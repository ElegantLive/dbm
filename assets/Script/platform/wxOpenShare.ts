// @ts-nocheck wx

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxOpenShare extends cc.Component {
  onLoad() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.showShareMenu({ withShareTicket: true });
      wx.onShareAppMessage(function (res) {
        return {
          title: "这是一款很神奇，很简单的冒险！！！",
          imageUrl:
            "https://mmbiz.qpic.cn/mmbiz_png/w5pLFvdua9E8aJcPHkk0MqRhlWkNjD4472z1QDYNYQsoNo52tJMk4STVOibqekjkqRXoib9tibDbHv48lvzWkSX0Q/0",
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
