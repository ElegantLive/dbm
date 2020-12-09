import { getCollisionEnterDir } from "../util/Common";
import Game4 from "./Game4";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SuperManMove2_6 extends cc.Component {
  @property()
  speed = 0;

  @property()
  show: boolean = false;

  onLoad() {}

  update(dt) {
    if (!this.show) return;

    this.node.x += this.speed * dt;
  }

  dispatchShow() {
    if (!this.show) {
      this.node.active = true;
      this.show = true;
    }
  }
}
