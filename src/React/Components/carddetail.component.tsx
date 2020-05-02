import "./carddetail.component.style.scss";

import { Card } from "../../Classes/GameObjects/Card";
import React from "react";
import BsComponent from "./bs.component";

const CardDetailComponent = (props:{card:Card, onClickOutside:()=>void}) => {
    
    return (
        <div 
        className={"CardDetailDiv "}
        >   
            <BsComponent onClick={()=>props.onClickOutside()}/>
            <div className="CardDetail">
                <img className="CardIllustration" src={props.card.type.data.picturePath}/>
                <div className="CardStats">
                    <h1>w: 3</h1>
                    <h1>t: 1/3</h1>
                </div>
                <h1 className="CardName">{props.card.type.data.name}</h1>
            </div>
        </div>
    )
}

export default CardDetailComponent;