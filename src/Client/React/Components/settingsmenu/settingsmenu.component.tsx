import "./settingsmenu.component.style.scss";
import React from "react";
import { backgroundsImgs } from "Client/Assets/Assets";
//import Draggable from 'react-draggable';
import SettingsMenuButtonComponent from "./settingsmenubutton.component";
import SettingsMenuListComponent from "./settingsmenulist.component";
import SettingsMenuTextInputComponent from "./settingsmenutextinput.component";
import SettingsMenuSwitchComponent from "./settingsmenuswitch.component";

export default class SettingsMenuComponent extends React.Component {
  constructor(readonly props: {
    loc: Locs,
    locs: { [key: string]: Locs },
    resolutions: { [key: string]: string },
    onSceneRequest: (scene: string) => void,
    onSettingChange: (name: string, value: any) => void,
    currentSettings: {
      lang: string,
      username: string,
      fullscreen: boolean,
      resolution: string
    }
  }) {
    super(props);
  }
  
  render() {

    return (
    <div className="SettingsMenuDiv"
      style={{
        backgroundColor:'black'
      }}>
      <img className="SettingsBackground" src={backgroundsImgs.settings} alt=""></img>
      <SettingsMenuButtonComponent
        text={this.props.loc.f}
        emoji={"↩"} position={{ x: '3%', y: '15%' }}
        onClick={() => { this.props.onSceneRequest("back");}}
      ></SettingsMenuButtonComponent>

      <SettingsMenuTextInputComponent
        text={this.props.loc.h} emoji={"⫘"}
        position={{ x: '49%', y: '15%' }}
        onSubmit={(value: string) => this.props.onSettingChange("username", value)}
        submitText={this.props.loc["j"]}
        currentValue={this.props.currentSettings.username}
        regexpStr={`^(.{3,12})$`}
      ></SettingsMenuTextInputComponent>

      <SettingsMenuListComponent
        text={this.props.loc["g"]}
        emoji={"æ"}
        position={{ x: '35%', y: '30%' }}
        content={(() => {
          const content = [];
          for (const [key, value] of Object.entries(this.props.locs)) {
            content.push({id:key, title:value["0"], desc:this.props.loc["i"]})
          }
          return content;})()}
        selectedId={this.props.currentSettings.lang}
        onElementClick={(id: string) => this.props.onSettingChange("language", id)}
        fontSize={"3vw"}
      ></SettingsMenuListComponent>

      <SettingsMenuSwitchComponent
        text={this.props.loc["k"]}
        emoji={"◳"}
        position={{ x: '67%', y: '60%' }}
        toggled={this.props.currentSettings.fullscreen}
        onClick={(state: boolean) => this.props.onSettingChange("fullscreen", state)}
      ></SettingsMenuSwitchComponent>

      <SettingsMenuListComponent
        text={this.props.loc["l"]}
        emoji={"▣"}
        position={{ x: '67%', y: '30%' }}
        content={(() => {
          const content = [];
          for (const [key, value] of Object.entries(this.props.resolutions)) {
            content.push({id:key, title:value, desc:this.props.loc["i"]})
          }
          return content;})()}
        selectedId={this.props.currentSettings.resolution}
        onElementClick={(id: string) => this.props.onSettingChange("resolution", id)}
        fontSize={"2vw"}
      ></SettingsMenuListComponent>
    </div>  
    )
  }
}

//<BsComponent strength={10} color='black'></BsComponent>