import { initState } from "../state/Init";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  onLoad() {
    initState();
  }
}
