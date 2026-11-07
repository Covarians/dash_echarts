# dash_echarts

**dash_echarts** is a [Dash](https://dash.plotly.com/) component that displays
[Apache ECharts](https://echarts.apache.org/) charts in Python Dash applications.

You describe the chart with a standard ECharts `option` dictionary in Python, and
user interactions (clicks, zoom, brush selection, y-axis right-click…) come back to
your Dash callbacks as component properties. ECharts extensions are included:
`echarts-gl` (3D), `echarts-stat` (regression, histogram, clustering transforms) and
`mapbox-gl`.

The chart code is loaded only when a chart is displayed, so pages without a chart stay light.

## Install

```
pip install git+https://github.com/Covarians/dash_echarts.git@1.2.0
```

## Use it in a Dash app

```python
import dash_echarts
from dash import Dash, Input, Output, callback, html

app = Dash(__name__)

option = {
    "tooltip": {"trigger": "axis"},
    "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]},
    "yAxis": {"type": "value"},
    "series": [{"type": "line", "data": [150, 230, 224, 218, 135, 147, 260]}],
}

app.layout = html.Div([
    dash_echarts.DashECharts(id="chart", option=option, style={"width": "100%", "height": "400px"}),
    html.Pre(id="click-output"),
])


@callback(Output("click-output", "children"), Input("chart", "click_data"))
def show_click(click_data):
    return f"Clicked: {click_data}" if click_data else "Click a point on the line."


if __name__ == "__main__":
    app.run(debug=True)
```

## Properties

**Chart**

| Property | Description |
| --- | --- |
| `option` | ECharts option. Each change replaces the whole chart option. |
| `opt_merge` | Option merged into the current chart, to update only some parts. |
| `style`, `id` | Style of the chart container (give it a height) and Dash id. |
| `reset_id` | Increment to clear the chart and redraw `option`. |
| `resize_id` | Increment to resize the chart to its container (after 500 ms). |
| `yAxisResize` | `{index, min, max}`: sets a y-axis range and resets its dataZoom. |
| `maps` | `{name: geoJSON or {svg: "<svg…>"}}` maps registered in ECharts. |
| `mapbox_token` | Mapbox access token for `echarts-gl` mapbox charts. |

**JavaScript functions** (formatters, callbacks…), passed as code strings. The code is
executed in the browser: only pass trusted code, never user input.

| Property | Description |
| --- | --- |
| `funs` | `{name: "function (params) { … }"}`. Inside a function, `this` gives access to `chart`, `echarts`, `ramda`, `gl`, `ecStat`, `mapboxgl` and the other funs. |
| `fun_keys` | Option keys whose string value is a function name, e.g. `["formatter"]`. |
| `fun_values` | String values in the option to replace by the function of that name. |
| `fun_paths` | `{name: ["tooltip", "formatter"]}`: puts a function at a path of the option. |
| `fun_prepares` | Functions called with (a copy of) the option before it is displayed. |
| `fun_effects` | Functions called once the chart exists, then when they, `funs` or the option change: `[name]` or `[{name, option}]`. |

**Events sent to Dash**

| Property | Sent when |
| --- | --- |
| `click_data`, `n_clicks`, `n_clicks_timestamp`, `event` | A chart element is clicked (`event`: mouse position, button and modifier keys). |
| `clicked_bar_data` | A bar chart category is clicked, when `enable_get_clicked_bar_data_event` is true (replaces `click_data`). |
| `zoom_data` | The dataZoom changes: `{start, end}` in %. |
| `selected_data` | The selection changes. |
| `brush_data`, `brushSelected_data` | A brush selection ends / changes. |
| `yAxisRightClick` | A y-axis is right-clicked: `{index, name, axisName, min, max, ts}`. |
| `n_resizes` | The window is resized (timestamp). |

## Documentation

- [Architecture](doc/architecture.md) — how the component is built and loaded.
- [Develop & test](doc/develop-and-test.md) — the browser sandbox and the Dash example.
- [Build & deploy](doc/build-and-deploy.md) — build, version and install in apps.
- [Changelog](CHANGELOG.md)

## License

See [LICENSE](LICENSE).
