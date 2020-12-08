const { ccclass, property } = cc._decorator;

@ccclass
export default class FalldownBlock extends cc.Component {
  @property(cc.Vec2)
  falldownPosition: cc.Vec2 = cc.v2(0, 0);

  @property(cc.SpriteFrame)
  funnySpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  normalSpriteFrame: cc.SpriteFrame = null;

  fallTween = null;

  onLoad() {
    cc
      .find("main", this.node)
      .getComponent(cc.Sprite).spriteFrame = this.normalSpriteFrame;
  }

  dispatchFalldown() {
    if (!this.fallTween) {
      this.fallTween = cc
        .tween(this.node)
        .to(0.5, { y: this.falldownPosition.y, x: this.falldownPosition.x })
        .call(() => {
          this.node.getChildByName("one").active = false;
          this.node.getChildByName("two").active = true;
          cc
            .find("main", this.node)
            .getComponent(cc.Sprite).spriteFrame = this.funnySpriteFrame;
        })
        .start();
    }
  }
}
