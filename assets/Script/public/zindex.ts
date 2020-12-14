const { ccclass, property } = cc._decorator;

@ccclass
export default class zindex extends cc.Component {
  onLoad() {
    this.node.zIndex = 2;
    this.node.parent.zIndex = 2;
  }
}
