import default_background from "./backgrounds/background_wall.png";
import archer_card from "./cardsPixel/archer.png";
import default_carpet from "./panels/background_glowingwire.png";
import default_layout from "./cardsLayouts/layout_hostel.png";
import background_smallwall from "./backgrounds/background_smallwall.png";
import texture_loop from "./backgrounds/looptexture.png";
import waveTexture from "./backgrounds/wavetexture.png";
import wavePanel from "./panels/panel_wave.png";
import settingsBg from "./backgrounds/settings.png";

export const backgroundsImgs: { [key:string]:string} = {
  "default": default_background,
  "smallwall": background_smallwall,
  "loopTexture": texture_loop,
  "settings": settingsBg,
  "waveTexture": waveTexture
}

export const cardsImgs: { [key:string]:string} = {
  "archer":archer_card
} 

export const carpetsImgs: { [key:string]:string} = {
  "default": default_carpet,
  "wavePanel": wavePanel
}

export const cardsLayoutsImgs: { [key:string]:string} = {
  default: default_layout
}