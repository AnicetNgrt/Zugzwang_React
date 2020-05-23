import './pawn.component.style.scss';
import { Pawn } from 'Shared/Classes/GameObjects/Pawn';
import React from 'react';
import { ReactImageTint } from 'react-image-tint';
import { tween, easing, chain, delay } from 'popmotion';
import Spritesheet from 'react-responsive-spritesheet';
import { anims } from "../../../Assets/Assets";

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
  pawn: Pawn
}

function putAnim(setStretchX:any, setStretchY:any, setTranslateY:any, setLockStretchAnim:any) {
  tween({ from: 1, to: 1.6, duration: 80, ease:easing.easeIn }).start({
    update: (v: any) => {
      setStretchY(v);
      setStretchX(1 - ((v-1)/2));
    },
    complete: () => {
      tween({ from: 1.2, to: 1, duration: 80, ease:easing.easeOut }).start({
        update: (v: any) => {
          setStretchY(v);
          setStretchX(1 - (v-1));
        },
        complete: () => {
          setLockStretchAnim(false);
        }
      })
    }
  })
}

const PawnComponent = React.forwardRef((props: PawnProps, ref: any) => {

  const [lastHeight, setLastHeight] = React.useState(0);
  const [showShadow, setShowShadow] = React.useState(false);
  const [stretchY, setStretchY] = React.useState(1);
  const [stretchX, setStretchX] = React.useState(1);
  const [translateY, setTranslateY] = React.useState(1);
  const [lockStretchAnim, setLockStretchAnim] = React.useState(false);

  if (!showShadow && props.addHeight > lastHeight) {
    setShowShadow(true);
  } else if (showShadow && props.addHeight < lastHeight) {
    setShowShadow(false);
    setLockStretchAnim(true);
    putAnim(setStretchX, setStretchY, setTranslateY, setLockStretchAnim);
  }

  if (props.addHeight !== lastHeight) {
    setLastHeight(props.addHeight);
  }

  return (
    <div className={"PawnDiv"+((props.selected || props.moving) ? " Selected" : "")+(props.pawn.isAlive ? "": " Ded")}
      style={{
        top: "calc("+props.top+"px - "+props.addHeight+"vw)",
        left: props.left + "px",
        transform: props.pawn.isAlive ? "scaleY("+stretchY+") scaleX("+stretchX+") translateY("+translateY+"%)":"",
        zIndex: Math.floor(props.top / 10),
        pointerEvents: props.selected ? "none" : "all"
      }}>
      <div className="PawnPics"> 
        <div className="ImgShadow"
          style={(showShadow ? {
            border: "solid 0.25vw "+props.color+"ee",
          } : {
            border: "solid 0.25vw "+props.color+"ee",
            boxShadow: "0 0 1vw black, 0 0vw 0vw rgba(0, 0, 50, 0)"
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