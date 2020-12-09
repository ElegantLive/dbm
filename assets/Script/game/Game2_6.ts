import Game from "./Game";
import SuperManMove2_6 from "./SuperManMove2_6";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game2_6 extends Game {
  @property()
  superManShowX = 0;

  superManShow: boolean = false;

  onLoad() {}

  update() {
    if (this.superManShow) return;

    const playerNode = cc.find("Canvas/Player");
    if (playerNode.x > this.superManShowX && !this.superManShow) {
      this.superManShow = true;
      this.dispatchShowSuper();
    }
  }
  dispatchShowSuper() {
    const superManNode = cc.find("Canvas/default/superman");
    const superScript: SuperManMove2_6 = superManNode.getComponent(
      "SuperManMove2_6"
    );
    superScript.dispatchShow();
  }
}
