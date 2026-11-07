# Changelog

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
