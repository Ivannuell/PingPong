import { ACELERATION, SPEED } from "../constants"


export class Ball extends Phaser.Physics.Arcade.Image {
  direction = 1

  constructor(scene: Phaser.Scene) {
    super(scene, 300, 300, 'ball')
    scene.physics.add.existing(this)
    scene.add.existing(this)
    this.setCircle(15)

    this.body!.onCollide = true
  }
  
  deltaPos = new Phaser.Math.Vector2(this.x, this.y)

  ballCollider(object2: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]){
    this.scene.physics.add.collider(this, object2, () => true, ()=>true, this.scene)
  }

  colliderListeners() {


    this.scene.physics.world.on('collide', (_obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {

      switch (obj2.getData('name')) {

        case 'BotWall' : {
          console.log('Bot wall hit')
          this.setVelocity(this.motionDirections()[0].x, this.motionDirections()[0].y)
          break;
        }

        case 'TopWall': {
          this.setVelocity(this.motionDirections()[1].x , this.motionDirections()[1].y)
          break;
        }

        case 'LeftWall': {
          this.setVelocity(this.motionDirections()[2].x , this.motionDirections()[2].y)
          this.direction = 1
          this.scene.events.emit('updateScore', 1)
          break;
        }
        
        case 'player': {
          this.setVelocity(this.motionDirections()[2].x , this.motionDirections()[2].y)
          this.direction = 1
          break;
        }
        
        case 'RighWall': {
          this.setVelocity(this.motionDirections()[3].x , this.motionDirections()[3].y)
          this.direction = -1
          this.scene.events.emit('updateScore', 2)
          break;
        }
        
        case 'computer': {
          this.setVelocity(this.motionDirections()[3].x , this.motionDirections()[3].y)
          this.direction = -1
          break;
        }
      }

      
    })
  }

  motionDirections(): Phaser.Math.Vector2[] {
    const upMotion = new Phaser.Math.Vector2(SPEED * this.direction, -SPEED)
    const downMotion = new Phaser.Math.Vector2(SPEED * this.direction, SPEED)
    const rightMotion = new Phaser.Math.Vector2(SPEED + ACELERATION, SPEED)
    const leftMotion = new Phaser.Math.Vector2(-SPEED - ACELERATION, SPEED)

    return [upMotion, downMotion, rightMotion, leftMotion]
  }
  
}