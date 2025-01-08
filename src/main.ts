import Phaser from "phaser";

import { Preloader } from "./Scene/Preloader";



const config: Phaser.Types.Core.GameConfig = {
  width: 1280,
  height: 720,
  scene: [
    Preloader,
    Game
  ]

}


const game = new Phaser.Game(config)