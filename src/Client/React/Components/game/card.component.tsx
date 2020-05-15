import React from "react";
import "./card.component.style.scss";
import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import { cardsImgs } from "../../../Assets/Assets";

const CardComponent = React.forwardRef((props: {
    card: Card,
    selected: boolean,
    selectable: boolean,
    onClick: () => void,
    onStartHover: () => void,
    onEndHover: () => void,
    arrow: string
}, ref: any) => {
    return (
    <div
    className={"CardDiv " + (props.card.shown ? "" : "Hidden ") + (props.selected ? "Selected " : "") + ((!props.selectable && !props.selected) ? "Unselectable " : "")}
    onClick={props.onClick}
    ref={ref}
    >
        <img className={"CardImg"}
            style={{ transform: 'rotate(' + (90 * (props.card.pictureRotation())) + 'deg)' }}
            src={cardsImgs[props.card.type.data.name.toLowerCase()]}
            alt=""
            onMouseEnter={(e) => props.onStartHover()}
            onMouseLeave={(e) => props.onEndHover()}
        ></img>
        <div
            className={"CardArrow"}
        >
            <h1>{props.arrow}</h1>
        </div>
    </div>
    )
    }
)

export default CardComponent;