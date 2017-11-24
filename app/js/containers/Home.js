/* global locale */
import React, { Component } from 'react';
import {map} from 'lodash/fp';
import {databaseApiUrl} from '../../../env';

import t from '../../../translations';

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
    const vv = this.state.meta.verified ? this.state.meta.verified.toLocaleString() : '';
    const c = this.state.meta.total ? this.state.meta.total.toLocaleString() : '';

    return (
      <div className="container frontstats">

        <div className="columns">
          <div className="col-4 col-sm-12">
            <div className="statcol">
              <h6>
                { t('Verified Digital Content')}
              </h6>
              <h2>
                <b>{vv}</b> <small>{t('units')}</small>
              </h2>
            </div>
          </div>
          <div className="col-4 col-sm-12">
            <div className="statcol">
              <h6>
                { t('Collected Digital Content')}
              </h6>
              <h3>
                <b>{c}</b> <small>{t('units')}</small>
              </h3>
            </div>
          </div>
          <div className="col-2 col-sm-12">
            <div className="statcol">
              <h6>
                { t('Identified Weapons')}
              </h6>
              <h4>
                <b>{this.state.meta.weapons.length}</b>
              </h4>
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="col-12">
            <h5>{t('Types of Violations')}</h5>
            {map(v =>
              <div className="frontvio">
                <h6><a href={`/${locale}/database?type_of_violation=${v}`}>
                  {t(v)}
                </a></h6>
              </div>
              , this.state.meta.violationtypes)}
          </div>
        </div>

      </div>
    );
  }
}
