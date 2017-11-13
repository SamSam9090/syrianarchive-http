/* global locale */

export const unitTitle = u =>
  u[`summary_${locale}`] ||
  u.description ||
  u[`online_title_${locale}`];

export default {unitTitle};
