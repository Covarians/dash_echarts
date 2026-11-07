import dash_echarts
from dash import Dash, Input, Output, callback, html

# Functions used by the chart are defined in assets/dash_echarts_functions.js.
app = Dash(__name__)

option = {
    "tooltip": {"trigger": "axis"},
    "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]},
    "yAxis": {
        "type": "value",
        "axisLabel": {"formatter": {"function": "withUnit", "args": "kg"}},
    },
    "series": [{"name": "Weight", "type": "line", "data": [150, 230, 224, 218, 135, 147, 260]}],
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
