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
import { GameObject } from "Shared/Classes/GameObjects/GameObject";
import { GiUsable } from "react-icons/gi";

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

type MovingPawn = { pawn: Pawn | undefined, pos: Vec2, addHeight: number } | undefined;

type GameBodyProps = {
  loc: Locs,
  gameState: GameState,
  onCardClicked: (card: Card, owner: Player) => void,
  onModification: (modifier: ModifierConclusion) => ModifierEffect[],
  cardsRefs: Map<Card, React.RefObject<HTMLDivElement>>,
  halfBakedHlights: { object: any, type: string, onClicked: (object: any, type: string) => void }[]
};

export default class GameBodyComponent extends React.Component {

  readonly state: {
    pboxes: { pos: { top: number, left: number } }[];
    boardPos: Array<Array<Vec2>>;
    selectedPawn: { pawn: Pawn, addHeight: number } | undefined;
    movingPawn: MovingPawn;
    highlights: { ref: React.RefObject<HTMLDivElement>, object: any, type: string, onClicked: (object: any, type: string) => void }[]
  }

  readonly boardRefs: Array<Array<React.RefObject<HTMLDivElement>>>;
  readonly pawnRefs: Map<number, React.RefObject<HTMLDivElement>>;

  constructor(readonly props: GameBodyProps) {
    super(props);

    const boardPos: Vec2[][] = [];
    this.boardRefs = [];
    this.pawnRefs = new Map<number, React.RefObject<HTMLDivElement>>();

    for (var i = 0; i <= props.gameState.board.maxCrd.y; i++) {
      this.boardRefs.push([]);
      boardPos.push([]);
      for (var j = 0; j <= props.gameState.board.maxCrd.x; j++) {
        const ref = React.createRef<HTMLDivElement>();
        this.boardRefs[i].push(ref);
        boardPos[i].push({ x: 0, y: 0 });
      }
    }

    for (var player of props.gameState.players) {
      for (var pawn of Array.from(player.pawns.values())) {
        this.pawnRefs.set(pawn.id, React.createRef<HTMLDivElement>());
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
      movingPawn: undefined,
      highlights: this.hlFromHalfBaked(props.halfBakedHlights)
    }
  }

  hlFromHalfBaked(hbhls: { object: any, type: string, onClicked: (object: any, type: string) => void }[]): { ref: React.RefObject<HTMLDivElement>, object: any, type: string, onClicked: (object: any, type: string) => void }[] {
    const ret = [];
    for (var hbhl of hbhls) {
      var ref = undefined;
      if (hbhl.object instanceof Pawn) {
        ref = this.pawnRefs.get(hbhl.object.id);
      } else if (hbhl.object instanceof Card) {
        ref = this.props.cardsRefs.get(hbhl.object);
      } else if (hbhl.object.x && hbhl.object.y) {
        ref = this.boardRefs[hbhl.object.y][hbhl.object.x];
      }
      if(ref) ret.push({ ref: ref, ...hbhl });
    }
    return ret;
  }

  UNSAFE_componentWillReceiveProps(newProps: GameBodyProps) {
    this.setState({ highlights: this.hlFromHalfBaked(newProps.halfBakedHlights) });
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

  moveAnim(effect: ModifierEffect) {
    const oldPawn = effect.old as Pawn;
    const newPawn = effect.new as Pawn;
    const from = this.state.boardPos[oldPawn.pos.y][oldPawn.pos.x];
    const to = this.state.boardPos[newPawn.pos.y][newPawn.pos.x];
    const ah = this.state.selectedPawn.addHeight;
    const t = tween({ from: from, to: to, duration: 500})
      .start({
        update: (v: any) => {
          this.setState({ movingPawn: {pawn: newPawn, pos:v, addHeight: ah} });
          //this.forceUpdate();
        },
        complete: () => {
          tween({ from: this.state.movingPawn.addHeight, to: 5, duration: 300 }).start(
            {
              update: (v: any) => {
                this.setState({ movingPawn: { ...this.state.movingPawn, addHeight: v } });
              },
              complete: () => {
                tween({ from: this.state.movingPawn.addHeight, to: 0, duration: 150, ease: easing.easeIn }).start(
                  {
                    update: (v: any) => {
                      this.setState({ movingPawn: { ...this.state.movingPawn, addHeight: v } });
                    },
                    complete: () => {
                      this.setState({ movingPawn: { pawn: placeholderPawn, pos: { x: 0, y: 0 }, addHeight: 0 } });
                    }
                  }
                );
              }
            }
          );
        }
      });
  }

  handleEffects(effects: ModifierEffect[]) {
    for (var effect of effects) {
      switch (effect.name) {
        case ModEffNames.PAWNMOVEMENT:
          this.moveAnim(effect);
          break;
      }
    }
  }

  componentWillReceiveProps(newProps:any) {
    this.setState({ selectedPawn: undefined });
  } 

  render() {
    const boardPos = this.state.boardPos;
    const selectedPawn:{pawn:Pawn, addHeight:number} = this.state.selectedPawn ? this.state.selectedPawn : { pawn: placeholderPawn, addHeight:0};
    const movingPawn:MovingPawn = this.state.movingPawn ? this.state.movingPawn : { pawn: placeholderPawn, pos:{x:0, y:0}, addHeight:0};
    return (
      <div className="GameBodyDiv">
        {(this.props.gameState.players.map((p, pi, parr) => (
          Array.from(p.pawns.values()).map((pa, pai, pawrr) => (
            <PawnComponent
              ref={this.pawnRefs.get(pa.id)}
              picture={pawns.basic}
              color={p.color}
              addHeight={(movingPawn.pawn === pa ? movingPawn.addHeight : (selectedPawn.pawn === pa ? selectedPawn.addHeight : 0))}
              top={(movingPawn.pawn === pa ? movingPawn.pos.y : boardPos[pa.pos.y][pa.pos.x].y)}
              left={(movingPawn.pawn === pa ? movingPawn.pos.x : boardPos[pa.pos.y][pa.pos.x].x)}
              directed={true}
              selected={selectedPawn.pawn === pa || movingPawn.pawn === pa}
              pawn={pa}
              onClick={() => {
                if (pa === selectedPawn.pawn) {
                  tween({ from: 2, to: 0, duration: 400 }).start({
                    update: (v: any) => { this.setState({ selectedPawn: { pawn: pa, addHeight: v } }) },
                    complete: () => { this.setState({ selectedPawn: undefined }); }
                  });
                }
                else {
                  tween({ from: 0, to: 2, duration: 400 }).start({
                    update: (v: any) => { this.setState({ selectedPawn: { pawn: pa, addHeight: v } }) }
                  });
                }
              }}
            ></PawnComponent>
          ))
        )))}
        {(this.state.highlights.map(h => {
          const rect = h.ref.current.getBoundingClientRect();

          var style:any = {
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: rect.top + rect.height/2,
            left: rect.left + rect.width / 2,
            width: rect.width,
            height: rect.height,
            border: "dashed 0.25vw yellow",
            borderRadius: "0.5vw",
            boxSizing: "content-box",
            //backgroundColor: "red",
            zIndex: 1200,
          }

          return (
            <div
              className="HightLight"
              style={style}
              onClick={()=>h.onClicked(h.object, h.type)}
            >
              
            </div>
          )
        }))}
        <PlayerComponent
          cardsRefs={this.props.cardsRefs}
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
            if (!this.state.selectedPawn) {
              /*const highlights = this.state.highlights;
              highlights.push({
                ref: this.boardRefs[y][x],
                object: { x: x, y: y },
                type: "tile selection",
                onClicked: (object, type) => {
                  const hs = this.state.highlights;
                  var i = 0;
                  for (var h of hs) {
                    if (h.object === object) hs.splice(i, 1);
                    i++;
                  }
                  this.setState({ highlights: hs });
                }
              });
              this.setState({ highlights: highlights });*/
              return
            }
            var player;
            for (var pl of this.props.gameState.players) {
              if (pl.pawns.has(this.state.selectedPawn.pawn)) {
                player = pl; 
              }
            }
            if (pl !== undefined) {
              const pawn = this.state.selectedPawn.pawn;
              const ccl = moveUnsafe(pawn, player, this.props.gameState, { x: x, y: y });
              console.log(ccl);
              if (ccl.success) {
                this.setState({ selectedPawn: pawn });
              }
              this.handleEffects(this.props.onModification(ccl));
            }
          }}
        />
        <PlayerComponent
          cardsRefs={this.props.cardsRefs}
          onPbDrag={(pos)=>{}}
          loc={this.props.loc}
          player={this.props.gameState.players[1]}
          mirror={true}
          onCardClicked={(card: Card) => this.props.onCardClicked(card, this.props.gameState.players[1])} />
      </div>
    );
  }
}