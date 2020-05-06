import React, { useEffect } from "react";
import "./card.component.style.scss";
import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import { cardsImgs } from "../../../Assets/Assets";

function CardComponent(props:{card:Card, selected:boolean, onClick:()=>void}) {
    return (
        <div 
        className={"CardDiv "+(props.card.shown ? "":"Hidden ")}
        onClick={props.onClick}
        >   
            <img className={"CardImg"} src={cardsImgs[props.card.type.data.name.toLowerCase()]}></img>
            <h1 className={"CardArrow"}>{'※'}</h1>
        </div>
    )
}

export default CardComponent;