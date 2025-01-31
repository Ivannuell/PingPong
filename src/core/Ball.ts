

export class Ball extends Phaser.Physics.Arcade.Image {
  direction!: number

  constructor(scene: Phaser.Scene) {
    super(scene, 300, 300, 'ball')
    scene.physics.add.existing(this)
    scene.add.existing(this)
    this.setCircle(15)

    this.body!.onCollide = true
  }
  
  deltaPos = new Phaser.Math.Vector2(this.x, this.y)

  ballCollider(obect_2: Phaser.GameObjects.GameObject, callback: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback) {
    this.scene.physics.add.collider(this, obect_2, callback, () => true, this.scene)
  }
  
}