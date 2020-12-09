import FlyCoin from "../public/FlyCoin";
import { getCollisionEnterDir } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiddenRewardBlock extends cc.Component {
  @property(cc.Prefab)
  coin: cc.Prefab = null;

  @property(cc.SpriteFrame)
  noneSpriteFrame: cc.SpriteFrame = null;

  onLoad() {}

  onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    if (other.tag == 0) {
      const dir = getCollisionEnterDir(other, self);
      if (dir.y < 0) {
        if (self.node.getComponent("CollisionReward").got == 1) {
          this.initCoin();
          this.node.opacity = 255;
          this.node.getComponent(cc.Sprite).spriteFrame = this.noneSpriteFrame;
          self.node.getComponent("CollisionReward").got = -1;
          this.playAction();
        }
      }
    }
  }

  initCoin() {
    const coinNode = cc.instantiate(this.coin);
    coinNode.getComponent("FlyCoin").init(this.node, cc.find("Canvas/default"));
  }

  playAction() {
    const dft = {
        y: this.node.y,
      },
      act = {
        y: this.node.y + 30,
      };
    let up = cc.tween().to(0.1, act),
      down = cc.tween().to(0.1, dft);

    cc.tween(this.node).then(up).then(down).start();
  }
}
