const { ccclass, property } = cc._decorator;

@ccclass
export default class CollisonReward extends cc.Component {
  @property()
  got = 0;

  dispachGot() {
    if (this.got == 0) {
      this.got = 1;
    }
  }
}
