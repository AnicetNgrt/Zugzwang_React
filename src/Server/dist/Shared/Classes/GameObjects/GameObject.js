"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CopyIdProvider_1 = require("../IdProviders/CopyIdProvider");
var GameObject = /** @class */ (function () {
    function GameObject(idProvider) {
        this.idProvider = idProvider;
        this.id = idProvider.provide();
    }
    GameObject.prototype.copy = function () {
        return new GameObject(CopyIdProvider_1.CopyIdProvider.getYours(this));
    };
    return GameObject;
}());
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map