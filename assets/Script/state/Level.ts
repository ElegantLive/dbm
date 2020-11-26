import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";

const maxLevel = 11;
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
