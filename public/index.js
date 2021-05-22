"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard_1 = require("./keyboard");
require("./game");
window.addEventListener('keyup', function (event) { keyboard_1.default.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { keyboard_1.default.onKeydown(event); }, false);
//# sourceMappingURL=index.js.map