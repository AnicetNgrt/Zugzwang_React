"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CopyIdProvider = /** @class */ (function () {
    function CopyIdProvider(id) {
        this.id = id;
    }
    CopyIdProvider.prototype.provide = function () {
        return this.id;
    };
    CopyIdProvider.getYours = function (gameObject) {
        return new CopyIdProvider(gameObject.id);
    };
    return CopyIdProvider;
}());
exports.CopyIdProvider = CopyIdProvider;
//# sourceMappingURL=CopyIdProvider.js.map