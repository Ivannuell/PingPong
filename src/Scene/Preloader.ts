

import Phaser from "phaser";
import WebFontLoader from 'webfontloader'

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
    this.load.image('scoreBar', "ScoreBar.png")
    this.load.image('ballMotion', "BallMotion.png")

    WebFontLoader.load({
      custom: {
        families: ['Teko']
      }
    })

  }

  create() {
    this.scene.switch('Game')
  }
}