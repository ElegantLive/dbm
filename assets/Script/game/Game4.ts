import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game4 extends Game {
  @property()
  hitNumber = 20;

  onLoad() {}

  update() {
    if (this.hitNumber == 0) {
      const princess = cc.find("Canvas/Princess");
      if (!princess.active) {
        princess.active = true;
      }
    }
  }

  dispatchNumber() {
    if (this.hitNumber > 0) {
      this.hitNumber--;
    }
  }
}
