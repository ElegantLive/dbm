// @ts-nocheck wx

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxOpenShare extends cc.Component {
  onLoad() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.showShareMenu({ withShareTicket: true });
      wx.onShareAppMessage(function (res) {
        return {
          title: "经典冒险游戏始终好玩，来吧！一起回味经典的乐趣。",
          imageUrl: null,
          success(res) {
            console.log(res);
          },
          fail(res) {
            console.log(res);
          },
        };
      });
    }
  }
}
