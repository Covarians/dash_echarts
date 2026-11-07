# dash_echarts

**dash_echarts** is a [Dash](https://dash.plotly.com/) component that displays
[Apache ECharts](https://echarts.apache.org/) charts in Python Dash applications.

You describe the chart with a standard ECharts `option` dictionary in Python.
User interactions (clicks, zoom, axis right-click, any other ECharts event) come back
to your Dash callbacks as component properties, and you can drive the chart with
ECharts actions. JavaScript functions such as formatters live in your app's assets
and are referenced by name from Python.

The chart code is loaded only when a chart is displayed, so pages without a chart stay light.

## Install

The repository is private: you need read access to `Covarians/dash_echarts` on GitHub.

```
pip install git+https://github.com/Covarians/dash_echarts.git@2.0.0
```

For servers and automated installs, see [Build & deploy](doc/build-and-deploy.md#install-in-an-app).

## Use it in a Dash app

```python
import dash_echarts
from dash import Dash, Input, Output, callback, html

app = Dash(__name__)

option = {
    "tooltip": {"trigger": "axis"},
    "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]},
    "yAxis": {"type": "value", "axisLabel": {"formatter": {"function": "withUnit", "args": "kg"}}},
    "series": [{"name": "Weight", "type": "line", "data": [150, 230, 224, 218, 135, 147, 260]}],
}

app.layout = html.Div([
    dash_echarts.DashECharts(id="chart", option=option, style={"height": "400px"}),
    html.Pre(id="click-output"),
])


@callback(Output("click-output", "children"), Input("chart", "click_data"))
def show_click(click_data):
    return f"Clicked: {click_data}" if click_data else "Click a point on the line."


if __name__ == "__main__":
    app.run(debug=True)
```

with, in `assets/dash_echarts_functions.js`:

```js
window.dashEchartsFunctions = Object.assign(window.dashEchartsFunctions || {}, {
    withUnit: (unit) => (value) => `${value} ${unit}`,
});
```

## JavaScript functions

ECharts uses JavaScript functions for formatters, label callbacks, etc. They are not
sent from Python:

1. Define them in a JavaScript file of the app's `assets/` folder (Dash loads it
   automatically), in `window.dashEchartsFunctions`.
2. Reference them anywhere in `option` or `option_merge`:
   - `{"function": "name"}` uses the function `name`;
   - `{"function": "name", "args": value}` calls `name(value)` and uses the function it
     returns. This builds parametrized functions from Python (units, labels,
     thresholds...), and a callback can change `args` with a `Patch`.

An object is treated as a reference only if its keys are exactly `function` and
optionally `args`.

## Properties

**Chart**

| Property | Description |
| --- | --- |
| `option` | ECharts option. Each change replaces the whole chart option. |
| `option_merge` | Option merged into the current chart, to update only some parts. |
| `replace_merge` | Component types (e.g. `["series", "yAxis"]`) that `option_merge` replaces instead of merging (ECharts `replaceMerge`): missing components are removed, those with the same `id` keep their state (zoom, legend selection...). |
| `style`, `className`, `id` | Container style (give it a height), CSS class and Dash id. |
| `theme` | Registered theme name (e.g. `"dark"`) or theme object. Re-creates the chart. |
| `renderer` | `"canvas"` (default) or `"svg"`. Re-creates the chart. |
| `loading` | Shows the ECharts loading animation. |
| `actions` | ECharts actions dispatched each time the list is set, e.g. `[{"type": "dataZoom", "start": 0, "end": 50}]`. |
| `y_axis_range` | `{index, min, max}`: sets a y axis range and resets its dataZoom. |
| `reset_count` | Increment to clear the chart and draw `option` again. |
| `click_mode` | `"series"` (default): clicks on chart elements. `"grid"`: any click inside a grid, with its coordinates. |
| `events` | Other ECharts events to report in `event_data`, e.g. `["legendselectchanged", "brushSelected"]`. |

The chart follows the size of its container automatically.

**Sent to Dash**

| Property | Content |
| --- | --- |
| `n_clicks`, `click_data` | Click count and last click. `"series"` mode: componentType, componentId, seriesName, name, dataIndex, value... `"grid"` mode: gridIndex, x, y, and xCategory for a category x axis. |
| `zoom_data` | Last dataZoom change: dataZoomId, start, end (in %), startValue, endValue. |
| `axis_right_click_data` | Right-click on an axis with `triggerEvent: true`: axis, index, id, name, seriesName, displayed min and max. |
| `event_data` | Last event listed in `events`: its parameters and `type`. |

Each of them has a `timestamp`, so a callback fires even when the values repeat.

## Documentation

- [Architecture](doc/architecture.md) — how the component is built and loaded.
- [Develop & test](doc/develop-and-test.md) — the browser sandbox and the Dash example.
- [Build & deploy](doc/build-and-deploy.md) — build, version and install in apps.
- [Changelog](CHANGELOG.md), including the migration from 1.x to 2.0.

## License

Proprietary, all rights reserved. See [LICENSE](LICENSE).
