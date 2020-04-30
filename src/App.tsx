import React, { useState } from 'react';
import './App.scss';
import CardComponent from './components/card.component';
import { Hand } from './ZwangClasses/Hand';
import PcPaneComponent from './components/pcPane.component';
import BoardComponent from './components/board.omponent';

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
