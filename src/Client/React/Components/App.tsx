import React from 'react';
import './App.scss';
import { getLocalData } from 'Client/client';
import { IpcRenderer } from 'electron';
import LoginMenuComponent from './loginMenu/loginmenu.component';
import MainMenuComponent from './mainmenu/mainmenu.component';
import SettingsMenuComponent from './settingsmenu/settingsmenu.component';

var ipcRenderer: null | IpcRenderer = null;

if (typeof window['require'] !== "undefined") {
  const electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  console.log("ipc renderer", ipcRenderer);
}

export interface AppProps {
  locs:{[key:string]:Locs}
}

export type AppState = {
  loginData: { loggedIn: boolean, sessionId: string },
  scene: string,
  lang: string
}

export default class App extends React.Component {

  readonly state: AppState;

  constructor(readonly props: AppProps) {
    super(props);
    this.state = {
      loginData: { loggedIn: false, sessionId: "" },
      scene: "settings",
      lang: "en"
    };
  }

  componentDidMount() {
    // initialising local private data
    getLocalData("loginData")
      .then(data => {
        if (data != null) this.setState({ loginData: JSON.parse(data) });
        this.forceUpdate();
      });
  }

  componentDidUpdate() {
    if (!this.state.loginData.loggedIn && ipcRenderer != null) {
      ipcRenderer.send('resizeSmall');
      ipcRenderer.send('fullscreenOff');
      ipcRenderer.send('center');
    } else if (this.state.loginData.loggedIn && ipcRenderer != null){
      ipcRenderer.send('resize1080');
      ipcRenderer.send('fullscreenOn');
    }
  }

  render() {
    return (
      <div className="AppDiv">
        {(this.state.scene === "main" &&
          <MainMenuComponent loc={this.props.locs[this.state.lang]}></MainMenuComponent>
        )}
        {(this.state.scene === "login" &&
          <LoginMenuComponent loc={this.props.locs[this.state.lang]}></LoginMenuComponent>  
        )}
        {(this.state.scene === "settings" &&
          <SettingsMenuComponent locs={this.props.locs} loc={this.props.locs[this.state.lang]}></SettingsMenuComponent>
        )}
      </div>
    )
  }
}



/*{(loginData.loggedIn &&
  <GameComponent loc={this.props.loc}></GameComponent>
)}*/
