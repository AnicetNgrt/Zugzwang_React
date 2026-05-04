import React from "react";
import "./settingsmenulist.component.style.scss";
import Draggable from "react-draggable";

export default function SettingsMenuListComponent(props: {
  emoji:string,
  text: string,
  content: {id:string, title:string, desc:string}[]
  position: { x: string, y: string },
  fontSize: string,
  onElementClick: (id: string) => void,
  selectedId: string
}) {
  return (
    <Draggable
      bounds="parent"
     handle=".emoji">
      <div className="SettingsMenuListDiv" style={{
        top: props.position.y,
        left: props.position.x
      }}>
        <h1 className={"emoji"}>
          {props.emoji}
        </h1>
        <div className={"list"}>
          <h1 className={"listTitle"}>
            {" "+props.text}
          </h1>
          <div className={"listBody"} role="listbox" aria-label={props.text}>

            {(props.content.map(element => (
              <div
                key={element.id}
                className={"listElement" + (element.id === props.selectedId ? " selected" : "")}
                role="option"
                tabIndex={0}
                aria-selected={element.id === props.selectedId}
                onClick={() => props.onElementClick(element.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    props.onElementClick(element.id);
                  }
                }}
              >
                <h1 className={"listElementTitle"} style={{fontSize:props.fontSize}}>{element.title}</h1>
                <p className={"listElementDesc"}>{element.desc}</p>
              </div>
            )))}

          </div>
        </div>
      </div>
    </Draggable>
  )
}