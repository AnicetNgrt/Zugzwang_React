import { Howl } from "howler";
import menuTheme from "./Into Uncertainty - JAY MAN.ogg";
import moveSound from "./PAWN MOVEMENT/movementSound3.mp3";
import daggerSound from "./SNEAKY DAGGERS/attackEffect.mp3";
import cardOpenSound from "./CARD HANDLING/cardSlide1.mp3";
import cardOpenSound2 from "./CARD HANDLING/cardSlide2.mp3";
import endTurn from "./nextTurn.mp3";
import startTurn from "./startTurn.mp3";
import startGame from "./ilodJAYMAN_edit_startGame.mp3";
import selectNeutral from "./UI/select.mp3";
// (selectCancel and selectPositive previously required separate files but the original
//  code aliased them all to selectNeutral; preserved that behaviour below.)

export const sounds: any = {
  menuTheme: new Howl({
    src: [menuTheme],
    loop: false,
    volume: 0
  }),
  moveSound: new Howl({
    src: [moveSound],
    loop: false,
    volume: 0.5
  }),
  daggerSound: new Howl({
    src: [daggerSound],
    loop: false,
    volume: 0.5
  }),
  cardOpenSound: new Howl({
    src: [cardOpenSound],
    loop: false,
    volume: 0.5
  }),
  cardOpenSound2: new Howl({
    src: [cardOpenSound2],
    loop: false,
    volume: 0.5
  }),
  cardPlayValid: new Howl({
    src: [cardOpenSound2],
    loop: false,
    volume: 0.5
  }),
  cardPlayNotValid: new Howl({
    src: [cardOpenSound2],
    loop: false,
    volume: 0.5
  }),
  endTurn: new Howl({
    src: [endTurn],
    loop: false,
    volume: 0.6
  }),
  startGame: new Howl({
    src: [startGame],
    loop: false,
    volume: 0
  }),
  startTurn: new Howl({
    src: [startTurn],
    loop: false,
    volume: 0.2
  }),
  selectNeutral: new Howl({
    src: [selectNeutral],
    loop: false,
    volume: 0.5
  }),
  selectPositive: new Howl({
    src: [selectNeutral],
    loop: false,
    volume: 0.5
  }),
  selectCancel: new Howl({
    src: [selectNeutral],
    loop: false,
    volume: 0.5
  }),
};
