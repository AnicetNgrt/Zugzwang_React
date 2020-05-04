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
Object.defineProperty(exports, "__esModule", { value: true });
var ShownCardType_1 = require("./ShownCardType");
var Orientation_1 = require("../../Enums/Orientation");
var DisplacementCardType = /** @class */ (function (_super) {
    __extends(DisplacementCardType, _super);
    function DisplacementCardType(data) {
        var _this = _super.call(this, {
            weight: data.weight,
            name: data.name,
            picturePath: data.picturePath,
            maxTurn: data.maxTurn,
            maxGame: data.maxGame,
            actions: []
        }) || this;
        _this.data = __assign(__assign({}, data), { actions: [] });
        return _this;
    }
    DisplacementCardType.prototype.rotate = function (rotation) {
        if (this.data.fullCircle)
            return;
        for (var i = 0; i < this.data.displacements.length; i++) {
            var rotated = Orientation_1.reOrient(this.data.displacements[i].pattern, rotation);
            this.data.displacements[i].pattern = rotated;
        }
    };
    DisplacementCardType.prototype.getPlayableFor = function (player, gameState) {
        var ret = [];
        return ret.concat(_super.prototype.getPlayableFor.call(this, player, gameState));
    };
    return DisplacementCardType;
}(ShownCardType_1.ShownCardType));
exports.DisplacementCardType = DisplacementCardType;
//# sourceMappingURL=DisplacementCardType.js.map