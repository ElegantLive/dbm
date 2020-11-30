import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";
import { LevelInfo } from "../level/LevelItem";

const maxLevel = 1;
export const LevelKey = "userLevel";

export const initLevel = () => {
  const currentLevelState = getCfgVal(LevelKey);
  if (!currentLevelState) {
    // 第一次进来
    let level = [];
    for (let index = 0; index < maxLevel; index++) {
      const slv = Math.floor(index / 6) + 1;
      const lv = Math.floor(index % 6) + 1;
      const item = {
        lv,
        slv,
        status: index < 1 ? "current" : "lock",
      };
      level.push(item);
    }

    initByStorage(LevelKey, level);
  }
  if (currentLevelState.length < maxLevel) {
    // 需要加关卡
    let level = currentLevelState;
    const lastLevel = currentLevelState[currentLevelState.length - 1];
    for (let index = currentLevelState.length - 1; index < maxLevel; index++) {
      const slv = Math.floor(index / 6) + 1;
      const lv = Math.floor(index % 6) + 1;
      let status = "lock";
      if (index == currentLevelState.length - 1) {
        if (lastLevel.status == "pass") {
          status = "current";
        }
      }
      const item = {
        lv,
        slv,
        status,
      };
      level.push(item);
    }

    setCfgVal(LevelKey, level);
  }
  return;
};

export const getGroupLevel = () => {
  const levelInfo = getCfgVal(LevelKey);

  let groupLevel = {};
  levelInfo.map((item) => {
    if (groupLevel[item.slv]) {
      groupLevel[item.slv].push(item);
    } else {
      groupLevel[item.slv] = [item];
    }
  });

  return groupLevel;
};

let currentLevel = {
  times: 0, // 挑战次数
  lv: 1, // 小关
  slv: 1, // 大关
  status: "lock", // 大关
  life: 3, // 命
  reward: 300, // 通关金币奖励
};

export const initCurrentLevel = (lvInfo: LevelInfo) => {
  currentLevel = {
    times: 0, // 挑战次数
    lv: lvInfo.lv, // 小关
    slv: lvInfo.slv, // 大关
    life: 3, // 命
    reward: 300, // 通关金币奖励
    status: lvInfo.status, // 大关
  };
};

export const getCurrentLevel = () => {
  return currentLevel;
};

export const getNextLevel = () => {
  const current = getCurrentLevel();
  let nextLv = {
    lv: current.lv + 1,
    slv: current.slv,
  };

  if (nextLv.lv > 6) {
    nextLv.lv = 1;
    nextLv.slv += 1;
  }

  return getLevelByLvInfo(nextLv.lv, nextLv.slv);
};

export const unlockNextLevel = () => {
  const nextLv = getNextLevel();
  if (!nextLv) return;

  let lv = getCfgVal(LevelKey);

  const newLv = lv.map((item) => {
    if (
      item.lv == nextLv.lv &&
      item.slv == nextLv.slv &&
      item.status == "lock"
    ) {
      item.status = "current";
    }
    return item;
  });

  if (lv != newLv) {
    setCfgVal(LevelKey, newLv);
  }
};

export const getLevelByLvInfo = (lv, slv) => {
  let lvs = getCfgVal(LevelKey);

  let hasLv = null;

  for (let index = 0; index < lvs.length; index++) {
    const element = lvs[index];
    if (element.lv == lv && element.slv == slv) {
      hasLv = element;
      break;
    }
  }

  return hasLv;
};
