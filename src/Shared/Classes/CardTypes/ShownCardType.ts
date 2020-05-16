import { CardType, CardTypeData } from "../../Interfaces/CardType";
import { Player } from "../GameObjects/Player";
import { GameState } from "../GameObjects/GameState";
import { Action } from "../Other/Action";
import { Hidable } from "../../Interfaces/Hidable";
import { ModifierObjects, ModifierConclusion, getFailedConclusion } from "../Other/Modifier";

export class ShownCardType implements CardType, Hidable {
    readonly shown: boolean = true;

    constructor(
        readonly data:CardTypeData
    ) { }
    
    play(gameState: GameState, actionIndex: number, player: Player, objects: ModifierObjects): ModifierConclusion {
        if (this.data.actions.length <= actionIndex || actionIndex < 0) return getFailedConclusion("action index is incorrect");
        const action: Action = this.data.actions[actionIndex];

        const ccl = action.play(gameState, player, objects);
        if (ccl.success) {
            //console.log(gameState.players[0].pawns.values());
            //console.log({...ccl});
        }
        return ccl;
    }
}