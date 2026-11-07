import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as gl from 'echarts-gl';
import * as echarts from 'echarts';
import * as ramda from 'ramda';
import * as ecStat from 'echarts-stat';
// Side-effect import: registers the Baidu map ('bmap') component in ECharts.
import 'echarts/extension/bmap/bmap';
import mapboxgl from 'mapbox-gl';

echarts.registerTransform(ecStat.transform.regression);
echarts.registerTransform(ecStat.transform.histogram);
echarts.registerTransform(ecStat.transform.clustering);

// Names provided by the component in the context (`this`) of the funs.
const LIB_KEYS = ['chart', 'echarts', 'bmap', 'ramda', 'gl', 'ecStat', 'mapboxgl'];
const UNSAFE_KEYS = ['__proto__', 'prototype', 'constructor'];
const EVENT_FIELDS = ['type', 'button', 'offsetX', 'offsetY', 'clientX', 'clientY', 'altKey', 'ctrlKey', 'shiftKey', 'metaKey'];

// funs code is executed: it must come from trusted server code, never from user input.
const compileFun = (code, context) => new Function(`return (${code.trim()}).bind(this)`).call(context);

const isSafePath = (path) => Array.isArray(path)
    && path.every(key => (typeof key === 'string' || typeof key === 'number') && !UNSAFE_KEYS.includes(String(key)));

/* Replaces, in place, string values whose key is in `keys` by the function they name. */
const convertKeys = (obj, keys, funs) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            if (keys.includes(key)) {
                obj[key] = funs[value];
            }
        } else if (value !== null && typeof value === 'object') {
            convertKeys(value, keys, funs);
        }
    });
};

/* Replaces, in place, string values listed in `values` by the function they name. */
const convertValues = (obj, values, funs) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            if (values.includes(value)) {
                obj[key] = funs[value];
            }
        } else if (value !== null && typeof value === 'object') {
            convertValues(value, values, funs);
        }
    });
};

/**
 * Dash component rendering an Apache ECharts chart.
 */
const DashEcharts = ({
    id, setProps, style,
    option, opt_merge, maps,
    funs, fun_keys, fun_values, fun_paths, fun_effects, fun_prepares,
    mapbox_token,
    enable_get_clicked_bar_data_event = false,
    n_clicks = 0,
    resize_id = 0,
    reset_id = 0,
    yAxisResize,
}) => {
    const [chart, setChart] = useState(null);
    const chartRef = useRef(null);

    // Latest values read by the event handlers, which are registered once on mount.
    const setPropsRef = useRef(setProps);
    setPropsRef.current = setProps;
    const clickCountRef = useRef(n_clicks);
    useEffect(() => { clickCountRef.current = n_clicks; }, [n_clicks]);
    const sendProps = (newProps) => setPropsRef.current?.(newProps);

    // The `this` of every function passed in funs: libraries, the chart and the other funs.
    const context = useRef({ echarts, ramda, gl, ecStat, mapboxgl }).current;
    const userFunKeys = useRef([]);

    const funsLookup = useMemo(() => {
        userFunKeys.current.forEach(key => { delete context[key]; });
        userFunKeys.current = [];
        Object.entries(funs ?? {}).forEach(([key, code]) => {
            if (LIB_KEYS.includes(key) || UNSAFE_KEYS.includes(key)) {
                return;
            }
            context[key] = typeof code === 'string' ? compileFun(code, context) : code;
            userFunKeys.current.push(key);
        });
        return { ...context };
    }, [funs]);

    // Option with the funs references replaced by functions. The option prop itself is never modified.
    const chartOption = useMemo(() => {
        const usesFuns = fun_prepares?.length || fun_keys?.length || fun_values?.length || !ramda.isEmpty(fun_paths ?? {});
        if (!option || !usesFuns) {
            return option;
        }
        let opt = ramda.clone(option);
        (fun_prepares ?? []).forEach(name => funsLookup[name](opt));
        if (fun_keys?.length) {
            convertKeys(opt, fun_keys, funsLookup);
        }
        if (fun_values?.length) {
            convertValues(opt, fun_values, funsLookup);
        }
        Object.entries(fun_paths ?? {}).forEach(([name, path]) => {
            if (isSafePath(path)) {
                opt = ramda.assocPath(path, funsLookup[name], opt);
            }
        });
        return opt;
    }, [option, funsLookup, fun_prepares, fun_keys, fun_values, fun_paths]);

    // Declared before the chart creation effect so maps are registered before the option uses them.
    useEffect(() => {
        if (mapbox_token) {
            mapboxgl.accessToken = mapbox_token;
            // echarts-gl's mapbox3D looks for the global mapboxgl.
            window.mapboxgl = mapboxgl;
        }
    }, [mapbox_token]);

    useEffect(() => {
        ramda.forEachObjIndexed((value, key) => {
            const map = typeof value?.svg === 'string'
                ? { ...value, svg: new DOMParser().parseFromString(value.svg, 'image/svg+xml') }
                : value;
            echarts.registerMap(key, map);
        }, maps ?? {});
    }, [maps]);

    /* Creates the chart on mount, registers the events and disposes everything on unmount. */
    useEffect(() => {
        const myChart = echarts.init(chartRef.current);
        if (chartOption) {
            myChart.setOption(chartOption, true, false);
        }
        context.chart = myChart;
        setChart(myChart);

        // If enable_get_clicked_bar_data_event is true, use the getZr function to get the clicked category instead of echarts' .on("click").
        if (enable_get_clicked_bar_data_event) {
            myChart.getZr().on('click', params => {
                // Get cursor position and coordinates in grid.
                const pointInPixel = [params.offsetX, params.offsetY];
                const pointInGrid = myChart.convertFromPixel('grid', pointInPixel);

                // Get xAxes and series.
                const model = myChart.getModel();
                const xAxes = model.get('xAxis');
                const series = model.get('series');

                if (xAxes && xAxes.length > 0) {
                    // Get array of data of selected xAxis (index 0).
                    const xAxisValues = xAxes[0].data;

                    // Get dataZoom range (in %).
                    const dataZoom = {
                        start: model.get('dataZoom')[0].start,
                        end: model.get('dataZoom')[0].end
                    };

                    const yAxis = model.get('yAxis')[0];

                    // Get the corresponding category id.
                    const categoryId = xAxisValues[pointInGrid[0]];

                    let barDataObj;

                    // If user clicked an arrow.
                    if (params && params.target && params.target.shape && params.target.shape.symbolType === 'arrow') {
                        // Find the series holding the scatter elements.
                        const arrow_series = series.find((element) => element.type === 'scatter');
                        if (typeof arrow_series !== 'undefined') {
                            // Index of clicked coordinates in xAxis data.
                            const categoryIndex = xAxes[0].data.findIndex((xAxisData) => xAxisData === categoryId);

                            // Indexes of category ids to match.
                            const indexesOfScatter = arrow_series.data.map((data) => xAxes[0].data.findIndex((xAxisData) => xAxisData === data[0]));

                            // Find the category id to match closest to the clicked coordinates' index.
                            const closestIndexOfScatter = indexesOfScatter.reduce((prev, curr) => (
                                Math.abs(curr - categoryIndex) < Math.abs(prev - categoryIndex) ? curr : prev
                            ));

                            const scatterValue = arrow_series.data.find((x) => x[0] === xAxes[0].data[closestIndexOfScatter]);

                            if (typeof scatterValue !== 'undefined') {
                                barDataObj = {
                                    id: scatterValue[0],
                                    name: scatterValue[2]
                                };
                            }
                        }
                    }

                    // If clicked point is not an arrow or if barDataObj wasn't found successfully, take the closest bar's data.
                    if (typeof barDataObj === 'undefined') {
                        // Check that user clicked in the bar graph area, using dataZoom to know the boundaries.
                        // Can't test on yAxis max as it is not always defined, so a click over the graph area will still trigger.
                        if (pointInGrid[0] >= xAxisValues.length * dataZoom.start / 100
                            && pointInGrid[0] <= xAxisValues.length * dataZoom.end / 100
                            && pointInGrid[1] >= yAxis.min) {

                            for (const serie of series) {
                                if (serie.type === 'bar') {
                                    for (const data_elt of serie.data) {
                                        // Category name is at index 4.
                                        if (data_elt.value[0] === categoryId) {
                                            barDataObj = {
                                                id: data_elt.value[0],
                                                name: data_elt.value[4]
                                            };
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (barDataObj) {
                        sendProps({ clicked_bar_data: barDataObj });
                    }
                }
            });
        }
        else {
            myChart.on('click', e => {
                const ts = Date.now();
                const clickCount = clickCountRef.current + 1;
                clickCountRef.current = clickCount;
                const data = ramda.pick([
                    'componentType',
                    'seriesType', 'seriesIndex', 'seriesName',
                    'name',
                    'dataIndex', 'data', 'dataType',
                    'value', 'color', 'yAxisIndex',
                ], e);
                data.n_clicks = clickCount;
                data.core_timestamp = ts;
                sendProps({
                    event: e.event?.event ? ramda.pick(EVENT_FIELDS, e.event.event) : {},
                    n_clicks: clickCount,
                    n_clicks_timestamp: ts,
                    click_data: data
                });
            });
        }

        /* Register to Echart right click event on yAxis to change its extent (min & max) */
        myChart.on('contextmenu', params => {
            const data = ramda.pick(['componentType', 'componentIndex'], params);

            // Pass the yAxis right click event to Dash.
            if (data.componentType === 'yAxis') {
                // Prevent the browser context menu.
                params.event.event.preventDefault();

                const yAxisIndex = data.componentIndex;
                const yAxes = myChart.getModel().findComponents({ mainType: 'yAxis' });

                if (yAxes && yAxes.length > yAxisIndex) {
                    // The yAxis extent: its actual displayed min & max values.
                    const yAxisExtent = yAxes[yAxisIndex].axis.scale.getExtent();
                    const yAxisName = yAxes[yAxisIndex].name;
                    const seriesName = myChart.getModel().option.series.find(s => s.yAxisIndex === yAxisIndex)?.name;

                    // Timestamp makes the value unique so that Dash detects the event even if other values didn't change.
                    sendProps({
                        yAxisRightClick: {
                            index: yAxisIndex, name: seriesName, min: yAxisExtent[0], max: yAxisExtent[1], axisName: yAxisName, ts: Date.now()
                        }
                    });
                }
            }
        });

        myChart.on('datazoom', e => {
            const d = e.batch ? e.batch[0] : e;
            const data = ramda.pick(['start', 'end'], d);
            data.core_timestamp = Date.now();
            sendProps({ zoom_data: data });
        });

        myChart.on('selectchanged', e => {
            const data = ramda.pick([
                'escapeConnect',
                'fromAction', 'fromActionPayload', 'isFromClick',
                'selected', 'type'
            ], e);
            data.core_timestamp = Date.now();
            sendProps({ selected_data: data });
        });

        myChart.on('brushEnd', e => {
            const data = ramda.pick(['areas', 'brushId', 'type'], e);
            data.core_timestamp = Date.now();
            sendProps({ brush_data: data });
        });

        myChart.on('brushSelected', e => {
            const data = ramda.pick(['areas', 'brushId', 'type', 'selected'], e);
            data.core_timestamp = Date.now();
            sendProps({ brushSelected_data: data });
        });

        const resizeFunc = () => {
            myChart.resize();
            const ts = Date.now();
            sendProps({ n_resizes: ts, n_clicks_timestamp: ts });
        };
        window.addEventListener('resize', resizeFunc);

        return () => {
            window.removeEventListener('resize', resizeFunc);
            myChart.dispose();
            if (context.chart === myChart) {
                delete context.chart;
            }
        };
    }, []);

    useEffect(() => {
        if (chart && chartOption) {
            chart.setOption(chartOption, true, false);
        }
    }, [chartOption]);

    useEffect(() => {
        if (chart && opt_merge) {
            // notMerge = false, to merge passed opt data.
            chart.setOption(opt_merge, false, false);
        }
    }, [opt_merge]);

    useEffect(() => {
        if (chart) {
            (fun_effects ?? []).forEach(e => {
                if (typeof e === 'string') {
                    funsLookup[e]();
                } else {
                    funsLookup[e.name](e.option);
                }
            });
        }
    }, [chart, fun_effects, funsLookup, chartOption]);

    useEffect(() => {
        if (!chart || resize_id <= 0) {
            return undefined;
        }
        const timer = setTimeout(() => chart.resize(), 500);
        return () => clearTimeout(timer);
    }, [resize_id]);

    /* Effect hook to modify yAxis extent and reset dataZoom */
    useEffect(() => {
        if (!chart || !yAxisResize) {
            return;
        }
        const data = ramda.pick(['index', 'min', 'max'], yAxisResize);
        if (data.index === undefined || data.min === undefined || data.max === undefined) {
            return;
        }
        const yAxes = chart.getModel().option.yAxis.filter(yAxis => yAxis !== undefined);
        if (yAxes.length > data.index) {
            // yAxis will be matched by id, to update min and max.
            const opt = {
                yAxis: { id: yAxes[data.index].id, min: data.min, max: data.max }
            };

            // If the yAxis has a dataZoom, reset it without changing its visibility.
            const yAxisDataZoom = chart.getModel().option.dataZoom?.find(dz => dz && dz.yAxisIndex === data.index);
            if (yAxisDataZoom) {
                opt.dataZoom = { id: yAxisDataZoom.id, start: 0, end: 100 };
            }

            chart.setOption(opt);
        }
    }, [yAxisResize]);

    useEffect(() => {
        if (chart && reset_id > 0) {
            chart.clear();
            if (chartOption) {
                chart.setOption(chartOption, true, false);
            }
        }
    }, [reset_id]);

    return (
        <div id={id} style={style} ref={chartRef} />
    );
};

DashEcharts.propTypes = {
    resize_id: PropTypes.number,
    reset_id: PropTypes.number,
    n_clicks: PropTypes.number,
    n_clicks_timestamp: PropTypes.number,
    /**
     * Timestamp of the last window resize.
     */
    n_resizes: PropTypes.number,
    click_data: PropTypes.object,
    zoom_data: PropTypes.object,
    selected_data: PropTypes.object,
    brush_data: PropTypes.object,
    brushSelected_data: PropTypes.object,
    style: PropTypes.object,
    /**
     * Mouse event of the last click: type, button, offsetX/Y, clientX/Y and modifier keys.
     */
    event: PropTypes.object,
    option: PropTypes.object,
    opt_merge: PropTypes.object,
    /**
     * Deprecated: not used.
     */
    part_of_opt: PropTypes.object,
    enable_get_clicked_bar_data_event: PropTypes.bool,
    clicked_bar_data: PropTypes.object,
    maps: PropTypes.object,
    /**
     * Functions as JavaScript code strings, by name. The code is executed in the browser:
     * only pass trusted code, never user input.
     */
    funs: PropTypes.object,
    fun_keys: PropTypes.array,
    fun_values: PropTypes.array,
    /**
     * Function name to path in the option where the function is set: {name: ['key1', 'key2', ...]}.
     */
    fun_paths: PropTypes.object,
    /**
     * Functions called once the chart exists, then whenever they, the funs or the option change: [name] or [{name, option}].
     */
    fun_effects: PropTypes.array,
    fun_prepares: PropTypes.array,
    mapbox_token: PropTypes.string,
    /**
     * Not used: to use bmap, load the Baidu Maps API script (with its key) in the app.
     */
    bmap_token: PropTypes.string,
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,
    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    /**
     * Send yAxisIndex, min and max after yAxis right click event
     */
    yAxisRightClick: PropTypes.object,

    /**
     * Receive yAxisIndex, min and max to resize yAxis
     */
    yAxisResize: PropTypes.object,
};

export default DashEcharts;

export const propTypes = DashEcharts.propTypes;
