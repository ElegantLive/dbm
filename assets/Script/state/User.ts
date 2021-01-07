import { openVideoWithCb } from "../platform/RewardVideo";
import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";

export const UserKey = "userState";

export interface UserState extends Object {
  skin: number;
  has_skin: number[];
  coin: number;
  heart: number;
  unlimitLife: boolean;
  lastLv: {
    slv: number;
    lv: number;
  };
}

const resetHeart = 89;
export const maxHeart = 6;
export const UNLIMIT_LIFT_HEART = "∞";

let unlimitLifeNum = 0;
export const needAdNum = 5;

export const getUnLimitLifeNum = () => {
  return unlimitLifeNum;
};

export const addUnlimitLifeNum = () => {
  if (unlimitLifeNum >= needAdNum) {
    let currentUserState = getUser();
    currentUserState.unlimitLife = true;
    setCfgVal(UserKey, currentUserState);
    return;
  }
  unlimitLifeNum++;
  if (unlimitLifeNum >= needAdNum) {
    let currentUserState = getUser();
    currentUserState.unlimitLife = true;
    setCfgVal(UserKey, currentUserState);
  }
};

let addTime: number = resetHeart;

let addTimer = null;

export const getAddTime = () => {
  return addTime;
};

const decreaseAddtime = () => {
  addTime--;
};

const resetAddTime = () => {
  addTime = resetHeart;
};

export const initUser = () => {
  let currentUserState = getUser();
  if (!currentUserState) {
    // 第一次进来
    let currentUserState: UserState = {
      skin: 0,
      has_skin: [0],
      coin: 0,
      heart: maxHeart,
      unlimitLife: false,
      lastLv: {
        lv: 1,
        slv: 1,
      },
    };
    initByStorage(UserKey, currentUserState);
    return true;
  }

  if (currentUserState.unlimitLife) {
    unlimitLifeNum = needAdNum;
  }

  initAddTimer();

  return true;
};

export const initAddTimer = () => {
  if (!addTimer) {
    addTimer = setInterval(() => {
      if (getUser().heart >= maxHeart) {
        if (getAddTime() <= resetHeart) {
          resetAddTime();
        }
      } else {
        if (getAddTime() > 0) {
          decreaseAddtime();
        } else {
          // 体力加一
          increaseHeart();
          resetAddTime();
        }
      }
    }, 1000);
  }
};

export const getUser: () => UserState = () => {
  return getCfgVal(UserKey);
};

export const increaseCoin = (number: number) => {
  let state = getUser();
  state.coin += number;
  setCfgVal(UserKey, state);
};

export const increaseHeart = () => {
  let state = getUser();
  state.heart++;
  setCfgVal(UserKey, state);
};

export const increaseHeartByAd = () => {
  let state = getUser();
  state.heart = maxHeart; // 直接补满
  setCfgVal(UserKey, state);
  resetAddTime();
};

export const descreaseHeart = () => {
  let state = getUser();
  if (state.unlimitLife) return;
  state.heart--;
  setCfgVal(UserKey, state);
};

export const checkHeart = () => {
  const state = getUser();
  if (state.unlimitLife) return true;
  return state.heart > 0;
};

export const setLastGameLevel = (slv: number, lv: number) => {
  let state = getUser();
  state.lastLv = {
    slv,
    lv,
  };
  setCfgVal(UserKey, state);
};

export const countUnlimitLife = () => {
  let call = () => {
    addUnlimitLifeNum();
  };

  openVideoWithCb(call);
};
