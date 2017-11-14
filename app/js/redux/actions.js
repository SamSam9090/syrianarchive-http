// import Promise from 'bluebird';
import {merge, isEqual, isEmpty} from 'lodash/fp';

import {store} from '../store';

import {api} from '../api';

export const requestUnits = received => ({type: 'REQUEST_UNITS', received});
export const updateUnits = units => ({type: 'UPDATE_UNITS', units});
export const updateStats = stats => ({type: 'UPDATE_STATS', stats});

export const updateFilters = filters =>
  dispatch => {
    const current = store.getState().database;
    const f = merge(current.filters, filters);
    // only ping the api if the filters have changed.
    if (!isEqual(f, current.filters) || isEmpty(current.ds)) {
      dispatch(requestUnits(true));
      dispatch({
        type: 'UPDATE_FILTERS',
        filters: f,
      });

      return api.post('units', f)
        .then(r => {
          dispatch(updateUnits(r.units));
          dispatch(updateStats(r.stats));
          dispatch(requestUnits(false));
          return r;
        });
    }
  };

export const resetFilters = () =>
  dispatch => api.post('units', {})
    .then(r => {
      dispatch(updateUnits(r.units));
      dispatch(updateStats(r.stats));
      dispatch(requestUnits(false));
      dispatch({
        type: 'RESET_FILTERS',
      });
      return r;
    });

export const selectUnit = unit => ({type: 'SELECT_UNIT', unit});
export const unsetUnit = () => ({type: 'UNSET_UNIT'});

export const retrieveUnit = unitId =>
  dispatch => {
    const current = store.getState().unit;
    // only ping the api if the filters have changed.
    if (!isEqual(unitId, current.id) || isEmpty(current.meat)) {
      dispatch({
        type: 'REQUEST_UNIT',
        received: false,
      });

      return api.get(`units/${unitId}`)
        .then(r => {
          dispatch(selectUnit(r));
          dispatch({
            type: 'REQUEST_UNIT',
            received: true,
          });
          return r;
        });
    }
  };

export const getMeta = () =>
  dispatch => {
    const current = store.getState().database.meta;

    if (!(current && current.verified)) {
      return api.get('meta')
        .then(r => dispatch({type: 'INITIATE_META', meta: r}));
    }
  };


export default {
  updateFilters, resetFilters, getMeta, retrieveUnit, unsetUnit, selectUnit
};
