import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { DashECharts as LazyDashECharts } from '../LazyLoader';

/**
 * Dash component rendering an Apache ECharts chart.
 * The chart code (ECharts and its extensions) is only loaded when a chart is displayed.
 */
const DashECharts = ({
    enable_get_clicked_bar_data_event = false,
    n_clicks = 0,
    resize_id = 0,
    reset_id = 0,
    ...props
}) => (
    // Same box as the chart while its code loads, to avoid a layout jump.
    <Suspense fallback={<div id={props.id} style={props.style} />}>
        <LazyDashECharts
            enable_get_clicked_bar_data_event={enable_get_clicked_bar_data_event}
            n_clicks={n_clicks}
            resize_id={resize_id}
            reset_id={reset_id}
            {...props}
        />
    </Suspense>
);

DashECharts.propTypes = {
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

export default DashECharts;
