import { initLevel } from "./Level";
import { initUser } from "./User";

export const initState = () => {
  initLevel();
  initUser();
};
