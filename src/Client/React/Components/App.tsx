import React, { useState } from 'react';
import './App.scss';
import PcPaneComponent from './pcPane.component';
import BoardComponent from './board.component';
import { Board } from '../../../Shared/Classes/GameObjects/Board';
import { RandomIdProvider } from '../../../Shared/Classes/IdProviders/RandomIdProvider';
import { Card } from '../../../Shared/Classes/GameObjects/Card';
import CardDetailComponent from './carddetail.component';

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

function App() {
  
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div className="AppDiv">
      <div className="Header">
        <h1><span className="Title">the wahlse</span><span className="Prefix">{' ⁜'}</span></h1>
      </div>
      <div className="GameWindow">
        <BoardComponent board={board}/>
        <PcPaneComponent onCardClicked={(card:Card) => setSelected(card)}/>
      </div>
      {selected != null && 
          <CardDetailComponent card={selected} onClickOutside={()=>{
            setSelected(null);
          }}></CardDetailComponent>
      }
    </div>
  );
}

export default App;
