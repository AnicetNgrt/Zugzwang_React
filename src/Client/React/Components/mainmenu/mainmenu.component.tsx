import "./mainmenu.component.style.scss";
import React from "react";
import { backgroundsImgs } from "Client/Assets/Assets";
//import Draggable from 'react-draggable';
import MainMenuButtonComponent from "./mainmenubutton.component";

export default class MainMenuComponent extends React.Component {

  constructor(readonly props: { [key: string]: any, loc:Locs, onSceneRequest:(scene:string)=>void }) {
    super(props);
  }

  render() {
    return (<div className="MainMenuDiv"
      style={{
        backgroundColor:'black'
      }}>
      <img className="GameBackground" src={backgroundsImgs.default} alt=""></img>
      <MainMenuButtonComponent
        text={this.props.loc.d}
        emoji={"⨝"}
        position={{ x: '29%', y: '28%' }}
        onClick={()=>{ this.props.onSceneRequest("lobby");}}
      ></MainMenuButtonComponent>
      <MainMenuButtonComponent
        text={this.props.loc.e}
        emoji={"▦"}
        position={{ x: '29%', y: '38%' }}
        onClick={()=>{}}
      ></MainMenuButtonComponent>
      <MainMenuButtonComponent
        text={this.props.loc.c}
        emoji={"◮"}
        position={{ x: '29%', y: '48%' }}
        onClick={() => { this.props.onSceneRequest("settings");}}
      ></MainMenuButtonComponent>
    </div>)
  }
}

//<BsComponent strength={10} color='black'></BsComponent>