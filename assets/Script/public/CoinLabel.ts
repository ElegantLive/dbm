import { getUser } from "../state/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Direct extends cc.Component {
  coin: number = 0;

  onLoad() {
    this.updateCoin(getUser().coin);
  }

  update() {
    const nextUserCoin = getUser().coin;
    if (nextUserCoin != this.coin) {
      this.updateCoin(nextUserCoin);
    }
  }

  updateCoin(coin: number) {
    this.coin = coin;
    this.node.getComponent(cc.Label).string = this.coin.toString();
  }
}
