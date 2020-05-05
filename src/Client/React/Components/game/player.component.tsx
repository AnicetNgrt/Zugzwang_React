import "./player.component.style.scss";
import { Card } from "Shared/Classes/GameObjects/Card";
import React from "react";
import HandComponent from "./hand.component";
import { Hand } from "Shared/Classes/Other/Hand";

export default function PlayerComponent(props: { name: string, hand: Hand, onCardClicked:(card:Card)=>void}) {
  return (
    <div className="PlayerDiv">
      <img className="BackgroundIllustration" src="/images/panels/background_glowingwire.png"></img>
      <HandComponent hand={props.hand} onCardClicked={(card:Card) =>props.onCardClicked(card)}></HandComponent>
    </div>
  )
}