// @ts-nocheck tt

import { isTt } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TtOpenShare extends cc.Component {
  onLoad() {
    if (isTt()) {
      tt.showShareMenu({
        success: (res) => {
          console.log("设置分享成功");
          console.log(res);
        },

        fail: (res) => {
          console.log("设置分享失败");
          console.log(res);
        },
        complete: (res) => {
          console.log("设置分享完成");
          console.log(res);
        },
      });
      tt.onShareAppMessage(function (res) {
        console.log(res);

        return {
          title: "这是一款很神奇，很简单的冒险！！！",
          imageUrl:
            "https://mmbiz.qpic.cn/mmbiz_png/w5pLFvdua9E8aJcPHkk0MqRhlWkNjD4472z1QDYNYQsoNo52tJMk4STVOibqekjkqRXoib9tibDbHv48lvzWkSX0Q/0",
          success(sres) {
            console.log(sres);
          },
          fail(fres) {
            console.log(fres);
          },
        };
      });
    }
  }
}
