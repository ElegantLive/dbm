const { ccclass, property } = cc._decorator;

@ccclass
export default class Modal extends cc.Component {
  @property([cc.Prefab])
  container: cc.Prefab[] = [];

  init() {
    this.container.map((item) => {
      const node = cc.instantiate(item);
      node.active = false;
      this.node.addChild(node);
    });
  }
}
