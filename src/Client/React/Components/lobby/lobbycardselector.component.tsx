import "./lobbycardselector.component.style.scss";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Item = {
  id: string,
  content: string
}

const items = [
  { id: "ca1", content: "truc" },
  { id: "ca2", content: "truc2" },
  { id: "ca3", content: "truc" },
  { id: "ca4", content: "truc2" },
  { id: "ca5", content: "truc" },
  { id:"ca6", content: "truc2" },
  { id: "ca7", content: "truc2" },
  { id: "ca8", content: "truc" },
  { id: "ca9", content: "truc2" },
  { id: "ca10", content: "truc" },
  { id:"ca11", content: "truc2" },
  { id: "ca12", content: "truc2" },
  { id: "ca13", content: "truc" },
  { id: "ca14", content: "truc2" },
  { id: "ca15", content: "truc" },
  { id:"ca16", content: "truc2" }
]

type Collumn = {
    name: string,
    items: Item[]
}

const collumns = {
  "c1": {
    name: "Available",
    items: items
  },
  "c2": {
    name: "Selected",
    items: []
  }
};

export default class LobbyCardSelectorComponent extends React.Component {

  readonly state: { collumns: { [key:string]:Collumn }}

  constructor(readonly props: {loc:Locs}) {
    super(props);
    this.state = {
      collumns: collumns
    }
  }

  render() {
    return (
      <DragDropContext
      onDragEnd={result=>console.log(result)}>
        <div className="LobbyCardSelectorDiv">
          <h1 className="SelectorTitle">{this.props.loc["o"]}</h1>
          {Object.entries(collumns).map(([id, collumn]) => {
            return (
              <Droppable droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <div className="collumn"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{}}
                    >
                      <h1 className="collumnTitle">{collumn.name}</h1>
                      {collumn.items.map((value, index) => {
                        return (
                          <Draggable key={value.id} draggableId={value.id} index={index}>
                            {(provided, snapshot) => {
                              return (
                                <div className="card"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={{
                                    ...provided.draggableProps.style
                                  }}
                                >

                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    );
  }
}