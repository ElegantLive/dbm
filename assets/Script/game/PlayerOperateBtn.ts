import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Direct extends cc.Component {
  @property()
  type = "left";

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.handlePressStart, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.handlePressEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.handlePressEnd, this);
  }

  handlePressStart() {
    const playerNode = cc.find("Canvas/Player");
    if (!playerNode) return;
    const playerScript: Player = playerNode.getComponent("Player");
    switch (this.type) {
      case "left":
        playerScript.playerLeft();
        break;
      case "right":
        playerScript.playerRight();
        break;
      case "jump":
        playerScript.playerUp();
        break;

      default:
        break;
    }
  }

  handlePressEnd() {
    const playerNode = cc.find("Canvas/Player");
    if (!playerNode) return;
    const playerScript: Player = playerNode.getComponent("Player");
    switch (this.type) {
      case "left":
      case "right":
        playerScript.noLRControlPlayer();
        break;
      case "jump":
        playerScript.noUpControlPlayer();
        break;

      default:
        break;
    }
  }
}
