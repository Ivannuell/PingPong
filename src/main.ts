import Phaser from "phaser";

import { Preloader } from "./Scene/Preloader";
import { Game } from "./Scene/Game";



const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [
    Preloader,
    Game
  ]

}


new Phaser.Game(config)