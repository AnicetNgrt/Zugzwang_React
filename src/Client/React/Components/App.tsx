import React from 'react';
import './App.scss';
import GameComponent from './game/game.component';
import loginData from "../../LocalStorage/loginData.json";

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
      loginData: loginData
    }
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
