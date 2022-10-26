"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowDrag = exports.lerp = void 0;
const electron_1 = require("electron");
function lerp(start, end, speed) {
    if (Math.abs(start - end) < .1) {
        return end;
    }
    return (1 - speed) * start + speed * end;
}
exports.lerp = lerp;
class WindowDrag {
    _window;
    _offset = { x: 0, y: 0 };
    _lastSize = { x: 0, y: 0 };
    _screenSize;
    _pos = { x: 0, y: 0 };
    _size = { x: 0, y: 0 };
    pos = { x: 0, y: 0 };
    size = { x: 0, y: 0 };
    setLast() {
        const bounds = this.window.getBounds();
        const cursor = electron_1.screen.getCursorScreenPoint();
        this._lastSize = {
            x: bounds.width,
            y: bounds.height
        };
        this._offset = {
            x: bounds.x - cursor.x,
            y: bounds.y - cursor.y
        };
    }
    setWindow(window) {
        this._window = window;
        this.setLast();
    }
    get window() {
        if (this._window === undefined) {
            throw new Error('Window undefined');
        }
        return this._window;
    }
    get screenSize() {
        if (this._screenSize === undefined) {
            throw new Error('Screen size undefined');
        }
        return this._screenSize;
    }
    start = () => {
        const cursor = electron_1.screen.getCursorScreenPoint();
        this._screenSize = electron_1.screen.getDisplayNearestPoint(cursor).bounds;
        this.setLast();
        Object.assign(this._size, this._lastSize);
    };
    stop = (interval) => {
        clearInterval(interval);
        this.setPosition(this.pos);
        this.setSize(this.size);
    };
    setSize(p) {
        try {
            this.window.setSize(Math.round(p.x) ?? 1, Math.round(p.y) ?? 1);
        }
        catch (e) {
        }
    }
    setPosition(p) {
        try {
            this.window.setPosition(Math.round(p.x) ?? 1, Math.round(p.y) ?? 1);
        }
        catch (e) {
        }
    }
    snapToScreenCorner(mouse, snapOffset) {
        const { screenSize } = this;
        const pos = { x: screenSize.x, y: screenSize.y };
        const size = { x: 0, y: 0 };
        const center = screenSize.width / 2;
        const centerDiv = center / 2;
        mouse.x = screenSize.x !== 0 ? Math.abs(screenSize.x) - Math.abs(mouse.x) : mouse.x;
        mouse.y = screenSize.y !== 0 ? Math.abs(screenSize.y) - Math.abs(mouse.y) : mouse.y;
        mouse.x = Math.abs(mouse.x);
        mouse.y = Math.abs(mouse.y);
        if (mouse.x > center - centerDiv && mouse.x < center + centerDiv && mouse.y < snapOffset) {
            size.x = screenSize.width;
            size.y = screenSize.height;
            return { pos, size };
        }
        else if (mouse.x < snapOffset) {
            size.x = screenSize.width / 2;
            size.y = screenSize.height;
            return { pos, size };
        }
        else if (mouse.x > screenSize.width - snapOffset) {
            pos.x = screenSize.width / 2 + screenSize.x;
            size.x = screenSize.width / 2;
            size.y = screenSize.height;
            return { pos, size };
        }
        else if (mouse.y < snapOffset) {
            size.x = screenSize.width;
            size.y = screenSize.height / 2;
            return { pos, size };
        }
        else if (mouse.y > screenSize.height - snapOffset) {
            pos.y = screenSize.height / 2 + screenSize.y;
            size.x = screenSize.width;
            size.y = screenSize.height / 2;
            return { pos, size };
        }
    }
    update = () => {
        const mousePos = electron_1.screen.getCursorScreenPoint();
        const { screenSize } = this;
        const newScreenSize = electron_1.screen.getDisplayNearestPoint(mousePos).bounds;
        const lastPos = this._offset;
        const lastSize = this._lastSize;
        const snapOffset = 40;
        const scale = .5;
        if (lastSize.x >= screenSize.width - snapOffset ||
            lastSize.y >= screenSize.height - snapOffset) {
            const { width, height } = screenSize;
            lastSize.x = width * scale;
            lastSize.y = height * scale;
            this._offset.x *= scale;
            this._offset.y *= scale;
        }
        let pos = {
            x: lastPos.x + mousePos.x,
            y: lastPos.y + mousePos.y
        };
        let size = { ...lastSize };
        const snap = this.snapToScreenCorner(mousePos, snapOffset);
        if (snap) {
            pos = snap.pos;
            size = snap.size;
        }
        this.pos = pos;
        this.size = size;
        this._pos.x = lerp(this._pos.x, pos.x, .2);
        this._pos.y = lerp(this._pos.y, pos.y, .2);
        this._size.x = lerp(this._size.x, size.x, .2);
        this._size.y = lerp(this._size.y, size.y, .2);
        this.setSize(this._size);
        this.setPosition(this._pos);
        this._screenSize = newScreenSize;
    };
}
exports.WindowDrag = WindowDrag;
