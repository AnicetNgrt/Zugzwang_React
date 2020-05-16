import "./carddetail.component.style.scss";

import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import React from "react";
import BsComponent from "./bs.component";
import Draggable, { DraggableEvent } from 'react-draggable';
import { cardsLayoutsImgs, cardsImgs } from "../../../Assets/Assets";
import { Action } from "Shared/Classes/Other/Action";
import { Player } from "Shared/Classes/GameObjects/Player";
import { Vec2 } from "Shared/Types/Vec2";
import { tween, keyframes, everyFrame } from "popmotion";
import { BsArrowsMove } from "react-icons/bs";

class CardDetailComponent extends React.Component {
    
    detailRef: React.RefObject<HTMLDivElement>;

    readonly state: {
        face1Opacity: number,
        face2Opacity: number,
        animated: boolean,
        pos: Vec2,
        cardPos: Vec2,
    }

    shownAction: Action[];

    constructor(readonly props: {
        loc: Locs,
        card: Card, onClickOutside: () => void,
        color: string,
        onActionSelected: (action: Action) => void,
        owner: Player,
        cardRef: React.RefObject<HTMLDivElement>
    }) {
        super(props);
        this.state = {
            face1Opacity: 1,
            face2Opacity: 0,
            animated: false,
            pos: { y: 0, x: 0 },
            cardPos: { y: 0, x: 0}
        }
        this.shownAction = []
        //console.log(props.card);
        this.detailRef = React.createRef();
    }

    componentDidMount() {
        const fromRect = this.props.cardRef.current.getBoundingClientRect();
        const from = { y: fromRect.top, x: fromRect.left };
        const detailRect = this.detailRef.current.getBoundingClientRect();
        const to = { y: (window.innerHeight / 2) - (detailRect.height/2), x: (window.innerWidth / 2) - (detailRect.width/2) }
        
        tween({ from: from, to: to, duration: 500 })
            .start({
                update: (v: any) => {
                    this.setState({ pos: v });
                }
        });
    }

    fadeFace1(to:number) {
        tween({ from: this.state.face1Opacity, to:to, duration: 500 })
        .start({
            update: (v: any) => {
                this.setState({ face1Opacity:v });
        }})
    }
    fadeFace2(to:number) {
        tween({ from: this.state.face2Opacity, to:to, duration: 500 })
        .start({
            update: (v: any) => {
                this.setState({ face2Opacity:v });
        }})
    }
    
    render() {
        return (
            <div className={"CardDetailDiv "}>
                <Draggable
                    handle=".Faces"
                    bounds="parent"
                    axis={"both"}
                    disabled={this.state.animated}
                    onStop={(...args: any[]) => {
                        //console.log(args);
                        const { x, y } = args[1];
                        this.setState({ pos: { x: x, y: y} });
                    }}
                    position={{x:this.state.pos.x, y:this.state.pos.y}}
                >
                <div
                className="CardDetail"
                ref={this.detailRef}
                    >
                    <div
                        className="Faces"
                    >
                        {(!this.state.animated && 
                            <div className="CloseCardButton" onClick={()=>{this.props.onClickOutside()}}>
                                <h1>{"×"}</h1>
                            </div>
                        )}
                        {(true &&
                                <div className="Face" style={{
                                opacity: this.state.face1Opacity > 0 ? this.state.face1Opacity : 0,
                                transform: "rotateY(" + (180 + (90 * (this.state.face1Opacity + 1))) + "deg)",
                                backgroundColor: this.props.color
                                }}>
                                <div className="IllustrationContainer">
                                <img className="CardIllustration" src={cardsImgs[this.props.card.type.data.name.toLowerCase()]} alt=""/>
                                <BsComponent strength={10} color="#000000"/>
                                </div>
                            
                                <div className="Stats" style={{
                                    top: '2.5%', left: '78.5%',
                                    backgroundColor: '#8b7b9c'
                                }}>
                                    <h1><span className="StatNumber">{this.props.card.type.data.weight}</span><span className="StatLetter">{"w"}</span></h1>
                                </div>
                                <div className="Stats" style={{
                                    top: '14.5%', left: '78.5%',
                                    backgroundColor: (this.props.card.type.data.maxTurn - this.props.card.playedTurn === 0 ? '#c9001e' : (this.props.card.type.data.maxTurn === 999 ? '#009e74' : '#c96100'))
                                }}>
                                    <h1><span className="StatNumber">{
                                        (this.props.card.type.data.maxTurn === 999 ? "∞" : this.props.card.type.data.maxTurn - this.props.card.playedTurn)
                                    }</span><span className="StatLetter">{"t"}</span></h1>
                                </div>
                                <div className="Stats" style={{
                                    top: '27%', left: '78.5%',
                                    backgroundColor: (this.props.card.type.data.maxGame - this.props.card.playedGame === 0 ? '#c9001e' : (this.props.card.type.data.maxGame === 999 ? '#009e74' : '#c96100'))
                                }}>
                                    <h1><span className="StatNumber">{
                                        (this.props.card.type.data.maxGame === 999 ? "∞" : this.props.card.type.data.maxGame - this.props.card.playedGame)
                                    }</span><span className="StatLetter">{"g"}</span></h1>
                                </div>
                            
                                <img className="CardLayout" src={cardsLayoutsImgs.default} alt=""></img>
                                <div>
                                    <h1 className="CardName">{this.props.card.type.data.name}</h1>
                                </div>
                                <div className="Actions">
                                    {(this.props.card.type.data.actions.map((a, i, arr) => {
                                    return (
                                        <div
                                            className={"ActionDetail" + (this.shownAction.indexOf(a) !== -1 ? " ShownAction" : "")}
                                            //style={{opacity: hide ? 0: 1}}
                                        >
                                            <div className="ActionName"
                                                onClick={() => {
                                                    if (this.shownAction.indexOf(a) !== -1) {
                                                        this.shownAction.splice(this.shownAction.indexOf(a), 1);
                                                        this.forceUpdate();
                                                        this.forceUpdate();
                                                    } else {
                                                        this.shownAction = [...this.shownAction, a];
                                                        this.forceUpdate();
                                                        this.forceUpdate();
                                                    }
                                            }}>
                                                <span className="ActionCost">
                                                    {a.cost} <span className="ApCost">AP</span>
                                                </span>
                                                {" " + this.props.loc[a.name]}
                                                <div className="ActionDesc">
                                                    {this.props.loc[a.description]}
                                                    <div
                                                        className="PlayActionButton"
                                                        onClick={()=>{this.props.onActionSelected(a)}}
                                                    >
                                                        {this.props.loc["z"]}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }))}
                                </div>
                                <h1><BsArrowsMove className="CDicon"/></h1>
                            </div>
                            
                        )}  
                    
                    </div>
                </div>
                </Draggable>
        </div>)
    }
}

export default CardDetailComponent;