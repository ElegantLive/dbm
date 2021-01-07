import { getStateReady } from "../state/Init";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {
  checkInterVal: number = 0;
  onLoad() {
    this.node.active = false;
    this.checkInter();
  }

  onDisable() {
    console.log("disable");
  }

  onEnable() {
    console.log("enable");
  }

  checkInter() {
    if (!this.checkInterVal) {
      this.checkInterVal = setInterval(() => {
        if (getStateReady()) {
          this.node.active = true;
          clearInterval(this.checkInterVal);
          this.checkInterVal = 0;
        }
      }, 200);
    }
  }
}
