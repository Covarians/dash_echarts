# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashECharts(Component):
    """A DashECharts component.
Apache ECharts chart for Dash.
The chart code is only loaded when a chart is displayed.

JavaScript functions (formatters, ...) are not sent from Python: define them in an
app asset as `window.dashEchartsFunctions = {name: function}` and reference them in
`option` or `option_merge` with `{"function": "name"}`. With
`{"function": "name", "args": ...}`, the registered function is a factory called
with `args` that returns the function to use.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- actions (list of dicts; optional):
    ECharts actions dispatched each time this list is set,  e.g.
    [{\"type\": \"dataZoom\", \"start\": 0, \"end\": 50}].

- axis_right_click_data (dict; optional):
    Last right-click on an axis whose triggerEvent is True:  axis
    (\"xAxis\" or \"yAxis\"), index, id, name, seriesName, displayed
    min and max, timestamp.

- className (string; optional):
    CSS class of the chart container.

- click_data (dict; optional):
    Last click (see click_mode), with a timestamp. In \"series\" mode
    it includes  componentId, the id of the clicked component when it
    has one.

- click_mode (a value equal to: 'series', 'grid'; default 'series'):
    \"series\": clicks on chart elements are reported in click_data.
    \"grid\": any click inside a grid is reported with its coordinates
    (x, y, and xCategory for a category x axis).

- event_data (dict; optional):
    Last event listed in `events`: its ECharts parameters, type and
    timestamp.

- events (list of strings; optional):
    Names of other ECharts events to report in event_data,  e.g.
    [\"legendselectchanged\", \"brushSelected\"].

- loading (boolean; default False):
    Shows the ECharts loading animation.

- n_clicks (number; default 0):
    Number of clicks reported in click_data.

- option (dict; optional):
    ECharts option. Each change replaces the whole chart option.

- option_merge (dict; optional):
    Option merged into the current chart option, to update only some
    parts.

- renderer (a value equal to: 'canvas', 'svg'; default 'canvas'):
    Rendering engine. Changing it re-creates the chart.

- replace_merge (list of strings; optional):
    Component types (e.g. [\"series\", \"yAxis\"]) that option_merge
    replaces instead of  merging, as ECharts' replaceMerge: their
    components missing from option_merge are  removed, and those with
    the same id keep their state (zoom, legend selection...).

- reset_count (number; default 0):
    Increment to clear the chart and draw `option` again.

- style (dict; optional):
    Style of the chart container. It needs a height, e.g. {\"height\":
    \"400px\"}.

- theme (string | dict; optional):
    ECharts theme: the name of a registered theme (e.g. \"dark\") or a
    theme object.  Changing it re-creates the chart.

- y_axis_range (dict; optional):
    Sets the range of a y axis and resets the dataZoom attached to it.

    `y_axis_range` is a dict with keys:

    - index (number; optional)

    - min (number; optional)

    - max (number; optional)

- zoom_data (dict; optional):
    Last dataZoom change: dataZoomId, start, end (in %), startValue,
    endValue, timestamp."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_echarts'
    _type = 'DashECharts'
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, className=Component.UNDEFINED, style=Component.UNDEFINED, option=Component.UNDEFINED, option_merge=Component.UNDEFINED, replace_merge=Component.UNDEFINED, theme=Component.UNDEFINED, renderer=Component.UNDEFINED, loading=Component.UNDEFINED, actions=Component.UNDEFINED, y_axis_range=Component.UNDEFINED, reset_count=Component.UNDEFINED, click_mode=Component.UNDEFINED, events=Component.UNDEFINED, n_clicks=Component.UNDEFINED, click_data=Component.UNDEFINED, zoom_data=Component.UNDEFINED, axis_right_click_data=Component.UNDEFINED, event_data=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'actions', 'axis_right_click_data', 'className', 'click_data', 'click_mode', 'event_data', 'events', 'loading', 'n_clicks', 'option', 'option_merge', 'renderer', 'replace_merge', 'reset_count', 'style', 'theme', 'y_axis_range', 'zoom_data']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'actions', 'axis_right_click_data', 'className', 'click_data', 'click_mode', 'event_data', 'events', 'loading', 'n_clicks', 'option', 'option_merge', 'renderer', 'replace_merge', 'reset_count', 'style', 'theme', 'y_axis_range', 'zoom_data']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashECharts, self).__init__(**args)
