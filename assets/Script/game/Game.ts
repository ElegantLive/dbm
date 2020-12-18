import { unlockNextLevel } from "../state/Level";
import { toggleModal } from "../util/Common";
import { preLoadLevelScene } from "../util/Load";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  type = "";

  onLoad() {
    // 直接预加载下一关卡
    preLoadLevelScene("next");
  }

  dispatchSuccess() {
    unlockNextLevel();
    toggleModal("settleContainer", true, true);
  }
  
  dispatchFailure() {
    toggleModal("settleContainer", true, false);
  }
}
