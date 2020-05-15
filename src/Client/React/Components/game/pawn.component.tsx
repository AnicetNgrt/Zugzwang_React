import './pawn.component.style.scss';
import { Pawn } from 'Shared/Classes/GameObjects/Pawn';
import React from 'react';
import { ReactImageTint } from 'react-image-tint';
import { tween, easing, chain, delay } from 'popmotion';

type PawnProps = {
  picture: string,
  top: number,
  left: number,
  directed: boolean,
  color: string,
  onClick: () => void,
  selected: boolean,
  addHeight: number,
  pawn:Pawn
}

const PawnComponent = React.forwardRef((props: PawnProps, ref: any) => {
  return (
    <div className={"PawnDiv"+(props.selected ? " Selected" : "")}
      style={{
        top: "calc("+props.top+"px - "+props.addHeight+"vw)",
        left: props.left + "px",
        zIndex: Math.floor(props.top / 10),
        pointerEvents: props.selected ? "none" : "all"
      }}>
      <div className="PawnPics"> 
        <div className="ImgShadow"
          style={(props.selected ? {} : {
            border: "solid 0.25vw "+props.color+"88",
            boxShadow: "0 0 1vw " + props.color + "ff"
        })}></div>
        <div className="PawnHitbox" onClick={() => {
          props.onClick();
        }}> </div>
        <img ref={ref} className="PawnIllustration" src={props.picture} alt="">
        </img>
        <ReactImageTint src={props.picture} color={props.color} />  
        <h1>{props.pawn.id}</h1>
      </div>
    </div>
  )
});

export default PawnComponent;