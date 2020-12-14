import { loadLevelScene, preLoadAllLevelScene } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PreLoadAll extends cc.Component {
  onLoad() {
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
          console.log(complete);
        }
      );
    });
  }
}
