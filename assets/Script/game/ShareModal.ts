//@ts-nocheck tt

import { getLastVideoPath } from "../platform/ttGameRecord";
import { unlockNextLevel } from "../state/Level";
import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

type State = "win" | "lose";

@ccclass
export default class SettleModal extends cc.Component {
  @property(cc.SpriteFrame)
  winMain: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  loseMain: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  loseTitle: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  winTitle: cc.SpriteFrame = null;

  type: State = "lose";

  init(type: State) {
    const btnGroup = cc.find("btnGroup", this.node),
      middleBtn = cc.find("middle", btnGroup),
      main = cc.find("main", this.node),
      title = cc.find("title", this.node);
    if (type == "win") {
      main.getComponent(cc.Sprite).spriteFrame = this.winMain;
    }

    if (type == "lose") {
      main.getComponent(cc.Sprite).spriteFrame = this.loseMain;
    }

    title.getComponent(cc.Sprite).spriteFrame =
      type == "win" ? this.winTitle : this.loseTitle;

    this.type = type;
    middleBtn.on("click", this.handleCall, this);

    middleBtn
      .getComponent(cc.Button)
      .target.getChildByName("Label")
      .getComponent(cc.Label).string = type == "win" ? "分享炫耀" : "分享求助";

    if (middleBtn.active) {
      const act = { scale: 1.1 },
        dft = { scale: middleBtn.scale };
      let up = cc.tween().to(0.5, act),
        down = cc.tween().to(0.5, dft),
        action = cc.tween().then(up).then(down);
      cc.tween(middleBtn).repeatForever(action).start();
    }
  }

  handleCall() {
    const videoPath = getLastVideoPath();

    const msg = this.type == "win" ? "" : "";
    tt.shareAppMessage({
      title: "分享",
      desc: msg,
      channel: "video",
      extra: {
        videoPath: videoPath,
        videoTopics: ["神奇大冒险"],
      },
      success: (shareRes) => {
        console.log("分享视频成功");
        tt.navigateToVideoView({
          videoId: shareRes.videoId,
          success: (navRes) => {
            console.log("跳转成功");
            console.log(navRes);
          },
          fail: (navRes) => {
            console.log("跳转失败");
            console.log(navRes);
            // 可根据 res.errCode 处理失败case
          },
        });
      },
      fail: (res) => {
        console.log("分享视频失败");
        console.log(res);
      },
    });
    this.type == "win" ? this.winCall() : this.loseCall();
  }

  winCall() {
    unlockNextLevel();
    toggleModal("settleContainer", true, true);
  }

  loseCall() {
    toggleModal("settleContainer", true, false);
  }
}
