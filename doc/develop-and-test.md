# Develop & test

## First-time setup

From the repository root:

```
npm ci
python -m venv venv
venv\Scripts\activate            # Windows cmd (PowerShell: .\venv\Scripts\Activate.ps1)
pip install -r requirements.txt
```

`npm ci` installs the JavaScript tools exactly as in `package-lock.json`.
`requirements.txt` installs the Dash version used by the apps (needed to build and to
run `usage.py`).

## 1. Browser sandbox (fast iteration)

```
npm start
```

This opens http://localhost:8080. The page (`src/demo/App.js`) renders the real
component from `src/lib` and reloads on every save.

- **Edit** `src/lib/fragments/DashECharts.react.js` (behavior) or
  `src/lib/components/DashECharts.react.js` (props).
- **Buttons** set the props: `option`, `option_merge`, function references,
  `y_axis_range`, `actions`, `loading`, `theme`, `renderer`, `click_mode`,
  `reset_count`, the container width, and unmount/mount the chart.
- **The log** under the chart shows every property the component sends back with
  `setProps`, as Dash would receive it.
- `App.js` defines `window.dashEchartsFunctions`, as an app's asset file would.
- The sandbox runs React 18 in `StrictMode`, which mounts components twice in
  development. A warning such as "There is a chart instance already initialized on
  the dom" or doubled log lines mean that some cleanup is missing.

Add a button to `App.js` to reproduce any case you are working on.

## 2. Test in Dash

The sandbox uses React 18; Dash 2.x runs the component with React 16.14. Before a
release, also test in a real Dash app:

```
npm run build
python usage.py
```

Open http://127.0.0.1:8050: the line chart must appear with "kg" on the y axis
labels (a function from `assets/dash_echarts_functions.js`), and clicking a point
must update the text below it. In the browser network tab, `async-DashECharts…js`
is the chart code, loaded with the chart.

To test in one of your apps before a release, install this folder in the app's
environment in editable mode: `pip install -e <path to dash_echarts>`.

## Troubleshooting

- **`ModuleNotFoundError: No module named 'pkg_resources'`** during the build:
  Dash 2.x needs `setuptools<81`. Run `pip install -r requirements.txt` in the venv.
- **`dash-generate-components` not found**: the venv is not activated.
- **Blank chart**: the container needs a height (`style={"height": "400px"}`).
- **Console warning `"name" is not a function of window.dashEchartsFunctions`**: the
  asset file is missing, not in the app's `assets/` folder, or misspells the name.
