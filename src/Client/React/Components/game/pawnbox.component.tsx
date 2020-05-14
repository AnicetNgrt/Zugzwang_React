import React from "react";
import "./pawnbox.component.style.scss";
import { Pawn } from "Shared/Classes/GameObjects/Pawn";

export default class PawnBoxComponent extends React.Component {
    constructor(readonly props: {
        loc:Locs,
        pawns: Pawn[],
        onDrag: (pos: { top: number, left: number })=>void
    }) {
        super(props);
    }

    render() {
        return (
            <div className={"PawnBoxDiv"}>
            <h1 className={"PawnBoxTitle"}>{this.props.loc["w"]}</h1>
            </div>
        )
    }
}