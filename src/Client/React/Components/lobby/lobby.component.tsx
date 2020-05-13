import "./lobby.component.style.scss";
import React from "react";
import { backgroundsImgs } from "Client/Assets/Assets";
import LobbyButtonComponent from "./lobbybutton.component";
import LobbyTextInputComponent from "./lobbytextinput.component";
import LobbyListComponent from "./lobbylist.component";
import LobbySwitchComponent from "./lobbyswitch.component";
import Draggable from "react-draggable";
import LobbyCardSelectorComponent from "./lobbycardselector.component";
//import Draggable from 'react-draggable';

type LobbyProps = {
  loc: Locs,
  locs: { [key: string]: Locs },
  resolutions: { [key: string]: string },
  onSceneRequest: (scene: string) => void,
  onSettingChange: (name: string, value: any) => void,
  username: string,
  slots: number
};

type LobbyPlayer = {
  username: string,
  color: string
}

const colors = [
  "#ac3232",
  "#3f3f74",
  "#37946e",
  "#8f563b"
]

export default class LobbyComponent extends React.Component {
  
  readonly state: {
    players: LobbyPlayer[]
  };
  
  constructor(readonly props:LobbyProps) {
    super(props);
    this.state = {
      players: [{
        username: props.username,
        color: colors[0]
      }, {
        username: "Antonio",
        color: colors[1]
      }]
    }

    for (var i = 1; i < props.slots; i++) {
      this.state.players.push({ username: "", color: "black" });
    }
  }
  
  componentWillReceiveProps(nextProps: LobbyProps) {
    if (nextProps.username !== this.props.username) {
      const players = this.state.players;
      players[0].username = nextProps.username;
      this.setState({ players: players });
    }
  }

  render() {

    return (
    <div className="LobbyDiv"
      style={{
        backgroundColor:'black'
      }}>
      <img className="LobbyBackground" src={backgroundsImgs.lobby} alt=""></img>
      <Draggable
        bounds="parent"
        handle=".PlayersTitle"
      >
        <div className="Players">
          <h1 className="PlayersTitle">{this.props.loc["m"]}</h1>
          {Array.from(this.state.players.values()).map((v, i, a) => (
            <div
              className="PlayerSlot"
              style={{ backgroundColor: v.color }}
              onClick={() => {
                var pass = true;
                var color = a[i].color;
                do {
                  pass = true;
                  color = colors[(colors.indexOf(color) + 1) % colors.length];
                  for (var player of a) {
                    if (player.color === color) pass = false;
                  }
                } while (pass === false);
                a[i].color = color;
                this.setState({ players: a });
              }}
            >
              <h1 className="Player">{v.username}</h1>
            </div>
          ))}
        </div>
      </Draggable>
      
      <LobbyCardSelectorComponent
        loc={this.props.loc}    
      ></LobbyCardSelectorComponent>

      <LobbyButtonComponent
        text={this.props.loc["n"]}
        emoji={"↩"} position={{ x: '1%', y: '2%' }}
        onClick={() => { this.props.onSceneRequest("back");}}
      ></LobbyButtonComponent>
    </div>  
    )
  }
}

//<BsComponent strength={10} color='black'></BsComponent>