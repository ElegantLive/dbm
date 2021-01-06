import Game from "../game/Game";
import { ModelContainerType } from "../game/Modal";
import AudioManager from "../public/AudioManager";
import {
  getCurrentLevel,
  getNextLevel,
  initCurrentLevel,
} from "../state/Level";
import { setLastGameLevel } from "../state/User";
import { hideLoading, showLoading } from "./GameCommon";

export type Dir = {
  x: number;
  y: number;
};

export type Dirr = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

export async function delay(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      return resolve();
    }, time);
  });
}

export const toggleModal = (
  contanier?: ModelContainerType,
  state?: boolean,
  gameState?: boolean
) => {
  if (!state) state = false;

  if (true == state && !contanier) return;

  const modal = cc.find("Canvas/ui/modal");
  if (modal) {
    if (contanier) {
      modal.children.map((childNode) => {
        childNode.active = false;
      });
      const contanierNode = cc.find(contanier, modal);
      if (contanier == "settleContainer") {
        contanierNode
          .getComponent("SettleModal")
          .init(gameState ? "win" : "lose");
      }
      if (contanier == "heartContainer") {
        const state = Game.getGameState();
        let InitType = "close";
        if (state == "LOSE") {
          InitType = "level";
        }
        contanierNode.getComponent("HeartModal").init(InitType);
      }
      if (contanier == "shareContainer") {
        contanierNode
          .getComponent("ShareModal")
          .init(gameState ? "win" : "lose");
      }

      if (contanier != "settleContainer") {
        const closeBtn = cc
          .find("closeModel", contanierNode)
          .getComponent("CloseBtn");

        let closeCall = () => {};
        if (contanier == "shareContainer") {
          closeCall = () => {
            toggleModal("settleContainer", state, gameState);
          };
        }
        closeBtn.init(closeCall);
      } else {
        cc.find("closeModel", contanierNode).active = false;
      }

      contanierNode.active = state;
    } else {
      modal.children.map((childNode) => {
        childNode.active = false;
      });
    }
    modal.active = state;
  }
};

export const loadLevelScene = (type: "current" | "next") => {
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

  initCurrentLevel(lvInfo);
  showLoading();
  cc.director.loadScene(`level_${lvInfo.slv}_${lvInfo.lv}`, () => {
    setLastGameLevel(lvInfo.slv, lvInfo.lv);
    hideLoading();
  });
};

export const getDistance = (start, end) => {
  var pos = cc.v2(start.x - end.x, start.y - end.y);
  var dis = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
  return dis;
};

export const getCollisionEnterDir = (
  other: cc.BoxCollider,
  self: cc.BoxCollider,
  clean: boolean = false
) => {
  const dir: Dir = { x: 0, y: 0 };
  let pre = 20,
    ignorePre = 5;
  let otherR = other.world.aabb.xMax; // 碰撞物的右边x
  let otherL = other.world.aabb.xMin; // 碰撞物的左边x
  let otherU = other.world.aabb.yMax; // 碰撞物的上边x
  let otherD = other.world.aabb.yMin; // 碰撞物的下边x

  let myR = self.world.aabb.xMax; // 我的右边x
  let myL = self.world.aabb.xMin; // 我的左边x
  let myU = self.world.aabb.yMax; // 我上边x
  let myD = self.world.aabb.yMin; // 我的下边x

  if (myR - otherL >= 0 && myR - otherL < pre) {
    // 我的最大x大于他的最小x，右侧撞到
    dir.x = 1;
    // console.log("myR - otherL");
    // console.log(myR - otherL);
  }
  if (otherR - myL >= 0 && otherR - myL < pre) {
    // 他的最大x大于我的最小x，左侧撞到
    dir.x = -1;
    // console.log("otherR - myL");
    // console.log(otherR - myL);
  }

  if (clean) {
    if (dir.x != 0) {
      // 检查是否清除x
      if (myU - otherD >= 0 && myU - otherD < ignorePre) {
        // console.log("clean x");
        dir.x = 0;
      }
      if (otherU - myD >= 0 && otherU - myD < ignorePre) {
        // console.log("clean x");
        dir.x = 0;
      }
    }
  }
  if (myU - otherD >= 0 && myU - otherD < pre) {
    // 我的最大y大于他的最小y，上侧撞到
    dir.y = 1;
    // console.log("myU - otherD");
    // console.log(myU - otherD);
  }

  if (otherU - myD >= 0 && otherU - myD < pre) {
    // 他的最大y大于我的最小y，下侧撞到
    dir.y = -1;
    // console.log("otherU - myD");
    // console.log(otherU - myD);
  }

  if (clean) {
    if (dir.y) {
      // 检查是否清除y
      if (myR - otherL >= 0 && myR - otherL < ignorePre) {
        // console.log("clean y");
        dir.y = 0;
      }
      if (otherR - myL >= 0 && otherR - myL < ignorePre) {
        // console.log("clean y");
        dir.y = 0;
      }
    }
  }

  return dir;
};

export const compileDir = (all): Dirr => {
  let returnObj: Dirr = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  for (const key in all) {
    if (Object.prototype.hasOwnProperty.call(all, key)) {
      const element: Dir = all[key];

      if (
        returnObj.left &&
        returnObj.right &&
        returnObj.top &&
        returnObj.bottom
      ) {
        break;
      }

      if (element.x > 0 && !returnObj.right) {
        returnObj.right = 1;
      }
      if (element.x < 0 && !returnObj.left) {
        returnObj.left = 1;
      }
      if (element.y > 0 && !returnObj.top) {
        returnObj.top = 1;
      }
      if (element.y < 0 && !returnObj.bottom) {
        returnObj.bottom = 1;
      }
    }
  }
  return returnObj;
};

export const getAudioManager: () => AudioManager = () => {
  return cc.find("root").getComponent("AudioManager");
};

export const isWx = () => {
  return cc.sys.platform == cc.sys.WECHAT_GAME;
};

export const isTt = () => {
  return cc.sys.platform == cc.sys.BYTEDANCE_GAME;
};

export const isVivo = () => {
  return cc.sys.platform == cc.sys.VIVO_GAME;
};

export const isOppo = () => {
  return cc.sys.platform == cc.sys.OPPO_GAME;
};

export const isWebGame = () => {
  return cc.sys.isBrowser;
};
