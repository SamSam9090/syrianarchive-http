import React, { Component } from 'react';
import {unitTitle, location} from '../containers/helpers';
import t from '../../../translations';

export default class ListEvidence extends Component {
  render() {
    const i = this.props.unit;
    return (
      <div className="columns item">
        <div className="col-1">
          <small>
            {i.reference_code}
          </small>
        </div>
        <div className="col-2">{i.incident_date}</div>
        <div className="col-6 dtitle">{unitTitle(i)}</div>
        <div className="col-2">{location(i.location)}</div>
        <div className="col-1">
          <button className="btn" onClick={this.props.selector}>
            {t('view')}
          </button>
        </div>
      </div>
    );
  }
}
