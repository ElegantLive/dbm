import { getCfgVal, initByStorage, setCfgVal } from "../util/Storage";

export const UserKey = "userState";

export const initUser = () => {
  const currentUserState = getCfgVal(UserKey);
  if (!currentUserState) {
    // 第一次进来
    let state = {
      skin: 0,
      has_skin: [0],
      coin: 0,
    };
    initByStorage(UserKey, state);
    return;
  }
};

export const getUser = () => {
  return getCfgVal(UserKey);
};

export const increaseCoin = (number: number) => {
  let state = getUser();
  state.coin += number;
  setCfgVal(UserKey, state);
};
