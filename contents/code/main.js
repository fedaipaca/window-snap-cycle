const SIZES = {
    left:   [1/2, 2/3, 1/3],
    right:  [1/2, 2/3, 1/3],
    center: [1/2, 2/3, 1/3],
    fill:   [1, 0.9]
};
const TOLERANCE = 40;

function rectFor(action, ratio, a) {
    const w = Math.round(a.width * ratio);
    if (action === "left")
        return { x: a.x, y: a.y, width: w, height: a.height };
    if (action === "right")
        return { x: a.x + a.width - w, y: a.y, width: w, height: a.height };
    if (action === "center")
        return { x: a.x + Math.round((a.width - w) / 2), y: a.y, width: w, height: a.height };
    const h = Math.round(a.height * ratio);
    return { x: a.x + Math.round((a.width - w) / 2), y: a.y + Math.round((a.height - h) / 2), width: w, height: h };
}

function near(g, r) {
    return Math.abs(g.x - r.x) <= TOLERANCE && Math.abs(g.y - r.y) <= TOLERANCE &&
           Math.abs(g.width - r.width) <= TOLERANCE && Math.abs(g.height - r.height) <= TOLERANCE;
}

function snap(action) {
    const win = workspace.activeWindow;
    if (!win || !win.normalWindow || !win.moveable || !win.resizeable || win.fullScreen) return;
    const area = workspace.clientArea(KWin.MaximizeArea, win);
    const sizes = SIZES[action];
    const current = win.frameGeometry;
    let next = 0;
    for (let i = 0; i < sizes.length; i++) {
        if (near(current, rectFor(action, sizes[i], area))) {
            next = (i + 1) % sizes.length;
            break;
        }
    }
    if (win.tile) win.tile = null;
    win.setMaximize(false, false);
    win.frameGeometry = rectFor(action, sizes[next], area);
}

registerShortcut("SnapCycleLeft",   "Window Snap Cycle: Left",   "Ctrl+Alt+Left",   function () { snap("left"); });
registerShortcut("SnapCycleRight",  "Window Snap Cycle: Right",  "Ctrl+Alt+Right",  function () { snap("right"); });
registerShortcut("SnapCycleCenter", "Window Snap Cycle: Center", "Ctrl+Alt+C",      function () { snap("center"); });
registerShortcut("SnapCycleFill",   "Window Snap Cycle: Fill",   "Ctrl+Alt+Return", function () { snap("fill"); });
