export const showLoading = () => {
  cc.find("root/loading").active = true;
};

export const hideLoading = () => {
  cc.find("root/loading").active = false;
};
