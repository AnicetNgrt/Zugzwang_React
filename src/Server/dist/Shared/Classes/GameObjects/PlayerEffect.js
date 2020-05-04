"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GameObject_1 = require("./GameObject");
var CopyIdProvider_1 = require("../IdProviders/CopyIdProvider");
var PlayerEffect = /** @class */ (function (_super) {
    __extends(PlayerEffect, _super);
    function PlayerEffect(name, description, picturePath, maxLevel, level, idProvider) {
        var _this = _super.call(this, idProvider) || this;
        _this.name = name;
        _this.description = description;
        _this.picturePath = picturePath;
        _this.maxLevel = maxLevel;
        _this._level = 0;
        _this.level = level;
        return _this;
    }
    Object.defineProperty(PlayerEffect.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (level) {
            this._level = Math.max(Math.min(level, this.maxLevel), 0);
        },
        enumerable: true,
        configurable: true
    });
    PlayerEffect.prototype.copy = function () {
        return new PlayerEffect(this.name, this.description, this.picturePath, this.maxLevel, this.level, CopyIdProvider_1.CopyIdProvider.getYours(this));
    };
    return PlayerEffect;
}(GameObject_1.GameObject));
exports.PlayerEffect = PlayerEffect;
//# sourceMappingURL=PlayerEffect.js.map