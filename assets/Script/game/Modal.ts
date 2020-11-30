const { ccclass, property } = cc._decorator;

@ccclass
export default class Modal extends cc.Component {
  @property(cc.Prefab)
  tip: cc.Prefab = null;
  @property(cc.Prefab)
  pause: cc.Prefab = null;
  @property(cc.Prefab)
  settle: cc.Prefab = null;

  init() {
    const tipNode = cc.instantiate(this.tip);
    const settleNode = cc.instantiate(this.settle);
    const pauseNode = cc.instantiate(this.pause);

    this.node.addChild(tipNode);
    this.node.addChild(settleNode);
    this.node.addChild(pauseNode);
  }
}
