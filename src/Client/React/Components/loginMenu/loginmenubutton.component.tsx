import React from "react";
import "./loginmenubutton.component.style.scss";
import Draggable from "react-draggable";

export default function LoginMenuButtonComponent(props: {
  emoji:string,
  text: string,
  position: { x: string, y: string }
}) {
  return (
    <Draggable
      bounds="parent"
     handle=".emoji">
      <div className="LoginButtonDiv" style={{
        top: props.position.y,
        left: props.position.x
      }}>
        <h1 className={"emoji"}>
          {props.emoji}
        </h1>
        <h1 className={"text"}>
          {" "+props.text}
        </h1>
      </div>
    </Draggable>
  )
}