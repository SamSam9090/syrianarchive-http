import moment from 'moment';
import {reduce, each, omit, isEmpty, compact, merge, last} from 'lodash/fp';

const reduceW = reduce.convert({cap: false});

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

export const updateQS = fs => {
  const h = window.location.hash;
  const myURL = [location.protocol, '//', location.host, location.pathname].join('');
  const qs = querystring(fs).slice(0, -1);
  window.history.pushState({}, document.title, `${myURL}${qs}${h}`);
  return document.location;
};

export const params = {
  unit: query().unit,
  filters: omit('unit', query()),
};

export const updateParams = state => {
  if (last(location.pathname.match(/\w+/g)) === 'database') {
    const ps = merge(state.database.filters, {unit: state.unit.id});
    updateQS(ps);
  }
};


export default {params, updateParams};
