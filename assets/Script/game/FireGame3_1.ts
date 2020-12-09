const { ccclass, property } = cc._decorator;

@ccclass
export default class FireGame3_1 extends cc.Component {
  @property()
  speed = 0;

  @property()
  show: boolean = false;

  onLoad() {}

  update(dt) {
    if (!this.show) return;

    this.node.x += this.speed * dt;
  }

  dispatchShow() {
    if (!this.show) {
      this.node.active = true;
      this.show = true;
    }
  }
}
