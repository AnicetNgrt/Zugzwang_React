import { Pattern } from "../Types/Pattern";
import { Orientation } from "../Enums/Orientation";

export const Patterns: {[key:string]:Pattern} = {
    smallRivers: [
        Orientation.NORTH
    ],
    knightWest: [
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.WEST
    ],
    knightEast: [
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.EAST
    ],
    clockmakerEast: [
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.WEST
    ],
    clockmakerWest: [
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.NORTH,
        Orientation.EAST
    ]
}