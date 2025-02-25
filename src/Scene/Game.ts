import Phaser from "phaser";
import { keyBindings } from "../types";
import Computer_paddle from "../core/computer_paddle";
import { Ball } from "../core/Ball";
import { SPEED } from "../constants";


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

  TIME_LIMIT = 5

  score_1 = 0
  score_2 = 0

  justScored = false

  ballMotion!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  timer!: Phaser.Time.TimerEvent

  create() {

    this.board = this.add.image(0, 60, 'board').setOrigin(0).setScale(1.2, 1.2)
    this.ball = new Ball(this, (direction: number) => this.updateComp(direction))
    this.ball.setVelocity(SPEED)
    this.ball.setMaxVelocity(700)

    this.ballMotion = this.physics.add.image(this.ball.x, this.ball.y, "ballMotion")
    this.ballMotion.setDisplayOrigin(this.ballMotion.width, 0)
    this.ballMotion.setAlpha(0.3)

    this.player_paddle = this.physics.add.image(50, 300, 'player').setImmovable().setData('name', 'player')
    this.comp = new Computer_paddle(this, this.ball, this.ball.direction).setData('name', 'computer')

    this.b_wall = this.physics.add.staticImage(480, 625, 'player').setAlpha(0).setData('name', 'BotWall')
    this.t_wall = this.physics.add.staticImage(480, 30, 'player').setAlpha(0).setData('name', 'TopWall')
    this.r_wall = this.physics.add.staticImage(985, 300, 'player').setAlpha(0).setData('name', 'RightWall')
    this.l_wall = this.physics.add.staticImage(-25, 300, 'player').setAlpha(0).setData('name', 'LeftWall')

    this.b_wall.body.setSize(960, 50)
    this.t_wall.body.setSize(960, 60)
    this.r_wall.body.setSize(50, 600)
    this.l_wall.body.setSize(50, 600)

    this.player_paddle.setOrigin(0)

    this.ball.ballCollider([this.b_wall, this.t_wall, this.r_wall, this.l_wall, this.player_paddle, this.comp])

    this.KEYS = this.input.keyboard?.addKeys(this.key_conf) as keyBindings
    this.scene.run('GameInterface', this).setVisible(true)

    this.timer = this.time.addEvent({
      delay: 30000,
      callback: () => {
        console.log("Timer done")
      }
    })

    this.ball.colliderListeners()
    this.events.addListener('updateScore', (scorrer: number) => {
      this.updateScore(scorrer)
    })
  }

  

  update() {

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

  updateComp(direction: number) {
    this.comp.updateDir(direction)
  }


}