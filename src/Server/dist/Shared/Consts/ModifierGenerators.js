"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Modifier_1 = require("../Classes/Other/Modifier");
var Modification_1 = require("../Classes/Other/Modification");
var Pawn_1 = require("../Classes/GameObjects/Pawn");
function changeEffectLevel(effect, lvl) {
    if (effect.level == lvl)
        return [];
    var modified = effect.copy();
    modified.level = 1;
    var modifier = new Modifier_1.Modifier([effect], [
        new Modification_1.Modification(effect, modified)
    ]);
    return [modifier];
}
function tryKill(pawn) {
    if (pawn.state != Pawn_1.PawnState.FINE)
        return false;
    pawn.state = Pawn_1.PawnState.DEAD;
    return true;
}
function attacksAtaDistance(player, gameState, distance) {
    var modifiers = [];
    var _loop_1 = function (pawn) {
        var foePawns = gameState.getEnemyPawns(player);
        var eligibles = foePawns.filter(function (foePawn, i, a) {
            return foePawn.distanceTo(pawn) <= distance;
        });
        for (var _i = 0, eligibles_1 = eligibles; _i < eligibles_1.length; _i++) {
            var foePawn = eligibles_1[_i];
            var modified = foePawn.copy();
            if (!tryKill(modified))
                break;
            modifiers.push(new Modifier_1.Modifier([pawn, foePawn], [
                new Modification_1.Modification(foePawn, modified)
            ]));
        }
    };
    for (var _i = 0, _a = player.pawns; _i < _a.length; _i++) {
        var pawn = _a[_i];
        _loop_1(pawn);
    }
    return modifiers;
}
exports.ModifierGenerators = {
    focus: function (player, gameState) {
        return changeEffectLevel(player.effects.focus, 1);
    },
    unfocus: function (player, gameState) {
        return changeEffectLevel(player.effects.focus, 0);
    },
    bowShot: function (player, gameState) {
        if (player.effects.focus.level < 1)
            return [];
        return attacksAtaDistance(player, gameState, 2);
    },
    contact: function (player, gameState) {
        return attacksAtaDistance(player, gameState, 1);
    }
};
//# sourceMappingURL=ModifierGenerators.js.map