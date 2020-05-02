import React, { useState } from 'react';
import './App.scss';
import PcPaneComponent from './pcPane.component';
import BoardComponent from './board.component';
import { Board } from '../../Classes/GameObjects/Board';
import { RandomIdProvider } from '../../Classes/IdProviders/RandomIdProvider';

const board = Board.getFromSize({x:10, y:15}, new RandomIdProvider(4));

function App() {
  
  return (
    <div className="GameWindow">
      <BoardComponent board={board}/>
      <PcPaneComponent/>
    </div>
  );
}

export default App;
