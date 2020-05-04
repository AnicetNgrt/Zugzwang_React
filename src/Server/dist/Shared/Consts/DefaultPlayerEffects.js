"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerEffect_1 = require("../Classes/GameObjects/PlayerEffect");
function DefaultPlayerEffects(idProvider) {
    return {
        focus: new PlayerEffect_1.PlayerEffect("Focus", "", null, 1, 0, idProvider),
        explorer: new PlayerEffect_1.PlayerEffect("Explorer", "", null, 1, 0, idProvider),
        actionPoints: new PlayerEffect_1.PlayerEffect("Action points", "", null, 999, 0, idProvider),
        reinforcements: new PlayerEffect_1.PlayerEffect("Reinforcements", "", null, 999, 999, idProvider)
    };
}
exports.DefaultPlayerEffects = DefaultPlayerEffects;
//# sourceMappingURL=DefaultPlayerEffects.js.map