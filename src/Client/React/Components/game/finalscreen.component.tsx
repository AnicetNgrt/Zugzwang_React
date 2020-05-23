import React from "react";
import "./finalscreen.component.style.scss";
import { Player } from "Shared/Classes/GameObjects/Player";
import { tween, easing } from "popmotion";

export default class FinalScreenComponent extends React.Component {

  readonly state: {lineW:number};

  constructor(readonly props: {
    loc:Locs,
    player: Player,
    onExit:()=>void
  }) {
    super(props);
    this.state = {
      lineW: 0
    }
  }

  componentDidMount() {
    tween({ from: 0, to: 100, duration: 4000, ease: easing.easeInOut }).start({
      update: (v: any) => {
        this.setState({ lineW: v });
      }
    });
  }


  render() {
    return (
      <div className="FinalScreenDiv" style={{backgroundColor:this.props.player.color+"55"}}>
        <div className="FsLine" style={{
          width: this.state.lineW + "vw"
        }}></div>
        <div className="WinTitle">
          <h1 className="WinTitlePlayerName">{this.props.player.name}</h1>
          <h1 className="WinTitleSub">{this.props.loc["8"]}</h1>
        </div>
        <div className="WinExitButton"
        onClick={()=>this.props.onExit()}>{this.props.loc["9"]}</div>
      </div>
    )
  }
}