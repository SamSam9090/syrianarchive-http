/* global locale */
import moment from 'moment';
import {reduce, each, omit, isEmpty, compact} from 'lodash/fp';
import {databaseApiUrl} from '../../../env';

const reduceW = reduce.convert({cap: false});

export const unitTitle = u =>
  u[`summary_${locale}`] ||
  u.description ||
  u[`online_title_${locale}`];

export const querystring = reduceW((a, v, k) => (v ? `${a}${k}=${v}&` : a), '?');

export const query = () => {
  const search = location.search.substring(1);
  const ks = compact(search.split('&'));
  const dict = {};
  each(i => {
    const k = i.split('=')[0];
    const v = decodeURI(i.split('=')[1]);
    dict[k] = v;
    if (k === 'before' || k === 'after') {
      dict[k] = moment.unix(v / 1000);
    }
  })(ks);
  return omit(isEmpty, dict);
};

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
  const qs = querystring(fs).slice(0, -1);
  window.history.pushState({}, document.title, `${myURL}${qs}${h}`);
  return document.location;
};

export default {unitTitle, querystring, timeMeOut, updateQS, query};
