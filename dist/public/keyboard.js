"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    _pressed: {},
    A: 65,
    W: 87,
    D: 68,
    S: 83,
    F: 70,
    SPACE: 32,
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};
//# sourceMappingURL=keyboard.js.map