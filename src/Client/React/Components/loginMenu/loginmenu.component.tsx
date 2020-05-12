import "./loginmenu.component.style.scss";
import React from "react";
import { carpetsImgs } from "Client/Assets/Assets";
import Draggable from 'react-draggable';
import LoginMenuButtonComponent from "./loginmenubutton.component";

export default class LoginMenuComponent extends React.Component {
  constructor(readonly props: { [key: string]: any, loc:Locs }) {
    super(props);
  }

  render() {
    return (<div className="LoginMenuDiv"
      style={{
        //backgroundImage: `url(${backgroundsImgs.waveTexture})`,
        backgroundRepeat: 'repeat'
      }}>
      <img className="LoginBackgroundImg" src={carpetsImgs.wavePanel} alt=""></img>
      <Draggable
      bounds="parent"
      >
        <h1 className="GameTitle">Path<span className="Subtitle">erns</span></h1>
      </Draggable>
      <LoginMenuButtonComponent text={this.props.loc.a} emoji={"⨝"} position={{ x: '13%', y: '32%' }}></LoginMenuButtonComponent>
      <LoginMenuButtonComponent text={this.props.loc.b} emoji={"▦"} position={{x:'13%',y:'35%'}}></LoginMenuButtonComponent>
      <LoginMenuButtonComponent text={this.props.loc.c} emoji={"◮"} position={{ x: '13%', y: '38%' }}></LoginMenuButtonComponent>
    </div>)
  }
}

//<BsComponent strength={10} color='black'></BsComponent>