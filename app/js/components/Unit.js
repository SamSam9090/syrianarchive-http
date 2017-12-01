/* global locale */
import React, { Component } from 'react';
import {isEmpty, map, compact} from 'lodash/fp';
import t from '../../../translations';

import {unitTitle, location} from '../containers/helpers';

const mapW = map.convert({cap: false});
// const mapW = map.convert({cap: false});
// {mapW((v, k) =>
//   <div><b>{k}</b>: {String(v)}</div>
// , omit('type_of_violation', i))}

const fixurl = url => url.replace('/var/www/files', 'http://media.newsy.org');

export default class Unit extends Component {
  componentDidMount() {
    window.onpopstate = this.props.clear;
  }

  render() {
    const i = this.props.unit;
    if (isEmpty(i)) {
      document.getElementsByTagName( 'html' )[0].classList.remove('fixmod');
      return <div />;
    }
    const graphic = !(i.graphic_content === false);
    document.getElementsByTagName( 'html' )[0].classList.add('fixmod');
    console.log(i);

    const content = (
      <div className="columns unit">
        <div className="col-6 col-sm-12 meta">

          {graphic &&
            <small className="warning"> {t('Warning: this video may contain graphic content')} </small>
          }

          <video src={fixurl(i.filename || '')} controls>
            {`Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="videofile.webm">download it</a>
            and watch it with your favorite video player!`}
          </video>

          <small>
            {t('Online Link')}
          </small>
          <h6><a href={i.online_link}>{i.online_link}</a></h6>

          <small>
            {t('Meta')}
          </small>
          <h6>md5 {i.md5_hash} - {t('acquired')} {i.date_of_acquisition}</h6>

        </div>
        <div className="col-6 col-sm-12 meta">

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
            {location(i.location)}
          </h5>

          <small>
            {t('Precise Location')}:
          </small>
          <h5>
            {i.latitude} {i.longitude}
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
            {i.weapons_used.join(', ')}
          </h5>

          <small>
            {t('Collections')}:
          </small>
          <h5>
            {i.collections.join(', ')}
          </h5>

          <small>
            {t('Type of Violation')}:
          </small>
          <h5>
            {compact(mapW((k, v) => (k ? t(v) : ''), i.type_of_violation)).join(', ')}
          </h5>


        </div>
      </div>);
    return (
      <div className="modal modal-lg active">
        <div className="modal-overlay" />
        <div className="modal-container">
          <div className="modal-body">
            <div className="modal-header">
              <button onClick={this.props.clear} className="btn btn-clear float-right" />
              <a href="/">{t('Syrian Archive')}</a> -
              <a href={`/${locale}/database`}> {t('Verified Violations Database')}</a> - {t('Verified Unit')}: {i.reference_code}
            </div>
            <div className="content">
              {content}
            </div>
            <div className="modal-footer">
              <button onClick={this.props.clear} className="btn">
                {t('Close')}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
