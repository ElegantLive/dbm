import { isOppo, isWx, isVivo, isTt } from "./Common";
import zsSdk = require("./zs.sdk");
import cfg from "./cfg";

let loadedData = { promotion: [] };
let imageDict = {};
let openTime = 0; // 用于开局一分钟之内禁止弹广告

export const setOpenTimer = () => {
  openTime = Math.floor(Date.now() / 1000) + 60;
};

export const getOpenStatus = () => {
  console.log("now, opentime");
  console.log(Math.floor(Date.now() / 1000));
  console.log(openTime);
  // 是否在开局禁止广告时间内 true 是 不显示广告 false 否 显示广告
  if (openTime < 1) return false;

  return Math.floor(Date.now() / 1000) <= openTime;
};

export const setLoadedData = (data) => {
  loadedData = data;
};

export const setImageKV = (k, v) => {
  imageDict[k] = v;
};

export const getImageByKey = (k, call) => {
  if (imageDict.hasOwnProperty(k)) {
    const spriteFrame = new cc.SpriteFrame(imageDict[k]);
    call && call(spriteFrame);
    return;
  }

  loadRemoteImage(k, call);
  return;
};

export const loadRemoteImage = (url, call) => {
  cc.assetManager.loadRemote(url, { ext: ".png" }, (err, texture: any) => {
    if (texture) {
      setImageKV(url, texture);
      const spriteFrame = new cc.SpriteFrame(texture);
      call && call(spriteFrame);
    }
  });
};

export const zsLoad = (call) => {
  const loadMap = [
    cc.sys.WECHAT_GAME,
    cc.sys.OPPO_GAME,
    cc.sys.VIVO_GAME,
    cc.sys.QQ_PLAY,
  ];
  if (loadMap.indexOf(cc.sys.platform) > -1) {
    console.log("zsSdk.loadCfg");
    zsSdk.loadCfg((data) => {
      cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
      if (isOppo()) {
        if (
          data.hasOwnProperty("zs_onemin_show_ad_switch") &&
          parseInt(data.zs_onemin_show_ad_switch) > 0
        ) {
          setOpenTimer();
        }
      }
    });
    call && call();
  } else {
    // call && call();
    // return;
    zsSdk.loadCfg((data) => {
      cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
      call && call();
    });
  }
  //wx, oppo, vivo, tt, qq
  const map = [
    cc.sys.WECHAT_GAME,
    // cc.sys.OPPO_GAME,
    // cc.sys.VIVO_GAME,
    cc.sys.QQ_PLAY,
  ];
  if (map.indexOf(cc.sys.platform) > -1) {
    zsSdk.login((user_id) => {
      cc.sys.localStorage.setItem("zsUser", user_id);
      zsSdk.init(user_id);
    });
  }
};

export const loadZsCfg = (call: Function) => {
  zsSdk.loadCfg((data) => {
    cc.sys.localStorage.setItem("zsCfg", JSON.stringify(data));
    call && call();
  });
};

export const loadZsLogin = () => {
  zsSdk.login((user_id) => {
    cc.sys.localStorage.setItem("zsUser", user_id);
    zsSdk.init(user_id);
  });
};

export const isZsLogin = () => {
  const zsUser = cc.sys.localStorage.getItem("zsUser");
  return zsUser ? true : false;
};

export const getZsCfgVal = (key: string, dft?: any) => {
  if (!dft) dft = false;
  const zsCfgStr = cc.sys.localStorage.getItem("zsCfg");
  if (!zsCfgStr) return dft;

  if (!isJsonString(zsCfgStr)) return dft;

  const zsCfg = JSON.parse(zsCfgStr);
  if (zsCfg.hasOwnProperty(key) == false) {
    return dft;
  }

  return zsCfg[key];
};

// export const getSysVal = (key: string, dft?: false) => {
//   if (!dft) dft = false;
//   const zsCfgStr = cc.sys.localStorage.getItem(key);
//   if (!zsCfgStr) return dft;

//   return isJsonString(zsCfgStr) ? JSON.parse(zsCfgStr) : zsCfgStr;
// };

export const getZsLoadData = (call) => {
  if (isOppo() || isWx()) {
    zsSdk.loadAd((res) => {
      call(res);
    });
  } else {
    call(loadedData);
  }
};

export const setZsLoadData = (call) => {
  zsSdk.loadAd((res) => {
    const adArray = res.promotion;
    if (!adArray.length) {
      return;
    }
    setLoadedData(res);
    for (let i = 0; i < adArray.length; i++) {
      let adEntity = adArray[i];
      cc.assetManager.loadRemote(
        adEntity.app_icon,
        { ext: ".png" },
        (err, texture) => {
          if (texture) {
            setImageKV(adEntity.app_icon, texture);
          }
          if (i + 1 == adArray.length) {
            call && call();
          }
        }
      );
    }
  });
  call && call();
};

export const initZsData = (call) => {
  setZsLoadData(call);
  setInterval(() => {
    isOppo() || isWx() ? console.log(loadedData) : setZsLoadData(null);
  }, 1000 * 30);
};

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

export const versionCheck = () => {
  // 最初版本1.1.0
  // return false;
  // return true;
  if (isWx()) {
    return !(getZsCfgVal("zs_version", "1.0.0") == cfg.version);
  }
  if (isOppo()) {
    return getZsCfgVal("zs_version", "1.0") == cfg.version;
  }
  if (isVivo()) {
    return getZsCfgVal("zs_version", "1.0") == cfg.version;
  }
  if (isTt()) {
    return getZsCfgVal("zs_version", "1.0") != cfg.version;
  }

  // 默认
  return !(getZsCfgVal("zs_version", "1.0") == cfg.version);
};

// module.exports = {
//   zsLoad,
//   initZsData,
//   getZsLoadData,
//   getZsCfgVal,
//   getSysVal,
//   versionCheck,
//   loadRemoteImage,
//   getImageByKey,
//   getOpenStatus,
// };
