import "./pcPane.component.style.scss";
import React from "react";
import HandComponent from "./hand.component";
import { Hand } from "../../Classes/Other/Hand";
import { Card } from "../../Classes/GameObjects/Card";
import { FlickeringCardTypes } from "../../Consts/FlickeringCardTypes";
import { RandomIdProvider } from "../../Classes/IdProviders/RandomIdProvider";

const cards1: Card[] = [
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), false),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true)
];

const hand1 = new Hand(cards1);

const cards2: Card[] = [
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), true),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(4), true),
    new Card(FlickeringCardTypes.Archer(), 10, 50, new RandomIdProvider(7), true),
    new Card(FlickeringCardTypes.Archer(), 0, 0, new RandomIdProvider(5), true),
];

const hand2 = new Hand(cards2);

function PcPaneComponent() {
    return(
        <div className="HandsDiv">
            <HandComponent hand={hand1} playerName="Anicet"></HandComponent>
            <HandComponent hand={hand2} playerName="Joshua"></HandComponent>
        </div>
    )
}

export default PcPaneComponent;