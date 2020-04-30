import { HumanPlayer } from "./HumanPlayer";
import { SenderPlayer } from "../../Interfaces/SenderPlayer";

export class CientHumanPlayer extends HumanPlayer implements SenderPlayer {
    sendMove(move: any): void {
        throw new Error("Method not implemented.");
    }
}