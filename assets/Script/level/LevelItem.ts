import { initCurrentLevel } from "../state/Level";
import { getAudioManger } from "../util/Common";

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

  lvInfo: LevelInfo;

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, this.goLevel, this);
  }
  goLevel() {
    const { slv, lv, status } = this.lvInfo;
    getAudioManger().playOnceMusic("button");
    if (status != "lock") {
      initCurrentLevel(this.lvInfo);
      cc.director.loadScene(`level_${slv}_${lv}`);
    }
  }

  public init(lvInfo: LevelInfo) {
    this.lvInfo = lvInfo;
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
