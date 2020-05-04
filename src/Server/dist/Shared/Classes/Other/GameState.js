"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameState = /** @class */ (function () {
    function GameState(players) {
        this.players = players;
    }
    GameState.prototype.getFoes = function (player) {
        return this.players.filter(function (p, i, a) {
            return p.team != player.team;
        });
    };
    GameState.prototype.getAllies = function (player) {
        return this.players.filter(function (p, i, a) {
            return p.team == player.team;
        });
    };
    GameState.prototype.getEnemyPawns = function (player) {
        var foes = this.getFoes(player);
        var pawns = [];
        for (var _i = 0, foes_1 = foes; _i < foes_1.length; _i++) {
            var foe = foes_1[_i];
            for (var _a = 0, _b = foe.pawns; _a < _b.length; _a++) {
                var pawn = _b[_a];
                pawns.push(pawn);
            }
        }
        return pawns;
    };
    return GameState;
}());
exports.GameState = GameState;
//# sourceMappingURL=GameState.js.map