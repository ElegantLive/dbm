import { loadLevelScene, toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBtn extends cc.Component {
  @property()
  type = "";

  onLoad() {
    this.node.on("click", this.handleClick, this);
  }

  handleClick() {
    switch (this.type) {
      case "pause":
        this.pauseGame();
        break;
      case "resume":
        this.resumeGame();
        break;
      case "home":
        cc.director.loadScene("home");
        break;
      case "replay":
        loadLevelScene("current");
        break;
      case "jump_level":
        loadLevelScene("next");
        break;
      case "go_next_level":
        loadLevelScene("next");
        break;
      case "get_reward":
        cc.log("get_reward");
        break;
      case "closeModal":
        this.closeModal();
        break;
      case "getTips":
        cc.log("getTips");
        break;
      default:
        break;
    }
  }

  pauseGame() {
    cc.audioEngine.pauseAll();
    cc.director.pause();
    this.openModal("pauseContainer");
  }

  resumeGame() {
    cc.director.resume();
    cc.audioEngine.resumeAll();
    this.closeModal("pauseContainer");
  }

  closeModal(contanier?: string) {
    toggleModal(contanier, false);
  }

  openModal(contanier: string) {
    if (!contanier) return;
    toggleModal(contanier, true);
  }
}
