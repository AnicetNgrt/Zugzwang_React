import { FlickeringCardType } from "../Classes/CardTypeImplementations/FlickeringCardType";

export const FlickeringCardTypes: {[key:string]:()=>FlickeringCardType} = { 
    "Archer":() => {return new FlickeringCardType({
        weight:3,
        name:"Archer",
        picturePath: null,
        maxTurn:2,
        maxGame:999,
        actions: []
    })}
}