import "./player.component.style.scss";
import { Card } from "Shared/Classes/GameObjects/Card";
import React from "react";
import HandComponent from "./hand.component";
import { carpetsImgs } from "../../../Assets/Assets";

export default function PlayerComponent(props: { name: string, hand: Card[], onCardClicked:(card:Card)=>void}) {
  return (
    <div className="PlayerDiv">
      <img className="BackgroundIllustration" src={carpetsImgs.default} alt=""></img>
      <HandComponent hand={props.hand} onCardClicked={(card:Card) =>props.onCardClicked(card)}></HandComponent>
    </div>
  )
}