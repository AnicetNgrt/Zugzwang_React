import "./settingsmenuswitch.component.style.scss";
import Draggable from "react-draggable";
import React from "react";
import BsComponent from "../game/bs.component";

type SwitchProps = {
  emoji: string,
  text: string,
  position: { x: string, y: string },
  toggled: boolean,
  onClick: (state: boolean) => void
}

export default class SettingsMenuSwitchComponent extends React.Component {
  
  readonly state: { toggled: boolean };

  constructor(readonly props: SwitchProps) {
    super(props);
    this.state = { toggled: props.toggled };
  }

  componentWillReceiveProps(nextProps: SwitchProps) {
    if (nextProps.toggled !== this.props.toggled)
      this.setState({ toggled: nextProps.toggled });
  }
  
  render() {
    return (
      <Draggable
        bounds="parent"
       handle=".emoji">
        <div className="SettingsMenuSwitchDiv" style={{
          top: this.props.position.y,
          left: this.props.position.x
        }}>
          <h1 className={"emoji"}>
            {this.props.emoji}
          </h1>
          <h1 className={"text"} onClick={() => {
            this.setState({ toggled: !this.state.toggled });
            this.props.onClick(!this.state.toggled);
          }}>
            {" " + this.props.text}
            <div className="switchDiv">
              <div className={"switchCircle" + (this.state.toggled ? " on" : " off")}></div>
              {(!this.state.toggled &&
                <BsComponent strength={1} color={"black"}></BsComponent>
                )}
            </div>
          </h1>
        </div>
      </Draggable>
    )
  }

}