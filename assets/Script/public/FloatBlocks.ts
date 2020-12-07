import CWorld from "../game/World";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Direct extends cc.Component {
  @property()
  fallNumber: number = 0;

  isTouch: boolean = false;

  _speed_y: number = 0;

  @property(cc.Node)
  wrongNode: cc.Node = null;

  update(dt) {
    if (this.isTouch) {
      this._speed_y += CWorld.G * dt;
      this.node.y += this._speed_y * dt;
    }
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.tag == 0 && !this.isTouch && !this._speed_y) {
      this._speed_y = this.fallNumber;
      this.isTouch = true;
      this.wrongNode.active = true;
    }
  }
}
