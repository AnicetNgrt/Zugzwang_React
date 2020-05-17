import { FlickeringCardType } from "../Classes/CardTypes/FlickeringCardType";
import { moveToModifier } from "./Modifiers";
import { Action } from "../Classes/Other/Action";

export const FlickeringCardTypes: {[key:string]:()=>FlickeringCardType} = { 
    Archer:() => {return new FlickeringCardType({
        weight:3,
        name:"Archer",
        picturePath: "/images/cardsPixel/archer.png",
        maxTurn:2,
        maxGame:999,
        actions: []
    })
    },
    PlacePawn: () => {
        return new FlickeringCardType({
            weight: 0,
            name: "PlacePawn",
            picturePath: undefined,
            maxTurn: 999,
            maxGame: 999,
            actions: [new Action(0, "", "", moveToModifier)]
        })
    }
}