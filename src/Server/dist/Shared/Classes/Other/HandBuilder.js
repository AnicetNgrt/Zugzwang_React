"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("../GameObjects/Card");
var Hand_1 = require("./Hand");
var HandBuilderErrors;
(function (HandBuilderErrors) {
    HandBuilderErrors["NONE"] = "Everything is fine";
    HandBuilderErrors["TOO_HEAVY"] = "Your hand is too heavy.";
    HandBuilderErrors["DUPLICATE_CARD"] = "You have the same card twice.";
})(HandBuilderErrors = exports.HandBuilderErrors || (exports.HandBuilderErrors = {}));
var HandBuilder = /** @class */ (function () {
    function HandBuilder(cardTypes, maxWeight, validCompoCheck) {
        this.cardTypes = cardTypes;
        this.maxWeight = maxWeight;
        this.validCompoCheck = validCompoCheck;
        this.weight = 0;
    }
    HandBuilder.getEmptyHandBuilder = function (maxWeight, validCompoCheck) {
        return new HandBuilder([], maxWeight, validCompoCheck);
    };
    HandBuilder.prototype.addCard = function (cardType) {
        this.weight += cardType.data.weight;
        this.cardTypes.push(cardType);
    };
    HandBuilder.prototype.hasValidWeight = function () {
        return this.weight <= this.maxWeight && (new Set(this.cardTypes)).size !== this.cardTypes.length;
    };
    HandBuilder.prototype.getHand = function (idProvider) {
        if (!this.hasValidWeight)
            throw new Error(HandBuilderErrors.TOO_HEAVY);
        var endReason = this.validCompoCheck();
        if (endReason != HandBuilderErrors.NONE)
            throw new Error(endReason);
        var cards = [];
        for (var _i = 0, _a = this.cardTypes; _i < _a.length; _i++) {
            var type = _a[_i];
            cards.push(Card_1.Card.getCardOfType(type, idProvider));
        }
        return Hand_1.Hand.getHandFromCards(cards);
    };
    return HandBuilder;
}());
exports.HandBuilder = HandBuilder;
//# sourceMappingURL=HandBuilder.js.map