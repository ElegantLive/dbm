import { getCurrentLevel, getNextLevel } from "../state/Level";
import { increaseCoin } from "../state/User";
import { getAudioManger, loadLevelScene, toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBtn extends cc.Component {
  @property()
  type = "";

  onLoad() {
    this.node.on("click", this.handleClick, this);
  }

  handleClick() {
    getAudioManger().playOnceMusic("button");
    switch (this.type) {
      case "pause":
        this.pauseGame();
        break;
      case "resume":
        this.resumeGame();
        break;
      case "home":
        this.resume();
        cc.director.loadScene("home");
        break;
      case "replay":
        this.resume();
        loadLevelScene("current");
        break;
      case "jump_level":
        this.resume();
        loadLevelScene("next");
        break;
      case "go_next_level":
        this.resume();
        loadLevelScene("next");
        break;
      case "get_reward":
        this.resume();
        cc.log("get_reward");
        const currentLevel = getCurrentLevel();
        increaseCoin(currentLevel.reward);
        const nextLv = getNextLevel();
        if (nextLv) {
          loadLevelScene("next");
        } else {
          this.node.active = false;
        }
        break;
      case "closeModal":
        this.resume();
        this.closeModal();
        break;
      case "getTips":
        this.resume();
        cc.log("getTips");
        break;
      default:
        break;
    }
  }

  pauseGame() {
    // cc.audioEngine.pauseAll();
    cc.director.pause();
    this.openModal("pauseContainer");
  }

  resumeGame() {
    this.resume();
    this.closeModal("pauseContainer");
  }

  resume() {
    cc.director.resume();
    // cc.audioEngine.resumeAll();
  }

  closeModal(contanier?: string) {
    toggleModal(contanier, false);
  }

  openModal(contanier: string) {
    if (!contanier) return;
    toggleModal(contanier, true);
  }
}
