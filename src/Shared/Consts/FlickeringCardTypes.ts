import { FlickeringCardType } from "../Classes/CardTypes/FlickeringCardType";

export const FlickeringCardTypes: {[key:string]:()=>FlickeringCardType} = { 
    Archer:() => {return new FlickeringCardType({
        weight:3,
        name:"Archer",
        picturePath: "/images/cardsPixel/archer.png",
        maxTurn:2,
        maxGame:999,
        actions: []
    })}
}