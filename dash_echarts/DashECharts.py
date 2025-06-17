# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
import numbers # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.development.base_component import ComponentType # noqa: F401
except ImportError:
    ComponentType = typing.TypeVar("ComponentType", bound=Component)


class DashECharts(Component):
    """A DashECharts component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- axisPointer_index (number; optional)

- bmap_token (string; optional)

- brushSelected_data (dict; optional)

- brush_data (dict; optional)

- click_data (dict; optional)

- clicked_bar_data (dict; optional)

- enable_get_axisPointer_event (boolean; default False)

- enable_get_clicked_bar_data_event (boolean; default False)

- event (dict; optional)

- fun_effects (list; optional)

- fun_keys (list; optional)

- fun_paths (dict; optional)

- fun_prepares (list; optional)

- fun_values (list; optional)

- funs (dict; optional)

- mapbox_token (string; optional)

- maps (dict; optional)

- n_clicks (number; default 0)

- n_clicks_timestamp (number; default -1)

- opt_merge (dict; optional)

- option (dict; optional)

- part_of_opt (dict; optional)

- reset_id (number; default 0)

- resize_id (number; default 0)

- selected_data (dict; optional)

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
    def __init__(
        self,
        resize_id: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        reset_id: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        n_clicks: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        n_clicks_timestamp: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        click_data: typing.Optional[dict] = None,
        zoom_data: typing.Optional[dict] = None,
        selected_data: typing.Optional[dict] = None,
        brush_data: typing.Optional[dict] = None,
        brushSelected_data: typing.Optional[dict] = None,
        style: typing.Optional[typing.Any] = None,
        event: typing.Optional[dict] = None,
        option: typing.Optional[dict] = None,
        opt_merge: typing.Optional[dict] = None,
        part_of_opt: typing.Optional[dict] = None,
        enable_get_clicked_bar_data_event: typing.Optional[bool] = None,
        clicked_bar_data: typing.Optional[dict] = None,
        enable_get_axisPointer_event: typing.Optional[bool] = None,
        axisPointer_index: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        maps: typing.Optional[dict] = None,
        funs: typing.Optional[dict] = None,
        fun_keys: typing.Optional[typing.Sequence] = None,
        fun_values: typing.Optional[typing.Sequence] = None,
        fun_paths: typing.Optional[dict] = None,
        fun_effects: typing.Optional[typing.Sequence] = None,
        fun_prepares: typing.Optional[typing.Sequence] = None,
        mapbox_token: typing.Optional[str] = None,
        bmap_token: typing.Optional[str] = None,
        id: typing.Optional[typing.Union[str, dict]] = None,
        yAxisRightClick: typing.Optional[dict] = None,
        yAxisResize: typing.Optional[dict] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'axisPointer_index', 'bmap_token', 'brushSelected_data', 'brush_data', 'click_data', 'clicked_bar_data', 'enable_get_axisPointer_event', 'enable_get_clicked_bar_data_event', 'event', 'fun_effects', 'fun_keys', 'fun_paths', 'fun_prepares', 'fun_values', 'funs', 'mapbox_token', 'maps', 'n_clicks', 'n_clicks_timestamp', 'opt_merge', 'option', 'part_of_opt', 'reset_id', 'resize_id', 'selected_data', 'style', 'yAxisResize', 'yAxisRightClick', 'zoom_data']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'axisPointer_index', 'bmap_token', 'brushSelected_data', 'brush_data', 'click_data', 'clicked_bar_data', 'enable_get_axisPointer_event', 'enable_get_clicked_bar_data_event', 'event', 'fun_effects', 'fun_keys', 'fun_paths', 'fun_prepares', 'fun_values', 'funs', 'mapbox_token', 'maps', 'n_clicks', 'n_clicks_timestamp', 'opt_merge', 'option', 'part_of_opt', 'reset_id', 'resize_id', 'selected_data', 'style', 'yAxisResize', 'yAxisRightClick', 'zoom_data']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashECharts, self).__init__(**args)
