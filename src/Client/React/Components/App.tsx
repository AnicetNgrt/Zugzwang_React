import React from 'react';
import './App.scss';
import GameComponent from './game/game.component';
import { getLocalData } from 'Client/client';

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
    getLocalData("loginData")
      .then(data => {
        if (data != null) this.state.loginData = JSON.parse(data);
      });
    
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {

    return (
      <div className="AppDiv">
        {(this.state.loginData.loggedIn &&
          <GameComponent></GameComponent>
        )} 
      </div>
    )
  }
}
