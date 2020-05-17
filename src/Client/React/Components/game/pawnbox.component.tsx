import React from "react";
import "./pawnbox.component.style.scss";
import { Pawn } from "Shared/Classes/GameObjects/Pawn";

export default class PawnBoxComponent extends React.Component {
    constructor(readonly props: {
        loc:Locs,
        pawns: Pawn[],
        onDrag: (pos: { top: number, left: number }) => void,
        slotsRefs: React.RefObject<HTMLDivElement>[]
    }) {
        super(props);
    }

    render() {
        return (
            <div className={"PawnBoxDiv"}>
                <div className={"Slots"}>
                    <div ref={this.props.slotsRefs[0]} className={"slot"}></div>
                    <div ref={this.props.slotsRefs[1]} className={"slot"}></div>
                    <div ref={this.props.slotsRefs[2]} className={"slot"}></div>
                    
                </div>
                <h1 className={"PawnBoxTitle"}>{this.props.loc["w"]}</h1>
                <p className={"PawnBoxDesc"}>{this.props.loc["7"]}</p>
            </div>
        )
    }
}