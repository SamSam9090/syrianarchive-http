import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import reader from './redux/reducers';

import {updateParams} from './params';

const persistedState =
 localStorage.getItem('reduxState') ?
   JSON.parse(localStorage.getItem('reduxState')) : {};

export const store = createStore(
  reader,
  persistedState,
  applyMiddleware(logger, thunkMiddleware)
);

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

store.subscribe(() => {
  updateParams(store.getState());
});

export default {store};
