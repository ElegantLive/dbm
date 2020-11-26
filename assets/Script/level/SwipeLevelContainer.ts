import { getGroupLevel } from "../state/Level";

const { ccclass, property } = cc._decorator;

export type Direction = "left" | "right";

@ccclass
export default class SwipeLevelContainer extends cc.Component {
  @property(cc.Prefab)
  slvPrefab: cc.Prefab = null;

  @property()
  moveLength = 0;

  @property()
  moving = false;

  defaultX;

  static _instance: SwipeLevelContainer;

  onLoad() {
    this.init();
    this.defaultX = this.node.x;
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new SwipeLevelContainer();
    }
    return this._instance;
  }

  init() {
    const groupLevel = getGroupLevel();
    Object.keys(groupLevel).map((item) => {
      const node = cc.instantiate(this.slvPrefab);
      node.getComponent("SLevelItem").init(item, groupLevel[item]);
      this.node.addChild(node);
    });
    this.node.width = Object.keys(groupLevel).length * this.node.parent.width;
    this.node.getComponent(cc.Layout).updateLayout();
  }

  public moveHandle(dir: Direction) {
    if (this.moving) return;
    const groupLevel = getGroupLevel();

    let movlength = parseInt(this.moveLength.toString());
    const minX =
      this.defaultX - movlength * (Object.keys(groupLevel).length - 1);
    if (dir == "left") movlength = -movlength;

    const moveX = this.node.x + movlength;
    if (moveX > this.defaultX || moveX < minX) return;

    this.moving = true;
    cc.tween(this.node)
      .to(0.3, { x: moveX })
      .call(() => {
        this.moving = false;
      })
      .start();
  }
}
