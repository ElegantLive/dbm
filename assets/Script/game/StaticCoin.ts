import AudioManager from "../public/AudioManager";
import { increaseCoin } from "../state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticCoin extends cc.Component {
  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (this.node.getComponent("CollisionReward").got == 1) {
        cc.find("root").getComponent("AudioManager").playOnceMusic("coin");
        increaseCoin(1);
        this.node.destroy();
      }
    }
  }
}
