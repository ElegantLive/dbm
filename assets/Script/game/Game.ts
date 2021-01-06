import { startRecord } from "../platform/ttGameRecord";
import { unlockNextLevel } from "../state/Level";
import { isTt, toggleModal } from "../util/Common";
import { preLoadLevelScene } from "../util/Load";

const { ccclass, property } = cc._decorator;

export type GameState = "PENDING" | "WIN" | "LOSE";

@ccclass
export default class Game extends cc.Component {
  @property()
  type = "";

  protected static state: GameState = "PENDING";

  onLoad() {
    // 直接预加载下一关卡
    preLoadLevelScene("next");
    if (isTt()) {
      // 开始录屏
      startRecord();
    }
  }

  static getGameState() {
    return Game.state;
  }

  dispatchSuccess() {
    Game.state = "WIN";
    unlockNextLevel();
    if (isTt()) {
      toggleModal("shareContainer", true, true);
    } else {
      toggleModal("settleContainer", true, true);
    }
  }

  dispatchFailure() {
    Game.state = "LOSE";
    if (isTt()) {
      toggleModal("shareContainer", true, false);
    } else {
      toggleModal("settleContainer", true, false);
    }
  }
}
