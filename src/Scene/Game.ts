import Phaser from "phaser";


export class Game extends Phaser.Scene {
  constructor() {
    super("Game")
  }

  create() {
    const board = this.add.image(400, 300, 'board')
    const ball = this.physics.add.image(400, 300, "ball")
    ball.setGravity(0, 200)
    // this.physics.add.existing(ball)


    const b_wall = this.physics.add.image(400, 540, 'player').setImmovable()
    b_wall.setAngle(90).refreshBody()
    
    

    this.physics.add.collider(ball, b_wall)

    
  }


  
}