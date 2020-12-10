const { ccclass, property } = cc._decorator;

@ccclass
export default class CWorld extends cc.Component {
  @property()
  WorldFallG: number = -1000;

  @property()
  WorldWalkA: number = 300;

  @property()
  debug: boolean = false;

  static G: number = 0;
  static WalkA: number = 0;
  static GiveCoin: number = 0;
  static AddSpeed: number = 1;

  onLoad() {
    CWorld.G = this.WorldFallG;
    CWorld.WalkA = this.WorldWalkA;
  }

  start() {
    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = this.debug;
    cc.director.getCollisionManager().enabledDrawBoundingBox = this.debug;
  }
}
