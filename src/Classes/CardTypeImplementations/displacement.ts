import { Pattern, DisplacementCardType, Orientation } from "./usable/DisplacementCardType"

export const DisplacementCardTypes: {[key:string]:()=>DisplacementCardType} = {
    "SmallRivers": () => {return new DisplacementCardType({
        weight:0,
        name:"Small Rivers",
        picturePath:null,
        maxTurn:999,
        maxGame:999,
        fullCircle:false,
        patterns: [Patterns.smallRivers]
    })}
}

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