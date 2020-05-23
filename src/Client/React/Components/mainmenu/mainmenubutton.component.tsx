import React from "react";
import "./mainmenubutton.component.style.scss";
import Draggable from "react-draggable";
import { sounds } from "Client/Assets/sounds/sounds";

export default function MainMenuButtonComponent(props: {
  emoji:string,
  text: string,
  position: { x: string, y: string },
  onClick: () => void
}) {
  return (
    <Draggable
      bounds="parent"
     handle=".emoji">
      <div className="MainMenuButtonDiv" style={{
        top: props.position.y,
        left: props.position.x
      }}>
        <h1 className={"emoji"}>
          {props.emoji}
        </h1>
        <h1 className={"text"} onClick={() => {
          sounds.selectPositive.play();
          props.onClick();
        }}>
          {" "+props.text}
        </h1>
      </div>
    </Draggable>
  )
}