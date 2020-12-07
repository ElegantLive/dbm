const { ccclass, property } = cc._decorator;

@ccclass
export default class HiddenRewardBlock extends cc.Component {
  @property(cc.Prefab)
  coin: cc.Prefab = null;

  @property(cc.SpriteFrame)
  noneSpriteFrame: cc.SpriteFrame = null;

  onLoad() {}

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (self.node.getComponent("CollisionReward").got == 1) {
        this.initCoin();
        this.node.opacity = 255;
        this.node.getComponent(cc.Sprite).spriteFrame = this.noneSpriteFrame;
        self.node.getComponent("CollisionReward").got = -1;
      }
    }
  }

  initCoin() {
    const coinNode = cc.instantiate(this.coin);
    coinNode.getComponent("FlyCoin").init(this.node, cc.find("Canvas/default"));
  }
}
