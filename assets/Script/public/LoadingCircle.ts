const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingCircle extends cc.Component {
  @property(cc.Integer)
  angleSpeed: number = 1;

  timer = undefined;

  onLoad() {
    this.timer = setInterval(() => {
      this.node.angle -= this.angleSpeed;
    }, 1);
  }

  onDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
