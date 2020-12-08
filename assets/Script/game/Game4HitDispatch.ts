import Game4 from "./Game4";
import HiddenRewardBlock from "./HiddenRewardBlock";
import MulipleRewardBlock from "./MulipleRewardBlock";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game4HitDispatch extends cc.Component {
  got = 1;
  onLoad() {}

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (this.got > 0) {
        const game4: Game4 = cc.director
          .getScene()
          .getChildByName("Canvas")
          .getComponent("Game4");
        game4.dispatchNumber();
        this.got--;
      }
    }
  }
}
