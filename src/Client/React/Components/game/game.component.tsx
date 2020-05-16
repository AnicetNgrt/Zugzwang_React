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

function randInt(min:number, max:number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const idpr = new RandomIdProvider(3);

const availableCards: Card[][] = [[
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true)
],
[
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
]];

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4
}

var ciAnicet = randInt(0, colors.length - 1);
var ciThibo = (ciAnicet + randInt(1, colors.length - 2))%colors.length;

var anicet: Player = new Player((cards: Pset)=>true, "Anicet", colors[ciAnicet], 1, rules, idpr, 4, true);
var thibo: Player = new Player((cards: Pset)=>true, "Thibo", colors[ciThibo], 2, rules, idpr, 4, false);
var players: Player[] = [anicet, thibo];
var board: Board = Board.getFromSize(rules.boardSize, idpr);

anicet.addCard(availableCards[0][0]);
anicet.addCard(availableCards[0][1]);
anicet.givePawn(new Pawn(idpr, { x: 2, y: 3 }));
anicet.givePawn(new Pawn(idpr, { x: 3, y: 4 }));
anicet.givePawn(new Pawn(idpr, { x: 9, y: 14 }));

thibo.addCard(availableCards[1][0]);
thibo.addCard(availableCards[1][1]);
thibo.addCard(availableCards[1][3]);
thibo.givePawn(new Pawn(idpr, { x: 3, y: 3 }));
thibo.givePawn(new Pawn(idpr, { x: 7, y: 6 }));
thibo.givePawn(new Pawn(idpr, { x: 5, y: 0 }));

board.obstructed.add({ x: 2, y: 3 });
board.obstructed.add({ x: 3, y: 4 });
board.obstructed.add({ x: 9, y: 14 });
board.obstructed.add({ x: 3, y: 3 });
board.obstructed.add({ x: 7, y: 6 });
board.obstructed.add({ x: 5, y: 0 });

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
  onFullFilled: (objects: ModifierObjects) => void,
  test: (objects: ModifierObjects)=>boolean
};

export type GameComponentState = {
  selectedCards: Card[],
  status: Status,
  game: Game,
  hbhls: HalfBakedHlight[],
  modInputsRequests: ModInputsRequests,
  modInputs: ModifierObjects
}

export default class GameComponent extends React.Component {

  readonly state: GameComponentState;
  cardsRefs: Map<Card, React.RefObject<HTMLDivElement>>;
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
      modInputsRequests: {todo:[], onFullFilled:()=>{}, test:()=>false},
      modInputs: {}
    }

    this.cardsRefs = new Map<Card, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        if (!(card instanceof Card)) continue;
        this.cardsRefs.set(card, React.createRef<HTMLDivElement>());
      }
    }
  }

  componentDidMount() { }
  
  componentDidUpdate() {
    this.cardsRefs = new Map<Card, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        if (!(card instanceof Card)) continue;
        this.cardsRefs.set(card, React.createRef<HTMLDivElement>());
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
      modInputsRequests.todo.splice(0, 1);
      this.setHbhls(modInputs, modInputsRequests);
    }

    //console.log(modInputsRequests.todo);

    if (modInputsRequests.todo.length === 0) {
      modInputsRequests.onFullFilled(modInputs);
      this.setState({ hbhls: [] });
    }
    this.setState({ modInputsRequests: modInputsRequests, modInputs: modInputs });
  }

  onActionSelected(action: Action, card: Card, player: Player) {
    if (!player.playing) return alert("tu ne joues pas");
    if (this.state.modInputsRequests.todo.length !== 0) {
      this.setState({ modInputsRequests: {todo:[], onFullFilled:this.state.modInputs.onFullFilled}, modInputs: {} });
      return;
    }
    const mod = action.modifier;
    const todo = [];
    var addOwner = false;
    for (let key in mod.inputs) {
      if (key === "owner") {
        addOwner = true;
        continue;
      }
      todo.push({name:key, mi:mod.inputs[key]});
    }

    const modInputsRequests = {
      todo: todo,
      onFullFilled: (objects: ModifierObjects) => {
        this.handleCcl(card.play(
          this.cgs(),
          card.type.data.actions.indexOf(action),
          player,
          objects
        ));
      },
      test: (objects: ModifierObjects): boolean => {
        //console.log(objects);
        const ccl = card.play(
          this.cgs(),
          card.type.data.actions.indexOf(action),
          player,
          objects
        );
        return ccl.success;
      }
    }

    this.setState({
      modInputsRequests: modInputsRequests,
      modInputs: addOwner ? {"owner": [player] } : {}
    });
    this.setHbhls(addOwner ? { "owner": [player] } : {}, modInputsRequests);
  }

  setHbhls(modInputs: ModifierObjects, modInputsRequests:ModInputsRequests) {
    if (modInputsRequests.todo.length === 0) return;
    const gs = this.cgs();
    const current = modInputsRequests.todo[0];
    const hbhls: HalfBakedHlight[] = [];
    if (current.name === "movedPawn") {
      for (var pa of Array.from(modInputs["owner"][0].pawns.values())) {
        const pawn = pa;
        hbhls.push({ object: pawn, type: current.name, onClicked: () => this.fullFillMi(pawn) });
      }
    } else if (current.name === "pos") {
      for (var x = 0; x <= gs.board.maxCrd.x; x++) {
        for (var y = 0; y <= gs.board.maxCrd.y; y++) {
          const vec = { x: 0 + x, y: 0 + y };
          if (modInputsRequests.test({ ...modInputs, [current.name]: [vec] })) {
            hbhls.push({ object: vec, type: current.name, onClicked: () => this.fullFillMi(vec) });
          }
        }
      }
    }
    this.setState({ hbhls: hbhls });
  }

  handleCcl(ccl: ModifierConclusion): ModifierEffect[] {
    console.log("HANDLE");
    console.log(ccl);
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
      return ccl.effects;
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
          halfBakedHlights={this.state.hbhls}
          loc={this.props.loc}
          cardsRefs={this.cardsRefs}
          gameState={this.cgs()}
          onCardClicked={(card: Card, owner: Player) => {
            if (selectedCards.indexOf(card) !== -1) return;
            this.setState({ selectedCard: selectedCards.push(card) });
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
                  cardRef={this.cardsRefs.get(v)}
                  onActionSelected={(action: Action) => {
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