# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''DashECharts <- function(id=NULL, axisPointer_index=NULL, bmap_token=NULL, brushSelected_data=NULL, brush_data=NULL, click_data=NULL, clicked_bar_data=NULL, enable_get_axisPointer_event=NULL, enable_get_clicked_bar_data_event=NULL, event=NULL, fun_effects=NULL, fun_keys=NULL, fun_paths=NULL, fun_prepares=NULL, fun_values=NULL, funs=NULL, mapbox_token=NULL, maps=NULL, n_clicks=NULL, n_clicks_timestamp=NULL, opt_merge=NULL, option=NULL, part_of_opt=NULL, reset_id=NULL, resize_id=NULL, selected_data=NULL, style=NULL, yAxisResize=NULL, yAxisRightClick=NULL, zoom_data=NULL) {
    
    props <- list(id=id, axisPointer_index=axisPointer_index, bmap_token=bmap_token, brushSelected_data=brushSelected_data, brush_data=brush_data, click_data=click_data, clicked_bar_data=clicked_bar_data, enable_get_axisPointer_event=enable_get_axisPointer_event, enable_get_clicked_bar_data_event=enable_get_clicked_bar_data_event, event=event, fun_effects=fun_effects, fun_keys=fun_keys, fun_paths=fun_paths, fun_prepares=fun_prepares, fun_values=fun_values, funs=funs, mapbox_token=mapbox_token, maps=maps, n_clicks=n_clicks, n_clicks_timestamp=n_clicks_timestamp, opt_merge=opt_merge, option=option, part_of_opt=part_of_opt, reset_id=reset_id, resize_id=resize_id, selected_data=selected_data, style=style, yAxisResize=yAxisResize, yAxisRightClick=yAxisRightClick, zoom_data=zoom_data)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashECharts',
        namespace = 'dash_echarts',
        propNames = c('id', 'axisPointer_index', 'bmap_token', 'brushSelected_data', 'brush_data', 'click_data', 'clicked_bar_data', 'enable_get_axisPointer_event', 'enable_get_clicked_bar_data_event', 'event', 'fun_effects', 'fun_keys', 'fun_paths', 'fun_prepares', 'fun_values', 'funs', 'mapbox_token', 'maps', 'n_clicks', 'n_clicks_timestamp', 'opt_merge', 'option', 'part_of_opt', 'reset_id', 'resize_id', 'selected_data', 'style', 'yAxisResize', 'yAxisRightClick', 'zoom_data'),
        package = 'dashEcharts'
        )

    structure(component, class = c('dash_component', 'list'))
}
