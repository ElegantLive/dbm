const { ccclass, property } = cc._decorator;

@ccclass
export default class Tips extends cc.Component {
  @property(cc.Integer)
  moveLength: number = 0;

  dftX;
  onLoad() {
    this.initAction();
  }

  initAction() {
    const target = cc.find("moveLabel", this.node);
    this.dftX = target.x;
    const act = { x: this.dftX + this.moveLength },
      dft = { x: this.dftX };

    let up = cc.tween().to(0.5, act),
      down = cc.tween().to(0.5, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(target).repeatForever(action).start();
  }
}
