import { Modifier, ModifierObjects, ModifierConclusion, getFailedConclusion } from "../Classes/Other/Modifier";
import { Pattern } from "../Types/Pattern";
import { ObjectsNames } from "../Classes/GameObjects/ObjectsNames";
import { GameState } from "../Classes/GameObjects/GameState";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Player } from "../Classes/GameObjects/Player";

export enum ModEffNames {
  INTERNALREFCHANGE = "internal ref change",
  PAWNMOVEMENT = "pawn movement",
  APCHANGE = "ap change",
  BOARDOBSTRUCTIONCHANGE = "board obstruction change",
  CARDPTCHANGE = "card pt change",
  CARDPGCHANGE = "card pg change",
  CARDREVEAL = "card reveal"
}

export function getFromPattern(pattern: Pattern): Modifier {
  return new Modifier(
    {
      "owner": { className: ObjectsNames.PLAYER, count: 1 },
      "movedPawn": { className: ObjectsNames.PAWN, count: 1, justification:"movedPawnJustification"}
    },
    (gameState: GameState, objects: ModifierObjects): ModifierConclusion => {
      const player: Player = (objects["player"][0] as Player);
      const pawn: Pawn = (objects["movedPawn"][0] as Pawn);

      if (!player.owns(pawn)) return getFailedConclusion();
      if (!pawn.isPlayable()) return getFailedConclusion();

      return pawn.editSafe(gameState, player, (newGameState: GameState, newOwner: Player, newPawn: Pawn): ModifierConclusion => {
        const success = newGameState.board.movePawnFromPattern(newPawn, newOwner, pattern);
        if (!success) return getFailedConclusion();

        newGameState.board = newGameState.board.copy();
        newGameState.board.obstructed.delete(pawn.pos);
        newGameState.board.obstructed.add(newPawn.pos);

        const ccl: ModifierConclusion = { success: success, effects: [] };
        ccl.effects.push({ name: ModEffNames.PAWNMOVEMENT, old: pawn, new: newPawn });
        ccl.effects.push({ name: ModEffNames.BOARDOBSTRUCTIONCHANGE, old: gameState.board, new: newGameState.board });
        return ccl;
      })
    }
  )
}

export const Patterns: { [key: string]: Modifier } = {

}