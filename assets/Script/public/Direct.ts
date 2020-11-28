const { ccclass, property } = cc._decorator;

@ccclass
export default class Direct extends cc.Component {
  @property()
  scene: string = "";

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, this.directScene, this);
  }

  directScene() {
    cc.director.loadScene(this.scene);
  }
}
