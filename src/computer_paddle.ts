import Phaser from "phaser";


export default class Computer_paddle extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, public ball: Phaser.GameObjects.Image, public direction: number) {
    super(scene, 910, 300, 'computer')

    this.addToDisplayList()
    this.addToUpdateList()
    scene.physics.add.existing(this)
    this.setImmovable()
  }

  private TRACKING_DISTANCE = 180
  private TRACKING_SPEED = 400

  update() {
    const ball_y = this.ball.y;
    const ball_x = this.ball.x;

    if (this.direction == -1) {
      this.setVelocityY(0)
      return
    }

    if (ball_y > this.y && (ball_x > this.TRACKING_DISTANCE)) {
      // this.y += 8
      this.setVelocityY(this.TRACKING_SPEED)
      if (this.y >= 600 + (this.getBottomCenter().y - this.getTopCenter().y) * 2) {
        this.setVelocityY(0)
      }
    } else if (ball_y < this.y && (ball_x > this.TRACKING_DISTANCE)) {
      // this.y -= 8
      this.setVelocityY(-this.TRACKING_SPEED)
      if (this.y <= 60 - (this.getBottomCenter().y - this.getTopCenter().y) * 2) {
        this.setVelocityY(0)
      }
    } else if (ball_x != this.TRACKING_DISTANCE) {
      this.setVelocityY(0)
    }

  }

  updateDir(dir: number) {
    this.direction = dir
  }
}