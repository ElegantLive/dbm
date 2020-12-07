const { ccclass, property } = cc._decorator;

@ccclass
export default class TrickerKey extends cc.Component {
  @property([cc.Node])
  trickers: cc.Node[] = [];

  onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    if (other.tag == 0) {
      this.node.active = false;
      this.trickers.map((item) => {
        item.active = true;
      });

      this.node.destroy();
    }
  }
}
