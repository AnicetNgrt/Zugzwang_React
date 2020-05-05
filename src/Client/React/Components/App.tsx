import React from 'react';
import './App.scss';
import { Board } from '../../../Shared/Classes/GameObjects/Board';
import { RandomIdProvider } from '../../../Shared/Classes/IdProviders/RandomIdProvider';
import { Card } from '../../../Shared/Classes/GameObjects/Card';
import CardDetailComponent from './game/carddetail.component';
import GameBodyComponent from './game/gamebody.component';
import BsComponent from './game/bs.component';

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

export interface AppProps {
}

export type AppState = {
  selectedCards: Card[],
  inGame: boolean
}

export default class App extends React.Component {

  readonly state: AppState;

  constructor(readonly props: AppProps) {
    super(props);
    this.state = {
      selectedCards: [],
      inGame: false
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    const { selectedCards } = this.state;

    return (
      <div className="AppDiv">
        <img className="GameBackground" src="images/backgrounds/background_wall.png"></img>
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
