import "./loginmenu.component.style.scss";
import React from "react";
import { carpetsImgs } from "Client/Assets/Assets";
import Draggable from 'react-draggable';
import LoginMenuButtonComponent from "./loginmenubutton.component";

type LoginMenuProps = {
  loc: Locs,
  currentUsername: string,
  onLogin: (username: string) => void
};

type LoginMenuState = {
  username: string
};

export default class LoginMenuComponent extends React.Component<LoginMenuProps, LoginMenuState> {
  constructor(readonly props: LoginMenuProps) {
    super(props);
    const seed = props.currentUsername && props.currentUsername !== "anonymous"
      ? props.currentUsername
      : "";
    this.state = { username: seed };
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = this.state.username.trim();
    if (value.length === 0) return;
    this.props.onLogin(value);
  }

  handleGuest() {
    const guestId = Math.floor(Math.random() * 9000 + 1000);
    this.props.onLogin(`${this.props.loc.u || "Guest"}#${guestId}`);
  }

  render() {
    const canSubmit = this.state.username.trim().length > 0;
    return (<div className="LoginMenuDiv"
      style={{
        backgroundRepeat: 'repeat'
      }}>
      <img className="LoginBackgroundImg" src={carpetsImgs.wavePanel} alt=""></img>
      <Draggable
      bounds="parent"
      >
        <h1 className="GameTitle">Path<span className="Subtitle">erns</span></h1>
      </Draggable>

      <form className="LoginForm" onSubmit={e => this.handleSubmit(e)}>
        <label className="LoginLabel">
          {this.props.loc.h || "Username"}
        </label>
        <input
          className="LoginInput"
          type="text"
          value={this.state.username}
          onChange={e => this.handleChange(e)}
          placeholder={this.props.loc.h || "Username"}
          autoFocus
        />
        <button
          className="LoginSubmit"
          type="submit"
          disabled={!canSubmit}
        >
          {this.props.loc.loginSubmit || "Log in"}
        </button>
      </form>

      <LoginMenuButtonComponent
        text={this.props.loc.loginGuest || "Continue as Guest"}
        emoji={"⨝"}
        position={{ x: '13%', y: '70%' }}
        onClick={() => this.handleGuest()}
      ></LoginMenuButtonComponent>
    </div>)
  }
}
