import "./game.component.style.scss";
import React from "react";
import GameBodyComponent from "./gamebody.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import CardDetailComponent from "./carddetail.component";
import BsComponent from "./bs.component";
import { Board } from "Shared/Classes/GameObjects/Board";
import { RandomIdProvider } from "Shared/Classes/IdProviders/RandomIdProvider";
import { backgroundsImgs } from "../../../Assets/Assets";

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

export interface GameProps {
}

export type GameComponentState = {
  selectedCards: Card[],
  inGame: boolean
}

export default class GameComponent extends React.Component {

  readonly state: GameComponentState;

  constructor(readonly props: {}) {
    super(props);
    this.state = {
      selectedCards: [],
      inGame: false
    }
  }

  componentDidMount() { }
  
  componentDidUpdate() { }

  render() {

    const { selectedCards } = this.state;

    return (
      <div className="GameDiv">
        <img className="GameBackground" src={backgroundsImgs.default}></img>
        <GameBodyComponent board={board} onCardClicked={(card: Card) => {
          if (selectedCards.indexOf(card) != -1) return;
          this.setState({ selectedCard: selectedCards.push(card) });
        }}/>
        {selectedCards.length > 0 && 
          selectedCards.map((v, i, a) => (
            <CardDetailComponent card={v} onClickOutside={() => {
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