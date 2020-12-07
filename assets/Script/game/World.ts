const { ccclass, property } = cc._decorator;

@ccclass
export default class CWorld extends cc.Component {
  @property()
  WorldFallG: number = -1000;

  @property()
  WorldWalkA: number = 300;

  static G: number = 0;
  static WalkA: number = 0;
  static GiveCoin: number = 0;
  static AddSpeed: number = 1;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    CWorld.G = this.WorldFallG;
    CWorld.WalkA = this.WorldWalkA;
  }

  start() {
    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = false;
    cc.director.getCollisionManager().enabledDrawBoundingBox = false;
  }

  // update (dt) {}
}
