import { toggleModal } from "../util/Common";
import { ModelContainerType } from "./Modal";

const { ccclass } = cc._decorator;

@ccclass
export default class TipsModal extends cc.Component {
  init(slv: number, lv: number) {
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
    toggleModal(this.node.name as ModelContainerType, true);
  }
}
