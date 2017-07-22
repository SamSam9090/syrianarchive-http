
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Investigations from './Investigations';
import Database from './Database';

export default class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Switch>
            <Route path="/:locale/investigations" component={Investigations} />
            <Route path="/:locale/database" component={Database} />
          </Switch>
        </div>
      </div>
    );
  }
}
