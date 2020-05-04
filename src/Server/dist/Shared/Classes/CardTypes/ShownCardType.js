"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShownCardType = /** @class */ (function () {
    function ShownCardType(data) {
        this.data = data;
        this.shown = true;
    }
    ShownCardType.prototype.getPlayableFor = function (player, gameState) {
        return [];
    };
    return ShownCardType;
}());
exports.ShownCardType = ShownCardType;
//# sourceMappingURL=ShownCardType.js.map