import { getCurrentLevel, getNextLevel } from "../state/Level";

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
        this.loadLevelScene("current");
        break;
      case "jump_level":
        this.loadLevelScene("next");
        break;
      case "go_next_level":
        this.loadLevelScene("next");
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
    this.openModal("pauseContaner");
  }

  resumeGame() {
    cc.director.resume();
    cc.audioEngine.resumeAll();
    this.closeModal("pauseContaner");
  }

  closeModal(contanier?: string) {
    this.toggleModal(contanier, false);
  }

  openModal(contanier: string) {
    if (!contanier) return;
    this.toggleModal(contanier, true);
  }

  toggleModal(contanier?: string, state?: boolean) {
    if (!state) state = false;

    if (true == state && !contanier) return;

    const modal = cc.find("Canvas/ui/modal");
    if (contanier) {
      const contanierNode = cc.find(contanier, modal);
      contanierNode.active = state;
    } else {
      const tipNode = cc.find("tipsContaner", modal),
        pauseNode = cc.find("pauseContaner", modal),
        settleNode = cc.find("settleContaner", modal);

      tipNode.active = state;
      pauseNode.active = state;
      settleNode.active = state;
    }
    modal.active = state;
  }

  loadLevelScene(type: "current" | "next") {
    let lvInfo = null;
    switch (type) {
      case "current":
        lvInfo = getCurrentLevel();
        break;
      case "next":
        lvInfo = getNextLevel();
        break;
      default:
        break;
    }
    if (!lvInfo) return;

    cc.director.loadScene(`level_${lvInfo.slv}_${lvInfo.lv}`);
  }
}
