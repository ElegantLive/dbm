import { getDistance } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeJointMiddle extends cc.Component {
  @property(cc.Prefab)
  item: cc.Prefab = null;
  @property(cc.Node)
  endNode: cc.Node = null;

  onLoad() {
    this.init();
  }

  init() {
    let partRope: cc.Node[] = new Array();
    const length = Math.round(
      getDistance(this.node, this.endNode) / this.item.data.height
    );

    for (let i = 0; i < length; i++) {
      partRope[i] = cc.instantiate(this.item);
      this.node.parent.addChild(partRope[i]);
      partRope[i].setPosition(cc.v2(0, 0));
      const rope = partRope[i].getComponent(cc.RopeJoint);
      if (i > 0) {
        rope.connectedBody = partRope[i - 1].getComponent(cc.RigidBody);
        rope.maxLength = partRope[i].height;
      } else {
        rope.connectedBody = this.node.getComponent(cc.RigidBody);
        rope.maxLength = partRope[i].height;
      }
    }
    this.endNode.getComponent(cc.RopeJoint).connectedBody = partRope[
      length - 1
    ].getComponent(cc.RigidBody);
    this.endNode.getComponent(cc.RopeJoint).maxLength =
      partRope[length - 1].height;
  }
}
