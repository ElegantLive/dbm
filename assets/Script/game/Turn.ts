const { ccclass, property } = cc._decorator;

export type TurnStatus = 1 | -1 | 0;

@ccclass
export default class Turn extends cc.Component {
  @property(cc.SpriteFrame)
  leftSpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  rightSpriteFrame: cc.SpriteFrame = null;

  turnStatus: TurnStatus = 1;

  onLoad() {
    this.node.getComponent(cc.Sprite).spriteFrame = this.leftSpriteFrame;
  }

  turnRight() {
    const current = this.node.getComponent(cc.Sprite).spriteFrame;
    if (current != this.rightSpriteFrame) {
      this.node.getComponent(cc.Sprite).spriteFrame = this.rightSpriteFrame;
      this.turnStatus = -1;
    }
  }

  toggleTurn() {
    const current = this.node.getComponent(cc.Sprite).spriteFrame;
    if (current != this.rightSpriteFrame) {
      this.node.getComponent(cc.Sprite).spriteFrame = this.rightSpriteFrame;
      this.turnStatus = -1;
    } else {
      this.node.getComponent(cc.Sprite).spriteFrame = this.leftSpriteFrame;
      this.turnStatus = 1;
    }
  }
}
