import { DisplacementCardType } from "../Classes/CardTypes/DisplacementCardType"
import { Patterns } from "./Patterns"
import { Orientation } from "../Enums/Orientation"


export const DisplacementCardTypes: {[key:string]:()=>DisplacementCardType} = {
    smallRivers: () => {return new DisplacementCardType({
        weight:0,
        name:"Small Rivers",
        picturePath:undefined,
        maxTurn:999,
        maxGame:999,
        fullCircle:false,
        displacements: [{
            cost:1,
            patterns: [Patterns.smallRivers]
        }],
        defaultRotation: Orientation.NORTH
    })},
    knight: () => {return new DisplacementCardType({
        weight:8,
        name:"Knight",
        picturePath:undefined,
        maxTurn:999,
        maxGame:999,
        fullCircle:false,
        displacements: [{
            cost:0,
            patterns: [Patterns.knightEast, Patterns.knightWest]
        }],
        defaultRotation: Orientation.NORTH
    })},
    clockMaker: () => {return new DisplacementCardType({
        weight:7,
        name:"Clockmaker",
        picturePath:undefined,
        maxTurn:2,
        maxGame:999,
        fullCircle:false,
        displacements: [{
            cost:1,
            patterns:[Patterns.clockmakerEast, Patterns.clockmakerWest]
        }],
        defaultRotation: Orientation.NORTH
    })},
    apollo: () => {return new DisplacementCardType({
        weight:3,
        name:"Apollo",
        picturePath:undefined,
        maxTurn:999,
        maxGame:999,
        fullCircle:false,
        displacements: [{
            cost:1,
            patterns: [Patterns.clockmakerEast, Patterns.clockmakerWest]
        }],
        defaultRotation: Orientation.SOUTH
    })}
}