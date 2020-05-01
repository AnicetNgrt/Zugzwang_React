import { HumanPlayer } from "./HumanPlayer";
import { MoveSender } from "../../Interfaces/MoveSender";

export class CientHumanPlayer extends HumanPlayer implements MoveSender {
    sendMove(move: any): void {
        throw new Error("Method not implemented.");
    }
}