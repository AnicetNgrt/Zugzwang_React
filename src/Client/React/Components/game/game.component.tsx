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
import { ModifierEffect } from "Shared/Classes/Other/Modifier";


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

var anicet: Player = new Player((cards: Set<Card>)=>true, "Anicet", colors[0], 1, rules, idpr, 4);
var thibo: Player = new Player((cards: Set<Card>)=>true, "Thibo", colors[1], 2, rules, idpr, 4);
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
  selectedCards: {color:string, card:Card}[],
  status: Status,
  game: Game
}

export default class GameComponent extends React.Component {

  readonly state: GameComponentState;

  constructor(readonly props: {
    loc:Locs
  }) {
    super(props);
    this.state = {
      selectedCards: [],
      status: Status.LOCAL,
      game: new Game(cgs)
    }
  }

  componentDidMount() { }
  
  componentDidUpdate() { }

  render() {
    const { selectedCards } = this.state;

    return (
      <div className="GameDiv">
        <img className="GameBackground" src={backgroundsImgs.game} alt=""></img>
        <GameBodyComponent
          loc={this.props.loc}
          gameState={this.state.game.states[this.state.game.states.length - 1]}
          onCardClicked={(card: Card, owner:Player) => {
          if (selectedCards.indexOf({card:card, color:owner.color}) !== -1) return;
          this.setState({ selectedCard: selectedCards.push({ card: card, color: owner.color }) });
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
          selectedCards.map((v, i, a) => (
            <CardDetailComponent color={v.color} card={v.card} onClickOutside={() => {
              this.setState({
                selectedCard: (() => {
                  delete selectedCards[i];
                  return selectedCards;
              })()});
            }}></CardDetailComponent>
          ))
        }
        <BsComponent strength={10} color="#02001b"></BsComponent>
      </div>
    )
  }
}