# Changelog

## 2.0.0

Rewrite of the component with a new, consistent API (breaking changes).

### Added
- JavaScript functions referenced by name from the option: `{"function": "name"}` or
  `{"function": "name", "args": value}`, defined in the app's assets in `window.dashEchartsFunctions`.
- `theme`, `renderer` (`"canvas"` / `"svg"`), `loading`, `className`.
- `actions`: ECharts actions dispatched from Python (zoom, highlight, legend, tooltip...).
- `events` + `event_data`: report any ECharts event.
- `click_mode="grid"`: report any click inside a grid with its coordinates and category.
- Right-click on x axes too (`axis_right_click_data.axis`).
- The chart follows its container size automatically (no more `resize_id`).

### Removed
- `funs` and `fun_keys`, `fun_values`, `fun_paths`, `fun_effects`, `fun_prepares`: JavaScript code is
  no longer sent from Python.
- ECharts GL, echarts-stat, mapbox and bmap extensions, `maps`, `mapbox_token`, `bmap_token`:
  the chart code goes from 3.27 MB to 1 MB.
- The AexDashboard-specific bar/arrow lookup of `enable_get_clicked_bar_data_event`: use
  `click_mode="grid"` and find the item from `xCategory` in Python.
- `part_of_opt`, `event`, `n_clicks_timestamp`, `n_resizes`, `selected_data`, `brush_data`,
  `brushSelected_data` (use `events`).

### Migration from 1.x

| 1.x | 2.0 |
| --- | --- |
| `funs={"f": "function (p) {...}"}`, `fun_values=["f"]`, `"formatter": "f"` | define `f` in `assets/*.js` in `window.dashEchartsFunctions`; `"formatter": {"function": "f"}` |
| formatter code built in Python | a factory function in the asset, with the values passed as `{"function": "f", "args": ...}` |
| `opt_merge` | `option_merge` |
| `reset_id` | `reset_count` |
| `resize_id` | (removed: automatic) |
| `yAxisResize={"index", "min", "max"}` | `y_axis_range={"index", "min", "max"}` |
| `yAxisRightClick` (`index, name, axisName, min, max, ts`) | `axis_right_click_data` (`axis, index, seriesName, name, min, max, timestamp`) |
| `enable_get_clicked_bar_data_event=True`, `clicked_bar_data` | `click_mode="grid"`, `click_data` (`gridIndex, x, y, xCategory`) |
| `click_data` (`core_timestamp`, `n_clicks`) | `click_data` (`timestamp`); `n_clicks` stays a separate prop |
| `zoom_data` (`start, end, core_timestamp`) | `zoom_data` (`dataZoomId, start, end, startValue, endValue, timestamp`) |
| `selected_data`, `brush_data`, `brushSelected_data` | `events=["selectchanged", "brushEnd", "brushSelected"]`, `event_data` |

## 1.2.0

### Changed
- The chart code is loaded only when a chart is displayed: the bundle loaded on every page goes from 3.27 MB to 5.4 KB.
- `event` contains plain mouse fields (`type`, `button`, `offsetX/Y`, `clientX/Y`, modifier keys) instead of the raw browser event.
- `fun_effects` run once the chart exists, then when they, `funs` or the option change (before: on every render).
- The `option` and `funs` props are no longer modified by the component. Functions in `funs` access the chart as `this.chart`.
- Python package generated with Dash 2.18.2.

### Fixed
- `n_clicks` stayed at 1.
- The chart was not disposed on unmount (memory leak, duplicated events with React 18).
- `fun_paths` threw an error and was ignored.
- The bmap extension was imported incorrectly.
- The lazy-loaded file name had the wrong case (`async-DashEcharts.js`) and was not found on case-sensitive servers.

### Added
- `n_resizes` property (window resize timestamp) is declared.
- Browser sandbox (`npm start`) and documentation in `doc/`.
- Proprietary license, with the notice of the original dash-echarts code and the bundled libraries.

### Removed
- R and Julia packages.
- `this.bmap` in `funs` (it was always undefined). `bmap_token` was never used.

## 1.1.0 (tag `1.0.1`)
- Added the y-axis name (`axisName`) to `yAxisRightClick`.

## 1.0.0
- First version.
