/* global locale */
export const unitTitle = u =>
  u[`summary_${locale}`] ||
  u.description ||
  u[`online_title_${locale}`];

let timeout = null;
export const timeMeOut = (func) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    func();
  }, 500);
};

export default {unitTitle, timeMeOut};
