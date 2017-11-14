import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './history';

import '../scss/main.scss';

import App from './containers/App';

import {store} from './store';

render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <div>
        <Route path="/:ar/" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('js-root')
);
