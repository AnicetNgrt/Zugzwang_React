import "./board.component.style.scss";
import React from "react";
import { Board } from "../../Classes/GameObjects/Board";

function BoardComponent(props:{board:Board}) {
    return(
        <table className={"BoardDiv"}>
            <tbody>
            {props.board.shiftMap.map(line => (
                <tr className={"Line"}>
                    {line.map(vec => (
                        <td className={"Tile"}>
                            
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default BoardComponent;