

import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preload")
  }


  preload() {
    this.load.setPath('public/assets/arts')

    this.load.image('ball', "Ball.png")
    this.load.image('computer', "Player.png")
    this.load.image('player', "Computer.png")
    this.load.image('board', "Board.png")
  }

  create() {
    this.scene.switch('Game')
  }
}