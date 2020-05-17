import "./player.component.style.scss";
import { Card } from "Shared/Classes/GameObjects/Card";
import React from "react";
import HandComponent from "./hand.component";
import { carpetsImgs } from "../../../Assets/Assets";
import { Player } from "Shared/Classes/GameObjects/Player";
import BsComponent from "./bs.component";
import PawnBoxComponent from "./pawnbox.component";

export default function PlayerComponent(props: {
  cardsRefs: Map<number, React.RefObject<HTMLDivElement>>,
  loc: Locs,
  player: Player,
  onCardClicked: (card: Card) => void,
  mirror: boolean,
  onPbDrag: (pos: { top: number, left: number }) => void,
  onEndTurn:() => void,
  slotsRefs: React.RefObject<HTMLDivElement>[],
  showBox: boolean
}) {
  return (
    <div className="PlayerDiv">
      <div className={"PlayerInfos"+(props.player.playing ? " Playing":"")} >
        <h1 className="PlayerInfosName" style={{background: "linear-gradient(180deg, rgba(69,40,60,1) 15%, "+props.player.color+" 80%)"}}>{props.player.name}</h1>
        {(props.player.playing &&
          <h1 className="PlayerAp">{props.player.ap}<span>{" AP"}</span></h1>
        )}
        {((props.player.playing && !props.showBox) &&
          <div className="EndTurnButton"
            onClick={() => {
              if (props.player.playing) {
                props.onEndTurn();
              }
            }
          }><h1>{props.loc["6"]}</h1></div>
        )}
        <BsComponent strength={1} color={'black'}></BsComponent>
      </div>
      <div className="CarpetContainer" style={props.mirror ? {transform:"scale(-1, 1)"} : {}}>
        <img className="BackgroundIllustration" src={carpetsImgs.cloudPanelB} alt=""></img>
      </div>
      <HandComponent
        cardsRefs={props.cardsRefs}
        loc={props.loc}
        owner={props.player}
        hand={Array.from(props.player.hand.valuesCard())}
        onCardClicked={(card: Card) => {
          props.onCardClicked(card);
        }}></HandComponent>
      {(props.showBox &&
        <PawnBoxComponent
        slotsRefs={props.slotsRefs}
        loc={props.loc}
        pawns={[]}
        onDrag={pos=> props.onPbDrag(pos)}
        ></PawnBoxComponent>
      )}
    </div>
  )
}