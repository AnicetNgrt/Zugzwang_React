import "./board.component.style.scss";
import React from "react";
import { Board } from "../../../../Shared/Classes/GameObjects/Board";

export interface BoardProps {
    board: Board,
    players: string[]
}

export type BoardState = {

}

export default class BoardComponent extends React.Component {
    constructor(readonly props: BoardProps) {
        super(props);
    }

    componentDidMount() { }
    
    componentDidUpdate() { }

    render() {
        return (
            <div className={"BoardDiv"}>
                <div className="GameTitle">
                    <h1 className="PlayerName"
                        style={{float: 'left', backgroundColor:'#c94747'}}>{this.props.players[0]}</h1>
                    <h1 className="PlayerName"
                        style={{float:'right', left:'54%', backgroundColor:'#4070bd'}}>{this.props.players[1]}</h1>
                </div>
                <div className="TableContainer">
                <table>
                    <tbody>
                    {this.props.board.shiftMap.map(line => (
                        <tr className={"Line"}>
                            {line.map(vec => (
                                <td className={"Tile"}>
                                    
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