import React from "react";
import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import CardComponent from "./card.component";
import "./hand.component.style.scss";
import Draggable from "react-draggable";
import { Player } from "Shared/Classes/GameObjects/Player";

const HandComponent = (props: {
    loc: Locs,
    owner: Player,
    hand: Card[], onCardClicked: (card: Card) => void,
    cardsRefs: Map<number, React.RefObject<HTMLDivElement>>}) => {
    const hidden = props.hand.filter(c => {
        return !c.shown && c.type.data.name !== "PlacePawn";
    });
    const shown = props.hand.filter(c=>{
        return c.shown && c.type.data.name !== "PlacePawn";
    });
    
    return (
        <div className="HandComponent">
            <Draggable
                bounds="parent">
                    <div className="HandDiv">
                    {hidden.length > 0 && <div className="SubHand">
                        <div className="CardList"
                            style={{
                                backgroundColor: props.owner.color,
                                border: props.owner.playing ? 'solid 0.25vw #00fd8779' : "",
                                boxShadow: props.owner.playing ? '0 0 0.5vw #00ca76, inset 0 0 0.5vw #00ca7681':""
                            }}>
                            {hidden.map(card => (
                                <CardComponent 
                                card={card}
                                ref={props.cardsRefs.get(card.id)}  
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
                        <div className="SubHandTitle">
                            <h1>{props.loc["x"]}</h1>
                        </div>
                    </div>}
                    {shown.length > 0 && <div className="SubHand">
                        <div className="CardList"
                            style={{
                                backgroundColor: props.owner.color,
                                border: props.owner.playing ? 'solid 0.25vw #00fd8779' : "",
                                boxShadow: props.owner.playing ? '0 0 0.5vw #00ca76, inset 0 0 0.5vw #00ca7681':""
                            }}>
                            {shown.map(card => (
                                <CardComponent 
                                card={card} 
                                selected={false}
                                selectable={true}
                                ref={props.cardsRefs.get(card.id)}    
                                onClick={() => {
                                    props.onCardClicked(card);
                                }}
                                onStartHover={()=>{}}
                                onEndHover={()=>{}}
                                arrow={'⨀'}/>
                            ))}
                        </div>
                        <div className="SubHandTitle">
                            <h1>{props.loc["x"]}</h1>
                        </div>
                    </div>}
                </div>
            </Draggable>
        </div>
    );
}

export default HandComponent;