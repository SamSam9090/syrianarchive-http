/* global locale */
import {reduce} from 'lodash/fp';
import {databaseApiUrl} from '../../../env';

const reduceW = reduce.convert({cap: false});

export const unitTitle = u =>
  u[`summary_${locale}`] ||
  u.description ||
  u[`online_title_${locale}`];

export const querystring = reduceW((a, v, k) => (v ? `${a}${k}=${v}&` : a), '?');

export const api = {
  get: resource => fetch(`${databaseApiUrl}/${resource}`, // eslint-disable-line
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json()),
  post: (resource, params) => fetch(`${databaseApiUrl}/${resource}`, // eslint-disable-line
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(r => r.json())
};

let timeout = null;
export const timeMeOut = (func) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    func();
  }, 500);
};

export const updateQS = fs => {
  const h = window.location.hash;
  const myURL = [location.protocol, '//', location.host, location.pathname].join('');
  window.history.pushState(fs, document.title, `${myURL}${querystring(fs)}${h}`);
  return document.location;
};

export default {unitTitle, querystring, timeMeOut, updateQS};
