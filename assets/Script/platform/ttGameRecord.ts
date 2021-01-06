//@ts-nocheck tt

let videoPath = null;

export const getLastVideoPath = () => {
  return videoPath;
};

export const setLastVideoPath = (path) => {
  videoPath = path;
};

export const initRecord = () => {
  const manager = tt.getGameRecorderManager();
  manager.onStart((res) => {
    console.log("录屏开始");
    console.log(res);
    // do something;
  });

  manager.onPause((res) => {
    console.log("录屏暂停");
    console.log(res);
    // do something;
  });

  manager.onResume((res) => {
    console.log("录屏恢复");
    console.log(res);
    // do something;
  });

  manager.onStop((res) => {
    console.log("录屏停止");
    console.log(res);
    videoPath = res.videoPath;
    // do something;
  });

  manager.onInterruptionBegin((res) => {
    console.log("录屏中断开始");
    console.log(res);
    // do something;
  });

  manager.onInterruptionEnd((res) => {
    console.log("录屏中断结束");
    console.log(res);
  });
};

export const startRecord = () => {
  const manager = tt.getGameRecorderManager();
  manager.start({
    duration: 300,
  });
};

export const stopRecord = () => {
  const manager = tt.getGameRecorderManager();
  manager.stop();
};

export const resumeRecord = () => {
  const manager = tt.getGameRecorderManager();
  manager.resume();
};
