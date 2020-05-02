import "./pcPane.component.style.scss";
import React, { useState } from "react";
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

function PcPaneComponent(props:{onCardClicked:(card:Card)=>void}) {

    const [selected, setSelected] = useState<Card | null>(null);

    return(
        <div className="HandsDiv">
            <HandComponent hand={hand1} onCardClicked={(card:Card) =>props.onCardClicked(card)} playerName="Anicet"></HandComponent>
            <HandComponent hand={hand2} onCardClicked={(card:Card) =>props.onCardClicked(card)} playerName="Joshua"></HandComponent>
        </div>
    )
}

export default PcPaneComponent;