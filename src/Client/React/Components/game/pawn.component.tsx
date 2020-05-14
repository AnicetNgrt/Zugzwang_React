import './pawn.component.style.scss';
import { Pawn } from 'Shared/Classes/GameObjects/Pawn';
import React from 'react';
import { ReactImageTint } from 'react-image-tint';

type PawnProps = {
  picture: string,
  top: number,
  left: number,
  directed: boolean,
  color: string,
  onClick: () => void,
  selected: boolean,
  pawn:Pawn
}

export default class PawnComponent extends React.Component {
  ref: React.RefObject<HTMLDivElement>;

  constructor(readonly props: PawnProps) {
    super(props);
    this.ref = React.createRef<HTMLDivElement>();
  }

  render() {
    return (
      <div ref={this.ref} className={"PawnDiv"+(this.props.selected ? " Selected" : "")}
        style={{
          top: (this.props.selected ? ("calc("+this.props.top+"px - 1vw)") : this.props.top+"px"),
          left: this.props.left + "px",
          zIndex: Math.floor(this.props.top/10)
        }}>
        <div className="PawnPics" onClick={() => {
            this.props.onClick();
          }}> 
          <div className="ImgShadow"></div>
          <img className="PawnIllustration" src={this.props.picture} alt="">
          </img>
          
          <ReactImageTint src={this.props.picture} color={this.props.color} />     
          <h1>{this.props.pawn.id}</h1>
        </div>
      </div>
    )
  }
}