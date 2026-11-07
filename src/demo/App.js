/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { DashECharts } from '../lib';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const randomData = () => DAYS.map(() => Math.round(50 + Math.random() * 250));

const baseOption = (data) => ({
    tooltip: { trigger: 'axis' },
    toolbox: { feature: { brush: { type: ['lineX', 'clear'] } } },
    brush: { xAxisIndex: 'all' },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    xAxis: { type: 'category', data: DAYS },
    yAxis: { id: 'y0', type: 'value', triggerEvent: true },
    series: [{ name: 'A', type: 'line', data }],
});

const toText = (value) => {
    try {
        const text = JSON.stringify(value);
        return text.length > 200 ? text.slice(0, 200) + '…' : text;
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
    const [props, setState] = useState({ option: baseOption(randomData()) });
    const [log, setLog] = useState([]);
    const [mounted, setMounted] = useState(true);
    const [wide, setWide] = useState(true);

    const setProps = (newProps) => {
        setState(prev => ({ ...prev, ...newProps }));
        const line = Object.entries(newProps).map(([key, value]) => `${key}: ${toText(value)}`).join(' | ');
        setLog(prev => [`${new Date().toLocaleTimeString()}  ${line}`, ...prev].slice(0, 20));
    };

    const update = (newProps) => setState(prev => ({ ...prev, ...newProps }));
    const increment = (key) => setState(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
            <h3>dash_echarts sandbox</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <Btn onClick={() => update({ option: baseOption(randomData()) })}>New data (option)</Btn>
                <Btn onClick={() => update({ opt_merge: { series: [{}, { name: 'B', type: 'line', data: randomData() }] } })}>
                    Add series B (opt_merge)
                </Btn>
                <Btn onClick={() => update({
                    funs: { seriesList: "function (params) { return params.map(p => p.seriesName + ': ' + p.value).join('<br/>'); }" },
                    fun_values: ['seriesList'],
                    option: { ...baseOption(randomData()), tooltip: { trigger: 'axis', formatter: 'seriesList' } },
                })}>
                    Tooltip formatter (funs)
                </Btn>
                <Btn onClick={() => update({ yAxisResize: { index: 0, min: 0, max: 500 } })}>Y axis 0–500 (yAxisResize)</Btn>
                <Btn onClick={() => increment('reset_id')}>Reset (reset_id)</Btn>
                <Btn onClick={() => { setWide(!wide); increment('resize_id'); }}>Change width (resize_id)</Btn>
                <Btn onClick={() => setMounted(!mounted)}>{mounted ? 'Unmount' : 'Mount'} chart</Btn>
                <Btn onClick={() => setLog([])}>Clear log</Btn>
            </div>
            <div style={{ width: wide ? '100%' : '60%', height: 400, border: '1px solid #ddd' }}>
                {mounted && (
                    <DashECharts id="chart" setProps={setProps} {...props} style={{ width: '100%', height: '100%' }} />
                )}
            </div>
            <h4>Props sent back by the component (newest first)</h4>
            <pre style={{ background: '#f6f6f6', padding: 8, maxHeight: 260, overflow: 'auto', fontSize: 12 }}>
                {log.length ? log.join('\n') : 'Click a point, right-click the y axis, zoom or brush the chart…'}
            </pre>
        </div>
    );
};

export default App;
