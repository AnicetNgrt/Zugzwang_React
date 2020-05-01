import { Player } from "../GameObjects/Player";
import { Pawn } from "../GameObjects/Pawn";

export class GameState {
    constructor(readonly players: [Player]) {}

    getFoes(player:Player):Player[] {
        return this.players.filter((p, i, a) => {
            return p.team != player.team;
        });
    }

    getAllies(player:Player):Player[] {
        return this.players.filter((p, i, a) => {
            return p.team == player.team;
        });
    }

    getEnemyPawns(player:Player):Pawn[] {
        const foes = this.getFoes(player);
        const pawns = [];
        for(const foe of foes) {
            for(const pawn of foe.pawns) {
                pawns.push(pawn);
            }
        }
        return pawns;
    }
}