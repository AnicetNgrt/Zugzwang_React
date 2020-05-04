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
var PawnState;
(function (PawnState) {
    PawnState["FINE"] = "This pawn is alive";
    PawnState["EXILED"] = "This pawn is exiled";
    PawnState["DEAD"] = "This pawn is dead";
})(PawnState = exports.PawnState || (exports.PawnState = {}));
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(idProvider, state, x, y) {
        var _this = _super.call(this, idProvider) || this;
        _this.x = x;
        _this.y = y;
        _this.state = state;
        return _this;
    }
    Pawn.prototype.distanceTo = function (pawn) {
        return Math.abs(pawn.x - this.x) + Math.abs(pawn.y - this.y);
    };
    Pawn.prototype.copy = function () {
        return new Pawn(CopyIdProvider_1.CopyIdProvider.getYours(this), this.state, this.x, this.y);
    };
    return Pawn;
}(GameObject_1.GameObject));
exports.Pawn = Pawn;
//# sourceMappingURL=Pawn.js.map