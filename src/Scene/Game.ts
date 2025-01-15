import Phaser from "phaser";
import { keyBindings } from "../types";
import Computer_paddle from "../computer_paddle";


export class Game extends Phaser.Scene {
  constructor() {
    super("Game")
  }

  key_conf = {
    UP: Phaser.Input.Keyboard.KeyCodes.W,
    DOWN: Phaser.Input.Keyboard.KeyCodes.S
  }

  KEYS!: keyBindings;
  player_paddle!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  comp!: Computer_paddle


  b_wall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody
  t_wall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody
  r_wall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody
  l_wall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody
  ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  board!: Phaser.GameObjects.Image

  SPEED = 300
  ACELERATION = 20
  DIRECTION = 1

  upMotion!: Phaser.Math.Vector2
  downMotion!: Phaser.Math.Vector2
  rightMotion!: Phaser.Math.Vector2
  leftMotion!: Phaser.Math.Vector2


  create() {
    this.board = this.add.image(0, 60, 'board').setOrigin(0).setScale(1.2, 1.2)
    this.ball = this.physics.add.image(400, 300, 'ball')

    this.player_paddle = this.physics.add.image(50, 300, 'player').setImmovable()

    this.ball.setVelocity(this.SPEED)

    this.b_wall = this.physics.add.staticImage(480, 625, 'player').setAlpha(0)
    this.t_wall = this.physics.add.staticImage(480, 30, 'player').setAlpha(0)
    this.r_wall = this.physics.add.staticImage(985, 300, 'player').setAlpha(0)
    this.l_wall = this.physics.add.staticImage(-25, 300, 'player').setAlpha(0)

    this.b_wall.body.setSize(960, 50)
    this.t_wall.body.setSize(960, 60)
    this.r_wall.body.setSize(50, 600)
    this.l_wall.body.setSize(50, 600)

    this.player_paddle.setOrigin(0)
    this.ball.setCircle(15)

    this.comp = new Computer_paddle(this, this.ball, this.DIRECTION)

    this.physics.add.collider(this.ball, [this.b_wall], () => {
      this.ball.setVelocity(this.upMotion.x, this.upMotion.y)
      this.ACELERATION += 10
      this.SPEED += 5

    })
    this.physics.add.collider(this.ball, [this.t_wall], () => {
      this.ball.setVelocity(this.downMotion.x, this.downMotion.y)
      this.ACELERATION += 10
      this.SPEED += 5

    })
    this.physics.add.collider(this.ball, [this.comp, this.r_wall], () => {
      this.ball.setVelocity(this.leftMotion.x, this.leftMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = -1;
      this.comp.updateDir(this.DIRECTION)
      
    })
    this.physics.add.collider(this.ball, [this.player_paddle, this.l_wall], () => {
      this.ball.setVelocity(this.rightMotion.x, this.rightMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = 1
      this.comp.updateDir(this.DIRECTION)
    })

    this.KEYS = this.input.keyboard?.addKeys(this.key_conf) as keyBindings



  }

  update() {
    this.upMotion = new Phaser.Math.Vector2(this.SPEED * this.DIRECTION, -this.SPEED)
    this.downMotion = new Phaser.Math.Vector2(this.SPEED * this.DIRECTION, this.SPEED)
    this.rightMotion = new Phaser.Math.Vector2(this.SPEED + this.ACELERATION, this.SPEED)
    this.leftMotion = new Phaser.Math.Vector2(-this.SPEED - this.ACELERATION, this.SPEED)

    const paddle_size = this.player_paddle.getBottomCenter().y - this.player_paddle.getTopCenter().y

    if (this.KEYS.UP.isDown) {
      if (this.player_paddle.y <= 60) {
        this.player_paddle.y = 60;
        return
      }
      this.player_paddle.y -= 10
    }

    if (this.KEYS.DOWN.isDown) {
      if (this.player_paddle.y >= 600 - paddle_size) {
        this.player_paddle.y = 600 - paddle_size
        return
      }
      this.player_paddle.y += 10
    }

    // if (this.trigger) {
    //   this.comp.y += 8
    //   if (this.comp.y >= 500) this.trigger = false
    // } else {
    //   this.comp.y -= 8
    //   if (this.comp.y <= 100) this.trigger = true
    // }

    this.comp.update()

    

  }

}