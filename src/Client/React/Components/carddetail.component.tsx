import "./carddetail.component.style.scss";

import { Card } from "../../../Shared/Classes/GameObjects/Card";
import React from "react";
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

const CardDetailComponent = (props:{card:Card, onClickOutside:()=>void}) => {
    
    return (
        <DragDropContext onDragEnd={()=>{}}>
            <Droppable droppableId="droppable-1">
                {(provided, snapshot) => (<div 
                className={"CardDetailDiv "}
                ref={provided.innerRef}
                {...provided.droppableProps}
                >   
                    <Draggable draggableId="draggable-1" index={0}>
                        {(provided, snapshot) => (
                        <div className="CardDetail"
                        ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <div className="CloseCardButton" onClick={()=>props.onClickOutside()}>
                                <h1>{"×"}</h1>
                            </div>
                            <img className="CardIllustration" src={props.card.type.data.picturePath}/>
                            <div>
                                <h1 className="CardName">{props.card.type.data.name}</h1>
                            </div>
                            <div className="CardStats">
                                <h1>w: 3</h1>
                                <h1>t: 1/3</h1>
                            </div>
                        </div>)}
                    </Draggable>
                </div>)}
            </Droppable>
        </DragDropContext>
    )
}

export default CardDetailComponent;