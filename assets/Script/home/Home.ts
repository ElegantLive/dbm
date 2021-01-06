import { initState } from "../state/Init";
import { isTt } from "../util/Common";
import { preLoadAllLevelScene, preLoadAllResources } from "../util/Load";
import { isZsLogin, loadZsCfg, loadZsLogin } from "../util/ZsLoad";

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
    if (isTt()) {
      if (!isZsLogin()) {
        loadZsCfg(() => {
          loadZsLogin();
        });
      }
    }
  }
}
