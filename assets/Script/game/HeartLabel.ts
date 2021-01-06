import { getUser, UNLIMIT_LIFT_HEART } from "../state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeartLabel extends cc.Component {
  onLoad() {
    const state = getUser(),
      label = this.node.getComponent(cc.Label);
    if (state.unlimitLife) {
      label.string = UNLIMIT_LIFT_HEART;
    } else {
      label.string = state.heart.toString();
    }
  }

  update() {
    this.handleHeart();
  }

  handleHeart() {
    const label = this.node.getComponent(cc.Label);
    if (label.string == UNLIMIT_LIFT_HEART) {
      return;
    }

    const state = getUser();

    if (state.unlimitLife) {
      if (label.string != UNLIMIT_LIFT_HEART) {
        label.string = UNLIMIT_LIFT_HEART;
      }
    } else {
      const heart = state.heart,
        currentNum = parseInt(label.string);

      if (heart != currentNum) {
        label.string = heart.toString();
      }
    }
  }
}
