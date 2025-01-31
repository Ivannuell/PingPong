import Phaser from "phaser";
import { keyBindings } from "../types";
import Computer_paddle from "../core/computer_paddle";
import { Ball } from "../core/Ball";
import { ACELERATION, SPEED } from "../constants";


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
  ball!: Ball
  board!: Phaser.GameObjects.Image

  DIRECTION = 1
  TIME_LIMIT = 5

  upMotion!: Phaser.Math.Vector2
  downMotion!: Phaser.Math.Vector2
  rightMotion!: Phaser.Math.Vector2
  leftMotion!: Phaser.Math.Vector2

  score_1 = 0
  score_2 = 0

  justScored = false

  ballMotion!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  timer!: Phaser.Time.TimerEvent

  create() {

    this.board = this.add.image(0, 60, 'board').setOrigin(0).setScale(1.2, 1.2)
    this.ball = new Ball(this)
    this.ball.setVelocity(SPEED)
    this.ball.setMaxVelocity(700)

    this.ballMotion = this.physics.add.image(this.ball.x, this.ball.y, "ballMotion")
    this.ballMotion.setDisplayOrigin(this.ballMotion.width, 0)
    this.ballMotion.setAlpha(0.3)
    // this.ballMotion.setAngle(90)

    this.player_paddle = this.physics.add.image(50, 300, 'player').setImmovable()

    this.b_wall = this.physics.add.staticImage(480, 625, 'player').setAlpha(0)
    this.t_wall = this.physics.add.staticImage(480, 30, 'player').setAlpha(0)
    this.r_wall = this.physics.add.staticImage(985, 300, 'player').setAlpha(0)
    this.l_wall = this.physics.add.staticImage(-25, 300, 'player').setAlpha(0)

    this.b_wall.body.setSize(960, 50)
    this.t_wall.body.setSize(960, 60)
    this.r_wall.body.setSize(50, 600)
    this.l_wall.body.setSize(50, 600)

    this.player_paddle.setOrigin(0)

    this.comp = new Computer_paddle(this, this.ball, this.DIRECTION)

    this.physics.add.collider(this.ball, [this.b_wall], () => {
      this.ball.setVelocity(this.upMotion.x, this.upMotion.y)
      this.ballMotion.setAlpha(0.3)

    })

    this.physics.add.collider(this.ball, [this.t_wall], () => {
      this.ball.setVelocity(this.downMotion.x, this.downMotion.y)
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


    this.timer = this.time.addEvent({
      // loop: true,
      delay: 1000,
      callback: () => {
        console.log(this.TIME_LIMIT);
        this.TIME_LIMIT -= 1
      },
      repeat: 5,

    })

    // console.log(this.ball)

    this.t_wall!.body.onCollide = true
    this.physics.world.on('collide', (object1, object2, body1, body2) => {
      if (object2 == this.t_wall) {
        this.ball.setVelocity(this.downMotion.x, this.downMotion.y)
        this.ballMotion.setAlpha(0.3)
      }
    })

  }


  update() {

    this.upMotion = new Phaser.Math.Vector2(SPEED * this.DIRECTION, -SPEED)
    this.downMotion = new Phaser.Math.Vector2(SPEED * this.DIRECTION, SPEED)
    this.rightMotion = new Phaser.Math.Vector2(SPEED + ACELERATION, SPEED)
    this.leftMotion = new Phaser.Math.Vector2(-SPEED - ACELERATION, SPEED)

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

    const p1 = new Phaser.Math.Vector2(this.ball.deltaPos.x, this.ball.deltaPos.y)
    const p2 = new Phaser.Math.Vector2(this.ball.x, this.ball.y)
    this.ballMotion.setPosition(this.ball.x, this.ball.y)
    this.ballMotion.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p1, p2)) + 45)
    this.ball.deltaPos = p2

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
  }

}