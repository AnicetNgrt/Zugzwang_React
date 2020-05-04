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
var Player_1 = require("../GameObjects/Player");
var AiPlayer = /** @class */ (function (_super) {
    __extends(AiPlayer, _super);
    function AiPlayer(hand, pawns, team, idProvider) {
        var _this = _super.call(this, hand, pawns, team, idProvider) || this;
        _this.hand = hand;
        _this.pawns = pawns;
        _this.team = team;
        return _this;
    }
    AiPlayer.prototype.sendMove = function (move) {
        throw new Error("Method not implemented.");
    };
    AiPlayer.prototype.hasLost = function () {
        throw new Error("Method not implemented.");
    };
    AiPlayer.prototype.play = function (gameState) {
        throw new Error("Method not implemented.");
    };
    return AiPlayer;
}(Player_1.Player));
exports.AiPlayer = AiPlayer;
//# sourceMappingURL=AiPlayer.js.map