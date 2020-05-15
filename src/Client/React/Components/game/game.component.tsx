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

var anicet: Player = new Player((cards: Set<Card>)=>true, "Anicet", colors[ciAnicet], 1, rules, idpr, 4, true);
var thibo: Player = new Player((cards: Set<Card>)=>true, "Thibo", colors[ciThibo], 2, rules, idpr, 4, false);
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

var cgs = new GameState(players, idpr, board, rules, 0);


export interface GameProps {
}


export class Game {
  states: GameState[];
  constructor(initial: GameState) {
    this.states = [initial];
  }
}

export type GameComponentState = {
  selectedCards: Card[],
  status: Status,
  game: Game,
  hbhls: { object: any, type: string, onClicked: (object: any, type: string) => void }[],
  modInputsRequests: { todo: { name: string, mi: ModifierInput }[], onFullFilled:(objects:ModifierObjects)=>void },
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
      modInputsRequests: {todo:[], onFullFilled:()=>{}},
      modInputs: {}
    }

    this.cardsRefs = new Map<Card, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        this.cardsRefs.set(card, React.createRef<HTMLDivElement>());
      }
    }
  }

  componentDidMount() { }
  
  componentDidUpdate() {
    this.cardsRefs = new Map<Card, React.RefObject<HTMLDivElement>>();
    for (var player of this.state.game.states[this.state.game.states.length-1].players) {
      for (var card of Array.from(player.hand.values())) {
        this.cardsRefs.set(card, React.createRef<HTMLDivElement>());
      }
    }
  }

  fullFillMi(object: any) {
    const modInputsRequests = this.state.modInputsRequests;
    const modInputs = this.state.modInputs;
    modInputs[modInputsRequests.todo[0].name].push(object);
    if(modInputs[modInputsRequests.todo[0].name].length === modInputsRequests.todo[0].mi.count) modInputsRequests.todo.splice(0, 1);
    if (modInputsRequests.todo.length === 0) modInputsRequests.onFullFilled(modInputs);
    this.setState({ modInputsRequests: modInputsRequests, modInputs: modInputs });
  }

  onActionSelected(action: Action, card: Card, player: Player) {
    if (!player.playing) return alert("tu ne joues pas");
    if (this.state.modInputs.todo !== []) {
      this.setState({ modInputsRequests: [], modInputs: [] });
      return;
    }
    const mod = action.modifier;
    const todo = [];
    var addOwner = false;
    for (var [key, modInput] of Object.entries(mod.inputs)) {
      if (key === "owner") {
        addOwner = true;
        break;
      }
      todo.push({name:key, mi:modInput});
    }
    this.setState({
      modInputsRequests: {
        todo: todo,
        onFullFilled: (objects:ModifierObjects) => {
          this.handleCcl(card.play(
            this.state.game.states[this.state.game.states.length - 1],
            card.type.data.actions.indexOf(action),
            player,
            objects
          ));
        }
      },
      modInputs: addOwner ? [player] : []
    });
  }

  handleCcl(ccl:ModifierConclusion): ModifierEffect[] {
    if (!ccl.success) return [];
    else {
      const game = this.state.game;
      var lastgs: GameState = this.state.game.states[this.state.game.states.length - 1];
      for (var effect of ccl.effects) {
        if (effect.new instanceof GameState) {
          lastgs = effect.new;
        }
      }
      game.states.push(lastgs);
      console.log(game);
      this.setState({ game: game });
      this.forceUpdate();
      return ccl.effects;
    }
  }

  render() {
    const { selectedCards } = this.state;

    return (
      <div className="GameDiv">
        <img className="GameBackground" src={backgroundsImgs.game} alt=""></img>
        <GameBodyComponent
          halfBakedHlights={[]}
          loc={this.props.loc}
          cardsRefs={this.cardsRefs}
          gameState={this.state.game.states[this.state.game.states.length - 1]}
          onCardClicked={(card: Card, owner:Player) => {
          if (selectedCards.indexOf(card) !== -1) return;
          this.setState({ selectedCard: selectedCards.push(card) });
          }}
          onModification={(ccl):ModifierEffect[] => {
            if (!ccl.success) return [];
            else {
              const game = this.state.game;
              var lastgs: GameState = this.state.game.states[this.state.game.states.length - 1];
              for (var effect of ccl.effects) {
                if (effect.new instanceof GameState) {
                  lastgs = effect.new;
                }
              }
              game.states.push(lastgs);
              console.log(game);
              this.setState({ game: game });
              this.forceUpdate();
              return ccl.effects;
            }
          }}
        />
        
        {selectedCards.length > 0 && 
          this.state.game.states[this.state.game.states.length - 1].players.map((p, pi, parr) => (
            selectedCards.map((v, i, a) => (
              p.owns(v) &&
              <CardDetailComponent
                loc={this.props.loc}
                color={p.color}
                card={v}
                owner={p}
                cardRef={this.cardsRefs.get(v)}
                onActionSelected={(action: Action) => {
                  this.onActionSelected(action, v, p);
                }}
                onClickOutside={() => {
                this.setState({
                  selectedCard: (() => {
                    delete selectedCards[i];
                    return selectedCards;
                })()});
              }}></CardDetailComponent>
            ))
          ))
        }
        <BsComponent strength={10} color="#02001b"></BsComponent>
      </div>
    )
  }
}