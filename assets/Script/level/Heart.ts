import { openVideoWithCb } from "../platform/wxVideo";
import { getAddTime, getUser, increaseHeartByAd } from "../state/User";
import { isWx } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Heart extends cc.Component {
  @property(cc.Label)
  moreHeartLabel: cc.Label = null;

  @property(cc.Integer)
  moreHeartNumber: number = 5;

  @property(cc.Label)
  lastTimerLabel: cc.Label = null;

  @property(cc.Label)
  heartContainer: cc.Node = null;

  @property(cc.SpriteFrame)
  fullSpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  emptySpriteFrame: cc.SpriteFrame = null;

  onLoad() {
    if (!this.moreHeartLabel) {
      this.moreHeartLabel = cc
        .find("moreHeart", this.node)
        .getComponent(cc.Label);
    }
    if (!this.lastTimerLabel) {
      this.lastTimerLabel = cc
        .find("leftTime", this.node)
        .getComponent(cc.Label);
    }

    if (!this.heartContainer) {
      this.heartContainer = cc.find("heartContainer", this.node);
      this.heartContainer.on(
        cc.Node.EventType.TOUCH_START,
        this.handleHeart,
        this
      );
    }
  }

  handleHeart() {
    let call = () => {
      increaseHeartByAd();
    };
    if (isWx()) {
      openVideoWithCb(call);
    } else {
      call();
    }
  }

  update() {
    const heartNumber = getUser().heart;
    const leftTime = getAddTime();
    if (heartNumber < 5) {
      this.lastTimerLabel.string = leftTime.toString();
    } else {
      this.lastTimerLabel.string = "";
    }
    this.updateHeart(heartNumber);
  }

  updateHeart(number: number) {
    for (let index = 0; index < this.heartContainer.children.length; index++) {
      const element = this.heartContainer.children[index];
      if (number > 0) {
        element.getComponent(cc.Sprite).spriteFrame = this.fullSpriteFrame;
        number--;
      } else {
        element.getComponent(cc.Sprite).spriteFrame = this.emptySpriteFrame;
      }
    }
  }
}
