import React, { useEffect } from "react";
import "./card.component.style.scss";
import useComponentFocused from "../Hooks/useComponentFocused";

const CardComponent = (props:{
    card:number;
    onFocused:(card:number) => any;
}) => {
    const { ref, isComponentFocused } = useComponentFocused(false);

    useEffect(() => {
        if(isComponentFocused == true) {
            props.onFocused(props.card);
        }
    },[isComponentFocused])

    return (<div ref={ref} className={"CardDiv "+(isComponentFocused ? "Focused" : "Unfocused")}> test
    </div>)
}

export default CardComponent;