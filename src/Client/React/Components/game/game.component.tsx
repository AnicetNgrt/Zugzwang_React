import "./game.component.style.scss";
import React from "react";
import GameBodyComponent from "./gamebody.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import CardDetailComponent from "./carddetail.component";
import BsComponent from "./bs.component";
import { Board } from "Shared/Classes/GameObjects/Board";
import { RandomIdProvider } from "Shared/Classes/IdProviders/RandomIdProvider";
import { backgroundsImgs } from "../../../Assets/Assets";
import { GameState } from "Shared/Classes/GameObjects/GameState";
import { DisplacementCardTypes } from "Shared/Consts/DisplacementCardTypes";
import { Player } from "Shared/Classes/GameObjects/Player";
import { Status } from "../lobby/lobby.component";
import { colors } from "../lobby/lobby.component"; 
import { Pawn } from "Shared/Classes/GameObjects/Pawn";
import { ModifierEffect, ModifierInput, ModifierObjects, ModifierConclusion } from "Shared/Classes/Other/Modifier";
import { Action } from "Shared/Classes/Other/Action";
import { ObjectsNames } from "Shared/Classes/GameObjects/ObjectsNames";
import { GameObject } from "Shared/Classes/GameObjects/GameObject";
import Pset from "Shared/Classes/Other/Pset";
import { ModEffNames, moveToModifier } from "Shared/Consts/Modifiers";
import { Orientation } from "Shared/Enums/Orientation";
import { FlickeringCardType } from "Shared/Classes/CardTypes/FlickeringCardType";
import { FlickeringCardTypes } from "Shared/Consts/FlickeringCardTypes";
import { ShownCardType } from "Shared/Classes/CardTypes/ShownCardType";
import { ShownCardTypes } from "Shared/Consts/ShownCardTypes";

export function randInt(min:number, max:number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function mod(n:number, m:number):number {
  return ((n % m) + m) % m;
}

const idpr = new RandomIdProvider(3);

const availableCards: Card[][] = [[
  new Card(DisplacementCardTypes.knight(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 999, idpr, true),
  new Card(ShownCardTypes.sneakydaggers(), 0, 999, idpr, true)
],
[
  new Card(DisplacementCardTypes.apollo(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 999, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 999, idpr, true),
  new Card(ShownCardTypes.sneakydaggers(), 0, 999, idpr, true)
]];

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4
}

var ciAnicet = randInt(0, colors.length - 1);
var ciThibo = (ciAnicet + randInt(1, colors.length - 2))%colors.length;

var anicet: Player = new Player((cards: Pset)=>true, "Anicet", colors[ciAnicet], 1, rules, idpr, 0, true);
var thibo: Player = new Player((cards: Pset)=>true, "Thibo", colors[ciThibo], 2, rules, idpr, 0, false);
var players: Player[] = [anicet, thibo];
var board: Board = Board.getFromSize(rules.boardSize, idpr);

availableCards[0][1].rotate(Orientation.EAST);
anicet.addCard(availableCards[0][0]);
anicet.addCard(availableCards[0][1]);
anicet.addCard(availableCards[0][4]);

anicet.givePawn(new Pawn(idpr, { x: 1, y: 1 }));
//anicet.givePawn(new Pawn(idpr, { x: 1, y: 1 }));
//anicet.givePawn(new Pawn(idpr, { x: 1, y: 1 }));

availableCards[1][0].rotate(Orientation.WEST);
thibo.addCard(availableCards[1][0]);
thibo.addCard(availableCards[1][1]);
thibo.addCard(availableCards[1][3]);
thibo.addCard(availableCards[1][4]);
thibo.givePawn(new Pawn(idpr, { x: 1, y: 1 }));
//thibo.givePawn(new Pawn(idpr, { x: 1, y: 1 }));
//thibo.givePawn(new Pawn(idpr, { x: 1, y: 1 }));

var cgs = new GameState(players, idpr, board, rules, 0);

export interface GameProps {
}


export class Game {
  states: GameState[];
  constructor(initial: GameState) {
    this.states = [initial];
  }
}

type HalfBakedHlight = { object: any, type: string, onClicked: (object: any, type: string) => void };
type ModInputsRequests = {
  todo: { name: string, mi: ModifierInput }[],
  done: { name: string, mi: ModifierInput }[],
  onFullFilled: (objects: ModifierObjects) => void,
  test: (objects: ModifierObjects)=>string
};

export type GameComponentState = {
  selectedCards: Card[],
  status: Status,
  game: Game,
  hbhls: HalfBakedHlight[],
  modInputsRequests: ModInputsRequests,
  modInputs: ModifierObjects,
  stackedEffects: ModifierEffect[],
  playedCard: Card | null,
  playableActions: Map<Action, string>
}

export default class GameComponent extends React.Component {

  readonly state: GameComponentState;
  cardsRefs: Map<number, React.RefObject<HTMLDivElement>>;
  //readonly cardsRefs: Map<Card, React.RefObject<HTMLDivElement>>;

  constructor(readonly props: {
    loc:Locs
  }) {
    super(props);
    this.state = {
      selectedCards: [],
      status: Status.LOCAL,
      game: new Game(cgs),
      hbhls: [],
      modInputsRequests: {todo:[], done:[], onFullFilled:()=>{}, test:()=>"fail"},
      modInputs: {},
      stackedEffects: [],
      playedCard: null,
      playableActions: new Map<Action, string>()
    }

    this.cardsRefs = new Map<number, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        if (!(card instanceof Card)) continue;
        this.cardsRefs.set(card.id, React.createRef<HTMLDivElement>());
      }
    }
  }

  componentDidMount() {
    this.onNewTick();
  }
  
  componentDidUpdate() {
    this.cardsRefs = new Map<number, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        if (!(card instanceof Card)) continue;
        this.cardsRefs.set(card.id, React.createRef<HTMLDivElement>());
      }
    }
  }

  cgs(): GameState {
    return this.state.game.states[this.state.game.states.length - 1];
  }

  fullFillMi(object: any) {
    const modInputsRequests = this.state.modInputsRequests;
    const modInputs = this.state.modInputs;
    if (modInputs[modInputsRequests.todo[0].name]) {
      modInputs[modInputsRequests.todo[0].name].push(object);
    } else {
      modInputs[modInputsRequests.todo[0].name] = [object];
    }
    
    if (modInputs[modInputsRequests.todo[0].name].length === modInputsRequests.todo[0].mi.count) {
      modInputsRequests.done.push(modInputsRequests.todo[0]);
      modInputsRequests.todo.splice(0, 1);
      this.setHbhls(modInputs, modInputsRequests);
    }

    //console.log(modInputsRequests.todo);

    if (modInputsRequests.todo.length === 0) {
      
      modInputsRequests.onFullFilled(modInputs);
      this.setState({ hbhls: [] });
      this.setState({ playedCard: null }, () => {
        //this.forceUpdate();
      });
    }
    this.setState({ modInputsRequests: modInputsRequests, modInputs: modInputs });
  }

  onActionSelected(action: Action, card: Card, player: Player) {
    if (!player.playing) return alert("tu ne joues pas");
    if (this.state.modInputsRequests.todo.length !== 0 && this.state.playedCard.type.data.name !== "PlacePawn") {
      this.setState({ modInputsRequests: {todo:[], onFullFilled:this.state.modInputs.onFullFilled}, modInputs: {} });
      this.setState({ hbhls: [] });
      return;
    }
    const mod = action.modifier;
    const todo = [];
    var addOwner = false;
    var ownerMi = undefined;
    for (let key in mod.inputs) {
      if (key === "owner") {
        addOwner = true;
        ownerMi = mod.inputs[key];
        continue;
      }
      todo.push({name:key, mi:mod.inputs[key]});
    }

    const modInputsRequests:ModInputsRequests = {
      todo: todo,
      done: ownerMi !== undefined ? [{name:"owner", mi:ownerMi}] : [],
      onFullFilled: (objects: ModifierObjects) => {
        const effects = this.handleCcl(card.play(
          this.cgs(),
          card.type.data.actions.indexOf(action),
          player,
          objects
        ));
        this.setState({ stackedEffects: this.state.stackedEffects.concat(effects) });
      },
      test: (objects: ModifierObjects): string => {
        //console.log(objects);
        const ccl = card.play(
          this.cgs(),
          card.type.data.actions.indexOf(action),
          player,
          objects
        );
        var comment = "fail";
        if (ccl.success) comment = "ok";
        else if (ccl.reason === "board.movePawn unsuccessful") comment = "blocked";
        return comment;
      }
    }

    this.setState({
      modInputsRequests: modInputsRequests,
      modInputs: addOwner ? {"owner": [player] } : {}
    });
    //console.log(modInputsRequests);
    //console.log(addOwner ? { "owner": [player] } : {});
    this.setHbhls(addOwner ? { "owner": [player] } : {}, modInputsRequests);
    this.setState({ playedCard: card });
  }

  setPlayableActions(card: Card, owner: Player) {
    const playableActions = this.state.playableActions;
    if (card.playedTurn >= card.type.data.maxTurn) {
      for (var a of card.type.data.actions) {
        playableActions.set(a, "no-turn");
      }
      this.setState({ playableActions: playableActions });
      return;
    }
    if (card.playedGame >= card.type.data.maxGame) {
      for (var a of card.type.data.actions) {
        playableActions.set(a, "no-game");
      }
      this.setState({ playableActions: playableActions });
      return;
    }
    for (var a of card.type.data.actions) {
      if (owner.ap >= a.cost) playableActions.set(a, "playable");
      else playableActions.set(a, "expensive");
    }
    this.setState({ playableActions: playableActions });
  }

  handleEffects(modEffects: ModifierEffect[], gameState:GameState):ModifierEffect | null {
    for (var e of modEffects) {
      if (e.name === ModEffNames.CARDPGCHANGE || e.name === ModEffNames.CARDPTCHANGE || e.name === ModEffNames.APCHANGE) {
        for (var card of this.state.selectedCards) {
          if (card === undefined) {
            console.log(this.state.selectedCards);
            continue;
          }
          var updated: Card | null = null;
          var retry = 0;
          while (updated === null && retry<20) {
            updated = gameState.findEquivalent(card) as Card;
            retry++;
            console.log("PROCESSING"+retry);
          }
          if (retry >= 20) {
            console.log(card);
            return e;
          }
          /*console.log("UPDATED");
          console.log(updated);
          console.log("NEWGS");
          console.log(gameState);
          console.log("OLD");
          console.log(card);
          console.log("EFFECT");
          console.log(e);*/
          this.setPlayableActions(updated, gameState.findOwner(updated));
        }
      }
    }
    return null;
  }

  setHbhls(modInputs: ModifierObjects, modInputsRequests: ModInputsRequests) {
    //console.log(modInputsRequests);
    if (modInputsRequests.todo.length === 0) {
      //console.log("ALT");
      //console.log(modInputsRequests);
      return;
    }
    const gs = this.cgs();
    const current = modInputsRequests.todo[0];
    const hbhls: HalfBakedHlight[] = [];

    if (current.name === "movedPawn" || current.name === "attackingPawn") {
      for (var pa of Array.from(modInputs["owner"][0].pawns.values())) {
        if (!(pa instanceof Pawn)) continue;
        if (pa.isExiled || !pa.isAlive || !pa.isActive || pa.isPlacable) continue;
        const pawn = pa;
        hbhls.push({ object: pawn, type: current.name, onClicked: () => this.fullFillMi(pawn) });
      }
    } else if (current.name === "patternFinalPos") {
      const pawn = modInputs["movedPawn"][0];
      for (var x = pawn.pos.x - 3; x <= pawn.pos.x + 3; x++) {
        for (var y = pawn.pos.y - 3; y <= pawn.pos.y + 3; y++) {
          const vec = { x: mod(x, gs.board.maxCrd.x + 1), y: mod(y, gs.board.maxCrd.y + 1) };
          //console.log(vec);
          const testRes = modInputsRequests.test({ ...modInputs, [current.name]: [vec] });
          if (testRes === "ok") {
            hbhls.push({ object: vec, type: current.name+"ok", onClicked: () => this.fullFillMi(vec) });
          } else if (testRes === "blocked") {
            hbhls.push({ object: vec, type: current.name+"blocked", onClicked: () =>{}});
          }
        }
      }
    } else if (current.name === "freeMovedPawn") {
      for (pa of Array.from(modInputs["owner"][0].pawns.values())) {
        if (!(pa instanceof Pawn)) continue;
        if (!pa.isPlacable || pa.isExiled || !pa.isActive) continue;
        const pawn = pa;
        hbhls.push({ object: pawn, type: current.name, onClicked: () => this.fullFillMi(pawn) });
      }
    } else if (current.name === "placementFinalPos") {
      for (x = 0; x <= cgs.board.maxCrd.x; x++) {
        for (y = 0; y <= cgs.board.maxCrd.y; y++) {
          const vec = { x: x, y: y };
          const testRes = modInputsRequests.test({ ...modInputs, [current.name]: [vec] });
          if (testRes === "ok") {
            hbhls.push({ object: vec, type: current.name+"ok", onClicked: () => this.fullFillMi(vec) });
          } else if (testRes === "blocked") {
            hbhls.push({ object: vec, type: current.name+"blocked", onClicked: () =>{}});
          }
        }
      }
    } else if (current.name === "attackedPawn") {
      const owner = modInputs["owner"][0];
      for (var pl of cgs.players) {
        if (pl.team === owner.team) continue;
        for (pa of Array.from(pl.pawns.values())) {
          if (!(pa instanceof Pawn)) continue;
          if (pa.isExiled || !pa.isAlive || !pa.isActive || pa.isPlacable) continue;
          const pawn = pa;
          const testRes = modInputsRequests.test({ ...modInputs, [current.name]: [pawn] });
          if (testRes === "ok") {
            hbhls.push({ object: pawn, type: current.name+"ok", onClicked: () => this.fullFillMi(pawn) });
          }
        }
      }
    }
    if (hbhls.length === 0) {
      /*console.log("HERE");
      console.log(modInputsRequests);
      console.log(hbhls);*/
    }
    //console.log(hbhls);
    this.setState({ hbhls: hbhls }, () => {});
  }

  rollBackHls() {
    const modInputsRequests = this.state.modInputsRequests;
    const modInputs = this.state.modInputs;
    modInputsRequests.todo.splice(0, 0, modInputsRequests.done[modInputsRequests.done.length - 1]);
    modInputsRequests.done.splice(modInputsRequests.done.length - 1, 1);
    this.setState({ modInputsRequests: modInputsRequests, modInputs: modInputs });
    this.setHbhls(modInputs, modInputsRequests);
    return;
  }

  handleCcl(ccl: ModifierConclusion): ModifierEffect[] {
    //console.log("HANDLE");
    //console.log(ccl);
    if (!ccl.success) return [];
    else {
      const game = this.state.game;
      var lastgs: GameState = this.cgs();
      for (var effect of ccl.effects) {
        if (effect.new instanceof GameState) {
          //console.log(effect);
          lastgs = effect.new;
        }
      }
      game.states.push(lastgs);
      //console.log(game);
      this.setState({ game: game });
      this.forceUpdate();
      var effects = ccl.effects;
      var failed = null      
      do {
        failed = this.handleEffects(effects, this.cgs());
        if(effects === null) effects = effects.slice(effects.indexOf(failed), effects.length - 1);
      } while (failed !== null);
      return effects;
    }
  }

  handlePawnPlacement(owner: Player) {
    const cgs = this.cgs();
    const pl = cgs.findEquivalent(owner) as Player;
    const ca = new Card(FlickeringCardTypes.PlacePawn(), 0, 0, cgs.idProvider, false);
    pl.giveCard(ca);
    this.onActionSelected(ca.type.data.actions[0], ca, pl);
  }

  onNewTick() {
    for (var p of this.cgs().players) {
      if (p.playing) {
        this.handlePawnPlacement(p);
      }
    }
  }

  getLatestCard(card: Card) {
    for (var p of this.cgs().players) {
      for (var ca of Array.from(p.hand.values())) {
        if (!(ca instanceof Card)) continue;
        if (card.id === ca.id) return ca;
      }
    }
    return card;
  }

  render() {
    const { selectedCards } = this.state;

    return (
      <div className="GameDiv">
        <img className="GameBackground" src={backgroundsImgs.game} alt=""></img>
        <GameBodyComponent
          onEndTurn={() => {
            var mc: ModifierConclusion = { success: true, effects: [] };
            const newTurn = this.cgs().nextTurnState();
            //console.log(newTurn);
            mc.effects.push({ name: ModEffNames.ENDTURN, old: this.cgs(), new: newTurn });
            const effects = this.handleCcl(mc);
            //console.log(effects);
            this.setState({ stackedEffects: this.state.stackedEffects.concat(effects), selectedCards: [] });
            this.onNewTick();
          }}
          halfBakedHlights={this.state.hbhls}
          pendingEffect={this.state.stackedEffects[0]}
          onEffectRealized={() => {
            const se = this.state.stackedEffects;
            //console.log(se[0]);
            se.splice(0, 1);
            this.setState({ stackedEffects: se });
            this.onNewTick();
          }}
          loc={this.props.loc}
          cardsRefs={this.cardsRefs}
          initialGameState={this.state.game.states[0]}
          onCardClicked={(card: Card, owner: Player) => {
            if (selectedCards.indexOf(card) !== -1) {
              return;
            }
            this.setState({ selectedCard: selectedCards.push(card) });
            this.setPlayableActions(card, owner);
          }}
          onModification={(ccl):ModifierEffect[] => {
            if (!ccl.success) return [];
            else {
              const game = this.state.game;
              var lastgs: GameState = this.cgs();
              for (var effect of ccl.effects) {
                if (effect.new instanceof GameState) {
                  lastgs = effect.new;
                }
              }
              game.states.push(lastgs);
              this.setState({ game: game });
              this.forceUpdate();
              return ccl.effects;
            }
          }}
        />
        
        {selectedCards.length > 0 && 
          this.cgs().players.map((p, pi, parr) => (
            selectedCards.map((v, i, a) => {
              if (!p.owns(v)) {
                return (<div></div>); 
              }
              return(
                <CardDetailComponent
                  loc={this.props.loc}
                  color={p.color}
                  playableActions={this.state.playableActions}
                  played={(() => {
                    if (this.state.playedCard === null) return false;
                    return v.id === this.state.playedCard.id;
                  })()}
                  card={(()=>{
                    for (var p of this.cgs().players) {
                      for (var card of Array.from(p.hand.values())) {
                        if (!(card instanceof Card)) continue;
                        if (v.id === card.id) return card;
                      }
                    }
                    return v;
                  })()}
                  owner={p}
                  cardRef={this.cardsRefs.get(v.id)}
                  onActionSelected={(action: Action) => {
                    if (this.state.playedCard !== null) {
                      if (this.state.playedCard.id === v.id) this.setState({ playedCard: null });
                    }
                    this.onActionSelected(action, this.getLatestCard(v), p);
                  }}
                  onClickOutside={() => {
                  this.setState({
                    selectedCard: (() => {
                      delete selectedCards[i];
                      return selectedCards;
                  })()});
                }}></CardDetailComponent>
              )
            })
          ))
        }
        <BsComponent strength={10} color="#02001b"></BsComponent>
      </div>
    )
  }
}