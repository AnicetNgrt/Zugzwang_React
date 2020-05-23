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
import { GiUsable, GiPawn, GiSmashArrows, GiCardPlay, GiBouncingSword } from "react-icons/gi";
import { GoArrowUp, GoArrowSmallDown } from "react-icons/go";
import Spritesheet from 'react-responsive-spritesheet';
import { anims } from '../../../Assets/Assets';
import { mod, HalfBakedHlight } from "./game.component";
import { sounds } from "Client/Assets/sounds/sounds";

function placeAnim(comp: GameBodyComponent, oldPawn:Pawn, newPawn:Pawn) {
  tween({ from: comp.state.movingPawn.addHeight, to: 0, duration: 150, ease: easing.easeIn }).start(
    {
      update: (v: any) => {
        comp.setState({ movingPawn: { ...comp.state.movingPawn, addHeight: v } });
      },
      complete: () => {
        comp.setState({ movingPawn: { pawn: placeholderPawn, pos: { x: 0, y: 0 }, addHeight: 0 } });
        oldPawn.pos.x = newPawn.pos.x;
        oldPawn.pos.y = newPawn.pos.y;
        oldPawn.isPlacable = newPawn.isPlacable;
        comp.forceUpdate();
        comp.props.onEffectRealized();
      }
    }
  );
}
function reElevateAnim(comp:GameBodyComponent, oldPawn:Pawn, newPawn:Pawn) {
  tween({ from: comp.state.movingPawn.addHeight, to: 5, duration: 300 }).start(
    {
      update: (v: any) => {
        comp.setState({ movingPawn: { ...comp.state.movingPawn, addHeight: v } });
      },
      complete: () => {
        placeAnim(comp, oldPawn, newPawn);
      }
    }
  );
}
function moveAnim(comp:GameBodyComponent, oldPawn:Pawn, newPawn:Pawn, from:Vec2, to:Vec2) {
  const t = tween({ from: from, to: to, duration: 500 })
    .start({
      update: (v: any) => {
        comp.setState({ movingPawn: { pawn: oldPawn, pos: v, addHeight: comp.state.movingPawn.addHeight } });
        //this.forceUpdate();
      },
      complete: () => {
        reElevateAnim(comp, oldPawn, newPawn);
      }
    });
}
function startMoveAnimChain(comp: GameBodyComponent, ah:number, oldPawn:Pawn, newPawn:Pawn, from:Vec2, to:Vec2) {
  comp.setState({ movingPawn: { pawn: oldPawn, pos: from, addHeight: ah } });
  sounds.moveSound.play();
  tween({ from: ah, to: 3, duration: 300 }).start(
    {
      update: (v: any) => {
        comp.setState({ movingPawn: { ...comp.state.movingPawn, addHeight: v } });
      },
      complete: () => {
        moveAnim(comp, oldPawn, newPawn, from, to);
      }
    }
  );
}

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

type HightLight = {ref: React.RefObject<HTMLDivElement>, anim?:Anim, object: any, type: string, onClicked: (object: any, type: string) => void };
type Anim = {
  sprite: string,
  steps: number, onLoop: () => void,
  onEnterFrame: { frame: number, callback: () => void }[],
  completeLock?: boolean,
  sound?: any
};

type GameBodyProps = {
  loc: Locs,
  initialGameState: GameState,
  onCardClicked: (card: Card, owner: Player) => void,
  onModification: (modifier: ModifierConclusion) => ModifierEffect[],
  cardsRefs: Map<number, React.RefObject<HTMLDivElement>>,
  halfBakedHlights: HalfBakedHlight[],
  pendingEffect: ModifierEffect,
  onEffectRealized: () => void,
  onEndTurn: () => void
};

export default class GameBodyComponent extends React.Component {

  cgs: GameState;

  readonly state: {
    boardPos: Array<Array<Vec2>>;
    selectedPawn: { pawn: Pawn, addHeight: number } | undefined;
    movingPawn: MovingPawn;
    highlights: HightLight[]
  }

  readonly pboxes: { owner:Player, slotsRefs:React.RefObject<HTMLDivElement>[] }[];
  readonly boardRefs: Array<Array<React.RefObject<HTMLDivElement>>>;
  readonly pawnRefs: Map<number, React.RefObject<HTMLImageElement>>;

  constructor(readonly props: GameBodyProps) {
    super(props);

    const boardPos: Vec2[][] = [];
    this.boardRefs = [];
    this.pawnRefs = new Map<number, React.RefObject<HTMLImageElement>>();

    for (var i = 0; i <= props.initialGameState.board.maxCrd.y; i++) {
      this.boardRefs.push([]);
      boardPos.push([]);
      for (var j = 0; j <= props.initialGameState.board.maxCrd.x; j++) {
        const ref = React.createRef<HTMLDivElement>();
        this.boardRefs[i].push(ref);
        boardPos[i].push({ x: 0, y: 0 });
      }
    }

    for (var player of props.initialGameState.players) {
      for (var pawn of Array.from(player.pawns.values())) {
        if (!(pawn instanceof Pawn)) continue;
        this.pawnRefs.set(pawn.id, React.createRef<HTMLImageElement>());
      }
    }

    this.cgs = props.initialGameState;
    this.pboxes = [{
      owner: this.cgs.players[0],
      slotsRefs: [
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>()
      ]
    },
    {
      owner: this.cgs.players[1],
      slotsRefs: [
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>(),
        React.createRef<HTMLDivElement>()
      ]
    }];

    this.state = {
      boardPos: boardPos,
      selectedPawn: undefined,
      movingPawn: undefined,
      highlights: []
    }
  }

  hlFromHalfBaked(hbhls: { object: any, type: string, onClicked: (object: any, type: string) => void }[]): { ref: React.RefObject<HTMLDivElement>, object: any, type: string, onClicked: (object: any, type: string) => void }[] {
    const ret = [];
    for (var hbhl of hbhls) {
      var ref = undefined;
      if (hbhl.object instanceof Pawn) {
        ref = this.pawnRefs.get(hbhl.object.id);
        //console.log(JSON.stringify(ref.current.getBoundingClientRect()));
      } else if (hbhl.object instanceof Card) {
        ref = this.props.cardsRefs.get(hbhl.object.id);
      } else if (hbhl.object.x !== undefined && hbhl.object.y !== undefined) {
        ref = this.boardRefs[hbhl.object.y][hbhl.object.x];
      }
      if(ref) ret.push({ ref: ref, ...hbhl });
    }
    return ret;
  }

  componentDidMount() {
    const boardPos: Vec2[][] = [];
    for (var i = 0; i < this.boardRefs.length; i++) {
      boardPos.push([]);
      for (var j = 0; j < this.boardRefs[i].length; j++) {
        if (this.boardRefs === null) break;
        if (this.boardRefs[i][j].current) {
          const rect = this.boardRefs[i][j].current.getBoundingClientRect();
          boardPos[i].push({ y: rect.top, x: rect.left + rect.width/20});
        }
      } 
    }
    this.setState({ boardPos: boardPos }, () => {
      //console.log("adpdzapidhazd");
      this.setState({ highlights: this.hlFromHalfBaked(this.props.halfBakedHlights) });
    });
    
  }

  handlePawnMovement(effect: ModifierEffect) {
    const cgs = this.cgs;
    const oldPawn = cgs.findEquivalent(effect.old) as Pawn;
    const newPawn = effect.new as Pawn;

    const from = this.state.boardPos[oldPawn.pos.y][oldPawn.pos.x];
    const to = this.state.boardPos[newPawn.pos.y][newPawn.pos.x];
    const ah = 0;

    startMoveAnimChain(this, ah, oldPawn, newPawn, from, to);
  }

  handlePawnPlacement(effect: ModifierEffect) {
    const cgs = this.cgs;
    const oldPawn = cgs.findEquivalent(effect.old) as Pawn;
    const newPawn = effect.new as Pawn;
    const owner = cgs.findOwner(oldPawn);
    var pai = -1;
    var i = 0;
    for (var pa of Array.from(owner.pawns.values())) {
      if (!(pa instanceof Pawn)) continue;
      if (pa.id === oldPawn.id) {
        pai = i;
        break;
      }
      i++;
    }
    const pBoxSlot = this.pboxes[owner.team - 1].slotsRefs[pai].current;
    const rect = pBoxSlot.getBoundingClientRect();
    const from= { x: rect.left + rect.width / 9, y: rect.top + rect.height / 12 };
    const to = this.state.boardPos[newPawn.pos.y][newPawn.pos.x];
    const ah = 0;

    startMoveAnimChain(this, ah, oldPawn, newPawn, from, to);
  }

  handleApChange(effect: ModifierEffect) {
    const cgs = this.cgs;
    const pl = cgs.findEquivalent(effect.new) as Player;
    pl.ap = (effect.new as Player).ap;
    this.forceUpdate();
    this.props.onEffectRealized();
  }

  handleCardReveal(effect: ModifierEffect) {
    const cgs = this.cgs;
    const ca = cgs.findEquivalent(effect.new) as Card;
    ca.shown = (effect.new as Card).shown;
    this.forceUpdate();
    this.props.onEffectRealized();
  }

  handlePawnKill(effect: ModifierEffect) {
    const cgs = this.cgs;
    const pa = cgs.findEquivalent(effect.new) as Pawn;
    const hls = this.state.highlights;
    hls.push({
      type: "noStyle", ref: this.pawnRefs.get(pa.id), object: pa, onClicked: () => { },
      anim: {
        sprite: anims["stab_anim"],
        steps: 37,
        onLoop: () => {
          const newHls = this.state.highlights;
          this.setState({ highlights: newHls.filter(hl => hl.object.id !== pa.id) }, () => {});
          this.props.onEffectRealized();
        },
        onEnterFrame: [{
          frame: 25,
          callback: () => {
            pa.isAlive = (effect.new as Pawn).isAlive;
            cgs.board.obstructed.delete(pa.pos);
            this.forceUpdate();
          }
        }],
        sound: sounds.daggerSound
      }
    });
    this.setState({ highlights: hls.filter(hl => hl.type !== "attackedPawnok") }, () => {});
  }

  handleEffects(effects: ModifierEffect[]) {
    //console.log(effects);
    for (var effect of effects) {
      if (effect === undefined) {
        this.props.onEffectRealized();
        continue;
      }
      if (effect.name === ModEffNames.PAWNMOVEMENT) {
        this.handlePawnMovement(effect);
      } else if (effect.name === ModEffNames.PAWNPLACEMENT) {
        this.handlePawnPlacement(effect);
      } else if(effect.name === ModEffNames.APCHANGE) {
        this.handleApChange(effect);
      } else if (effect.name === ModEffNames.ENDTURN) {
        this.cgs = effect.new as GameState;
        this.props.onEffectRealized();
      } else if (effect.name === ModEffNames.CARDREVEAL) {
        this.handleCardReveal(effect);
      } else if (effect.name === ModEffNames.PAWNKILL) {
        this.handlePawnKill(effect);
      } else {
        this.props.onEffectRealized();
      }
    }
  }

  componentWillReceiveProps(newProps:any) {
    this.setState({ selectedPawn: undefined });
    //console.log("RROEHDOZHAZOUDHAZOUGDHAZ");
    //console.log(newProps.halfBakedHlights);
    //console.log(newProps);
    this.setState({ highlights: this.hlFromHalfBaked(newProps.halfBakedHlights) });
    if (newProps.pendingEffect !== this.props.pendingEffect) {
      //console.log(newProps.pendingEffect);
      this.handleEffects([newProps.pendingEffect]);
    }
  } 

  render() {
    //console.log(this.state.highlights);
    const boardPos = this.state.boardPos;
    const selectedPawn:{pawn:Pawn, addHeight:number} = this.state.selectedPawn ? this.state.selectedPawn : { pawn: placeholderPawn, addHeight:0};
    const movingPawn:MovingPawn = this.state.movingPawn ? this.state.movingPawn : { pawn: placeholderPawn, pos:{x:0, y:0}, addHeight:0};
    return (
      <div className="GameBodyDiv">
        {(this.cgs.players.map((p, pi, parr) => (
          Array.from(p.pawns.values()).map((pa, pai, pawrr) => {
            if (!(pa instanceof Pawn)) return (<div></div>);
            var pBoxSlotPos: Vec2 | undefined = undefined;
            if (pa.isPlacable) {
              const pBoxSlot = this.pboxes[pi].slotsRefs[pai].current;
              if (pBoxSlot) {
                const rect = pBoxSlot.getBoundingClientRect();
                //console.log(rect);
                pBoxSlotPos = { x: rect.left+rect.width/9, y: rect.top+rect.height/20 };
                //console.log(this.pboxes[pi]);
              }
            }

            return (
              <PawnComponent
              ref={this.pawnRefs.get(pa.id)}
              picture={pawns.basic}
              color={p.color}
              addHeight={(movingPawn.pawn === pa ? movingPawn.addHeight : (selectedPawn.pawn === pa ? selectedPawn.addHeight : 0))}
              top={(movingPawn.pawn === pa ? movingPawn.pos.y : (pBoxSlotPos ? pBoxSlotPos.y : boardPos[pa.pos.y][pa.pos.x].y))}
              left={(movingPawn.pawn === pa ? movingPawn.pos.x : (pBoxSlotPos ? pBoxSlotPos.x :  boardPos[pa.pos.y][pa.pos.x].x))}
              directed={true}
              moving={movingPawn.pawn === pa}
              selected={selectedPawn.pawn === pa}
              pawn={pa}
              onClick={() => {}}
            ></PawnComponent>
            )
          })
        )))}
        {(this.state.highlights.map(h => {
          //console.log("HERREEE");
          //console.log(h);
          if (h.ref.current === null) return <div></div>;
          const rect = h.ref.current.getBoundingClientRect();
          var style:any = {
            position: "absolute",
            top: rect.top + rect.height/2,
            left: rect.left + rect.width / 2,
            width: rect.width,
            height: rect.height,
            //backgroundColor: "red",
            zIndex: 1200,
          }

          //console.log(h.type);

          var className = "";
          if (h.type === "patternFinalPosok") {
            style.transform = "translate(-50%, -50%)";
            className = "HlDispTile Ok";
          }
          else if (h.type === "patternFinalPosblocked") {
            style.transform = "translate(-50%, -50%)";
            className = "HlDispTile Blocked";
          } else if (h.type === "movedPawn" || h.type === "attackingPawn") {
            style.transform = "translate(-50%, -50%)";
            className = "HlDispPawn";
          } else if (h.type === "freeMovedPawn") {
            style.transform = "translate(-50%, -50%)";
            className = "HlDispPawn";
          } else if (h.type === "placementFinalPosok") {
            className = "HlPlacementTile Ok";
            if (mod((h.object as Vec2).x, 2) !== mod((h.object as Vec2).y, 2)) {
              //console.log("HHHHHH");
              className += " Pair";
            }
          } else if (h.type === "placementFinalPosblocked") {
            style.transform = "translate(-50%, -50%)";
            className = "HlDispTile Blocked";
          } else if (h.type === "attackedPawnok") { 
            style.transform = "translate(-50%, -50%)";
            className = "HlKilledPawn Ok";
          }else if (h.type !== "noStyle") {
            style.transform = "translate(-50%, -50%)";
            style.border = "dashed 0.25vw yellow";
            style.borderRadius = "0.5vw";
            style.boxSizing = "content-box";
          } 

          return (
            <div
              className={"HightLight "+className}
              style={style}
              onClick={() => {
                if (!className.endsWith("Blocked")) {
                  sounds.selectPositive.play();
                }
                h.onClicked(h.object, h.type);
              }}
            >
              {((h.type === "patternFinalPosok") && <GiSmashArrows className="Icon"></GiSmashArrows>)}
              {((h.type === "movedPawn" || h.type === "freeMovedPawn" || h.type === "attackingPawn") && <GoArrowSmallDown className="Icon"></GoArrowSmallDown>)}
              {((h.type === "attackedPawnok") && <GiBouncingSword className="Icon"></GiBouncingSword>)}
              {h.anim &&
                <div className="HlAnimSprite">
                  <Spritesheet
                  image={h.anim.sprite}
                  widthFrame={50}
                  heightFrame={50}
                  steps={h.anim.steps}
                  fps={20}
                  style={{ imageRendering: 'pixelated' }}
                  loop={true}
                  onPlay={()=>{
                    if (h.anim.sound) {
                      h.anim.sound.play();
                    }
                  }}
                  onLoopComplete={(spritesheet: any) => {
                    if (!h.anim.completeLock) {
                      //console.log("onLoopComp")
                      h.anim.completeLock = true;
                      h.anim.onLoop();
                    }
                  }}
                  onEnterFrame={h.anim.onEnterFrame}
                  />
                </div>
              }
            </div>
          )
        }))}
        <PlayerComponent
          cardsRefs={this.props.cardsRefs}
          slotsRefs={this.pboxes[0].slotsRefs}
          showBox={(() => {
            for (var pa of Array.from(this.cgs.players[0].pawns.values())) {
              if (!(pa instanceof Pawn)) continue;
              if (pa.isPlacable) return true;
            }
            return false;
          })()}
          onPbDrag={(pos) => {
          }}
          loc={this.props.loc}
          player={this.cgs.players[0]}
          mirror={false}
          onEndTurn={() => {
            this.props.onEndTurn();
          }}
          onCardClicked={(card: Card) => this.props.onCardClicked(card, this.cgs.players[0])} />
        <BoardComponent
          refs={this.boardRefs}
          board={this.cgs.board}
          onTileClicked={(x: number, y: number) => {
          }}
        />
        <PlayerComponent
          cardsRefs={this.props.cardsRefs}
          slotsRefs={this.pboxes[1].slotsRefs}
          onPbDrag={(pos)=>{}}
          loc={this.props.loc}
          player={this.cgs.players[1]}
          mirror={true}
          onEndTurn={() => {
            this.props.onEndTurn();
          }}
          showBox={(() => {
            for (var pa of Array.from(this.cgs.players[1].pawns.values())) {
              if (!(pa instanceof Pawn)) continue;
              if (pa.isPlacable) return true;
            }
            return false;
          })()}
          onCardClicked={(card: Card) => this.props.onCardClicked(card, this.cgs.players[1])} />
      </div>
    );
  }
}