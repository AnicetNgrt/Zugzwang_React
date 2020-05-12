import "./settingsmenu.component.style.scss";
import React from "react";
import { backgroundsImgs } from "Client/Assets/Assets";
//import Draggable from 'react-draggable';
import SettingsMenuButtonComponent from "./settingsmenulist.component";
import SettingsMenuListComponent from "./settingsmenulist.component";

export default class SettingsMenuComponent extends React.Component {
  constructor(readonly props: { loc:Locs, locs:{ [key: string]: Locs} }) {
    super(props);
  }

  render() {
    return (<div className="SettingsMenuDiv"
      style={{
        backgroundColor:'black'
      }}>
      <img className="SettingsBackground" src={backgroundsImgs.settings} alt=""></img>
      <SettingsMenuButtonComponent text={this.props.loc.f} emoji={"↩"} position={{ x: '3%', y: '15%' }}></SettingsMenuButtonComponent>
      <SettingsMenuButtonComponent text={this.props.loc.h} emoji={"⫘"} position={{x:'49%',y:'15%'}}></SettingsMenuButtonComponent>
      <SettingsMenuListComponent text={this.props.loc.g} emoji={"æ"} position={{ x: '49%', y: '30%' }}></SettingsMenuListComponent>
    </div>)
  }
}

//<BsComponent strength={10} color='black'></BsComponent>