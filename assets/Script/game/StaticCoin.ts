import { increaseCoin } from "../state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticCoin extends cc.Component {
  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (this.node.getComponent("CollisionReward").got == 1) {
        increaseCoin(1);
        this.node.destroy();
      }
    }
  }
}
