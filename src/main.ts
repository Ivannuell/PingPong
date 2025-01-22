import Phaser from "phaser";

import { Preloader } from "./Scene/Preloader";
import { Game } from "./Scene/Game";
import UserInterface from "./Scene/GameInterface";



const config: Phaser.Types.Core.GameConfig = {
  width: 960,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
  scene: [
    Preloader,
    Game,
    UserInterface
  ]

}


new Phaser.Game(config)