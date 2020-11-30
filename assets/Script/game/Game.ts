import { toggleModal } from "../util/Common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property()
  type = "";

  onLoad() {}

  dispatchSuccess() {
    toggleModal("settleContainer", true, true);
  }
  dispatchFailure() {
    toggleModal("settleContainer", true, false);
  }
}
