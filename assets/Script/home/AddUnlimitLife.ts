import { openVideoWithCb } from "../platform/RewardVideo";
import { addUnlimitLifeNum, getUnLimitLifeNum } from "../state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class addUnlimitLife extends cc.Component {
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.addNum, this);
  }

  update() {
    const node = cc.find("nameContainer/name", this.node),
      label = node.getComponent(cc.Label),
      num = getUnLimitLifeNum();
    label.string = num + " / 5";
  }

  addNum() {
    let call = () => {
      addUnlimitLifeNum();
    };
    openVideoWithCb(call);
  }
}
