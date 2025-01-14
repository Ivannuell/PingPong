import Phaser from "phaser";

import { Preloader } from "./Scene/Preloader";
import { Game } from "./Scene/Game";



const config: Phaser.Types.Core.GameConfig = {
  width: 960,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [
    Preloader,
    Game
  ]

}


new Phaser.Game(config)