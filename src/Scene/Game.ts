import Phaser from "phaser"; 
import { keyBindings } from "../types";


export class Game extends Phaser.Scene {
  constructor() {
    super("Game")


  }
  
  key_conf = {
    UP: Phaser.Input.Keyboard.KeyCodes.W,
    DOWN: Phaser.Input.Keyboard.KeyCodes.S
  }
  
  KEYS! : keyBindings;
  player_paddle! : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  b_wall! : Phaser.Types.Physics.Arcade.ImageWithStaticBody
  t_wall! : Phaser.Types.Physics.Arcade.ImageWithStaticBody
  r_wall! : Phaser.Types.Physics.Arcade.ImageWithStaticBody
  l_wall! : Phaser.Types.Physics.Arcade.ImageWithStaticBody




  create() {
    const board = this.add.image(0, 60, 'board').setOrigin(0).setScale(1.2, 1.2)
    const ball = this.physics.add.image(400, 300, 'ball')
    
    this.player_paddle = this.physics.add.image(50, 300, 'player').setImmovable().setFlipX(true)
    
    let SPEED = 300
    let ACELERATION = 20
    let DIRECTION = 1
    ball.setVelocity(SPEED)
    
    
    this.b_wall = this.physics.add.staticImage(480, 625, 'player').setAlpha(0)
    this.t_wall = this.physics.add.staticImage(480, 30, 'player').setAlpha(0)
    this.r_wall = this.physics.add.staticImage(985, 300, 'player').setAlpha(0)
    this.l_wall = this.physics.add.staticImage(-25, 300, 'player').setAlpha(0)

    this.b_wall.body.setSize(960, 50)
    this.t_wall.body.setSize(960, 60)
    this.r_wall.body.setSize(50, 600)
    this.l_wall.body.setSize(50, 600)


    this.player_paddle.setOrigin(0)
    
    
    ball.setCircle(15)

    this.physics.add.collider(ball, [this.b_wall], () => {
      ball.setVelocity(SPEED * DIRECTION, -SPEED)
      ACELERATION += 10
      SPEED += 5
      
    })
    this.physics.add.collider(ball, [this.t_wall], () => {
      ball.setVelocity(SPEED * DIRECTION, SPEED)
      ACELERATION += 10
      SPEED += 5

    })
    this.physics.add.collider(ball, [this.r_wall], () => {
      ball.setVelocity(-SPEED - ACELERATION, SPEED * Phaser.Math.FloatBetween(-1, 1))
      DIRECTION = -1;

    })
    this.physics.add.collider(ball, [this.player_paddle, this.l_wall], () => {
      ball.setVelocity(SPEED + ACELERATION, SPEED * Phaser.Math.FloatBetween(-1, 1))
      DIRECTION = 1
    })

    this.KEYS = this.input.keyboard?.addKeys(this.key_conf) as keyBindings
    

    
  }
  
  update() {

    const paddle_size = this.player_paddle.getBottomCenter().y - this.player_paddle.getTopCenter().y

    if(this.KEYS.UP.isDown){
      if(this.player_paddle.y <= 60){
        this.player_paddle.y = 60;
        return
      }
      this.player_paddle.y -= 10
    }

    if(this.KEYS.DOWN.isDown){
      if(this.player_paddle.y >= 600 - paddle_size) {
        this.player_paddle.y = 600 - paddle_size
        return
      }
      this.player_paddle.y += 10
    }
    
  }


}