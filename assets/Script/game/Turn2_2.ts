import FalldownBlock from "./FalldownBlock";
import Turn from "./Turn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Turn2_2 extends Turn {
  onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    if (other.tag == 0) {
      if (this.turnStatus == 1) {
        this.turnRight();
        const block: FalldownBlock = cc
          .find("Canvas/default/falldown")
          .getComponent("FalldownBlock");
        block.dispatchFalldown();
      }
    }
  }
}
