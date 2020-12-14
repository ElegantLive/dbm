import { getCurrentLevel, getNextLevel } from "../state/Level";
import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipsModal extends cc.Component {
  init(slv: number, lv: number) {
    const closeNode = cc.find("close", this.node);
    if (closeNode) {
      setTimeout(() => {
        closeNode.on(cc.Node.EventType.TOUCH_START, this.closeMode, this);
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
  closeMode() {
    toggleModal(this.node.name, false);
  }
}
