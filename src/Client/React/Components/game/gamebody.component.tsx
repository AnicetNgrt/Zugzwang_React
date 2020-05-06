import "./gamebody.component.style.scss";
import React from "react";
import BoardComponent from "./board.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import { Board } from "Shared/Classes/GameObjects/Board";
import { FlickeringCardTypes } from "Shared/Consts/FlickeringCardTypes";
import { RandomIdProvider } from "Shared/Classes/IdProviders/RandomIdProvider";
import { Hand } from "Shared/Classes/Other/Hand";
import PlayerComponent from "./player.component";

const cards1: Card[] = [
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 2, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 1, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 1, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 2, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 1, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
  new Card(FlickeringCardTypes.Archer(), 10, 2, new RandomIdProvider(7), true)
];

const hand1 = new Hand(cards1);

const cards2: Card[] = [
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), true),
  new Card(FlickeringCardTypes.Archer(), 10, 2, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), true),
  new Card(FlickeringCardTypes.Archer(), 10, 1, new RandomIdProvider(7), true),
  new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
];

const hand2 = new Hand(cards2);

const players = ["Joueur 1", "Joueur 2"];

export default function GameBodyComponent(props: {board:Board, onCardClicked:(card:Card)=>void}) {
  return (
    <div className="GameBodyDiv">
      <PlayerComponent name={players[0]} hand={hand1} onCardClicked={(card: Card) => props.onCardClicked(card)}/>
      <BoardComponent board={props.board} players={players}/>
      <PlayerComponent name={players[1]} hand={hand2} onCardClicked={(card: Card) => props.onCardClicked(card)}/>
    </div>
  );
}