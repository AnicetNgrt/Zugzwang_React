import React, { useState } from 'react';
import './App.scss';
import PcPaneComponent from './pcPane.component';
import BoardComponent from './board.omponent';

function App() {

  const [cardsSelected, setCardsSelected] = useState<number[]>([]);
  const n = 10;
  const MAX_WEIGHT = 10;

  return (
    <div className="GameWindow">
      <PcPaneComponent/>
      <BoardComponent/>
    </div>
  );
}

export default App;
