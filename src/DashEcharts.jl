
module DashEcharts
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "1.1.0"

include("jl/''_dashecharts.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_echarts",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-DashECharts.js",
    external_url = "https://unpkg.com/dash_echarts@1.1.0/dash_echarts/async-DashECharts.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-DashECharts.js.map",
    external_url = "https://unpkg.com/dash_echarts@1.1.0/dash_echarts/async-DashECharts.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_echarts.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_echarts.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
