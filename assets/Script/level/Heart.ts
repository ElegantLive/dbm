import { getAddTime, getUser, maxHeart } from "../state/User";
import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Heart extends cc.Component {
  @property(cc.Label)
  moreHeartLabel: cc.Label = null;

  @property(cc.Label)
  lastTimerLabel: cc.Label = null;

  @property(cc.Label)
  heartContainer: cc.Node = null;

  @property(cc.SpriteFrame)
  fullSpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  emptySpriteFrame: cc.SpriteFrame = null;

  @property(cc.Prefab)
  videoIcon: cc.Prefab = null;

  onLoad() {
    // if (!this.moreHeartLabel) {
    //   this.moreHeartLabel = cc
    //     .find("moreHeart", this.node)
    //     .getComponent(cc.Label);
    // }
    // if (!this.lastTimerLabel) {
    //   this.lastTimerLabel = cc
    //     .find("leftTime", this.node)
    //     .getComponent(cc.Label);
    // }

    if (!this.heartContainer) {
      this.heartContainer = cc.find("heartContainer", this.node);
    }

    this.node.getComponent(cc.Layout).enabled = false;
    if (cc.director.getScene().name != "home") {
      this.addTimer();
    }

    this.node.on(cc.Node.EventType.TOUCH_START, this.handleHeart, this);
  }

  update() {
    const heartNumber = getUser().heart;
    const leftTime = getAddTime();
    if (this.lastTimerLabel) {
      if (heartNumber < maxHeart) {
        this.lastTimerLabel.string = leftTime.toString();
      } else {
        this.lastTimerLabel.string = "";
      }
    }
    this.updateHeart(heartNumber);
    this.updateTimerLabel();
  }

  handleHeart() {
    const user = getUser();
    if (user.unlimitLife) return;
    toggleModal("heartContainer", true);
  }

  addTimer() {
    // 先禁用layout
    const timer = new cc.Node();
    timer.name = "timer";
    timer.y = -40;
    timer.color = cc.Color.BLACK;
    timer.addComponent(cc.Label);
    const label = timer.getComponent(cc.Label);
    label.fontSize = 24;
    label.lineHeight = 24;
    label.string = "";
    this.node.addChild(timer);
  }

  updateTimerLabel() {
    const timer = cc.find("timer", this.node);
    if (!timer) {
      return;
    }
    const state = getUser();
    if (!state.unlimitLife && state.heart < maxHeart) {
      const diff = getAddTime();
      if (diff <= 0) {
        timer.getComponent(cc.Label).string = "";
        return;
      }
      let m: number | string = Math.floor(((diff % (3600 * 24)) % 3600) / 60);
      let s: number | string = Math.floor((diff % (3600 * 24)) % 60);
      // if (m > 0) m -= 1;
      if (m < 10) {
        m = `0${m}`;
      }
      if (s < 10) {
        s = `0${s}`;
      }
      timer.getComponent(cc.Label).string = `${m}:${s}`;
    }
  }

  updateHeart(number: number) {
    if (this.heartContainer.children.length > 1) {
      for (
        let index = 0;
        index < this.heartContainer.children.length;
        index++
      ) {
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
}
