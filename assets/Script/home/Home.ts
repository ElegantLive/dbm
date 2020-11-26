import { initLevel } from "../state/Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  onLoad() {
    initLevel();
  }
}
