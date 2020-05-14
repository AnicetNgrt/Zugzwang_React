import React from "react";
import "./lobbycardselector.component.style.scss";
import Draggable from "react-draggable";
import { Card } from "Shared/Classes/GameObjects/Card";
import CardComponent from "../game/card.component";

export default class LobbyCardSelectorComponent extends React.Component {

  readonly state: { selected: Card[], clicked:Card|null };

  constructor(readonly props: {
    loc: Locs,
    username: string,
    color: string,
    available: Card[],
    hand: Card[],
    position: { top: string, left: string },
    width: string,
    weight: number,
    maxWeight: number,
    onCardSeen: (card: Card) => void,
    onCardStartHover: (card: Card) => void,
    onCardEndHover: (card: Card) => void,
    selectable: (card: Card) => boolean,
    onSelect: (card: Card) => void
  }) {
    super(props);
    this.state = {
      selected: [],
      clicked: null
    }
  }

  render() {
    return (
      <Draggable
        bounds="parent"
        handle=".SelectorHead">
        <div
          className={"LobbyCardSelectorDiv"}
          style={{ width: this.props.width, top: this.props.position.top, left: this.props.position.left }}>
          <div className="SelectorHead" style={{backgroundColor:this.props.color+'a6'}}>
            <div className="Left">
              <h1 className="SelectorTitle">{this.props.username}</h1>
              <h1 className="SelectorInstructions">{this.props.loc["o"]}</h1>
            </div>
            <h1 className="weight"><span style={{fontSize:'1vw', verticalAlign:'top'}}>{"w "}</span>{this.props.weight+"/"+this.props.maxWeight}</h1>
          </div>
          <div className="SelectorBody">
            {(this.props.available.map((card, index, a) => {
              return (
                <div className="CardContainer">
                  {(this.state.clicked === card &&
                    <div className={"ClickedCard"} style={{boxShadow:(this.props.hand.indexOf(card) !== -1 ? "0 0 0.5vw white" : "none")}}>
                    <div className={"CardButton SelectButton" + ((this.props.selectable(card) || this.props.hand.indexOf(card) !== -1) ? "" : " NotSelectable")}
                      onClick={() => { this.props.onSelect(card); this.setState({ clicked: null }); }}
                    >{(this.props.hand.indexOf(card) !== -1 ? "- " : "+ ")}<span className="CardWeight">{card.type.data.weight+"w"}</span></div>
                    <div
                      className={"CardButton SeeButton" + ((this.props.selectable(card) || this.props.hand.indexOf(card) !== -1) ? "" : " NotSelectable")}
                      onClick={()=>this.props.onCardSeen(card)}
                    >⋯</div>
                      <div className={"CardButton DeSelectButton"} onClick={()=>this.setState({clicked:null})}>↩</div>
                    </div>
                  )}
                  {(this.state.clicked !== card &&
                    <CardComponent
                      card={card}
                      selected={this.props.hand.indexOf(card) !== -1}
                      onClick={() => (this.state.clicked === card ? this.setState({ clicked: null }) : this.setState({ clicked: card }))}
                      selectable={this.props.selectable(card)}
                      arrow={'⨀'}
                      onStartHover={() => this.props.onCardStartHover(card)}
                      onEndHover={() => this.props.onCardEndHover(card)}
                    ></CardComponent>
                  )}
                </div>
              )
            }))}
          </div>
        </div>
      </Draggable>
    )
  }
}