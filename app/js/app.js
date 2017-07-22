import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';


import App from './containers/App';


render(
  <BrowserRouter>
    <div>
      <Route path="/:ar/" component={App} />
    </div>
  </BrowserRouter>,
  document.getElementById('js-root')
);
