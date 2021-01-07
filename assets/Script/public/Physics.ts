const { ccclass, property } = cc._decorator;

@ccclass
export default class Physics extends cc.Component {
  @property()
  debug: boolean = false;

  @property()
  gravity: cc.Vec2 = cc.v2(0, -1100);

  onLoad() {
    this.initPhysics();
  }

  //PhysicsManager
  initPhysics() {
    let manager: cc.PhysicsManager = cc.director.getPhysicsManager();
    manager.enabled = true;
    if (this.debug) {
      manager.debugDrawFlags = 1;
    }
    manager.gravity = this.gravity;
  }
}
