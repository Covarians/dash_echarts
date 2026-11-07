# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashECharts(Component):
    """A DashECharts component.
Dash component rendering an Apache ECharts chart.
The chart code (ECharts and its extensions) is only loaded when a chart is displayed.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- bmap_token (string; optional):
    Not used: to use bmap, load the Baidu Maps API script (with its
    key) in the app.

- brushSelected_data (dict; optional)

- brush_data (dict; optional)

- click_data (dict; optional)

- clicked_bar_data (dict; optional)

- enable_get_clicked_bar_data_event (boolean; default False)

- event (dict; optional):
    Mouse event of the last click: type, button, offsetX/Y, clientX/Y
    and modifier keys.

- fun_effects (list; optional):
    Functions called once the chart exists, then whenever they, the
    funs or the option change: [name] or [{name, option}].

- fun_keys (list; optional)

- fun_paths (dict; optional):
    Function name to path in the option where the function is set:
    {name: ['key1', 'key2', ...]}.

- fun_prepares (list; optional)

- fun_values (list; optional)

- funs (dict; optional):
    Functions as JavaScript code strings, by name. The code is
    executed in the browser:  only pass trusted code, never user
    input.

- mapbox_token (string; optional)

- maps (dict; optional)

- n_clicks (number; default 0)

- n_clicks_timestamp (number; optional)

- n_resizes (number; optional):
    Timestamp of the last window resize.

- opt_merge (dict; optional)

- option (dict; optional)

- part_of_opt (dict; optional):
    Deprecated: not used.

- reset_id (number; default 0)

- resize_id (number; default 0)

- selected_data (dict; optional)

- style (dict; optional)

- yAxisResize (dict; optional):
    Receive yAxisIndex, min and max to resize yAxis.

- yAxisRightClick (dict; optional):
    Send yAxisIndex, min and max after yAxis right click event.

- zoom_data (dict; optional)"""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_echarts'
    _type = 'DashECharts'
    @_explicitize_args
    def __init__(self, resize_id=Component.UNDEFINED, reset_id=Component.UNDEFINED, n_clicks=Component.UNDEFINED, n_clicks_timestamp=Component.UNDEFINED, n_resizes=Component.UNDEFINED, click_data=Component.UNDEFINED, zoom_data=Component.UNDEFINED, selected_data=Component.UNDEFINED, brush_data=Component.UNDEFINED, brushSelected_data=Component.UNDEFINED, style=Component.UNDEFINED, event=Component.UNDEFINED, option=Component.UNDEFINED, opt_merge=Component.UNDEFINED, part_of_opt=Component.UNDEFINED, enable_get_clicked_bar_data_event=Component.UNDEFINED, clicked_bar_data=Component.UNDEFINED, maps=Component.UNDEFINED, funs=Component.UNDEFINED, fun_keys=Component.UNDEFINED, fun_values=Component.UNDEFINED, fun_paths=Component.UNDEFINED, fun_effects=Component.UNDEFINED, fun_prepares=Component.UNDEFINED, mapbox_token=Component.UNDEFINED, bmap_token=Component.UNDEFINED, id=Component.UNDEFINED, yAxisRightClick=Component.UNDEFINED, yAxisResize=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'bmap_token', 'brushSelected_data', 'brush_data', 'click_data', 'clicked_bar_data', 'enable_get_clicked_bar_data_event', 'event', 'fun_effects', 'fun_keys', 'fun_paths', 'fun_prepares', 'fun_values', 'funs', 'mapbox_token', 'maps', 'n_clicks', 'n_clicks_timestamp', 'n_resizes', 'opt_merge', 'option', 'part_of_opt', 'reset_id', 'resize_id', 'selected_data', 'style', 'yAxisResize', 'yAxisRightClick', 'zoom_data']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'bmap_token', 'brushSelected_data', 'brush_data', 'click_data', 'clicked_bar_data', 'enable_get_clicked_bar_data_event', 'event', 'fun_effects', 'fun_keys', 'fun_paths', 'fun_prepares', 'fun_values', 'funs', 'mapbox_token', 'maps', 'n_clicks', 'n_clicks_timestamp', 'n_resizes', 'opt_merge', 'option', 'part_of_opt', 'reset_id', 'resize_id', 'selected_data', 'style', 'yAxisResize', 'yAxisRightClick', 'zoom_data']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashECharts, self).__init__(**args)
