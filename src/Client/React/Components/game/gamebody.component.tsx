import "./gamebody.component.style.scss";
import React from "react";
import BoardComponent from "./board.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import { Board } from "Shared/Classes/GameObjects/Board";
import PlayerComponent from "./player.component";


const players = ["Joueur 1", "Joueur 2"];

export default function GameBodyComponent(props: {board:Board, onCardClicked:(card:Card)=>void}) {
  return (
    <div className="GameBodyDiv">
      <PlayerComponent name={players[0]} hand={[]} onCardClicked={(card: Card) => props.onCardClicked(card)}/>
      <BoardComponent board={props.board} players={players}/>
      <PlayerComponent name={players[1]} hand={[]} onCardClicked={(card: Card) => props.onCardClicked(card)}/>
    </div>
  );
}