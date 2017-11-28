/* global locale */
import {find} from 'lodash/fp';
import locations from '../../../locations.json';


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

const finda = a =>
  (find(l => l.name_ar === a, locations) ? find(l => l.name_ar === a, locations).name : a);

export const location = (arloc) =>
  (locale === 'ar' ? arloc : finda(arloc));

export default {unitTitle, timeMeOut, location};
