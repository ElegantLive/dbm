const { ccclass, property } = cc._decorator;

@ccclass
export default class UI extends cc.Component {
  @property(cc.Prefab)
  modal: cc.Prefab = null;

  onLoad() {
    const modalNode = cc.instantiate(this.modal);
    this.node.addChild(modalNode);
    modalNode.getComponent("Modal").init();
  }
}
