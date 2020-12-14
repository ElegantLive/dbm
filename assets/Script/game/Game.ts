import AudioManager from "../public/AudioManager";
import { unlockNextLevel } from "../state/Level";
import { preLoadLevelScene, toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  type = "";

  onLoad() {
    // 直接预加载当前关卡和下一关卡
    // preLoadLevelScene("current");
    // preLoadLevelScene("next");
  }

  dispatchSuccess() {
    unlockNextLevel();
    toggleModal("settleContainer", true, true);
  }
  dispatchFailure() {
    toggleModal("settleContainer", true, false);
  }
}
