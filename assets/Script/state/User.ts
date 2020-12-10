import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";

export const UserKey = "userState";

export interface UserState {
  skin: number;
  has_skin: number[];
  coin: number;
  heart: number;
}

const resetHeart = 60;

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
      heart: 5,
    };
    initByStorage(UserKey, currentUserState);
    return;
  }

  initAddTimer();
};

export const initAddTimer = () => {
  if (!addTimer) {
    addTimer = setInterval(() => {
      if (getAddTime() > 0) {
        decreaseAddtime();
      } else {
        // 体力加一
        increaseHeart();
        resetAddTime();
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
