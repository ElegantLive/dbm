import {
  getCurrentLevel,
  getNextLevel,
  initCurrentLevel,
} from "../state/Level";

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
