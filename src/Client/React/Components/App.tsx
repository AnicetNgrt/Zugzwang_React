import React from 'react';
import './App.scss';
import GameComponent from './game/game.component';
import { getLocalData } from 'Client/client';
import { IpcRenderer } from 'electron';
import LoginMenuComponent from './loginMenu/loginmenu.component';

var ipcRenderer: null | IpcRenderer = null;

if (typeof window['require'] !== "undefined") {
  const electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  console.log("ipc renderer", ipcRenderer);
}

export interface AppProps {
}

export type AppState = {
  loginData: {loggedIn:boolean, sessionId:string}
}

export default class App extends React.Component {

  readonly state: AppState;

  constructor(readonly props: AppProps) {
    super(props);
    this.state = {
      loginData: { loggedIn: false, sessionId: "" }
    };
  }

  componentDidMount() {
    getLocalData("loginData")
      .then(data => {
        if (data != null) this.state.loginData = JSON.parse(data);
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
    const loginData = this.state.loginData;
    return (
      <div className="AppDiv">
        {(loginData.loggedIn &&
          <GameComponent></GameComponent>
        )}
        {(!loginData.loggedIn &&
          <LoginMenuComponent></LoginMenuComponent>  
        )}
      </div>
    )
  }
}
