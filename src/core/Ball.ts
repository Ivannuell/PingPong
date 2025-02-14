import { SPEED } from "../constants"


export class Ball extends Phaser.Physics.Arcade.Image {
  direction = 1
  upMotion: Phaser.Math.Vector2

  constructor(scene: Phaser.Scene) {
    super(scene, 300, 300, 'ball')
    scene.physics.add.existing(this)
    scene.add.existing(this)
    this.setCircle(15)

    this.body!.onCollide = true
    this.upMotion = new Phaser.Math.Vector2(SPEED * this.direction, -SPEED)
  }
  
  deltaPos = new Phaser.Math.Vector2(this.x, this.y)

  ballCollider(object2: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]){
    this.scene.physics.add.collider(this, object2, () => true, ()=>true, this.scene)
  }

  colliderListeners() {
    this.scene.physics.world.on('collide', (obj1, obj2) => {
      if (obj2.getData('name') == 'BotWall') {
        console.log('Bot wall hit')
      }
    })
  }
  
}