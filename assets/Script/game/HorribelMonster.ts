const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBtn extends cc.Component {
  onLoad() {}

  onBeginContact(
    contact: cc.PhysicsContact,
    selfCollider: cc.ColliderInfo,
    otherCollider: cc.ColliderInfo
  ) {
    // console.log(contact, selfCollider, otherCollider);
    console.log(1);
  }
}
