import React from "react";
import "./settingsmenubutton.component.style.scss";
import Draggable from "react-draggable";

export default function SettingsMenuButtonComponent(props: {
  emoji:string,
  text: string,
  position: { x: string, y: string },
  onClick: () => void
}) {
  return (
    <Draggable
      bounds="parent"
     handle=".emoji">
      <div className="SettingsMenuButtonDiv" style={{
        top: props.position.y,
        left: props.position.x
      }}>
        <h1 className={"emoji"}>
          {props.emoji}
        </h1>
        <h1 className={"text"} onClick={()=>props.onClick()}>
          {" "+props.text}
        </h1>
      </div>
    </Draggable>
  )
}