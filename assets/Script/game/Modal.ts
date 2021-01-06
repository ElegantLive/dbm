const { ccclass, property } = cc._decorator;

export type ModelContainerType =
  | "settleContainer"
  | "shareContainer"
  | "heartContainer"
  | "tipsModal"
  | "pauseContainer"
  | null;
@ccclass
export default class Modal extends cc.Component {
  @property([cc.Prefab])
  container: cc.Prefab[] = [];

  @property(cc.Prefab)
  closeModel: cc.Prefab = null;

  init() {
    this.container.map((item) => {
      const node = cc.instantiate(item);
      node.active = false;
      const close = cc.instantiate(this.closeModel);
      close.x = 300.324;
      close.y = 178.275;
      node.addChild(close);
      this.node.addChild(node);
    });
  }
}
