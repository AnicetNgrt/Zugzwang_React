import archer_card from "./cardsPixel/archer.png";
import smallRivers_card from "./cardsPixel/petitsRuisseaux.png";
import knight_card from "./cardsPixel/cavalier.png";
import clock_card from "./cardsPixel/horloger.png";
import apollo_card from "./cardsPixel/apollo.png";
import contact_card from "./cardsPixel/contact.png";

import default_carpet from "./panels/background_glowingwire.png";
import default_background from "./backgrounds/background_wall.png";
import texture_loop from "./backgrounds/looptexture.png";
import waveTexture from "./backgrounds/wavetexture.png";
import background_smallwall from "./backgrounds/background_smallwall.png";
import game from "./backgrounds/background_game.png";
import settingsBg from "./backgrounds/settings.png";
import lobby from "./backgrounds/lobby.png";

import default_layout from "./cardsLayouts/layout_hostel.png";

import wavePanel from "./panels/panel_wave.png";
import paintingPanel from "./panels/panel_painting.png";
import cloud_carpet from "./panels/cloud_panel.png";
import cloud_carpetB from "./panels/cloud_panelB.png";

import basic_pawn from "./pawns/basic_pawn.png";

import stab_anim from "./anims/stab_anim.png";


export const backgroundsImgs: { [key:string]:string} = {
  "default": default_background,
  "smallwall": background_smallwall,
  "loopTexture": texture_loop,
  "settings": settingsBg,
  "waveTexture": waveTexture,
  "lobby": lobby,
  "game": game
}

export const cardsImgs: { [key:string]:string} = {
  "archer": archer_card,
  "small rivers": smallRivers_card,
  "clockmaker": clock_card,
  "knight": knight_card,
  "apollo": apollo_card,
  "sneaky daggers": contact_card
} 

export const carpetsImgs: { [key:string]:string} = {
  "default": default_carpet,
  "wavePanel": wavePanel,
  "paintingPanel": paintingPanel,
  "cloudPanel": cloud_carpet,
  "cloudPanelB": cloud_carpetB
}

export const cardsLayoutsImgs: { [key:string]:string} = {
  default: default_layout
}

export const pawns: { [key: string]: string } = {
  "basic":basic_pawn
}

export const anims: { [key: string]: string } = {
  "stab_anim": stab_anim
}