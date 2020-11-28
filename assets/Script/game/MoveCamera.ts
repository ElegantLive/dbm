// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveCamera extends cc.Component {
  @property(cc.Node)
  target: cc.Node = null;

  @property()
  maxLength = 0;

  targetDefaultPos: cc.Vec2;

  onLoad() {
    if (this.target) {
      this.targetDefaultPos = cc.v2(this.target.x, this.target.y);
    }
  }

  update(dt) {
    if (!this.maxLength) return;

    const diff = this.target.x - this.targetDefaultPos.x,
      newX = 0 + diff;
    if (newX < 0) {
      cc.log("return <0");
      return;
    }

    if (newX >= this.maxLength) {
      cc.log("return >=" + this.maxLength);
      return;
    }
    cc.log("ok");

    this.node.setPosition(newX, 0);
    cc.log(this.node.x);
  }
}
