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
var ListenerPlayer_1 = require("./ListenerPlayer");
var NodePlayer = /** @class */ (function (_super) {
    __extends(NodePlayer, _super);
    function NodePlayer(hand, pawns, teams, idProvider) {
        var _this = _super.call(this, hand, pawns, teams, idProvider) || this;
        _this.hand = hand;
        _this.pawns = pawns;
        _this.teams = teams;
        return _this;
    }
    NodePlayer.prototype.hasLost = function () {
        throw new Error("Method not implemented.");
    };
    NodePlayer.prototype.play = function (gameState) {
        throw new Error("Method not implemented.");
    };
    NodePlayer.prototype.sendMove = function (move) {
        throw new Error("Method not implemented.");
    };
    return NodePlayer;
}(ListenerPlayer_1.ListenerPlayer));
exports.NodePlayer = NodePlayer;
//# sourceMappingURL=NodePlayer.js.map