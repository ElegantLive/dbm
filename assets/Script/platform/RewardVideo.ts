import { isTt, isWebGame, isWx } from "../util/Common";
import { openTtVideoWithCb } from "./ttVideo";
import { openWxVideoWithCb } from "./wxVideo";

export const openVideoWithCb = (call: Function) => {
  if (isWx()) {
    openWxVideoWithCb(call);
    return;
  }
  if (isTt()) {
    openTtVideoWithCb(call);
    return;
  }
  if (isWebGame()) {
    call && call();
    return;
  }
};
