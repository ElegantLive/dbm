const { ccclass, property } = cc._decorator;

export interface LevelInfo {
  status: "lock" | "pass" | "current";
  lv: number;
  slv: number;
}

@ccclass
export default class LevelItem extends cc.Component {
  @property(cc.SpriteFrame)
  lockLvBg: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  passLvBg: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  currentLvBg: cc.SpriteFrame = null;

  @property()
  lvNumber: 0;

  public init(lvInfo: LevelInfo) {
    const { status, lv } = lvInfo;
    const mapSprite = {
      lock: this.lockLvBg,
      pass: this.passLvBg,
      current: this.currentLvBg,
    };

    const spriteFrame = mapSprite[status];

    const bgNode = cc.find("bg", this.node),
      numberNode = cc.find("number", this.node);
    bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    if (status == "lock") {
      numberNode.active = false;
    } else {
      numberNode.getComponent(cc.Label).string = lv.toString();
    }
  }
}
