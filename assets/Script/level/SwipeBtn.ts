import SwipeLevelContainer, { Direction } from "./SwipeLevelContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SwipeBtn extends cc.Component {
  @property()
  dir: Direction = "left";

  @property(cc.Node)
  moveContaner: cc.Node = null;

  onLoad() {
    this.init();
  }

  init() {
    this.node.on("click", this.clickHandle, this);
  }

  clickHandle() {
    this.moveContaner.getComponent("SwipeLevelContainer").moveHandle(this.dir);
  }
}
