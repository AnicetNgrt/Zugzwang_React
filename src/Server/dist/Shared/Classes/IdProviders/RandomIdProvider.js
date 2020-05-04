"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RandomIdProvider = /** @class */ (function () {
    function RandomIdProvider(length) {
        this.length = length;
    }
    RandomIdProvider.prototype.provide = function () {
        var max = Math.pow(10, Math.abs(this.length));
        var min = 1;
        return Math.floor((Math.random() * (max - min + 1)) + min) - 1;
    };
    return RandomIdProvider;
}());
exports.RandomIdProvider = RandomIdProvider;
//# sourceMappingURL=RandomIdProvider.js.map