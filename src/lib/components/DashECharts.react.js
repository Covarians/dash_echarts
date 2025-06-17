import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as gl from 'echarts-gl';
import * as echarts from 'echarts';
import * as ramda from 'ramda';
import * as ecStat from 'echarts-stat';
import bmap from 'echarts/extension/bmap/bmap';
// import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';


const loadFuns = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string' && !['chart', 'echarts', 'bmap', 'ramda', 'gl', 'ecStat', 'mapboxgl'].includes(key)) {
            const fun = new Function("return " + obj[key].trim() + ".bind(this)").bind(obj)
            obj[key] = fun();
        }
    })
}

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const DashEcharts = (props) => {
    const {
        // eslint-disable-next-line no-unused-vars
        n_clicks, n_clicks_timestamp, click_data, zoom_data,
        selected_data,
        brush_data,
        brushSelected_data,
        event,
        option, opt_merge, part_of_opt, 
        enable_get_clicked_bar_data_event, clicked_bar_data,
        enable_get_axisPointer_event, axisPointer_index,
        style, id, setProps,
        maps,
        funs, fun_keys, fun_values, fun_paths, fun_effects, fun_prepares,
        mapbox_token, bmap_token,
        resize_id,
        reset_id,
        yAxisRightClick,// yAxis has been right clicked, send this axis index and min/max values to Dash
        yAxisResize,    // yAxis resize, values sent from Dash
    } = props;


    // eslint-disable-next-line no-unused-vars
    const [chart, setChart] = useState({});
    const chartRef = useRef(null)

    const funConvertKeys = useCallback((obj) => {
        if (obj !== null) {
            Object.keys(obj).forEach(key => {
                const v = obj[key]
                if (typeof v === 'string') {

                    if (fun_keys.includes(key)) {
                        obj[key] = funs[v]
                    }
                } else if (typeof v === 'object') {
                    funConvertKeys(v)
                }
            })
        }
    })

    const funConvertValues = useCallback((obj) => {
        if (obj !== null) {
            Object.keys(obj).forEach(key => {
                const v = obj[key]
                if (!ramda.isEmpty(v)) {
                    if (typeof v === 'string') {
                        if (fun_values.includes(v)) {
                            obj[key] = funs[v]
                        }
                    }
                    else if (typeof v === 'object') {
                        funConvertValues(v)
                    }
                }
            })
        }
    })

    const funConvertPaths = useCallback((obj) => {
        if (obj !== null) {
            for (const key of fun_paths) {
                ramda.assocPath(fun_paths[key], funs[key], obj)
            }
        }
    })

    const funPreparesRun = useCallback((obj) => {
        for (const key of fun_prepares) {
            funs[key](obj)
        }
    })

    const registerMapForEach = useCallback((value, key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty('svg') && typeof value.svg === 'string') {
            const oParser = new DOMParser();
            const oDOM = oParser.parseFromString(value.svg, "image/svg+xml");
            value.svg = oDOM;
        }
        echarts.registerMap(key, value);
    })

    if (!ramda.isEmpty(maps)) {
        ramda.forEachObjIndexed(registerMapForEach, maps);
    }

    if (!ramda.isEmpty(mapbox_token)) {
        funs.mapboxgl = mapboxgl;
        mapboxgl.accessToken = mapbox_token;
        window.mapboxgl = mapboxgl;
    }

    if (!ramda.isEmpty(bmap_token)) {
        funs.bmap = bmap;
    }


    funs.echarts = echarts;
    funs.ramda = ramda;
    funs.gl = gl;
    funs.ecStat = ecStat;
    loadFuns(funs)
    if (!ramda.isEmpty(fun_prepares)) { funPreparesRun(option) }
    if (!ramda.isEmpty(fun_keys)) { funConvertKeys(option) }
    if (!ramda.isEmpty(fun_values)) { funConvertValues(option) }
    if (!ramda.isEmpty(fun_paths)) { funConvertPaths(option) }
    if (!ramda.isEmpty(fun_effects)) {
        fun_effects.forEach(e => {
            if (typeof e === 'string') {
                funs[e]()
            } else {
                funs[e.name](e.option)
            }
        })
    }

    echarts.registerTransform(ecStat.transform.regression);
    echarts.registerTransform(ecStat.transform.histogram);
    echarts.registerTransform(ecStat.transform.clustering);

    useEffect(() => {

        const myChart = echarts.init(chartRef.current)
        myChart.setOption(option, true, false)
        setChart(myChart)

        funs.chart = myChart;

        // If enable_get_clicked_bar_data_event is true, use the getZr function to get the clicked category instead of echarts' .on("click").
        if (enable_get_clicked_bar_data_event) {
            myChart.getZr().on("click", params => {
                // Get cursor position.
                const pointInPixel = [params.offsetX, params.offsetY];
                // Get coordinates in grid.
                const pointInGrid = myChart.convertFromPixel("grid", pointInPixel);

                // Get xAxes and series.
                const model = myChart.getModel();
                const xAxes = model.get("xAxis");
                const series = model.get("series");

                if (xAxes && xAxes.length > 0) {
                    // Get array of data of selected xAxis (index 0).
                    const xAxisValues = xAxes[0].data;

                    // Get dataZoom range (in %).
                    const dataZoom = {
                        start: model.get("dataZoom")[0].start,
                        end: model.get("dataZoom")[0].end
                    }

                    // Get yAxis data.
                    const yAxis = model.get("yAxis")[0];

                    // Get the corresponding category id.
                    const categoryId = xAxisValues[pointInGrid[0]];

                    // Init.
                    var barDataObj;

                    // If user clicked an arrow.
                    if (params && params.target && params.target.shape && params.target.shape.symbolType === "arrow") {
                        // Find the series holding the scatter elements.
                        const arrow_series = series.find((element) => element.type === "scatter");
                        if (typeof arrow_series !== "undefined") {
                            // Index of clicked coordinates in xAxis data.
                            const categoryIndex = xAxes[0].data.findIndex((xAxisData) => xAxisData === categoryId);

                            // Indexes of category ids to match.
                            const indexesOfScatter = arrow_series.data.map((data) => xAxes[0].data.findIndex((xAxisData) => xAxisData === data[0]));

                            // Find the category id to match closest to the clicked coordinates' index.
                            const closestIndexOfScatter = indexesOfScatter.reduce(function (prev, curr) {
                                return (Math.abs(curr - categoryIndex) < Math.abs(prev - categoryIndex) ? curr : prev);
                            });

                            const scatterValue = arrow_series.data.find((x) => x[0] === xAxes[0].data[closestIndexOfScatter]);

                            if (typeof scatterValue !== "undefined") {
                                barDataObj = {
                                    id: scatterValue[0],
                                    name: scatterValue[2]
                                }
                            }
                        }
                    }

                    // If clicked point is not an arrow or if barDataObj wasn't found successfully, take the closest bar's data.
                    if (typeof barDataObj === "undefined") {
                        // Check that user clicked in the bar graph area.
                        // Uses dataZoom to know the boundaries.
                        // Can't test on yAxis max as it is not always defined, so a click over the graph area will still trigger.
                        if (pointInGrid[0] >= xAxisValues.length * dataZoom.start / 100
                            && pointInGrid[0] <= xAxisValues.length * dataZoom.end / 100
                            && pointInGrid[1] >= yAxis.min) {

                            // Get the corresponding category id.
                            const categoryId = xAxisValues[pointInGrid[0]];

                            // Iterate through all series.
                            for (const serie of series) {
                                // Filter by series type.
                                if (serie.type === "bar") {
                                    // Iterate through a series' data.
                                    for (const data_elt of serie.data) {
                                        // If the first element of data of the series matches with categoryId, it's the one we were searching for. 
                                        // Category name is at index 4.
                                        if (data_elt.value[0] === categoryId) {
                                            barDataObj = {
                                                id: data_elt.value[0],
                                                name: data_elt.value[4]
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // If the correct bar has been matched.
                    if (barDataObj) {
                        // Set the clicked_bar_data property.
                        setProps({
                            clicked_bar_data: barDataObj
                        })
                    }
                }
            });
        }
        else {
            myChart.on("click", e => {
                const ts = Date.now()
                const clickCount = n_clicks + 1
                const data = ramda.pick([
                    'componentType',
                    'seriesType', 'seriesIndex', 'seriesName',
                    'name',
                    'dataIndex', 'data', 'dataType',
                    'value', 'color', 'yAxisIndex',
                ], e)
                data.n_clicks = clickCount;
                data.core_timestamp = ts;
                setProps({
                    event: e.event.event,
                    n_clicks: clickCount,
                    n_clicks_timestamp: ts,
                    click_data: data
                });
            });
        }

        /* Register to Echart right click event on yAxis to change its extent (min & max) */
        myChart.on("contextmenu", params => {
            const data = ramda.pick([
                'componentType', 'componentIndex',
            ], params)

            // Pass the yAxis right click event to Dash.
            if (data.componentType === 'yAxis') {
                // Prevent the right click event propagation.
                params.event.event.preventDefault();

                // Get the yAxis extent (its min & max actual displayed values).
                const yAxisIndex = data.componentIndex;

                // Get yAxes.
                const yAxes = myChart.getModel().findComponents({
                    mainType: 'yAxis'
                });

                // Check if the yAxis index is valid.
                if (yAxes && yAxes.length > yAxisIndex) {
                    // Get the extent of the yAxis.
                    const yAxisExtent = yAxes[yAxisIndex].axis.scale.getExtent();
                                    
                    // Extract the min and max values.
                    const minY = yAxisExtent[0];
                    const maxY = yAxisExtent[1];

                    // Get the yAxis name.
                    const yAxisName = yAxes[yAxisIndex].name;

                    // Get the corresponding series name.
                    const seriesName = myChart.getModel().option.series.find(s => s.yAxisIndex === yAxisIndex)?.name;

                    // Return props. Added timestamp (unique) so that Dash will detect the event even if other values didn't change.
                    setProps({
                        yAxisRightClick: {index: yAxisIndex, name: seriesName, min: minY, max: maxY, axisName: yAxisName, ts: Date.now()}
                    });
                }
            }
        });


        if (enable_get_axisPointer_event) {
            myChart.on('updateAxisPointer', (payload) => {
                // Event triggers also when mouse leaves render area. When that happens, dataIndex is not in the payload, so we filter using that.
                const dataIndex = payload.dataIndex;
                if (dataIndex) {
                    setProps({
                        yAxisRightClick: {index: yAxisIndex, name: seriesName, min: minY, max: maxY, axisName: yAxisName, ts: Date.now()}
                    });
                }
            });
        }


        myChart.on("datazoom", e => {
            const ts = Date.now()
            const d = e.batch ? e.batch[0] : e;
            const data = ramda.pick([
                'start', 'end'
            ], d);
            data.core_timestamp = ts;
            setProps({
                //event: e.event.event,
                zoom_data: data
            });
        });

        myChart.on("selectchanged", e => {
            const ts = Date.now()
            const data = ramda.pick([
                'escapeConnect',
                'fromAction', 'fromActionPayload', 'isFromClick',
                'selected', 'type'
            ], e)
            data.core_timestamp = ts;
            setProps({
                selected_data: data
            });
        })

        myChart.on("brushEnd", e => {
            const ts = Date.now()
            const data = ramda.pick([
                'areas', 'brushId', 'type'
            ], e)
            data.core_timestamp = ts;
            setProps({
                brush_data: data
            });
        })

        myChart.on("brushSelected", e => {
            const ts = Date.now()
            const data = ramda.pick([
                'areas', 'brushId', 'type', 'selected'
            ], e)
            data.core_timestamp = ts;
            setProps({
                brushSelected_data: data
            });
        })

        const resizeFunc = () => {
            if (!ramda.isEmpty(myChart)) {
                myChart.resize();
                const ts = Date.now()
                setProps({
                    n_resizes: ts,
                    n_clicks_timestamp: ts,
                });
            }
        }

        window.addEventListener('resize', resizeFunc);

        return () => {
            // Effect cleanup function when component is unmounted.
            // Unbind events.
            window.removeEventListener('resize', resizeFunc);
            // getZr.off("click");
            // myChart.off("click");
            // myChart.clear();
            // myChart.dispose();
        }

        // myChart.getZr().on("brushEnd", params => {
        //     var pointInPixel = [params.offsetX, params.offsetY];
        //     var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
        //     var category = myChart.getModel().get('xAxis')[0].data[pointInGrid[0]]
        //     console.log(category);

        //     // const ts = Date.now()
        //     // const data = ramda.pick([
        //     //     'areas', 'brushId', 'type'
        //     // ], params)
        //     // data.core_timestamp = ts;
        //     setProps({
        //         brush_data: category
        //     });
        // })

    }, []);
    // useEffect on empty array : will only run after the initial render (twice in debug).

    useEffect(() => {
        if (!ramda.isEmpty(chart)) {
            chart.setOption(option, true, false)
            // if (option)
            // {
            //     chart.setChart({ part_of_opt: option.dataZoom });
            //     //props.change_part_of_opt();
            // }
            // const resizeFunc = () => {
            //     if (!ramda.isEmpty(chart)) {
            //         chart.resize();
            //         const ts = Date.now()
            //         setProps({
            //             n_resizes: ts,
            //             n_clicks_timestamp: ts,
            //         });
            //     }
            // }
            // window.addEventListener('resize', resizeFunc);
            // return () => {
            //     window.removeEventListener('resize', resizeFunc)
            // }
        }
        // return () => {
        // }
    }, [option])

    useEffect(() => {
        if (!ramda.isEmpty(chart)) {
            // notMerge = false, to merge passed opt data.
            chart.setOption(opt_merge, false, false);

            // const resizeFunc = () => {
            //     if (!ramda.isEmpty(chart)) {
            //         chart.resize();
            //         const ts = Date.now()
            //         setProps({
            //             n_resizes: ts,
            //             n_clicks_timestamp: ts,
            //         });
            //     }
            // }
            // window.addEventListener('resize', resizeFunc);
            // return () => {
            //   window.removeEventListener('resize', resizeFunc)
            // }
            // }
            // return () => {
        }
    }, [opt_merge])

    useEffect(() => {
        if (!ramda.isEmpty(chart)) {
            if (resize_id > 0) {
                setTimeout(function () {
                    chart.resize()
                }, 500)
            }
        }
    }, [resize_id])


    /* Effect hook to modify yAxis extent and reset dataZoom */
    useEffect(() => {
        if (!ramda.isEmpty(chart)){
            const data = ramda.pick([
                'index', 'min', 'max'
            ], yAxisResize)

            // Check if the data is valid.
            if (data.index !== undefined && data.min !== undefined && data.max !== undefined) {
                // Get yAxes.
                const yAxes = chart.getModel().option.yAxis.filter(yAxis => yAxis !== undefined);

                // Check if the yAxis index is valid.
                if (yAxes.length > data.index) {
                    const yAxis = yAxes[data.index];

                    // yAxis will be matched by id, to update min and max.
                    let opt = {
                        'yAxis': {
                            id: yAxis.id, 
                            min: data.min, 
                            max: data.max
                        }
                    };
                    
                    // If the yAxis has a dataZoom, reset it.
                    // Don't modify its visibilty (the "show" property).
                    let yAxisDataZoom = chart.getModel().option.dataZoom.find(dz => dz && dz.yAxisIndex === data.index);

                    if (yAxisDataZoom) {
                        opt.dataZoom = {
                            id: yAxisDataZoom.id,
                            start: 0,
                            end: 100
                        }
                    }

                    chart.setOption(opt);
                }
            }
        }
    }, [yAxisResize])


    useEffect(() => {
        if (!ramda.isEmpty(chart)) {
            if (reset_id > 0) {
                chart.clear()
                chart.setOption(option, true, false)
            }
        }
    }, [reset_id])

    return (
        <div id={id} style={style} ref={chartRef} />
    );
};

DashEcharts.defaultProps = {
    resize_id: 0,
    reset_id: 0,
    n_clicks: 0,
    n_clicks_timestamp: -1,
    click_data: {},
    zoom_data: {},
    selected_data: {},
    brush_data: {},
    brushSelected_data: {},
    style: {},
    option: {},
    opt_merge: {},
    part_of_opt: {},
    enable_get_clicked_bar_data_event: false,
    clicked_bar_data: {},
    enable_get_axisPointer_event: false,
    axisPointer_index: null,
    maps: {},
    fun_keys: [],
    fun_values: [],
    fun_paths: {},
    fun_effects: [],
    fun_prepares: [],
    funs: {},
    mapbox_token: null,
    bmap_token: null,
    yAxisRightClick: {},
    yAxisResize: {},
};

DashEcharts.propTypes = {
    resize_id: PropTypes.number,
    reset_id: PropTypes.number,
    n_clicks: PropTypes.number,
    n_clicks_timestamp: PropTypes.number,
    click_data: PropTypes.object,
    zoom_data: PropTypes.object,
    selected_data: PropTypes.object,
    brush_data: PropTypes.object,
    brushSelected_data: PropTypes.object,
    style: PropTypes.object,
    event: PropTypes.object,
    option: PropTypes.object,
    opt_merge: PropTypes.object,
    part_of_opt: PropTypes.object,
    enable_get_clicked_bar_data_event: PropTypes.bool,
    clicked_bar_data: PropTypes.object,
    enable_get_axisPointer_event: PropTypes.bool,
    axisPointer_index: PropTypes.number,
    maps: PropTypes.object,
    funs: PropTypes.object,
    fun_keys: PropTypes.array,
    fun_values: PropTypes.array,
    fun_paths: PropTypes.object,
    fun_effects: PropTypes.array,
    fun_prepares: PropTypes.array,
    mapbox_token: PropTypes.string,
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

export const defaultProps = DashEcharts.defaultProps;
export const propTypes = DashEcharts.propTypes;
