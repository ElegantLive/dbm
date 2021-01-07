import { initLevel } from "./Level";
import { initUser } from "./User";

let stateReady = false;

export const initState = () => {
  const levelStatus = initLevel();
  const userStatus = initUser();
  stateReady = levelStatus && userStatus;
};

export const getStateReady = () => {
  return stateReady;
};
