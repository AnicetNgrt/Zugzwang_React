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
var DefaultPlayerEffects_1 = require("../../Consts/DefaultPlayerEffects");
var GameObject_1 = require("./GameObject");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(hand, pawns, team, idProvider) {
        var _this = _super.call(this, idProvider) || this;
        _this.hand = hand;
        _this.pawns = pawns;
        _this.team = team;
        _this.effects = DefaultPlayerEffects_1.DefaultPlayerEffects(idProvider);
        return _this;
    }
    return Player;
}(GameObject_1.GameObject));
exports.Player = Player;
//# sourceMappingURL=Player.js.map