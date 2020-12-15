//@ts-nocheck wx
import { getAudioManager } from "../util/Common";
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
    const audioScript = getAudioManager();
    if (!audioScript.getBgMusicStatus()) {
      audioScript.playBgMusic();
    }
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

export const openVideoWithCb = async (call: Function) => {
  if (cc.sys.platform != cc.sys.WECHAT_GAME) return;

  let rewardedVideo = getRewardedVideoInstance();
  rewardedVideo = null; // 加留存，不看广告
  if (!rewardedVideo) {
    call && call();
    return;
  }

  setVideoScallBack(call);
  try {
    await rewardedVideoLoad(rewardedVideo);
  } catch (error) {
    // 失败重试
    await rewardedVideoLoad(rewardedVideo);
  } finally {
    // 手动关闭音乐
    getAudioManager().stopBgMusic();
  }
};

const rewardedVideoLoad = async (rewardedVideo) => {
  try {
    await rewardedVideo.load();
    await rewardedVideo.show();
    return Promise.resolve();
  } catch (error) {
    console.log("catch show or load video error");
    console.log(error);
    return Promise.reject(error);
  }
};
