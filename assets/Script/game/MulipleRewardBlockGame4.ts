import Game4 from "./Game4";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MulipleRewardBlockGame4 extends cc.Component {
  @property(cc.Prefab)
  coin: cc.Prefab = null;

  @property(cc.SpriteFrame)
  noneSpriteFrame: cc.SpriteFrame = null;

  @property()
  number = 0;

  onLoad() {}

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0) {
      if (this.number > 0) {
        this.initCoin();
        this.playAction();

        const game4: Game4 = cc.director
          .getScene()
          .getChildByName("Canvas")
          .getComponent("Game4");
        game4.dispatchNumber();
        this.number--;
      } else {
        this.node.getComponent(cc.Sprite).spriteFrame = this.noneSpriteFrame;
      }
    }
  }

  initCoin() {
    const coinNode = cc.instantiate(this.coin);
    coinNode.getComponent("FlyCoin").init(this.node, cc.find("Canvas/default"));
  }

  playAction() {
    const dft = {
        y: this.node.y,
      },
      act = {
        y: this.node.y + 30,
      };
    let up = cc.tween().to(0.1, act),
      down = cc.tween().to(0.1, dft);

    cc.tween(this.node).then(up).then(down).start();
  }
}
