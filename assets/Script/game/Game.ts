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
    unlockNextLevel();
    toggleModal("settleContainer", true, true);
  }
  dispatchFailure() {
    toggleModal("settleContainer", true, false);
  }
}
