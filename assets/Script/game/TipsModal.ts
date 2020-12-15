import { toggleModal } from "../util/Common";

const { ccclass } = cc._decorator;

@ccclass
export default class TipsModal extends cc.Component {
  init(slv: number, lv: number) {
    const closeNode = cc.find("close", this.node);
    if (closeNode) {
      closeNode.active = false;
      setTimeout(() => {
        closeNode.active = true;
      }, 2000);
    }

    const basePath = `image/tip/${slv}_${lv}`;
    cc.resources.load(
      basePath,
      cc.SpriteFrame,
      null,
      (e, df: cc.SpriteFrame) => {
        if (!e) {
          cc.find("main", this.node).getComponent(cc.Sprite).spriteFrame = df;
        }
      }
    );
    toggleModal(this.node.name, true);
  }
}
