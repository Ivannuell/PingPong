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

  score_1 = 0
  score_2 = 0

  justScored = false

  ballMotion! : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  create() {

    this.board = this.add.image(0, 60, 'board').setOrigin(0).setScale(1.2, 1.2)
    this.ball = this.physics.add.image(400, 300, 'ball')


    this.ballMotion = this.physics.add.image(this.ball.x, this.ball.y, "ballMotion").setBelow(this.ball)
    this.ballMotion.setDisplayOrigin(this.ballMotion.width, 0)
    this.ballMotion.setAlpha(0.3)
    // this.ballMotion.setAngle(90)

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
    this.ball.setMaxVelocity(700)

    this.comp = new Computer_paddle(this, this.ball, this.DIRECTION)

    this.physics.add.collider(this.ball, [this.b_wall], () => {
      this.ball.setVelocity(this.upMotion.x, this.upMotion.y)
      this.ACELERATION += 10
      this.SPEED += 5
      this.ballMotion.setAlpha(0.3)

    })
    this.physics.add.collider(this.ball, [this.t_wall], () => {
      this.ball.setVelocity(this.downMotion.x, this.downMotion.y)
      this.ACELERATION += 10
      this.SPEED += 5
      this.ballMotion.setAlpha(0.3)

    })
    this.physics.add.collider(this.ball, [this.comp], () => {
      this.ball.setVelocity(this.leftMotion.x - 100, this.leftMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = -1;
      this.comp.updateDir(this.DIRECTION)
      this.ballMotion.setAlpha(1)

    })
    this.physics.add.collider(this.ball, [this.player_paddle], () => {
      this.ball.setVelocity(this.rightMotion.x + 100, this.rightMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = 1
      this.comp.updateDir(this.DIRECTION)
      this.ballMotion.setAlpha(1)
    })

    this.physics.add.collider(this.ball, this.l_wall, () => {
      this.ball.setVelocity(this.rightMotion.x, this.rightMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = 1
      this.comp.updateDir(this.DIRECTION)
      this.updateScore(1)
      this.ballMotion.setAlpha(0.3)
    })
    
    this.physics.add.collider(this.ball, this.r_wall, () => {
      this.ball.setVelocity(this.leftMotion.x, this.leftMotion.y * Phaser.Math.FloatBetween(-1, 1))
      this.DIRECTION = -1;
      this.comp.updateDir(this.DIRECTION)
      this.updateScore(2)
      this.ballMotion.setAlpha(0.3)
    })

    this.KEYS = this.input.keyboard?.addKeys(this.key_conf) as keyBindings
    this.scene.run('GameInterface', this).setVisible(true)

  }


  prevY = 0
  prevX = 0

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

    this.comp.update()


    const p1 = new Phaser.Math.Vector2(this.prevX, this.prevY)
    const p2 = new Phaser.Math.Vector2(this.ball.x, this.ball.y )

    this.ballMotion.setPosition(this.ball.x, this.ball.y)
    this.ballMotion.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p1, p2)) + 45)
    // this.ballMotion.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p1, p2)) + 45)


    // console.log('x - ', this.ball.getLocalTransformMatrix().e, ' y - ', this.ball.getLocalTransformMatrix().
    this.prevY = this.ball.y
    this.prevX = this.ball.x


  }



  updateScore(Scorrer: number): void {
    if (Scorrer == 1) {

      if (!this.justScored) {
        this.score_1 += 1
        this.justScored = true
      }

      if (this.ball.x < 850) {
        this.justScored = false
      }


    } else {
      if (!this.justScored) {
        this.score_2 += 1
        this.justScored = true
      }

      if (this.ball.x > 150) {
        this.justScored = false
      }

    }

    this.events.emit('score', Scorrer, this.score_1, this.score_2)

    console.log('PLAYER 1 = ', this.score_1)
    console.log('COMP = ', this.score_2)
  }

}