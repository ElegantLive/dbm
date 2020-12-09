const { ccclass, property } = cc._decorator;

@ccclass
export default class SplitNormalBlock extends cc.Component {
  split: boolean = false;

  @property()
  splitNumber = 0;

  update() {
    if (this.split) return;
    const playerNode = cc.find("Canvas/Player");
    const distanceX = Math.abs(playerNode.x - this.node.x);

    const touchDistance = (this.node.width + playerNode.width) / 2;

    if (distanceX < touchDistance + 50 && !this.split) {
      this.split = true;
      const firstNode = this.node.children[0];
      cc.tween(firstNode)
        .to(0.2, { x: firstNode.x - this.splitNumber })
        .start();
      const secondNode = this.node.children[1];
      cc.tween(secondNode)
        .to(0.2, { x: secondNode.x + this.splitNumber })
        .start();
    }
  }
}
