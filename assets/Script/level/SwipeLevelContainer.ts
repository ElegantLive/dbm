import { getGroupLevel } from "../state/Level";
import { getUser } from "../state/User";

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
    const state = getUser();
    if (state.hasOwnProperty("lastLv")) {
      const { slv } = state.lastLv;
      this.moveToSLv(slv);
    }
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

  /**
   * moveToSLv
   */
  public moveToSLv(slv: number) {
    if (!slv) return;

    let movlength = parseInt(this.moveLength.toString());

    const moveX = this.defaultX - movlength * (slv - 1);

    this.node.x = moveX;
  }
}
