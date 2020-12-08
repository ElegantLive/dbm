import Game4 from "./Game4";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game4Label extends cc.Component {
  number: number = 0;

  update() {
    const game4: Game4 = cc.find("Canvas").getComponent("Game4");
    if (game4.hitNumber != this.number) {
      const currentStr = this.node.getComponent(cc.Label).string;

      this.node.getComponent(cc.Label).string = `顶${game4.hitNumber}次问号`;
      this.number = game4.hitNumber;
    }
  }
}
