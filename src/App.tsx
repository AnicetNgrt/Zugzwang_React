import React, { useState } from 'react';
import './App.scss';
import CardComponent from './components/card.component';
import { Hand } from './ZwangClasses/Hand';

function App() {

  const [cardsSelected, setCardsSelected] = useState<number[]>([]);
  const n = 10;
  const MAX_WEIGHT = 10;

  const hands = [
    new Hand([
    ], MAX_WEIGHT, () => {
      
    }),
    new Hand([

    ], MAX_WEIGHT, () => {

    }),
  ]

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ul>
        <CardComponent card={0} onFocused={(card)=> setCardsSelected([...cardsSelected, card])}></CardComponent>
        {
          [...Array(n)].map((e, i) => {
            return (<CardComponent 
              card={i} 
              onFocused={(card)=> setCardsSelected([...cardsSelected, card])}></CardComponent>)
          })
        }
      </ul>
    </div>
  );
}

export default App;
