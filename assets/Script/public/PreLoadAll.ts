import { preLoadAllLevelScene } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PreLoadAll extends cc.Component {
  onLoad() {
    cc.director.preloadScene(
      "level",
      () => {},
      () => {
        console.log("loadedLevel");
      }
    );
    cc.director.preloadScene(
      "home",
      () => {},
      () => {
        console.log("loadedhome");
      }
    );
    preLoadAllLevelScene();
  }
}
