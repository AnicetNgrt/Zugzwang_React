import React from "react";
import "./settingsmenubutton.component.style.scss";
import Draggable from "react-draggable";
import { sounds } from "Client/Assets/sounds/sounds";

export default function SettingsMenuButtonComponent(props: {
  emoji: string,
  text: string,
  position: { x: string, y: string },
  onClick: () => void
}) {
  const activate = () => {
    sounds.selectPositive.play();
    props.onClick();
  };

  return (
    <Draggable
      bounds="parent"
      handle=".emoji">
      <div className="SettingsMenuButtonDiv" style={{
        top: props.position.y,
        left: props.position.x
      }}>
        <h1 className={"emoji"} aria-hidden="true">
          {props.emoji}
        </h1>
        <h1
          className={"text"}
          role="button"
          tabIndex={0}
          aria-label={props.text}
          onClick={activate}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              activate();
            }
          }}
        >
          {" " + props.text}
        </h1>
      </div>
    </Draggable>
  )
}
