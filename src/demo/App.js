/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { DashECharts } from '../lib';

// In a Dash app, this object is defined in an asset file (assets/*.js).
window.dashEchartsFunctions = {
    seriesList: (params) => params.map(p => `${p.seriesName}: ${p.value}`).join('<br/>'),
    withUnit: (unit) => (value) => `${value} ${unit}`,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const randomData = () => DAYS.map(() => Math.round(50 + Math.random() * 250));

const baseOption = (data) => ({
    tooltip: { trigger: 'axis' },
    legend: {},
    toolbox: { feature: { brush: { type: ['lineX', 'clear'] } } },
    brush: { xAxisIndex: 'all' },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    xAxis: { type: 'category', data: DAYS, triggerEvent: true },
    yAxis: { type: 'value', triggerEvent: true },
    series: [{ name: 'A', type: 'bar', data }],
});

const toText = (value) => {
    try {
        const text = JSON.stringify(value);
        return text.length > 240 ? text.slice(0, 240) + '\u2026' : text;
    } catch (e) {
        return '[not serializable]';
    }
};

const Btn = ({ onClick, children }) => (
    <button onClick={onClick} style={{ padding: '4px 10px' }}>{children}</button>
);

/**
 * Sandbox to develop and test DashECharts outside Dash.
 * setProps mimics Dash: props sent back by the component are merged into the state and logged.
 */
const App = () => {
    const [props, setState] = useState({
        option: baseOption(randomData()),
        events: ['legendselectchanged', 'brushSelected'],
    });
    const [log, setLog] = useState([]);
    const [mounted, setMounted] = useState(true);
    const [wide, setWide] = useState(true);

    const setProps = (newProps) => {
        setState(prev => ({ ...prev, ...newProps }));
        const line = Object.entries(newProps).map(([key, value]) => `${key}: ${toText(value)}`).join(' | ');
        setLog(prev => [`${new Date().toLocaleTimeString()}  ${line}`, ...prev].slice(0, 30));
    };

    const update = (newProps) => setState(prev => ({ ...prev, ...newProps }));
    const toggle = (key, a, b) => setState(prev => ({ ...prev, [key]: prev[key] === b ? a : b }));

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
            <h3>dash_echarts sandbox</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <Btn onClick={() => update({ option: baseOption(randomData()) })}>New data (option)</Btn>
                <Btn onClick={() => update({ option_merge: { series: [{}, { name: 'B', type: 'line', data: randomData() }] } })}>
                    Add line B (option_merge)
                </Btn>
                <Btn onClick={() => update({
                    option: {
                        ...baseOption(randomData()),
                        tooltip: { trigger: 'axis', formatter: { function: 'seriesList' } },
                        yAxis: { type: 'value', triggerEvent: true, axisLabel: { formatter: { function: 'withUnit', args: 'kg' } } },
                    },
                })}>
                    Formatters ({'{function}'})
                </Btn>
                <Btn onClick={() => update({ y_axis_range: { index: 0, min: 0, max: 500 } })}>Y axis 0-500 (y_axis_range)</Btn>
                <Btn onClick={() => update({ actions: [{ type: 'dataZoom', start: 0, end: 50 }] })}>Zoom 0-50% (actions)</Btn>
                <Btn onClick={() => toggle('loading', false, true)}>Toggle loading</Btn>
                <Btn onClick={() => toggle('theme', undefined, 'dark')}>Toggle dark theme</Btn>
                <Btn onClick={() => toggle('renderer', 'canvas', 'svg')}>Toggle SVG renderer</Btn>
                <Btn onClick={() => toggle('click_mode', 'series', 'grid')}>Toggle click_mode grid</Btn>
                <Btn onClick={() => update({ reset_count: (props.reset_count ?? 0) + 1 })}>Reset (reset_count)</Btn>
                <Btn onClick={() => setWide(!wide)}>Change width</Btn>
                <Btn onClick={() => setMounted(!mounted)}>{mounted ? 'Unmount' : 'Mount'} chart</Btn>
                <Btn onClick={() => setLog([])}>Clear log</Btn>
            </div>
            <div style={{ fontSize: 12, marginBottom: 8 }}>
                theme: {String(props.theme ?? 'default')} | renderer: {props.renderer ?? 'canvas'} | click_mode: {props.click_mode ?? 'series'} | loading: {String(props.loading ?? false)}
            </div>
            <div style={{ width: wide ? '100%' : '60%', border: '1px solid #ddd' }}>
                {mounted && (
                    <DashECharts id="chart" setProps={setProps} {...props} style={{ width: '100%', height: 400 }} />
                )}
            </div>
            <h4>Props sent back by the component (newest first)</h4>
            <pre style={{ background: '#f6f6f6', padding: 8, maxHeight: 260, overflow: 'auto', fontSize: 12 }}>
                {log.length ? log.join('\n') : 'Click a bar, right-click an axis, zoom, brush or toggle the legend\u2026'}
            </pre>
        </div>
    );
};

export default App;
