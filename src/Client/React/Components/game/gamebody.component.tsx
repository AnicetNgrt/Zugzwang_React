import "./gamebody.component.style.scss";
import React from "react";
import BoardComponent from "./board.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import PlayerComponent from "./player.component";
import { GameState } from "Shared/Classes/GameObjects/GameState";
import { Player } from "Shared/Classes/GameObjects/Player";
import PawnComponent from "./pawn.component";
import { Pawn } from "Shared/Classes/GameObjects/Pawn";
import { pawns } from "Client/Assets/Assets";
import { Vec2 } from "Shared/Types/Vec2";
import { ModifierConclusion, ModifierEffect } from "Shared/Classes/Other/Modifier";
import { ModEffNames } from "Shared/Consts/Modifiers";
import { RandomIdProvider } from "Shared/Classes/IdProviders/RandomIdProvider";
import { tween, easing } from 'popmotion';

const placeholderPawn = new Pawn(new RandomIdProvider(4), { x: 0, y: 0 });

function moveUnsafe(pawn: Pawn, owner: Player, gameState: GameState, pos: Vec2): ModifierConclusion {
  const newPawn = pawn.copy();
  const success = gameState.board.movePawn(newPawn, owner, pos);
  if (success) {
    gameState.board.obstructed.delete(pawn.pos);
    gameState.board.obstructed.add(newPawn.pos);
  }
  owner.pawns.delete(pawn);
  owner.pawns.add(newPawn);
  const ccl: ModifierConclusion = {
    success: success,
    effects: [{
      name: ModEffNames.PAWNMOVEMENT,
      old: pawn,
      new: newPawn
    },{
      name: ModEffNames.INTERNALREFCHANGE,
      old: gameState,
      new: gameState
    }]
  }
  return ccl;
}

export default class GameBodyComponent extends React.Component {

  readonly state: {
    pboxes: { pos: { top: number, left: number } }[];
    boardPos: Array<Array<Vec2>>;
    selectedPawn: Pawn | undefined;
    movingPawn: {pawn:Pawn | undefined, pos:Vec2} | undefined;
  }

  readonly boardRefs: Array<Array<React.RefObject<HTMLDivElement>>>;;

  constructor(readonly props: {
    loc: Locs,
    gameState: GameState,
    onCardClicked: (card: Card, owner: Player) => void,
    onModification: (modifier:ModifierConclusion) => ModifierEffect[]
  }) {
    super(props);

    const boardPos: Vec2[][] = [];
    this.boardRefs = [];

    for (var i = 0; i <= props.gameState.board.maxCrd.y; i++) {
      this.boardRefs.push([]);
      boardPos.push([]);
      for (var j = 0; j <= props.gameState.board.maxCrd.x; j++) {
        const ref = React.createRef<HTMLDivElement>();
        this.boardRefs[i].push(ref);
        boardPos[i].push({ x: 0, y: 0 });
      }
    }

    this.state  = {
      pboxes: [{
        pos:{top: 0, left: 0}
      },
        {
        pos:{top: 0, left: 0}
        }],
      boardPos: boardPos,
      selectedPawn: undefined,
      movingPawn: undefined
    }

  }

  componentDidMount() {
    const boardPos: Vec2[][] = [];
    for (var i = 0; i < this.boardRefs.length; i++) {
      boardPos.push([]);
      for (var j = 0; j < this.boardRefs[i].length; j++) {
        if (this.boardRefs === null) break;
        if (this.boardRefs[i][j].current) {
          const rect = this.boardRefs[i][j].current.getBoundingClientRect();
          boardPos[i].push({ y: rect.top, x: rect.left });
        }
      } 
    }
    this.setState({ boardPos: boardPos });
  }

  handleEffects(effects: ModifierEffect[]) {
    for (var effect of effects) {
      switch (effect.name) {
        case ModEffNames.PAWNMOVEMENT:
          const oldPawn = effect.old as Pawn;
          const newPawn = effect.new as Pawn;
          const from = this.state.boardPos[oldPawn.pos.y][oldPawn.pos.x];
          const to = this.state.boardPos[newPawn.pos.y][newPawn.pos.x];
          const t = tween({ from: from, to: to, duration: 500})
            .start({
              update: (v: any) => {
                console.log(v);
                this.setState({ movingPawn: {pawn: newPawn, pos:v} });
                //this.forceUpdate();
              },
              complete: () => {
                this.setState({ movingPawn: { pawn: placeholderPawn, pos: { x: 0, y: 0 } } });
              }
            });
          break;
      }
    }
  }

  componentWillReceiveProps(newProps:any) {
    this.setState({ selectedPawn: undefined });
  } 

  render() {
    const boardPos = this.state.boardPos;
    const movingPawn = this.state.movingPawn ? this.state.movingPawn : { pawn: placeholderPawn, pos:{x:0, y:0}};
    return (
      <div className="GameBodyDiv">
        {(this.props.gameState.players.map(p => (
          Array.from(p.pawns.values()).map(pa => (
            <PawnComponent
              picture={pawns.basic}
              color={p.color}
              top={(movingPawn.pawn === pa ? movingPawn.pos.y : boardPos[pa.pos.y][pa.pos.x].y)}
              left={(movingPawn.pawn === pa ? movingPawn.pos.x : boardPos[pa.pos.y][pa.pos.x].x)}
              directed={true}
              selected={this.state.selectedPawn === pa || movingPawn.pawn === pa}
              pawn={pa}
              onClick={() => {
                if (pa === this.state.selectedPawn) this.setState({ selectedPawn: undefined });
                else this.setState({ selectedPawn: pa });
              }}
            ></PawnComponent>
          ))
        )))}
        <PlayerComponent
          onPbDrag={(pos) => {}}
          loc={this.props.loc}
          player={this.props.gameState.players[0]}
          mirror={false}
          onCardClicked={(card: Card) => this.props.onCardClicked(card, this.props.gameState.players[0])} />
        <BoardComponent
          refs={this.boardRefs}
          board={this.props.gameState.board}
          onTileClicked={(x: number, y: number) => {
            console.log(x + "|" + y);
            if (!this.state.selectedPawn) return;
            var player;
            for (var pl of this.props.gameState.players) {
              if (pl.pawns.has(this.state.selectedPawn)) {
                player = pl; 
              }
            }
            if (pl !== undefined) {
              const pawn = this.state.selectedPawn;
              const ccl = moveUnsafe(pawn, player, this.props.gameState, { x: x, y: y });
              console.log(ccl);
              if (ccl.success) this.setState({ selectedPawn: pawn });
              this.handleEffects(this.props.onModification(ccl));
            }
          }}
        />
        <PlayerComponent
          onPbDrag={(pos)=>{}}
          loc={this.props.loc}
          player={this.props.gameState.players[1]}
          mirror={true}
          onCardClicked={(card: Card) => this.props.onCardClicked(card, this.props.gameState.players[1])} />
      </div>
    );
  }
}