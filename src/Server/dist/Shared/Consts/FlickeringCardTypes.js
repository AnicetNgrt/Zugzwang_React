"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FlickeringCardType_1 = require("../Classes/CardTypes/FlickeringCardType");
exports.FlickeringCardTypes = {
    Archer: function () {
        return new FlickeringCardType_1.FlickeringCardType({
            weight: 3,
            name: "Archer",
            picturePath: "/images/cardsPixel/archer.png",
            maxTurn: 2,
            maxGame: 999,
            actions: []
        });
    }
};
//# sourceMappingURL=FlickeringCardTypes.js.map