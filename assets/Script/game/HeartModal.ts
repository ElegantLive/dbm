const { ccclass, property } = cc._decorator;

@ccclass
export default class HeartModal extends cc.Component {
  init(type: "home" | "close" | "level") {
    const btnGroup = cc.find("btnGroup", this.node),
      leftBtn = cc.find("left", btnGroup),
      middleBtn = cc.find("middle", btnGroup);

    if (type == "home") {
      leftBtn.getComponent("GameBtn").type = "home";
    }

    if (type == "level") {
      leftBtn.getComponent("GameBtn").type = "level";
    }

    if (type == "close") {
      leftBtn.getComponent("GameBtn").type = "closeModal";
    }

    if (middleBtn.active) {
      const act = { scale: 1.1 },
        dft = { scale: middleBtn.scale };
      let up = cc.tween().to(0.5, act),
        down = cc.tween().to(0.5, dft),
        action = cc.tween().then(up).then(down);
      cc.tween(middleBtn).repeatForever(action).start();
    }
  }
}
