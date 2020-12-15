import { getAudioManager } from "../util/Common";
import { hideLoading, showLoading } from "../util/GameCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {
  onLoad() {
    this.init();
  }

  init() {
    const dft = {
        opacity: 255,
      },
      act = {
        opacity: 1,
      };
    let up = cc.tween().to(0.5, act),
      down = cc.tween().to(0.5, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(this.node).repeatForever(action).start();

    this.node.on("click", this.startHandle, this);
    cc.director.preloadScene("level");
  }
  startHandle() {
    getAudioManager().playOnceMusic("button");
    showLoading();
    cc.director.loadScene("level", () => {
      hideLoading();
    });
  }
}
