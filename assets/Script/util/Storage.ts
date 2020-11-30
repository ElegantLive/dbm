import { isJsonString } from "./Common";

export const initByStorage = (key, dftValue) => {
  const localStorage = cc.sys.localStorage;
  let userData = localStorage.getItem(key);
  if (!userData) {
    const value =
      typeof dftValue == "object" ? JSON.stringify(dftValue) : dftValue;
    localStorage.setItem(key, value);
    return;
  }
};

export const getCfgVal = (key) => {
  const localStorage = cc.sys.localStorage;
  const value = localStorage.getItem(key);

  return isJsonString(value) ? JSON.parse(value) : value;
};

export const setCfgVal = (key, value) => {
  const localStorage = cc.sys.localStorage;
  let realVal;
  if (typeof value == "object") {
    realVal = JSON.stringify(value);
  } else {
    realVal = value;
  }

  return localStorage.setItem(key, realVal);
};
