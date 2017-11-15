import React, { Component } from 'react';
import {isEmpty} from 'lodash/fp';
import t from '../../../translations';

import {unitTitle} from '../containers/helpers';

// const mapW = map.convert({cap: false});
// {mapW((v, k) =>
//   <div><b>{k}</b>: {String(v)}</div>
// , omit('type_of_violation', i))}

const fixurl = url => url.replace('/var/www/files', 'http://media.newsy.org');

export default class Unit extends Component {
  render() {
    const i = this.props.unit;
    if (isEmpty(i)) {
      return <div />;
    }

    const content = (
      <div className="columns unit">
        <div className="col-6 meta">

          <video src={fixurl(i.filename || '')} controls>
            {`Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="videofile.webm">download it</a>
            and watch it with your favorite video player!`}
          </video>

          <small>
            {t('Online Link')}
          </small>
          <h5><a href={i.online_link}>{i.online_link}</a></h5>

          <small>
            {t('Meta')}
          </small>
          <h6>md5 {i.md5_hash} - {t('acquired')} {i.date_of_acquisition}</h6>

        </div>
        <div className="col-6 meta">

          <h2>{unitTitle(i)}</h2>

          <small>
            {t('Incident Occurred at')}:
          </small>
          <h3>{i.incident_date}</h3>
          <h4>{i.incident_time}</h4>

          <small>
            {t('Location')}:
          </small>
          <h5>
            {i.location}
          </h5>

          <small>
            {t('Precise Location')}:
          </small>
          <h5>
            {i.latitude}
            {i.longitude}
          </h5>

          <small>
            {t('Acquired From')}:
          </small>
          <h5>
            {i.acquired_from}
          </h5>

          <small>
            {t('Weapons Used')}:
          </small>
          <h5>
            {i.weapons_used}
          </h5>


        </div>
      </div>);
    return (
      <div className="modal modal-lg active">
        <div className="modal-overlay" />
        <div className="modal-container">
          <div className="modal-header">
            <button onClick={this.props.clear} className="btn btn-clear float-right" />
            <div className="modal-title h5">{i.reference_code}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              {content}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={this.props.clear} className="btn">
              {t('Close')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
