"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hand = /** @class */ (function () {
    function Hand(cards) {
        this.cards = cards;
    }
    Hand.prototype.getPlayableFor = function (player, gameState) {
        var actions = [];
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            actions = actions.concat(card.getPlayableFor(player, gameState));
        }
        return actions;
    };
    Hand.getHandFromCards = function (cards) {
        return new Hand(cards);
    };
    return Hand;
}());
exports.Hand = Hand;
//# sourceMappingURL=Hand.js.map