import moment from 'moment';
import {reduce, each, omit, isEmpty, compact, last, merge} from 'lodash/fp';

import history from './history';

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
  const myURL = [location.pathname].join('');
  const qs = querystring(fs).slice(0, -1);
  history.replace(`${myURL}${qs}${h}`);
  console.log(`${myURL}${qs}${h}`);
  return document.location;
};

export const backQS = fs => {
  const h = window.location.hash;
  const myURL = [location.pathname].join('');
  const uqs = merge(query(), fs);
  const qs = querystring(uqs).slice(0, -1);
  history.push(`${myURL}${qs}${h}`);
  return document.location;
};

export const params = {
  unit: query().unit,
  filters: omit('unit', query()),
};

export const updateParams = state => {
  console.log('uhhh');
  if (last(location.pathname.match(/\w+/g)) === 'database') {
    updateQS(state.database.filters);
    if (state.unit.id) {
      backQS({unit: state.unit.id});
    }
  }
};


export default {params, updateParams};
