// Functions referenced from Python with {"function": "name"} or {"function": "name", "args": ...}.
window.dashEchartsFunctions = Object.assign(window.dashEchartsFunctions || {}, {
    // Factory: {"function": "withUnit", "args": "kg"} gives a formatter adding the unit.
    withUnit: (unit) => (value) => `${value} ${unit}`,
});
