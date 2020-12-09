import AudioManager from "../public/AudioManager";
import { unlockNextLevel } from "../state/Level";
import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  type = "";

  onLoad() {}

  dispatchSuccess() {
    cc.find("root").getComponent("AudioManager").playOnceMusic("win");
    unlockNextLevel();
    toggleModal("settleContainer", true, true);
  }
  dispatchFailure() {
    cc.find("root").getComponent("AudioManager").playOnceMusic("foollose");
    cc.find("Canvas/Princess").getComponent(cc.Animation).play("princess_cry");
    toggleModal("settleContainer", true, false);
  }
}
