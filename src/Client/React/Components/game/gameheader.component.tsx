import React from "react";
import "./gameheader.component.style.scss";

export default function GameHeaderComponent(props:{}) {
  return (
    <div className="Header">
      <h1><span className="Title">the wahlse</span><span className="Prefix">{' ⁜'}</span></h1>
    </div>
  )
}