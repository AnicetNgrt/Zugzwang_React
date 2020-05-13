import Draggable from "react-draggable";
import React from "react";
import "./settingsmenutextinput.component.style.scss";

type TextInputProps = {
  onSubmit: (value: string) => void,
  emoji:string,
  text: string,
  submitText: string,
  position: { x: string, y: string },
  currentValue: string,
  regexpStr: string
}

export default class SettingsMenuTextInputComponent extends React.Component {
  
  readonly state: { value: string, valid:boolean };

  constructor(readonly props: TextInputProps) {
    super(props);
    this.state = {value: props.currentValue, valid:false};
  }

  componentWillReceiveProps(nextProps: TextInputProps) {
    if (nextProps.currentValue !== this.props.currentValue)
      this.setState({ value: nextProps.currentValue });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value });
    var re = new RegExp(this.props.regexpStr);
    if (re.test(event.target.value)) this.setState({valid: true });
    else this.setState({ valid: false });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if(this.state.valid) this.props.onSubmit(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <Draggable
      bounds="parent"
      handle=".emoji">
        <div className="SettingsMenuTextInputDiv" style={{
          top: this.props.position.y,
          left: this.props.position.x
        }}>
          <h1 className={"emoji"}>
            {this.props.emoji}
          </h1>
          <form onSubmit={e=>this.handleSubmit(e)} className="form">
            <label className={"text"}>
              {this.props.text}
              
            </label>
            <input className="input" type="text" value={this.state.value} onChange={e=>this.handleChange(e)} />
            {(this.state.valid && 
              <input className="submit" type="submit" value={this.props.submitText} />
            )}
          </form>
        </div>
      </Draggable>
    );
  }
}