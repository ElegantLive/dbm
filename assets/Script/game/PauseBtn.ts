const { ccclass, property } = cc._decorator;

@ccclass
export default class Direct extends cc.Component {
  @property(cc.SpriteFrame)
  pauseSpriteFrame: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  resumeSpriteFrame: cc.SpriteFrame = null;

  onLoad() {
    this.node.on("click", this.handlePause, this);
  }

  handlePause() {
    if (cc.director.isPaused()) {
      cc.director.resume();
      cc.audioEngine.resumeAll();
      this.node
        .getComponent(cc.Button)
        .target.getComponent(cc.Sprite).spriteFrame = this.pauseSpriteFrame;
    } else {
      cc.audioEngine.pauseAll();
      cc.director.pause();
      this.node
        .getComponent(cc.Button)
        .target.getComponent(cc.Sprite).spriteFrame = this.resumeSpriteFrame;
    }
  }
}
