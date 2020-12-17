import { initState } from "../state/Init";
import { preLoadAllLevelScene, preLoadAllResources } from "../util/Load";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  onLoad() {
    cc.director.preloadScene(
      "level",
      (f, t) => {
        // console.log(`finish / total ${f} / ${t}`);
      },
      (e) => {
        if (e) {
          console.log(e);
        } else {
          preLoadAllLevelScene();
          preLoadAllResources();
        }
      }
    );
    initState();
  }
}
