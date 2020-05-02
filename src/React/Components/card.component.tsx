import React, { useEffect } from "react";
import "./card.component.style.scss";
import { Card } from "../../Classes/GameObjects/Card";

function CardComponent(props:{card:Card, selected:boolean, onClick:()=>void}) {
    
    return (
        <div 
        className={"CardDiv "+(props.card.shown ? "":"Hidden ")+(props.selected ? "Selected ":"")}
        onClick={props.onClick}
        >   
            <img className={"CardImg"} src="/images/cardsPixel/archer.png"></img>
            <h1 className={"CardArrow"}>{(props.selected ? "×" : '👁')}</h1>
        </div>
    )
}

export default CardComponent;