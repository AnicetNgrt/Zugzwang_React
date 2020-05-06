import "./carddetail.component.style.scss";

import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import React, { createRef } from "react";
import BsComponent from "./bs.component";
import Draggable from 'react-draggable';
import { cardsLayoutsImgs, cardsImgs } from "../../../Assets/Assets";

class CardDetailComponent extends React.Component {
    movingCard: React.RefObject<HTMLDivElement>;
    
    constructor(readonly props: { card: Card, onClickOutside: () => void }) {
        super(props);
        this.movingCard = createRef<HTMLDivElement>();
    }

    render() {
        return (
            <div className={"CardDetailDiv "}>
                <Draggable
                    handle=".handle"
                    bounds="parent"
                    >
                <div className="CardDetail" ref={this.movingCard}>
                    <div className="handle">
                    </div>
                    <div className="CloseCardButton" onClick={()=>{this.props.onClickOutside()}}>
                        <h1>{"×"}</h1>
                    </div>
                    <div className="IllustrationContainer">
                        <img className="CardIllustration" src={cardsImgs[this.props.card.type.data.name.toLowerCase()]} />
                        <BsComponent strength={10} color="#000000"/>
                    </div>
                
                    <div className="Stats" style={{
                        top: '3%', left: '78.5%',
                        backgroundColor: '#8b7b9c'
                    }}>
                        <h1><span className="StatNumber">{this.props.card.type.data.weight}</span><span className="StatLetter">{"w"}</span></h1>
                    </div>
                    <div className="Stats" style={{
                        top: '15%', left: '78.5%',
                        backgroundColor: (this.props.card.type.data.maxTurn - this.props.card.playedTurn == 0 ? '#c9001e' : (this.props.card.type.data.maxTurn == 999 ? '#009e74' : '#c96100'))
                    }}>
                        <h1><span className="StatNumber">{
                            (this.props.card.type.data.maxTurn == 999 ? "∞" : this.props.card.type.data.maxTurn - this.props.card.playedTurn)
                        }</span><span className="StatLetter">{"t"}</span></h1>
                    </div>
                    <div className="Stats" style={{
                        top: '27%', left: '78.5%',
                        backgroundColor: (this.props.card.type.data.maxGame - this.props.card.playedGame == 0 ? '#c9001e' : (this.props.card.type.data.maxGame == 999 ? '#009e74' : '#c96100'))
                    }}>
                        <h1><span className="StatNumber">{
                            (this.props.card.type.data.maxGame == 999 ? "∞" : this.props.card.type.data.maxGame - this.props.card.playedGame)
                        }</span><span className="StatLetter">{"g"}</span></h1>
                    </div>
                
                    <img className="CardLayout" src={cardsLayoutsImgs.default}></img>
                    <div>
                        <h1 className="CardName">{this.props.card.type.data.name}</h1>
                    </div>
                </div>
                </Draggable>
        </div>)
    }
}

export default CardDetailComponent;