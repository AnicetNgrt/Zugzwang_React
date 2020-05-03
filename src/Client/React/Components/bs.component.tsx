import React from "react";
import "./bs.component.style.scss";

function BsComponent(props:{onClick:()=>void}) {
    return(
        <div className="BsDiv" onClick={()=>props.onClick()}></div>
    )
}

export default BsComponent;