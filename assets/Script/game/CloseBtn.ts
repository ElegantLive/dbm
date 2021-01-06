import { delay, getAudioManager, isTt, toggleModal } from "../util/Common";
import { versionCheck, getZsCfgVal } from "../util/ZsLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CloseBtn extends cc.Component {
  @property(cc.Integer)
  defaultDelay: number = 0;

  @property(cc.Boolean)
  useZsDelay: boolean = false;

  @property(cc.String)
  zsDelayField: "zs_button_delay_time" | "zs_jump_time" = "zs_jump_time";

  @property()
  handle: "touch" | "click" = "click";

  @property()
  handleCall: Function = () => {};

  onLoad() {}

  init(call?: Function) {
    this.initDelay();
    this.initHandle();
    this.handleCall = call;
  }

  async initDelay() {
    let delayTime = this.defaultDelay;
    if (this.useZsDelay) {
      if (isTt()) {
        if (versionCheck()) {
          delayTime = parseInt(getZsCfgVal(this.zsDelayField, 0));
        }
      }
    }

    if (delayTime) {
      this.node.active = false;
      await delay(delayTime);
    }
    this.node.active = true;
  }

  initHandle() {
    let eventType: string;
    if (this.handle == "click") {
      eventType = this.handle;
    }
    if (this.handle == "touch") {
      eventType = cc.Node.EventType.TOUCH_START;
    }
    this.node.on(eventType, this.handleClick, this);
  }

  handleClick() {
    getAudioManager().playOnceMusic("button");
    cc.director.resume();
    toggleModal(null, false);
    this.handleCall && this.handleCall();
  }
}
