

import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super()
  }


  preload() {
    this.load.setBaseURL('public/assets/arts/')


    this.load.image('ball', "Ball.png")
    this.load.image('player', "Player.png")
    this.load.image('computer', "Computer.png")
    this.load.image('board', "Board.png")
  }
}