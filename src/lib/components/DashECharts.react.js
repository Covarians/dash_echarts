import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { DashECharts as LazyDashECharts } from '../LazyLoader';

/**
 * Apache ECharts chart for Dash.
 * The chart code is only loaded when a chart is displayed.
 *
 * JavaScript functions (formatters, ...) are not sent from Python: define them in an
 * app asset as `window.dashEchartsFunctions = {name: function}` and reference them in
 * `option` or `option_merge` with `{"function": "name"}`. With
 * `{"function": "name", "args": ...}`, the registered function is a factory called
 * with `args` that returns the function to use.
 */
const DashECharts = ({
    renderer = 'canvas',
    loading = false,
    reset_count = 0,
    click_mode = 'series',
    n_clicks = 0,
    ...props
}) => (
    // Same box as the chart while its code loads, to avoid a layout jump.
    <Suspense fallback={<div id={props.id} className={props.className} style={props.style} />}>
        <LazyDashECharts
            renderer={renderer}
            loading={loading}
            reset_count={reset_count}
            click_mode={click_mode}
            n_clicks={n_clicks}
            {...props}
        />
    </Suspense>
);

DashECharts.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * CSS class of the chart container.
     */
    className: PropTypes.string,

    /**
     * Style of the chart container. It needs a height, e.g. {"height": "400px"}.
     */
    style: PropTypes.object,

    /**
     * ECharts option. Each change replaces the whole chart option.
     */
    option: PropTypes.object,

    /**
     * Option merged into the current chart option, to update only some parts.
     */
    option_merge: PropTypes.object,

    /**
     * ECharts theme: the name of a registered theme (e.g. "dark") or a theme object.
     * Changing it re-creates the chart.
     */
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    /**
     * Rendering engine. Changing it re-creates the chart.
     */
    renderer: PropTypes.oneOf(['canvas', 'svg']),

    /**
     * Shows the ECharts loading animation.
     */
    loading: PropTypes.bool,

    /**
     * ECharts actions dispatched each time this list is set,
     * e.g. [{"type": "dataZoom", "start": 0, "end": 50}].
     */
    actions: PropTypes.arrayOf(PropTypes.object),

    /**
     * Sets the range of a y axis and resets the dataZoom attached to it.
     */
    y_axis_range: PropTypes.shape({
        index: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
    }),

    /**
     * Increment to clear the chart and draw `option` again.
     */
    reset_count: PropTypes.number,

    /**
     * "series": clicks on chart elements are reported in click_data.
     * "grid": any click inside a grid is reported with its coordinates
     * (x, y, and xCategory for a category x axis).
     */
    click_mode: PropTypes.oneOf(['series', 'grid']),

    /**
     * Names of other ECharts events to report in event_data,
     * e.g. ["legendselectchanged", "brushSelected"].
     */
    events: PropTypes.arrayOf(PropTypes.string),

    /**
     * Number of clicks reported in click_data.
     */
    n_clicks: PropTypes.number,

    /**
     * Last click (see click_mode), with a timestamp.
     */
    click_data: PropTypes.object,

    /**
     * Last dataZoom change: dataZoomId, start, end (in %), startValue, endValue, timestamp.
     */
    zoom_data: PropTypes.object,

    /**
     * Last right-click on an axis whose triggerEvent is true:
     * axis ("xAxis" or "yAxis"), index, name, seriesName, displayed min and max, timestamp.
     */
    axis_right_click_data: PropTypes.object,

    /**
     * Last event listed in `events`: its ECharts parameters, type and timestamp.
     */
    event_data: PropTypes.object,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
};

export default DashECharts;
