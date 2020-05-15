import React from "react";
import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import CardComponent from "./card.component";
import "./hand.component.style.scss";
import Draggable from "react-draggable";

const HandComponent = (props: {
    loc:Locs,
    hand: Card[], onCardClicked: (card: Card) => void,
    cardsRefs: Map<Card, React.RefObject<HTMLDivElement>>}) => {
    const hidden = props.hand.filter(c=>!c.shown);
    const shown = props.hand.filter(c=>c.shown);

    return (
        <div className="HandComponent">
            <Draggable
                bounds="parent">
                    <div className="HandDiv">
                    {hidden.length > 0 && <div className="SubHand">
                        <div className="SubHandTitle">
                            <h1>{props.loc["y"]}</h1>
                        </div>
                        <div className="CardList">
                            {hidden.map(card => (
                                <CardComponent 
                                card={card}
                                ref={props.cardsRefs.get(card)}  
                                selected={false}
                                selectable={true}
                                onClick={() => {
                                    props.onCardClicked(card);
                                }}
                                onStartHover={()=>{}}
                                onEndHover={()=>{}}
                                arrow={'⨀'} />
                            ))}
                        </div>
                    </div>}
                    {shown.length > 0 && <div className="SubHand">
                        <div className="SubHandTitle">
                            <h1>{props.loc["x"]}</h1>
                        </div>
                        <div className="CardList">
                            {shown.map(card => (
                                <CardComponent 
                                card={card} 
                                selected={false}
                                selectable={true}
                                ref={props.cardsRefs.get(card)}    
                                onClick={() => {
                                    props.onCardClicked(card);
                                }}
                                onStartHover={()=>{}}
                                onEndHover={()=>{}}
                                arrow={'⨀'}/>
                            ))}
                        </div>
                    </div>}
                </div>
            </Draggable>
        </div>
    );
}

export default HandComponent;