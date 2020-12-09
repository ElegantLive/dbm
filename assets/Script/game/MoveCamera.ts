import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveCamera extends cc.Component {
  @property(cc.Node)
  target: cc.Node = null;

  @property()
  maxLength = 0;

  targetDefaultPos: cc.Vec2;

  onLoad() {
    this.targetDefaultPos = cc.v2(cc.view.getVisibleSize().width / 2, 0);
  }

  update(dt) {
    if (!this.maxLength) return;

    if (!this.target.isValid || !this.target.active) return;
    const playerScript: Player = this.target.getComponent("Player");
    if (playerScript.isDead) return;
    const pos = this.target.convertToWorldSpaceAR(cc.v2(0, 0));

    if (pos.x < cc.view.getVisibleSize().width / 2) {
      // 小于左边一半屏幕
      return;
    }
    if (pos.x >= this.maxLength) {
      // 大于最大移动距离
      return;
    }
    const diff = pos.x - this.targetDefaultPos.x,
      newX = 0 + diff;

    if (newX < 0) {
      return;
    }

    if (newX >= this.maxLength) {
      return;
    }

    this.node.setPosition(newX, 0);
  }
}
