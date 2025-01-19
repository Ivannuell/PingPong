import Phaser from "phaser";


export default class UserInterface extends Phaser.Scene {
  constructor() {
    super('UserInterface')
  }

  GameScene!: Phaser.Scene
  score1!: number

  init(data: Phaser.Scene) {
    this.GameScene = data

  }

  create() {

    const score1 = this.add.text(520, 100, '0', {
      color: 'white',
      fontSize: 40
    })
    const score2 = this.add.text(420, 100, '0', {
      color: 'white',
      fontSize: 40
    })


    this.GameScene.events.addListener('score', (scorrer: number, player1: number, player2: number) => {
      if (scorrer == 1) {
        score1.text = `${player1}`
      } else {
        score2.text = `${player2}`
      }

    }, this)
  }
}