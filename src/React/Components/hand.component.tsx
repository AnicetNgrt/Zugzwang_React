import { Hand } from "../../Classes/Other/Hand";
import React, { useState } from "react";
import { Card } from "../../Classes/GameObjects/Card";
import CardComponent from "./card.component";
import "./hand.component.style.scss";

const HandComponent = (props:{hand:Hand, playerName:string}) => {

    const [selected, setSelected] = useState<Card[]>([]);
    const hidden = props.hand.cards.filter(c=>!c.shown);
    const shown = props.hand.cards.filter(c=>c.shown);

    return (
        <div className="HandComponent">
            <div className="HandDiv"
                style={{
                    width: (selected.length > 0 ? '50%' : '100%')
                }}>
                {hidden.length > 0 && <div className="SubHand">
                    <div className="SubHandTitle">
                        <h1>Hidden ↓</h1>
                    </div>
                    <div className="CardList">
                        {hidden.map(card => (
                            <CardComponent 
                            card={card} 
                            selected={selected.includes(card)}
                            onClick={() => setSelected(selected.includes(card) ? selected.filter(c => c.id  != card.id) : [card])}
                            />
                        ))}
                    </div>
                </div>}
                {shown.length > 0 && <div className="SubHand">
                    <div className="SubHandTitle">
                        <h1>Shown ↓</h1>
                    </div>
                    <div className="CardList">
                            {shown.filter(c=>c.shown).map(card => (
                                <CardComponent 
                                card={card} 
                                selected={selected.includes(card)}
                                onClick={() => setSelected(selected.includes(card) ? selected.filter(c => c.id  != card.id) : [card])}
                                />
                            ))}
                    </div>
                </div>}
            </div>
            { selected.length > 0 && <div className="CardDetailDiv">
                    adihzpoidhazpodih
                </div>
            }
        </div>
        
    );
}

export default HandComponent;