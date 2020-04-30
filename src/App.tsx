import React, { useState } from 'react';
import './App.scss';
import CardComponent from './Components/card.component';
import { Hand } from './Classes/Hand';
import PcPaneComponent from './Components/pcPane.component';
import BoardComponent from './Components/board.omponent';

function App() {

  const [cardsSelected, setCardsSelected] = useState<number[]>([]);
  const n = 10;
  const MAX_WEIGHT = 10;

  return (
    <div className="GameWindow">
      <PcPaneComponent></PcPaneComponent>
      <BoardComponent></BoardComponent>
    </div>
  );
}

export default App;
