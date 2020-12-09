import FireGame3_1 from "./FireGame3_1";
import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game3_1 extends Game {
  @property([cc.Vec2])
  dieArea: cc.Vec2[] = [];

  @property(cc.Node)
  addHiddenBlock: cc.Node = null;

  @property(cc.Node)
  fireNode: cc.Node = null;

  addDieBlock = false;

  fireNumber = 0;

  onLoad() {}

  update() {
    if (!this.addDieBlock) {
      const playerNode = cc.find("Canvas/Player");
      if (
        playerNode.x >= this.dieArea[0].x &&
        playerNode.x <= this.dieArea[1].x &&
        playerNode.y >= this.dieArea[0].y &&
        playerNode.y <= this.dieArea[1].y
      ) {
        this.dispatchShow();
      }
    }
  }
  dispatchShow() {
    this.addDieBlock = true;
    this.addHiddenBlock.children.map((item) => {
      item.active = true;
    });
  }

  dispatchFire() {
    const fireScript: FireGame3_1 = this.fireNode.getComponent("FireGame3_1");
    fireScript.dispatchShow();
  }

  checkFire() {
    if (this.fireNumber < this.addHiddenBlock.children.length) {
      this.fireNumber++;
      if (this.fireNumber == this.addHiddenBlock.children.length) {
        this.dispatchFire();
      }
    }
  }
}
