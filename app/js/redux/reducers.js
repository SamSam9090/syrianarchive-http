import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {merge, set} from 'lodash/fp';

import {params} from '../params';

const defaultDb = {
  updating: true,
  ds: [],
  filters: params.filters || {
    term: '',
    type_of_violation: '',
    before: '',
    after: '',
    page: 1,
  },
  stats: { page: 1 },
  selectedUnit: {}
};

const database = (state = defaultDb, action) => {
  switch (action.type) {
    case 'INITIATE':
      return {};
    case 'UPDATE_FILTERS':
      return merge(state, {filters: action.filters});
    case 'RESET_FILTERS':
      return set('filters', defaultDb.filters, state);
    case 'UPDATE_UNITS':
      return set('ds', action.units, state);
    case 'UPDATE_STATS':
      return merge(state, {stats: action.stats});
    case 'REQUEST_UNITS':
      return merge(state, {updating: action.received});
    default:
      return state;
  }
};

const defaultUnit = {
  updating: true,
  id: params.unit || '',
  meat: {}};

const unit = (state = defaultUnit, action) => {
  switch (action.type) {
    case 'SELECT_UNIT':
      return merge(state, {
        id: action.unit.reference_code,
        meat: action.unit
      });
    case 'UNSET_UNIT':
      return merge(defaultUnit, {id: ''});
    case 'REQUEST_UNIT':
      return merge(state, {updating: action.received});
    default:
      return state;
  }
};

const defaultMeta = {
  updating: true
};

const meta = (state = defaultMeta, action) => {
  switch (action.type) {
    case 'INITIATE_META':
      return merge(state, action.meta);
    default:
      return state;
  }
};

const app = combineReducers({
  database,
  unit,
  meta,
  router: routerReducer
});

export default app;
