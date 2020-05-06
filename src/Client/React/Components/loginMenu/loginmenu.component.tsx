import "./loginmenu.component.style.scss";
import React from "react";
import { backgroundsImgs, carpetsImgs } from "Client/Assets/Assets";
import BsComponent from "../game/bs.component";
import Draggable from 'react-draggable';
import MainMenuButtonComponent from "./mainmenubutton.component";

export default class LoginMenuComponent extends React.Component {
  constructor(readonly props: { [key: string]: any }) {
    super(props);
  }

  render() {
    return (<div className="LoginMenuDiv"
      style={{
        //backgroundImage: `url(${backgroundsImgs.waveTexture})`,
        backgroundRepeat: 'repeat'
      }}>
      <img className="LoginBackgroundImg" src={carpetsImgs.wavePanel}></img>
      <Draggable
      bounds="parent"
      >
        <h1 className="GameTitle">the <span className="Subtitle">cartet</span></h1>
      </Draggable>
      <MainMenuButtonComponent text="Online guest" emoji={"⨝"} position={{ x: '13%', y: '32%' }}></MainMenuButtonComponent>
      <MainMenuButtonComponent text="Online premium" emoji={"▦"} position={{x:'13%',y:'35%'}}></MainMenuButtonComponent>
      <MainMenuButtonComponent text="Offline play" emoji={"◮"} position={{ x: '13%', y: '38%' }}></MainMenuButtonComponent>
    </div>)
  }
}

//<BsComponent strength={10} color='black'></BsComponent>