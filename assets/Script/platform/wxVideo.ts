//@ts-nocheck wx
import { rewardedVideoAdunit } from "./wxConfig";

let rewardVideo;

const init = () => {
  if (!rewardedVideoAdunit) return null;
  rewardVideo = wx.createRewardedVideoAd({
    adUnitId: rewardedVideoAdunit,
  });
  rewardVideo.onError((err) => {
    console.log("rewardedVideoAdErr");
    console.log(err);
  });

  return rewardVideo;
};

const getRewardedVideoInstance = () => {
  if (!rewardVideo) {
    rewardVideo = init();
  }
  return rewardVideo;
};

const setVideoScallBack = (call: Function) => {
  let rewardedVideo = getRewardedVideoInstance();
  if (!rewardedVideo) {
    call && call();
    return;
  }
  rewardedVideo.onClose((res) => {
    if ((res && res.isEnded) || typeof res === "undefined") {
      // 可以获得奖励
      console.log("got reward");
      call && call();
    } else {
      // 不能获得奖励
      console.log("no reward");
    }
  });
};

export const openVideoWithCb = (call: Function) => {
  if (cc.sys.platform != cc.sys.WECHAT_GAME) return;

  let rewardedVideo = getRewardedVideoInstance();
  if (!rewardedVideo) {
    call && call();
    return;
  }

  setVideoScallBack(call);
  rewardedVideo.show().catch((err) => {
    // 加载失败重试
    console.log("catch show video error");
    console.log(err);
    rewardedVideo.load().then(() => {
      rewardedVideo.show();
    });
  });
};
