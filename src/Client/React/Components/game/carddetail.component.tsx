import "./carddetail.component.style.scss";

import { Card } from "../../../../Shared/Classes/GameObjects/Card";
import React from "react";
import BsComponent from "./bs.component";
import Draggable, { DraggableEvent } from 'react-draggable';
import { cardsLayoutsImgs, cardsImgs } from "../../../Assets/Assets";
import { Action } from "Shared/Classes/Other/Action";
import { Player } from "Shared/Classes/GameObjects/Player";
import { Vec2 } from "Shared/Types/Vec2";
import { tween, keyframes, everyFrame, easing } from "popmotion";
import { BsArrowsMove } from "react-icons/bs";
import { Textfit } from 'react-textfit';
import { GiVenusOfWillendorf } from "react-icons/gi";
import { sounds } from "Client/Assets/sounds/sounds";
import { moveToModifier } from "Shared/Consts/Modifiers";

const fakeAction: Action = new Action(0, "", "", moveToModifier);

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
        cardRef: React.RefObject<HTMLDivElement>,
        playableActions: Map<Action, string>,
        played: boolean
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
        if (!this.props.cardRef) {
            return;
        }
        if (this.props.cardRef.current) {
            const fromRect = this.props.cardRef.current.getBoundingClientRect();
            const from = { y: fromRect.top, x: fromRect.left };
            const detailRect = this.detailRef.current.getBoundingClientRect();
            var to;
            if (this.props.owner.team === 1) {
                to = { y: (window.innerHeight / 2) - (detailRect.height/2), x: (window.innerWidth / 5.3) - (detailRect.width/2) }
            } else {
                to = { y: (window.innerHeight / 2) - (detailRect.height/2), x: (window.innerWidth / 1.235) - (detailRect.width/2) }
            }
            sounds.cardOpenSound.play();
            tween({ from: from, to: to, duration: 300, ease:easing.easeInOut })
                .start({
                    update: (v: any) => {
                        this.setState({ pos: v });
                    }
            });
        } else {
            this.setState({ pos: {x:window.innerWidth/1.8, y:window.innerWidth/10} });
        }
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

        const pt = Math.max(this.props.card.type.data.maxTurn - this.props.card.playedTurn, 0);
        const pg = Math.max(this.props.card.type.data.maxGame - this.props.card.playedGame, 0);

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
                                <div className="CloseCardButton" onClick={() => {
                                    sounds.cardOpenSound.play();
                                    if (this.props.played) this.props.onActionSelected(fakeAction);
                                    this.props.onClickOutside();
                                }}>
                                <h1>{"×"}</h1>
                            </div>
                        )}
                        {(true &&
                                <div className="Face" style={{
                                opacity: this.state.face1Opacity > 0 ? this.state.face1Opacity : 0,
                                transform: "rotateY(" + (180 + (90 * (this.state.face1Opacity + 1))) + "deg)",
                                backgroundColor: 'black'
                                }}>
                                <div className="IllustrationContainer">
                                <img
                                    style={{ transform: this.props.card.pictureRotation() !== 0 ? 'rotate(' + (90 * (this.props.card.pictureRotation())) + 'deg)' : ""}}
                                    className="CardIllustration"
                                    src={cardsImgs[this.props.card.type.data.name.toLowerCase()]}
                                    alt=""
                                />
                                
                                </div>
                            
                                <div className="Stats" style={{
                                    top: '2.5%', left: '78.5%',
                                    backgroundColor: '#8b7b9c'
                                }}>
                                    <h1><span className="StatNumber">{this.props.card.type.data.weight}</span><span className="StatLetter">{"w"}</span></h1>
                                </div>
                                <div className="Stats" style={{
                                    top: '14.5%', left: '78.5%',
                                    backgroundColor: (pt === 0 ? '#c9001e' : (this.props.card.type.data.maxTurn === 999 ? '#009e74' : '#c96100'))
                                }}>
                                    <h1><span className="StatNumber">{
                                        (pt >= 99 ? "∞" : pt)
                                    }</span><span className="StatLetter">{"t"}</span></h1>
                                </div>
                                <div className="Stats" style={{
                                    top: '27%', left: '78.5%',
                                    backgroundColor: (pg === 0 ? '#c9001e' : (this.props.card.type.data.maxGame === 999 ? '#009e74' : '#c96100'))
                                }}>
                                    <h1><span className="StatNumber">{
                                        (pg >= 99 ? "∞" : pg)
                                    }</span><span className="StatLetter">{"g"}</span></h1>
                                </div>
                            
                                <img className="CardLayout" src={cardsLayoutsImgs.default} alt=""></img>
                                <div>
                                    <h1 className="CardName">
                                    <Textfit style={{height: "2.5vw", width:"17vw"}} mode="multi">{this.props.card.type.data.name}</Textfit>
                                    </h1>
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
                                                        sounds.cardOpenSound2.play();
                                                        this.forceUpdate();
                                                        this.forceUpdate();
                                                    } else {
                                                        this.shownAction = [...this.shownAction, a];
                                                        sounds.cardOpenSound2.play();
                                                        this.forceUpdate();
                                                        this.forceUpdate();
                                                    }
                                            }}>
                                                <span className="ActionCost">
                                                    {a.cost} <span className="ApCost">AP</span>
                                                </span>
                                                <Textfit style={{ display: "inline-block", marginLeft: "0.5vw", width:"72%", height: "2.5vw" }} mode="multi">{" " + this.props.loc[a.name]}</Textfit>
                                                
                                                <div className="ActionDesc">
                                                    {this.props.loc[a.description]}
                                                </div>
                                            </div>
                                            {(() => {
                                                if (this.shownAction.indexOf(a) === -1 || this.props.playableActions.get(a) === undefined) return (<div></div>);
                                                var playStr = this.props.loc["z"];
                                                var status = this.props.playableActions.get(a);
                                                if (status === "expensive") playStr = this.props.loc["1"];
                                                if (!this.props.owner.playing) {
                                                    status = "no-playing";
                                                    playStr = this.props.loc["2"];
                                                }
                                                if (status === "no-turn") playStr = this.props.loc["3"];
                                                if (status === "no-game") playStr = this.props.loc["5"];
                                                if (this.props.played) {
                                                    status = "cancel";
                                                    playStr = this.props.loc["4"];
                                                }
                                                return (
                                                    
                                                    <div
                                                        className={"PlayActionButton"+(status !== "playable" ? (status !== "cancel" ? " Locked" : " Cancel") : "")}
                                                        onClick={() => {
                                                            if (status === "playable" || status === "cancel") this.props.onActionSelected(a);
                                                            if (status === "playable") sounds.selectPositive.play();
                                                            if (status === "cancel") sounds.selectCancel.play();
                                                        }}
                                                    > 
                                                        <Textfit style={{ height: "4vw", fontFamily: (status === "playable" || status === "cancel") ? "Cinzel" : "'Jost', sans-serif" }} mode="multi">{playStr}</Textfit>
                                                    </div>
                                                )
                                            }
                                            )()}
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