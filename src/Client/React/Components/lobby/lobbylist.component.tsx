import React from "react";
import "./lobbylist.component.style.scss";
import Draggable from "react-draggable";

export default function LobbyListComponent(props: {
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
      <div className="LobbyListDiv" style={{
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
          <div className={"listBody"}>

            {(props.content.map(element => (
              <div className={"listElement" + (element.id === props.selectedId ? " selected" : "")}
                onClick={() => props.onElementClick(element.id)}>
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