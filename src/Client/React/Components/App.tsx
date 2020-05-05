import React from 'react';
import './App.scss';
import { Board } from '../../../Shared/Classes/GameObjects/Board';
import { RandomIdProvider } from '../../../Shared/Classes/IdProviders/RandomIdProvider';
import { Card } from '../../../Shared/Classes/GameObjects/Card';
import CardDetailComponent from './game/carddetail.component';
import GameHeaderComponent from './game/gameheader.component';
import GameBodyComponent from './game/gamebody.component';

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

export interface AppProps {
}

export type AppState = {
  selectedCard: Card | null,
  inGame: boolean
}

export default class App extends React.Component {

  readonly state: AppState;

  constructor(readonly props: AppProps) {
    super(props);
    this.state = {
      selectedCard: null,
      inGame: false
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    const { selectedCard } = this.state;

    return (
      <div className="AppDiv">
        <GameBodyComponent board={board} onCardClicked={(card:Card) => this.setState({ selectedCard: card})}/>
        {selectedCard != null && 
            <CardDetailComponent card={selectedCard} onClickOutside={()=>{
              this.setState({ selectedCard: null});
            }}></CardDetailComponent>
        }
      </div>
    )
  }
}
