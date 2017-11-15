import React, { Component } from 'react';
import {map} from 'lodash/fp';
import {databaseApiUrl} from '../../../env';

import t from '../../../translations';

import {violationtypes} from '../violationtypes';

export default class Investigations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: {
        weapons: []
      },
    };
  }

  componentDidMount() {
    this.getMeta();
  }

  getMeta() {
    return fetch(`${databaseApiUrl}/meta`, // eslint-disable-line
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(r => r.json())
      .then(r => this.setState({meta: r}));
  }


  render() {
    console.log(this.state);
    return (
      <div className="container stats">

        <div className="columns">
          <div className="col-2">
            <b>{this.state.meta.verified}</b> { t('Verified Incidents')}
          </div>
          <div className="col-2">
            <b>{this.state.meta.total}</b> { t('Collected Evidence')}
          </div>
          <div className="col-2">
            <b>{this.state.meta.weapons.length}</b> { t('Identified Weapons')}
          </div>
        </div>

        <div className="columns">
          <div className="col-8">
            {map(v =>
              <div>
                <b>{v.label}</b>
              </div>
              , violationtypes)}
          </div>
        </div>

      </div>
    );
  }
}
