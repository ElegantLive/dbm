import { getCurrentLevel, getNextLevel } from "../state/Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettleModal extends cc.Component {
  @property(cc.SpriteFrame)
  greenBtnBg: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  blueBtnBg: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  winMain: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  loseMainO: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  loseMainS: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  loseTitle: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  winTitle: cc.SpriteFrame = null;

  init(type: "win" | "lose") {
    const btnGroup = cc.find("btnGroup", this.node),
      leftBtn = cc.find("left", btnGroup),
      middleBtn = cc.find("middle", btnGroup),
      rightBtn = cc.find("right", btnGroup),
      main = cc.find("main", this.node),
      title = cc.find("title", this.node),
      mainLabel = main.getChildByName("Label");
    if (type == "win") {
      main.getComponent(cc.Sprite).spriteFrame = this.winMain;
      const currentLevel = getCurrentLevel();
      mainLabel.getComponent(cc.Label).string = `X${currentLevel.reward}`;
      mainLabel.active = true;
    }

    if (type == "lose") {
      mainLabel.active = false;
      const spriteFrame = Math.random() > 0.5 ? this.loseMainO : this.loseMainS;
      main.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    }

    title.getComponent(cc.Sprite).spriteFrame =
      type == "win" ? this.winTitle : this.loseTitle;

    leftBtn.getComponent(cc.Button).target.getComponent(cc.Sprite).spriteFrame =
      type == "win" ? this.blueBtnBg : this.greenBtnBg;

    const nexlLv = getNextLevel();
    if (!nexlLv && type == "win") {
      rightBtn.active = false;
      btnGroup.getComponent(cc.Layout).spacingX = 100;
      btnGroup.getComponent(cc.Layout).updateLayout();
    } else {
      rightBtn.active = true;
      rightBtn
        .getComponent(cc.Button)
        .target.getComponent(cc.Sprite).spriteFrame =
        type == "win" ? this.greenBtnBg : this.blueBtnBg;
      rightBtn
        .getComponent(cc.Button)
        .target.getChildByName("Label")
        .getComponent(cc.Label).string = type == "win" ? "继续" : "再次挑战";

      rightBtn.getComponent("GameBtn").type =
        type == "win" ? "go_next_level" : "replay";
    }
    middleBtn
      .getComponent(cc.Button)
      .target.getChildByName("Label")
      .getComponent(cc.Label).string = type == "win" ? "领取奖励" : "跳过本关";

    middleBtn.getComponent("GameBtn").type =
      type == "win" ? "get_reward" : "getTips";

    const act = { scale: 1.1 },
      dft = { scale: middleBtn.scale };
    let up = cc.tween().to(0.5, act),
      down = cc.tween().to(0.5, dft),
      action = cc.tween().then(up).then(down);
    cc.tween(middleBtn).repeatForever(action).start();
  }
}
