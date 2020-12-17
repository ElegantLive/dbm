import { getCurrentLevel, getNextLevel, LevelKey } from "../state/Level";
import { getCfgVal } from "./Storage";

let preloadResources = false;
export const preLoadAllResources = () => {
  if (!preloadResources) {
    const loadArr = ["image", "prefab", "sound"];
    loadArr.map((item) => {
      cc.resources.preloadDir(
        item,
        (finish, total, item) => {
          // console.log(finish);
          // console.log(total);
          // console.log(item);
        },
        (error, complete) => {
          console.log(error);
          // console.log(complete);
          if (!error) {
            preloadResources = true;
          }
        }
      );
    });
  }
};

let preloadAllLevel = false;
export const preLoadAllLevelScene = () => {
  if (!preloadAllLevel) {
    const allOfLv = getCfgVal(LevelKey);
    allOfLv.forEach((lvInfo) => {
      if (lvInfo.status != "lock") {
        cc.director.preloadScene(
          `level_${lvInfo.slv}_${lvInfo.lv}`,
          (loadNumber, allNumber) => {
            // console.log(
            //   "loading " +
            //     `level_${lvInfo.slv}_${lvInfo.lv} ${loadNumber} /  ${allNumber}`
            // );
          },
          (err) => {
            if (!err) {
              preloadAllLevel = true;
            }
            console.log("loaded " + `level_${lvInfo.slv}_${lvInfo.lv}`);
          }
        );
      }
    });
  }
};

export const preLoadLevelScene = (type: "current" | "next") => {
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

  cc.director.preloadScene(`level_${lvInfo.slv}_${lvInfo.lv}`);
};
