import "./player.component.style.scss";
import { Card } from "Shared/Classes/GameObjects/Card";
import React from "react";
import HandComponent from "./hand.component";
import { carpetsImgs } from "../../../Assets/Assets";
import { Player } from "Shared/Classes/GameObjects/Player";
import BsComponent from "./bs.component";
import PawnBoxComponent from "./pawnbox.component";

export default function PlayerComponent(props: {
  cardsRefs: Map<Card, React.RefObject<HTMLDivElement>>,
  loc: Locs,
  player: Player,
  onCardClicked: (card: Card) => void,
  mirror: boolean,
  onPbDrag: (pos: { top: number, left: number })=>void
}) {
  return (
    <div className="PlayerDiv">
      <div className="PlayerInfos" >
        <h1 className="PlayerInfosName" style={{backgroundColor:props.player.color}}>{props.player.name}</h1>
        <h1 className="PlayerAp">{props.player.ap}<span>{" AP"}</span></h1>
        <BsComponent strength={1} color={'black'}></BsComponent>
      </div>
      <div className="CarpetContainer" style={props.mirror ? {transform:"scale(-1, 1)"} : {}}>
        <img className="BackgroundIllustration" src={carpetsImgs.cloudPanelB} alt=""></img>
      </div>
      <HandComponent
        cardsRefs={props.cardsRefs}
        loc={props.loc}
        hand={Array.from(props.player.hand.values())}
        onCardClicked={(card: Card) => props.onCardClicked(card)}></HandComponent>
      <PawnBoxComponent
        loc={props.loc}
        pawns={[]}
        onDrag={pos=> props.onPbDrag(pos)}
      ></PawnBoxComponent>
    </div>
  )
}