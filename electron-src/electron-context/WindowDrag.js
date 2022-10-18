"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.WindowDrag = exports.lerp = void 0;
var electron_1 = require("electron");
function lerp(start, end, speed) {
    var value = (1 - speed) * start + speed * end;
    if (Math.abs(value) < .1 || Math.abs(start - end) < .1) {
        return end;
    }
    return value;
}
exports.lerp = lerp;
var WindowDrag = /** @class */ (function () {
    function WindowDrag() {
        var _this = this;
        this._offset = { x: 0, y: 0 };
        this._lastSize = { x: 0, y: 0 };
        this._pos = { x: 0, y: 0 };
        this._size = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this.size = { x: 0, y: 0 };
        this.start = function () {
            var cursor = electron_1.screen.getCursorScreenPoint();
            var bounds = _this.window.getBounds();
            _this._screenSize = electron_1.screen.getDisplayNearestPoint(cursor).bounds;
            _this._lastSize = {
                x: bounds.width,
                y: bounds.height
            };
            _this._offset = {
                x: bounds.x - cursor.x,
                y: bounds.y - cursor.y
            };
            Object.assign(_this._size, _this._lastSize);
            _this._pos = { x: bounds.x, y: bounds.y };
        };
        this.stop = function (interval) {
            clearInterval(interval);
            _this.setPosition(_this.pos);
            _this.setSize(_this.size);
        };
        this.update = function () {
            var mousePos = electron_1.screen.getCursorScreenPoint();
            var screenSize = _this.screenSize;
            var newScreenSize = electron_1.screen.getDisplayNearestPoint(mousePos).bounds;
            var lastPos = _this._offset;
            var lastSize = _this._lastSize;
            var snapOffset = 40;
            var scale = .5;
            if (lastSize.x >= screenSize.width - snapOffset ||
                lastSize.y >= screenSize.height - snapOffset) {
                var width = screenSize.width, height = screenSize.height;
                lastSize.x = width * scale;
                lastSize.y = height * scale;
                _this._offset.x *= scale;
                _this._offset.y *= scale;
            }
            var pos = {
                x: lastPos.x + mousePos.x,
                y: lastPos.y + mousePos.y
            };
            var size = __assign({}, lastSize);
            var snap = _this.snapToScreenCorner(mousePos, snapOffset);
            if (snap) {
                pos = snap.pos;
                size = snap.size;
            }
            _this.pos = pos;
            _this.size = size;
            _this._pos.x = lerp(_this._pos.x, pos.x, .2);
            _this._pos.y = lerp(_this._pos.y, pos.y, .2);
            _this._size.x = lerp(_this._size.x, size.x, .2);
            _this._size.y = lerp(_this._size.y, size.y, .2);
            _this.setSize(_this._size);
            _this.setPosition(_this._pos);
            _this._screenSize = newScreenSize;
        };
    }
    WindowDrag.prototype.setWindow = function (window) {
        this._window = window;
    };
    Object.defineProperty(WindowDrag.prototype, "window", {
        get: function () {
            if (this._window === undefined) {
                throw new Error('Window undefined');
            }
            return this._window;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WindowDrag.prototype, "screenSize", {
        get: function () {
            if (this._screenSize === undefined) {
                throw new Error('Screen size undefined');
            }
            return this._screenSize;
        },
        enumerable: false,
        configurable: true
    });
    WindowDrag.prototype.setSize = function (p) {
        var _a, _b;
        try {
            this.window.setSize((_a = Math.round(p.x)) !== null && _a !== void 0 ? _a : 1, (_b = Math.round(p.y)) !== null && _b !== void 0 ? _b : 1);
        }
        catch (e) {
        }
    };
    WindowDrag.prototype.setPosition = function (p) {
        var _a, _b;
        try {
            this.window.setPosition((_a = Math.round(p.x)) !== null && _a !== void 0 ? _a : 1, (_b = Math.round(p.y)) !== null && _b !== void 0 ? _b : 1);
        }
        catch (e) {
        }
    };
    WindowDrag.prototype.snapToScreenCorner = function (mouse, snapOffset) {
        var screenSize = this.screenSize;
        var pos = { x: screenSize.x, y: screenSize.y };
        var size = { x: 0, y: 0 };
        var center = screenSize.width / 2;
        var centerDiv = center / 2;
        mouse.x = screenSize.x !== 0 ? Math.abs(screenSize.x) - Math.abs(mouse.x) : mouse.x;
        mouse.y = screenSize.y !== 0 ? Math.abs(screenSize.y) - Math.abs(mouse.y) : mouse.y;
        mouse.x = Math.abs(mouse.x);
        mouse.y = Math.abs(mouse.y);
        if (mouse.x > center - centerDiv && mouse.x < center + centerDiv && mouse.y < snapOffset) {
            size.x = screenSize.width;
            size.y = screenSize.height;
            return { pos: pos, size: size };
        }
        else if (mouse.x < snapOffset) {
            size.x = screenSize.width / 2;
            size.y = screenSize.height;
            return { pos: pos, size: size };
        }
        else if (mouse.x > screenSize.width - snapOffset) {
            pos.x = screenSize.width / 2 + screenSize.x;
            size.x = screenSize.width / 2;
            size.y = screenSize.height;
            return { pos: pos, size: size };
        }
        else if (mouse.y < snapOffset) {
            size.x = screenSize.width;
            size.y = screenSize.height / 2;
            return { pos: pos, size: size };
        }
        else if (mouse.y > screenSize.height - snapOffset) {
            pos.y = screenSize.height / 2 + screenSize.y;
            size.x = screenSize.width;
            size.y = screenSize.height / 2;
            return { pos: pos, size: size };
        }
    };
    return WindowDrag;
}());
exports.WindowDrag = WindowDrag;
