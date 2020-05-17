import { Modifier, ModifierObjects, ModifierConclusion, getFailedConclusion } from "../Classes/Other/Modifier";
import { Pattern } from "../Types/Pattern";
import { ObjectsNames } from "../Classes/GameObjects/ObjectsNames";
import { GameState } from "../Classes/GameObjects/GameState";
import { Pawn } from "../Classes/GameObjects/Pawn";
import { Player } from "../Classes/GameObjects/Player";
import { Vec2 } from "../Types/Vec2";
import { Card } from "../Classes/GameObjects/Card";

export enum ModEffNames {
  INTERNALREFCHANGE = "internal ref change",
  PAWNMOVEMENT = "pawn movement",
  APCHANGE = "ap change",
  BOARDOBSTRUCTIONCHANGE = "board obstruction change",
  CARDPTCHANGE = "card pt change",
  CARDPGCHANGE = "card pg change",
  CARDREVEAL = "card reveal",
  ENDTURN = "end turn",
  PAWNPLACEMENT = "pawn placement",
  PAWNKILL = "pawn kill"
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
      gameState.board.movePawnFromPatternAnyway(testPawn, owner, pattern);
      ret.fail.add(testPawn.pos);
    }
  }
  //console.log(ret);
  return ret;
}

export const getFromAttackRange = (range: number): Modifier => {
  return new Modifier({
    "owner": { className: ObjectsNames.PLAYER, count: 1 },
    "attackingPawn": { className: ObjectsNames.PAWN, count: 1, justification: "" },
    "attackedPawn": { className: ObjectsNames.PAWN, count: 1, justification: "" }
  },
    (gameState: GameState, objects: ModifierObjects): ModifierConclusion => {
      
      const player: Player = (objects["owner"][0] as Player);
      const attacker: Pawn = (objects["attackingPawn"][0] as Pawn);
      const killed: Pawn = (objects["attackedPawn"][0] as Pawn);
      if (!player.owns(attacker)) return getFailedConclusion("player does not own this pawn");
      const enemyPlayer = gameState.findOwner(killed);
      if (attacker.isExiled || !attacker.isAlive || !attacker.isActive || attacker.isPlacable) return getFailedConclusion("Bad pawn state");
      if (killed.isExiled || !killed.isAlive || !killed.isActive || killed.isPlacable) return getFailedConclusion("Bad pawn state");
      if (enemyPlayer === null) return getFailedConclusion("incoherent data");
      if (enemyPlayer.team === player.team) return getFailedConclusion("can't kill ally pawn");
      if (killed.distanceTo(attacker) > range) return getFailedConclusion("too far away");

      return killed.editSafe(gameState, player, (newGameState: GameState, newOwner: Player, newKilled: Pawn): ModifierConclusion => {
        //console.log(newGameState.board);
        //console.log(pos);
        newGameState.board = newGameState.board.copy();
        newGameState.board.obstructed.delete(newKilled.pos);
        newKilled.isAlive = false;
  
        const ccl: ModifierConclusion = { success: true, effects: [] };
        ccl.effects.push({ name: ModEffNames.PAWNKILL, old: killed, new: newKilled });
        ccl.effects.push({ name: ModEffNames.BOARDOBSTRUCTIONCHANGE, old: gameState.board, new: newGameState.board });
        return ccl;
      })
    }
  );
}

export const moveToModifier = new Modifier(
  {
    "owner": { className: ObjectsNames.PLAYER, count: 1 },
    "freeMovedPawn": { className: ObjectsNames.PAWN, count: 1, justification: "movedPawnJustification" },
    "placementFinalPos": { className: ObjectsNames.VEC, count: 1}
  },
  (gameState: GameState, objects: ModifierObjects): ModifierConclusion => {
    //console.log(objects);
    const player: Player = (objects["owner"][0] as Player);
    const pawn: Pawn = (objects["freeMovedPawn"][0] as Pawn);
    const pos: Vec2 = (objects["placementFinalPos"][0] as Vec2);

    for (var ca of Array.from(player.hand.values())) {
      if (!(ca instanceof Card)) continue;
      if (ca.type.data.name === "PlacePawn") {
        player.remove(ca.id);
      }
    }

    if (pawn.isExiled || !pawn.isAlive || !pawn.isActive || !pawn.isPlacable) return getFailedConclusion("Bad pawn state");

    if (!player.owns(pawn)) return getFailedConclusion("player does not own this pawn");
    
    return pawn.editSafe(gameState, player, (newGameState: GameState, newOwner: Player, newPawn: Pawn): ModifierConclusion => {
      const success = newGameState.board.movePawn(newPawn, newOwner, pos);
      //console.log(newGameState.board);
      //console.log(pos);
      if (!success) return getFailedConclusion("board.movePawn unsuccessful");
      
      newPawn.isPlacable = false;
      newGameState.board = newGameState.board.copy();
      newGameState.board.obstructed.delete(pawn.pos);
      newGameState.board.obstructed.add(newPawn.pos);

      const ccl: ModifierConclusion = { success: success, effects: [] };
      ccl.effects.push({ name: ModEffNames.PAWNPLACEMENT, old: pawn, new: newPawn });
      ccl.effects.push({ name: ModEffNames.BOARDOBSTRUCTIONCHANGE, old: gameState.board, new: newGameState.board });
      return ccl;
    })
  }
);

export function getFromPatterns(patterns: Pattern[]): Modifier {
  return new Modifier(
    {
      "owner": { className: ObjectsNames.PLAYER, count: 1 },
      "movedPawn": { className: ObjectsNames.PAWN, count: 1, justification: "movedPawnJustification" },
      "patternFinalPos": { className: ObjectsNames.VEC, count: 1}
    },
    (gameState: GameState, objects: ModifierObjects): ModifierConclusion => {
      //console.log(objects);
      const player: Player = (objects["owner"][0] as Player);
      const pawn: Pawn = (objects["movedPawn"][0] as Pawn);
      const pos: Vec2 = (objects["patternFinalPos"][0] as Vec2);
      const poses = getPosesFromPatterns(patterns, gameState, pawn, player);

      if (pawn.isExiled || !pawn.isAlive || !pawn.isActive || pawn.isPlacable) return getFailedConclusion("Bad pawn state");

      //console.log("POSES: " + JSON.stringify(poses));
      var isSuccessfulPose = false;
      var isFailingPose = false;
      for (var successPose of Array.from(poses.success.values())) {
        if (successPose.x === pos.x && successPose.y === pos.y) {
          isSuccessfulPose = true;
          break;
        }
      }
      //console.log(poses);
      for (var failedPose of Array.from(poses.fail.values())) {
        if (failedPose.x === pos.x && failedPose.y === pos.y) {
          console.log("FAILING");
          isFailingPose = true;
          break;
        }
      }
      if (isFailingPose) return getFailedConclusion("board.movePawn unsuccessful");
      if (!isSuccessfulPose) return getFailedConclusion("pos is failing");
      //console.log('NOT THIS ONE: ' + JSON.stringify(pos));

      if (!player.owns(pawn)) return getFailedConclusion("player does not own this pawn");
      
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