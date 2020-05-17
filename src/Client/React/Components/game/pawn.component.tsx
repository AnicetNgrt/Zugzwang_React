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
  moving: boolean,
  addHeight: number,
  pawn:Pawn
}


const PawnComponent = React.forwardRef((props: PawnProps, ref: any) => {

  const [lastHeight, setLastHeight] = React.useState(0);
  const [showShadow, setShowShadow] = React.useState(false);

  if (!showShadow && props.addHeight > lastHeight) {
    setShowShadow(true);
  } else if (showShadow && props.addHeight < lastHeight) {
    setShowShadow(false);
  }

  if (props.addHeight !== lastHeight) {
    setLastHeight(props.addHeight);
  }

  return ( props.pawn.isAlive &&
    <div className={"PawnDiv"+((props.selected || props.moving) ? " Selected" : "")}
      style={{
        top: "calc("+props.top+"px - "+props.addHeight+"vw)",
        left: props.left + "px",
        zIndex: Math.floor(props.top / 10),
        pointerEvents: props.selected ? "none" : "all"
      }}>
      <div className="PawnPics"> 
        <div className="ImgShadow"
          style={(showShadow ? {
            border: "solid 0.25vw "+props.color+"88",
          } : {
            border: "solid 0.25vw "+props.color+"88",
            boxShadow: "0 0 1vw " + props.color + "ff, 0 0vw 0vw rgba(0, 0, 50, 0)"
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