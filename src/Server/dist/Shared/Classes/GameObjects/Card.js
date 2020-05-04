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
var Hidable_1 = require("../../Interfaces/Hidable");
var FlickeringCardType_1 = require("../CardTypes/FlickeringCardType");
var Card = /** @class */ (function (_super) {
    __extends(Card, _super);
    function Card(type, playedGame, playedTurn, idProvider, shown) {
        var _this = _super.call(this, idProvider) || this;
        _this.type = type;
        _this.playedGame = playedGame;
        _this.playedTurn = playedTurn;
        _this.idProvider = idProvider;
        if (shown != undefined) {
            _this._shown = shown;
        }
        else if (Hidable_1.isHidable(type)) {
            _this._shown = type.shown;
        }
        else {
            _this._shown = true;
        }
        return _this;
    }
    Object.defineProperty(Card.prototype, "shown", {
        get: function () {
            return this._shown;
        },
        set: function (shown) {
            if (this.type instanceof FlickeringCardType_1.FlickeringCardType) {
                this._shown = shown;
            }
        },
        enumerable: true,
        configurable: true
    });
    Card.prototype.getPlayableFor = function (player, gameState) {
        return this.type.getPlayableFor(player, gameState);
    };
    Card.prototype.copy = function () {
        var copy = new Card(this.type, this.playedGame, this.playedTurn, CopyIdProvider_1.CopyIdProvider.getYours(this));
        return copy;
    };
    Card.getCardOfType = function (cardType, idProvider) {
        return new Card(cardType, 0, 0, idProvider);
    };
    return Card;
}(GameObject_1.GameObject));
exports.Card = Card;
//# sourceMappingURL=Card.js.map