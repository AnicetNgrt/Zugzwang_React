import React, { useState } from 'react';
import './App.scss';
import PcPaneComponent from './pcPane.component';
import BoardComponent from './board.component';
import { Board } from '../../Classes/GameObjects/Board';
import { RandomIdProvider } from '../../Classes/IdProviders/RandomIdProvider';
import { Card } from '../../Classes/GameObjects/Card';
import CardDetailComponent from './carddetail.component';

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

function App() {
  
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div>
      <div className="Header">
  <h1>REIHENFOLGE <span className="SubTitle">{'▦'}</span></h1>
      </div>
      <div className="GameWindow">
        <BoardComponent board={board}/>
        <PcPaneComponent onCardClicked={(card:Card) => setSelected(card)}/>
        {selected != null && 
          <CardDetailComponent card={selected} onClickOutside={()=>{
            setSelected(null);
          }}></CardDetailComponent>
        }
      </div>
    </div>
  );
}

export default App;
