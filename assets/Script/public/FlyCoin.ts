import { increaseCoin } from "../state/User";
import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyCoin extends cc.Component {
  onLoad() {
    // this.initAction();
  }

  init(node: cc.Node, container: cc.Node) {
    const ws = node.convertToWorldSpaceAR(cc.v2(0, 0));
    const pos = container.convertToNodeSpaceAR(ws);
    pos.y += node.height / 2;
    this.node.setPosition(pos);
    cc.find("Canvas").addChild(this.node);
    cc.find("root").getComponent("AudioManager").playOnceMusic("coin");
    this.initAction();
  }

  initAction() {
    const dft = {
        scaleX: 1,
      },
      act = {
        scaleX: -1,
      };
    let up = cc.tween().to(0.3, act),
      down = cc.tween().to(0.3, dft),
      scaleAction = cc.tween().then(up).then(down),
      upAction = cc.tween().to(0.6, {
        y: this.node.y + 80,
        opacity: 0,
      });
    cc.tween(this.node)
      .parallel(scaleAction, upAction)
      .call(() => {
        increaseCoin(1);
        this.node.destroy();
      })
      .start();
  }
}
