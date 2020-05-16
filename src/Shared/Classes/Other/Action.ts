import { GameState } from "../GameObjects/GameState";
import { Player } from "../GameObjects/Player";
import { Modifier, ModifierConclusion, ModifierObjects, getFailedConclusion } from "./Modifier";
import { ModEffNames } from "../../Consts/Modifiers";

export class Action {
    constructor(
        readonly cost: number,
        readonly name: string,
        readonly description: string,
        readonly modifier: Modifier
    ) { }

    play(gameState: GameState, player: Player, objects: ModifierObjects): ModifierConclusion {
        if (player.ap < this.cost) return getFailedConclusion("can't afford this action");
        
        const ccl: ModifierConclusion = this.modifier.execute(gameState, objects);
        if (!ccl.success) return getFailedConclusion(ccl.reason ? ccl.reason : "unknown");
        
        var newGs: GameState;
        var newPlayer: Player;

        for (var effect of ccl.effects) {
            if (effect.new.id === player.id) {
                //console.log(player);
                //console.log(effect.new);
                (effect.new as Player).ap -= this.cost;
                if ((effect.new as Player).ap < 0) return getFailedConclusion("AFTERHAND: can't afford this action");
                
                ccl.effects.push({ name: ModEffNames.APCHANGE, old: effect.old, new: effect.new });
                return ccl;
            }
        }

        newPlayer = player.copy();
        newPlayer.ap -= this.cost;
        if (newPlayer.ap < 0) return getFailedConclusion("AFTERHAND: can't afford this action");

        for (effect of ccl.effects) {
            if (effect.new.id === gameState.id) {
                (effect.new as GameState).replacePlayerWith(newPlayer);
                ccl.effects.push({ name: ModEffNames.APCHANGE, old: player, new: newPlayer });
                ccl.effects.push({ name: ModEffNames.INTERNALREFCHANGE, old: effect.old, new: effect.new });
                return ccl;
            }
        }

        newGs = gameState.copy();
        newGs.replacePlayerWith(newPlayer);
        ccl.effects.push({ name: ModEffNames.APCHANGE, old: player, new: newPlayer });
        ccl.effects.push({ name: ModEffNames.INTERNALREFCHANGE, old: gameState, new: newGs });
        return ccl;
    }


}