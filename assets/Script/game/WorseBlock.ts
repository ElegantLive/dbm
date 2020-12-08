import { getCollisionEnterDir } from "../util/Common";
import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorseBlock extends cc.Component {
  hiddenTween = null;

  @property(cc.SpriteFrame)
  noneSpriteFrame: cc.SpriteFrame = null;

  onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    const dir = getCollisionEnterDir(other, self);

    if (dir.y < 0) {
      if (other.tag == 0) {
        if (!this.hiddenTween) {
          const hiddenNode = cc.find("hidden", this.node.parent);
          hiddenNode.active = true;
          this.hiddenTween = cc
            .tween(hiddenNode)
            .to(0.2, { y: hiddenNode.y + hiddenNode.height })
            .start();
          this.playAction();
        }
      }
    }
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

    this.node.getComponent(cc.Sprite).spriteFrame = this.noneSpriteFrame;
    cc.tween(this.node).then(up).then(down).start();
  }
}
