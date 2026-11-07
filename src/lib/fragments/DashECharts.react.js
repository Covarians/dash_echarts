import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';

const FUNCTION_REGISTRY = 'dashEchartsFunctions';
const CLICK_FIELDS = [
    'componentType', 'componentSubType', 'componentIndex',
    'seriesType', 'seriesIndex', 'seriesId', 'seriesName',
    'name', 'dataIndex', 'dataType', 'data', 'value', 'color',
    'xAxisIndex', 'yAxisIndex',
];
const ZOOM_FIELDS = ['dataZoomId', 'start', 'end', 'startValue', 'endValue'];

const pick = (keys, obj) => {
    const out = {};
    keys.forEach(key => {
        if (obj[key] !== undefined) {
            out[key] = obj[key];
        }
    });
    return out;
};

const isFunctionRef = (value) => typeof value.function === 'string'
    && Object.keys(value).every(key => key === 'function' || key === 'args');

const lookupFunction = ({ function: name, args }) => {
    const fn = window[FUNCTION_REGISTRY]?.[name];
    if (typeof fn !== 'function') {
        console.warn(`[DashECharts] "${name}" is not a function of window.${FUNCTION_REGISTRY}.`);
        return undefined;
    }
    // With args, the registered function is a factory returning the function to use.
    return args === undefined ? fn : fn(args);
};

/**
 * Returns `value` with every {function: name, args?} reference replaced by the function.
 * Unchanged branches are reused, so large data arrays are not copied.
 */
const resolveFunctions = (value) => {
    if (value === null || typeof value !== 'object') {
        return value;
    }
    if (!Array.isArray(value) && isFunctionRef(value)) {
        return lookupFunction(value);
    }
    let copy = null;
    const keys = Array.isArray(value) ? value.keys() : Object.keys(value);
    for (const key of keys) {
        const resolved = resolveFunctions(value[key]);
        if (resolved !== value[key]) {
            copy = copy ?? (Array.isArray(value) ? [...value] : { ...value });
            copy[key] = resolved;
        }
    }
    return copy ?? value;
};

/* JSON-safe copy of ECharts event parameters (no functions, DOM or rendering objects). */
const toSerializable = (value, depth = 0) => {
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
        return value;
    }
    if (depth > 4 || typeof value !== 'object') {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value.map(item => toSerializable(item, depth + 1));
    }
    const out = {};
    Object.keys(value).forEach(key => {
        if (key === 'event' || key.startsWith('$')) {
            return;
        }
        const item = toSerializable(value[key], depth + 1);
        if (item !== undefined) {
            out[key] = item;
        }
    });
    return out;
};

const firstAxisOfGrid = (axes, gridIndex) => (axes ?? []).find(axis => (axis.gridIndex ?? 0) === gridIndex);

/**
 * Implementation of DashECharts, loaded on first use by components/DashECharts.react.js,
 * which documents the props.
 */
const DashECharts = ({
    id, className, style, setProps,
    option, option_merge,
    theme, renderer = 'canvas', loading = false,
    actions, y_axis_range,
    reset_count = 0,
    click_mode = 'series',
    events,
    n_clicks = 0,
}) => {
    const containerRef = useRef(null);
    const [chart, setChart] = useState(null);

    // Latest values read by the chart event handlers, which are registered when the chart is created.
    const setPropsRef = useRef(setProps);
    setPropsRef.current = setProps;
    const send = (props) => setPropsRef.current?.(props);
    const nClicksRef = useRef(n_clicks);
    useEffect(() => { nClicksRef.current = n_clicks; }, [n_clicks]);
    const clickModeRef = useRef(click_mode);
    clickModeRef.current = click_mode;

    const resolvedOption = useMemo(() => resolveFunctions(option), [option]);
    const resolvedMerge = useMemo(() => resolveFunctions(option_merge), [option_merge]);
    const optionRef = useRef(resolvedOption);
    optionRef.current = resolvedOption;
    const mergeRef = useRef(resolvedMerge);
    mergeRef.current = resolvedMerge;

    const themeKey = theme !== null && typeof theme === 'object' ? JSON.stringify(theme) : theme;
    const eventsKey = JSON.stringify(events ?? []);

    /* Creates the chart, and re-creates it when the theme or the renderer change. */
    useEffect(() => {
        const instance = echarts.init(containerRef.current, theme ?? null, { renderer });
        if (optionRef.current) {
            instance.setOption(optionRef.current, true);
        }
        if (mergeRef.current) {
            instance.setOption(mergeRef.current);
        }

        const reportClick = (data) => {
            const count = nClicksRef.current + 1;
            nClicksRef.current = count;
            send({ n_clicks: count, click_data: { ...data, timestamp: Date.now() } });
        };

        instance.on('click', params => {
            if (clickModeRef.current === 'series') {
                reportClick(toSerializable(pick(CLICK_FIELDS, params)));
            }
        });

        instance.getZr().on('click', e => {
            if (clickModeRef.current !== 'grid') {
                return;
            }
            const point = [e.offsetX, e.offsetY];
            const current = instance.getOption();
            const gridIndex = (current.grid ?? []).findIndex((grid, index) => instance.containPixel({ gridIndex: index }, point));
            if (gridIndex < 0) {
                return;
            }
            const [x, y] = instance.convertFromPixel({ gridIndex }, point);
            const data = { componentType: 'grid', gridIndex, x, y };
            const xAxis = firstAxisOfGrid(current.xAxis, gridIndex);
            if (xAxis?.type === 'category' && Array.isArray(xAxis.data)) {
                const category = xAxis.data[Math.round(x)];
                data.xCategory = category !== null && typeof category === 'object' ? category.value : category;
            }
            reportClick(toSerializable(data));
        });

        instance.on('datazoom', e => {
            const zoom = e.batch ? e.batch[0] : e;
            send({ zoom_data: { ...toSerializable(pick(ZOOM_FIELDS, zoom)), timestamp: Date.now() } });
        });

        instance.on('contextmenu', params => {
            if (params.componentType !== 'xAxis' && params.componentType !== 'yAxis') {
                return;
            }
            params.event?.event?.preventDefault();
            const axisType = params.componentType;
            const index = params.componentIndex;
            // ECharts has no public API for the displayed axis range.
            const [min, max] = instance.getModel().getComponent(axisType, index).axis.scale.getExtent();
            const current = instance.getOption();
            const indexKey = `${axisType}Index`;
            const series = (current.series ?? []).find(s => (s[indexKey] ?? 0) === index);
            send({
                axis_right_click_data: {
                    axis: axisType,
                    index,
                    name: current[axisType]?.[index]?.name,
                    seriesName: series?.name,
                    min,
                    max,
                    timestamp: Date.now(),
                },
            });
        });

        const resizeObserver = new ResizeObserver(() => instance.resize());
        resizeObserver.observe(containerRef.current);

        setChart(instance);
        return () => {
            resizeObserver.disconnect();
            instance.dispose();
        };
    }, [themeKey, renderer]);

    useEffect(() => {
        if (chart && resolvedOption) {
            chart.setOption(resolvedOption, true);
        }
    }, [resolvedOption]);

    useEffect(() => {
        if (chart && resolvedMerge) {
            chart.setOption(resolvedMerge);
        }
    }, [resolvedMerge]);

    useEffect(() => {
        if (!chart) {
            return;
        }
        if (loading) {
            chart.showLoading();
        } else {
            chart.hideLoading();
        }
    }, [chart, loading]);

    useEffect(() => {
        if (chart && Array.isArray(actions)) {
            actions.forEach(action => chart.dispatchAction(action));
        }
    }, [chart, actions]);

    useEffect(() => {
        if (!chart || !y_axis_range) {
            return;
        }
        const { index, min, max } = y_axis_range;
        if (index === undefined || min === undefined || max === undefined) {
            return;
        }
        const current = chart.getOption();
        if (!current.yAxis?.[index]) {
            return;
        }
        // Components without id are merged by position, so other axes and zooms are kept.
        const update = {
            yAxis: Array.from({ length: index + 1 }, (_, i) => (i === index ? { min, max } : {})),
        };
        const zoomIndex = (current.dataZoom ?? []).findIndex(dz => [].concat(dz.yAxisIndex ?? []).includes(index));
        if (zoomIndex >= 0) {
            update.dataZoom = Array.from({ length: zoomIndex + 1 }, (_, i) => (i === zoomIndex ? { start: 0, end: 100 } : {}));
        }
        chart.setOption(update);
    }, [chart, y_axis_range]);

    useEffect(() => {
        if (chart && reset_count > 0) {
            chart.clear();
            if (optionRef.current) {
                chart.setOption(optionRef.current, true);
            }
        }
    }, [reset_count]);

    useEffect(() => {
        if (!chart) {
            return undefined;
        }
        const handlers = (events ?? []).map(name => {
            const handler = params => send({
                event_data: { ...toSerializable(params), type: name, timestamp: Date.now() },
            });
            chart.on(name, handler);
            return [name, handler];
        });
        return () => {
            if (!chart.isDisposed()) {
                handlers.forEach(([name, handler]) => chart.off(name, handler));
            }
        };
    }, [chart, eventsKey]);

    return <div id={id} className={className} style={style} ref={containerRef} />;
};

export default DashECharts;
