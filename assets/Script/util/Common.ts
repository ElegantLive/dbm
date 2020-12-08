import {
  getCurrentLevel,
  getNextLevel,
  initCurrentLevel,
} from "../state/Level";

export type Dir = {
  x: number;
  y: number;
};

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

export async function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, time);
  });
}

export const toggleModal = (
  contanier?: string,
  state?: boolean,
  gameState?: boolean
) => {
  if (!state) state = false;

  if (true == state && !contanier) return;

  const modal = cc.find("Canvas/ui/modal");
  if (contanier) {
    const contanierNode = cc.find(contanier, modal);
    if (contanier == "settleContainer") {
      contanierNode
        .getComponent("SettleModal")
        .init(gameState ? "win" : "lose");
    }
    contanierNode.active = state;
  } else {
    const tipNode = cc.find("tipsContainer", modal),
      pauseNode = cc.find("pauseContainer", modal),
      settleNode = cc.find("settleContainer", modal);

    tipNode.active = state;
    pauseNode.active = state;
    settleNode.active = state;
  }
  modal.active = state;
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
  cc.director.loadScene(`level_${lvInfo.slv}_${lvInfo.lv}`);
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
  let otherR = other.world.aabb.xMax; // 碰撞物的右边x
  let otherL = other.world.aabb.xMin; // 碰撞物的左边x
  let otherU = other.world.aabb.yMax; // 碰撞物的上边x
  let otherD = other.world.aabb.yMin; // 碰撞物的下边x

  let myR = self.world.aabb.xMax; // 我的右边x
  let myL = self.world.aabb.xMin; // 我的左边x
  let myU = self.world.aabb.yMax; // 我上边x
  let myD = self.world.aabb.yMin; // 我的下边x

  if (myR - otherL >= 0 && myR - otherL < 60) {
    // 我的最大x大于他的最小x，右侧撞到
    dir.x = 1;
    // console.log("myR - otherL");
    // console.log(myR - otherL);
  }
  if (otherR - myL >= 0 && otherR - myL < 60) {
    // 他的最大x大于我的最小x，左侧撞到
    dir.x = -1;
    // console.log("otherR - myL");
    // console.log(otherR - myL);
  }

  if (clean) {
    if (dir.x != 0) {
      // 检查是否清除x
      if (myU - otherD >= 0 && myU - otherD < 5) {
        // console.log("clean x");
        dir.x = 0;
      }
      if (otherU - myD >= 0 && otherU - myD < 5) {
        // console.log("clean x");
        dir.x = 0;
      }
    }
  }
  if (myU - otherD >= 0 && myU - otherD < 60) {
    // 我的最大y大于他的最小y，上侧撞到
    dir.y = 1;
    // console.log("myU - otherD");
    // console.log(myU - otherD);
  }

  if (otherU - myD >= 0 && otherU - myD < 60) {
    // 他的最大y大于我的最小y，下侧撞到
    dir.y = -1;
    // console.log("otherU - myD");
    // console.log(otherU - myD);
  }

  if (clean) {
    if (dir.y) {
      // 检查是否清除y
      if (myR - otherL >= 0 && myR - otherL < 5) {
        // console.log("clean y");
        dir.y = 0;
      }
      if (otherR - myL >= 0 && otherR - myL < 5) {
        // console.log("clean y");
        dir.y = 0;
      }
    }
  }

  return dir;
};
