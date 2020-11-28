import { LevelInfo } from "./LevelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {
  @property()
  slvNumber = 0;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  public init(slvNumber: number, slvInfo: LevelInfo[]) {
    const sLvNumberNode = cc.find("section/number", this.node);
    sLvNumberNode.getComponent(cc.Label).string = slvNumber.toString();
    const itemsContainer = cc.find("items", this.node);
    slvInfo.map((item, index) => {
      const node = cc.instantiate(this.itemPrefab);
      node.getComponent("LevelItem").init(item);
      itemsContainer.addChild(node);
    });
    itemsContainer.getComponent(cc.Layout).updateLayout();
  }
}
