import { Howl, Howler } from "howler";
const menuTheme = require("./Into Uncertainty - JAY MAN.ogg");
const moveSound = require("./PAWN MOVEMENT/movementSound3.mp3");
const daggerSound = require("./SNEAKY DAGGERS/attackEffect.mp3");
const cardOpenSound = require("./CARD HANDLING/cardSlide1.mp3");
const cardOpenSound2 = require("./CARD HANDLING/cardSlide2.mp3");
const endTurn = require("./nextTurn.mp3");
const startTurn = require("./startTurn.mp3");
const startGame = require("./ilodJAYMAN_edit_startGame.mp3");
const selectNeutral = require("./UI/select.mp3");
const selectCancel = require("./UI/cancel.mp3");
const selectPositive = require("./UI/valid.mp3");


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
}