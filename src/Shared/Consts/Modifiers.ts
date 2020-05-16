import { Modifier, ModifierObjects, ModifierConclusion, getFailedConclusion } from "../Classes/Other/Modifier";
import { Pattern } from "../Types/Pattern";
import { ObjectsNames } from "../Classes/GameObjects/ObjectsNames";
import { GameState } from "../Classes/GameObjects/GameState";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Player } from "../Classes/GameObjects/Player";
import { Vec2 } from "../Types/Vec2";

export enum ModEffNames {
  INTERNALREFCHANGE = "internal ref change",
  PAWNMOVEMENT = "pawn movement",
  APCHANGE = "ap change",
  BOARDOBSTRUCTIONCHANGE = "board obstruction change",
  CARDPTCHANGE = "card pt change",
  CARDPGCHANGE = "card pg change",
  CARDREVEAL = "card reveal"
}

export function getPosesFromPatterns(patterns: Pattern[], gameState: GameState, pawn: Pawn, owner:Player): {success:Set<Vec2>, fail:Set<Vec2>} {
  //console.log(patterns);
  const ret = { success: new Set<Vec2>(), fail: new Set<Vec2>() };
  for (var pattern of patterns) {
    const testPawn = pawn.copy();
    const success = gameState.board.movePawnFromPattern(testPawn, owner, pattern);
    if (success) {
      //console.log(success);
      ret.success.add(testPawn.pos);
      //console.log(testPawn.pos);
    } else {
      //ret.fail.add(testPawn.pos);
    }
  }
  //console.log(ret);
  return ret;
}

export function getFromPatterns(patterns: Pattern[]): Modifier {
  return new Modifier(
    {
      "owner": { className: ObjectsNames.PLAYER, count: 1 },
      "movedPawn": { className: ObjectsNames.PAWN, count: 1, justification: "movedPawnJustification" },
      "pos": { className: ObjectsNames.VEC, count: 1}
    },
    (gameState: GameState, objects: ModifierObjects): ModifierConclusion => {
      //console.log(objects);
      const player: Player = (objects["owner"][0] as Player);
      const pawn: Pawn = (objects["movedPawn"][0] as Pawn);
      const pos: Vec2 = (objects["pos"][0] as Vec2);
      const poses = getPosesFromPatterns(patterns, gameState, pawn, player);
      //console.log("POSES: " + JSON.stringify(poses));
      var isSuccessfulPose = false;
      for (var successPose of Array.from(poses.success.values())) {
        if (successPose.x === pos.x && successPose.y === pos.y) {
          isSuccessfulPose = true;
          break;
        }
      }
      if (!isSuccessfulPose) return getFailedConclusion("pos is failing");
      //console.log('NOT THIS ONE: ' + JSON.stringify(pos));

      if (!player.owns(pawn)) return getFailedConclusion("player does not own this pawn");
      if (!pawn.isPlayable()) return getFailedConclusion("pawn is not playable");
      
      return pawn.editSafe(gameState, player, (newGameState: GameState, newOwner: Player, newPawn: Pawn): ModifierConclusion => {
        const success = newGameState.board.movePawn(newPawn, newOwner, pos);
        //console.log(newGameState.board);
        //console.log(pos);
        if (!success) return getFailedConclusion("board.movePawn unsuccessful");
        
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