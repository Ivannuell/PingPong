import Phaser from "phaser";


export default class GameInterface extends Phaser.Scene {
  constructor() {
    super('GameInterface')
  }

  GameScene!: Phaser.Scene
  score1!: number

  init(data: Phaser.Scene) {
    this.GameScene = data

  }

  create() {
    this.add.image(180, 25, 'scoreBar').setScale(1.5, 1.5)
    this.add.image(780, 25, 'scoreBar').setScale(1.5, 1.5).setFlipX(true)

    const score2 = this.add.text(340, 15, '0', {
      color: 'white',
      fontSize: 40
      , fontFamily: 'Teko'
    })
    const score1 = this.add.text(600, 15, '0', {
      color: 'white',
      fontSize: 40
      , fontFamily: 'Teko'
    })


    this.add.text(480, 15, 'Time', {
      color: 'white',
      fontSize: 20
      , fontFamily: 'Teko'
    }).setOrigin(0.5, 0.5)

    this.add.text(480, 40, '0:00', {
      color: 'white',
      fontSize: 30
      , fontFamily: 'Teko'
    }).setOrigin(0.5, 0.5)



    this.GameScene.events.addListener('score', (scorrer: number, player1: number, player2: number) => {
      if (scorrer == 1) {
        score1.text = `${player1}`
      } else {
        score2.text = `${player2}`
      }

    }, this)
  }
}