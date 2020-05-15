import "./lobby.component.style.scss";
import React from "react";
import { backgroundsImgs } from "Client/Assets/Assets";
import LobbyButtonComponent from "./lobbybutton.component";
import Draggable from "react-draggable";
import LobbyCardSelectorComponent from "./lobbycardselector.component";
import { Card } from "Shared/Classes/GameObjects/Card";
import { RandomIdProvider } from "Shared/Classes/IdProviders/RandomIdProvider";
import { DisplacementCardTypes } from "Shared/Consts/DisplacementCardTypes";
import { Player } from "Shared/Classes/GameObjects/Player";
import CardDetailComponent from "../game/carddetail.component";
//import Draggable from 'react-draggable';

const idpr = new RandomIdProvider(4);

const rules = {
  maxPawn: 4,
  maxWeight: 10,
  boardSize: { x: 10, y: 15 },
  maxAp: 4
}

const availableCards: Card[][] = [[
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true)
],
[
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.knight(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.clockMaker(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.smallRivers(), 0, 0, idpr, true),
  new Card(DisplacementCardTypes.apollo(), 0, 0, idpr, true),
]];

export enum Status {
  HOST = "host",
  CLIENT = "client",
  LOCAL = "local"
}

type LobbyProps = {
  loc: Locs,
  locs: { [key: string]: Locs },
  onSceneRequest: (scene: string) => void,
  username: string,
  slots: number,
  local: boolean,
  status: string
};

type LobbyPlayer = {
  player: Player,
  local: boolean,
  ready: boolean,
  order: number
} | null

export const colors = [
  "#ac3232",
  "#3f3f74",
  "#37946e",
  "#8f563b",
  "#5b6ee1",
  "#76428a",
  "#df7126",
  "#d77bba"
]

export default class LobbyComponent extends React.Component {
  
  readonly state: {
    players: LobbyPlayer[],
    selectedCards: {color:string, card:Card}[]
  };
  cardRef: React.RefObject<HTMLDivElement>;
  
  constructor(readonly props:LobbyProps) {
    super(props);
    this.state = {
      players: [{
        player: new Player((any:any) => true, props.username, colors[0], 0, rules, idpr, rules.maxAp, false),
        local: true,
        ready: false,
        order: 1
      }],
      selectedCards: []
    }

    for (var i = 1; i < props.slots; i++) {
      this.state.players.push(null);
    }

    this.cardRef = React.createRef<HTMLDivElement>();
  }
  
  componentWillReceiveProps(nextProps: LobbyProps) {
    if (nextProps.username !== this.props.username) {
      const players = this.state.players;
      if(players[0]) players[0].player.name = nextProps.username;
      this.setState({ players: players });
    }
  }

  fillPlayerSlot(name: string, index: number, color: string, local:boolean) {
    const players = this.state.players;
    players.splice(index, 1, {
      player: new Player(cards => true, name, color, index, rules, idpr, rules.maxAp, false),
      local: local,
      ready: false,
      order: index + 1
    });
    this.setState({ players: players });
  }

  findAvailableColor(startingColor:string): string {
    var pass = true;
    var color = startingColor;
    do {
      pass = true;
      color = colors[(colors.indexOf(color) + 1) % colors.length];
      for (var player of this.state.players) {
        if (!player) break;
        if (player.player.color === color) pass = false;
      }
    } while (pass === false);
    return color;
  }

  allReady(): boolean {
    for (var p of this.state.players) {
      if (!p) return false;
      if (!p.ready) return false;
    }
    return true;
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
            {this.state.players.filter(p => (p == null || p.local)).map((v, i, a) => {
              if (!v) return (
                <div
                  className="AddPlayerSlot"
                  onClick={() => {
                    const color = this.findAvailableColor(colors[0]);
                    if(this.props.status === Status.LOCAL) this.fillPlayerSlot(this.props.loc["u"] +" "+ i, i, color, true);
                  }}
                >
                  <h1 className="AddPlus">+</h1>
                </div>
              );
              return (<div className="PlayerSlot">
                <h1
                  className="Player"
                  style={{ backgroundColor: v.player.color }}
                  onClick={() => {
                    v.player.color = this.findAvailableColor(v.player.color);
                    if(this.props.status === Status.LOCAL) this.setState({ players: a });
                  }}
                >
                  {(v ? v.player.name : "-----------")}
                </h1>
                <h1
                  className={"PlayFirst" + (v.order !== 1 ? " SecondPlayer" : "")}
                  onClick={() => {
                    if (this.props.status === Status.LOCAL) {
                      const order = v.order;
                      for (var p of a) {
                        if (p && p.order === 1) p.order = order; 
                      }
                      v.order = 1;
                      this.setState({ players: a });
                    }
                  }}
                >{v.order !== 1 ? "→ " + this.props.loc["r"] : this.props.loc["s"]}
                </h1>
                <h1 className={"Ready"+(v.local ? " Toggable":"")+(v.ready ? " Toggled":"")}
                  onClick={() => {
                    if (v.local && this.props.status === Status.LOCAL) {
                      v.ready = !v.ready;
                      this.setState({ players: a });
                    }
                  }}>
                  {v.ready ? this.props.loc["q"] : (v.local ? this.props.loc["p"] : this.props.loc["t"])}
                </h1>
              </div>);
            })}
        </div>
      </Draggable>
      
      {(this.state.players.filter(p => (p != null && p.local)).map((p, i, a) => {
        if (!p) return (<div></div>);
        return (
          <LobbyCardSelectorComponent
            loc={this.props.loc}
            username={p.player.name}
            hand={Array.from(p.player.hand.values())}
            color={p.player.color}
            available={
              [
                ...Array.from(p.player.hand.values()),
                ...availableCards[i].filter(card => !(p.player.hand.has(card)) && p.player.canAddCard(card)),
                ...availableCards[i].filter(card => !(p.player.hand.has(card)) && !p.player.canAddCard(card))
              ]
            }
            position={{ top: '23vh', left: (42.5 + (i * (48 / a.length))) + 'vw' }}
            width={(48 / a.length) + "vw"}
            weight={p.player.getHandWeight()}
            maxWeight={rules.maxWeight}
            onCardSeen={(card: Card) => {
              if (this.state.selectedCards.indexOf({card:card, color:"red"}) !== -1) return;
              this.setState({ selectedCard: this.state.selectedCards.push({card:card, color:p.player.color})});
            }}
            onCardStartHover={(card: Card) => {this.setState({hoveredCard:card})}}
            onCardEndHover={(card: Card) => { this.setState({ hoveredCard: null }) }}
            onSelect={(card: Card) => {
              const players = this.state.players;
              if (p.player.hand.has(card)) {
                p.player.removeCard(card);  
              } else if (p.player.canAddCard(card)) {
                p.player.addCard(card);
              }
              players.splice(i, 1, p);
              if(this.props.status === Status.LOCAL) this.setState({ players: players });
            }}
            selectable={(card:Card)=> (p.player.canAddCard(card))}
          ></LobbyCardSelectorComponent>
        )
      }))}

      <LobbyButtonComponent
        text={this.props.loc["n"]}
        emoji={"↩"} position={{ x: '1%', y: '2%' }}
        onClick={() => { this.props.onSceneRequest("back");}}
        ></LobbyButtonComponent>
        
        {(this.props.status === Status.LOCAL && this.allReady()) &&
          <LobbyButtonComponent
          text={this.props.loc["v"]}
          emoji={"▷"} position={{ x: '78%', y: '2%' }}
          onClick={() => { this.props.onSceneRequest("back");}}
          ></LobbyButtonComponent>
      }

      {this.state.selectedCards.length > 0 && 
          this.state.selectedCards.map((v, i, a) => (
            this.state.players.map(p => (
              p.player.color === v.color &&
              <CardDetailComponent
                loc={this.props.loc}
                cardRef={this.cardRef}
                color={p.player.color}
                card={v.card}
                owner={p.player}
                onActionSelected={()=>{}}
                onClickOutside={() => {
                this.setState({
                  selectedCard: (() => {
                    const selected = this.state.selectedCards;
                    delete selected[i];
                    return selected;
                })()});
              }}></CardDetailComponent>
            ))
          ))
      }
    </div>  
    )
  }
}

//<BsComponent strength={10} color='black'></BsComponent>