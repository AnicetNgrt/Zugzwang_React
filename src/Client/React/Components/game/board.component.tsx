import "./board.component.style.scss";
import React from "react";
import { Board } from "../../../../Shared/Classes/GameObjects/Board";

export interface BoardProps {
    board: Board,
    refs: React.Ref<HTMLDivElement>[][],
    onTileClicked: (x: number, y:number)=>void
}

export type BoardState = {

}

export default class BoardComponent extends React.Component {
    constructor(readonly props: BoardProps) {
        super(props);
    }

    componentDidMount() {
    }
    
    componentDidUpdate() { }

    render() {
        return (
            <div className={"BoardDiv"}>
                <div className="TableContainer">
                <table>
                    <tbody>
                    {this.props.board.shiftMap.map((line, i, a) => (
                        <tr className={"Line"}>
                            {line.map((vec, j, a) => (
                                <td className={"Tile"}>
                                    <div ref={this.props.refs[i][j]}
                                        onClick={() => {
                                            this.props.onTileClicked(j, i);
                                        }}
                                        style={{
                                            width:"100%",
                                            height: "100%"
                                        }}
                                    ></div> 
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div> 
            </div>
        )
    }
}