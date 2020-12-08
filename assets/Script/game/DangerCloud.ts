const { ccclass, property } = cc._decorator;

@ccclass
export default class DangerCloud extends cc.Component {
  @property(cc.SpriteFrame)
  dangerSpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  fuunySpriteFrame: cc.SpriteFrame = null;

  onLoad() {
    this.node.getComponent(cc.Sprite).spriteFrame = this.dangerSpriteFrame;
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (
        this.node.getComponent(cc.Sprite).spriteFrame != this.fuunySpriteFrame
      ) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.fuunySpriteFrame;
      }
    }
  }
}
