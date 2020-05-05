import React from "react";
import "./bs.component.style.scss";

function BsComponent(props:{strength:number, color:string}) {
    return(
        <div className="BsDiv" style={{
            boxShadow: "inset 0 0 " + props.strength + "rem "+props.color
        }}></div>
    )
}

export default BsComponent;