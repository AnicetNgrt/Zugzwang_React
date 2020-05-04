"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DisplacementCardType_1 = require("../Classes/CardTypes/DisplacementCardType");
var Patterns_1 = require("./Patterns");
exports.DisplacementCardTypes = {
    "SmallRivers": function () {
        return new DisplacementCardType_1.DisplacementCardType({
            weight: 0,
            name: "Small Rivers",
            picturePath: undefined,
            maxTurn: 999,
            maxGame: 999,
            fullCircle: false,
            displacements: [{
                    cost: 1,
                    pattern: Patterns_1.Patterns.smallRivers
                }]
        });
    },
    "Knight": function () {
        return new DisplacementCardType_1.DisplacementCardType({
            weight: 8,
            name: "Knight",
            picturePath: undefined,
            maxTurn: 2,
            maxGame: 999,
            fullCircle: false,
            displacements: [{
                    cost: 1,
                    pattern: Patterns_1.Patterns.knightEast
                },
                {
                    cost: 1,
                    pattern: Patterns_1.Patterns.knightWest
                }]
        });
    },
    "Clockmaker": function () {
        return new DisplacementCardType_1.DisplacementCardType({
            weight: 7,
            name: "Clockmaker",
            picturePath: undefined,
            maxTurn: 2,
            maxGame: 999,
            fullCircle: false,
            displacements: [{
                    cost: 1,
                    pattern: Patterns_1.Patterns.clockmakerEast
                },
                {
                    cost: 1,
                    pattern: Patterns_1.Patterns.clockmakerWest
                }]
        });
    }
};
//# sourceMappingURL=DisplacementCardTypes.js.map