import { getCurrentLevel, getNextLevel } from "../state/Level";
import {
  checkHeart,
  descreaseHeart,
  increaseCoin,
  increaseHeartByAd,
} from "../state/User";
import {
  getAudioManager,
  isTt,
  isWx,
  loadLevelScene,
  toggleModal,
} from "../util/Common";
import TipsModal from "./TipsModal";
import { resumeRecord, stopRecord } from "../platform/ttGameRecord";
import { ModelContainerType } from "./Modal";
import { openVideoWithCb } from "../platform/RewardVideo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBtn extends cc.Component {
  @property()
  type = "";

  @property()
  handle: "touch" | "click" = "click";

  onLoad() {
    let eventType: string;
    if (this.handle == "click") {
      eventType = this.handle;
    }
    if (this.handle == "touch") {
      eventType = cc.Node.EventType.TOUCH_START;
    }
    this.node.on(eventType, this.handleClick, this);
  }

  handleClick() {
    getAudioManager().playOnceMusic("button");
    let call: Function;
    switch (this.type) {
      case "pause":
        this.pauseGame();
        break;
      case "resume":
        this.resumeGame();
        if (isTt()) {
          resumeRecord();
        }
        break;
      case "home":
        this.resume();
        if (isTt()) {
          stopRecord();
        }
        cc.director.loadScene("home");
        break;
      case "level":
        this.resume();
        cc.director.loadScene("level");
        break;
      case "replay":
        if (isTt()) {
          stopRecord();
        }
        this.replay();
        break;
      case "jump_level":
        this.resume();
        call = () => {
          loadLevelScene("next");
        };
        openVideoWithCb(call);
        break;
      case "go_next_level":
        this.resume();
        loadLevelScene("next");
        break;
      case "get_reward":
        this.resume();
        cc.log("get_reward");

        call = () => {
          const currentLevel = getCurrentLevel();
          increaseCoin(currentLevel.reward);
          const nextLv = getNextLevel();
          if (nextLv) {
            loadLevelScene("next");
          } else {
            this.node.active = false;
          }
        };
        openVideoWithCb(call);
        break;
      case "closeModal":
        this.resume();
        if (isTt()) {
          resumeRecord();
        }
        this.closeModal();
        break;
      case "getTips":
        call = () => {
          this.openTipImageMode();
        };
        openVideoWithCb(call);
        break;
      case "getHeart":
        call = () => {
          this.closeModal();
          increaseHeartByAd();
        };
        openVideoWithCb(call);
        break;
      case "getHeartReplay":
        call = () => {
          this.closeModal();
          increaseHeartByAd();
          this.replay();
        };
        openVideoWithCb(call);
        break;
      default:
        break;
    }
  }
  replay() {
    if (checkHeart()) {
      descreaseHeart();
      this.resume();
      loadLevelScene("current");
    } else {
      toggleModal("heartContainer", true, true);
    }
  }

  pauseGame() {
    // cc.audioEngine.pauseAll();
    cc.director.pause();
    if (isTt()) {
      stopRecord();
    }
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
    toggleModal(contanier as ModelContainerType, false);
  }

  openModal(contanier: string) {
    if (!contanier) return;
    toggleModal(contanier as ModelContainerType, true);
  }

  openTipImageMode() {
    this.closeModal("tipsContainer");
    const currentLevel = getCurrentLevel();
    const tipsc: TipsModal = cc
      .find("Canvas/ui/modal/tipsImageContainer")
      .getComponent("TipsModal");
    tipsc.init(currentLevel.slv, currentLevel.lv);
    // 不能操作
    cc.director.pause();
  }
}
