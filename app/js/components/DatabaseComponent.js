import React, { Component } from 'react';
import moment from 'moment';

import {map, isEmpty} from 'lodash/fp';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ListEvidence from './ListEvidence';
import Unit from './Unit';

import t from '../../../translations';
import {timeMeOut, location} from '../containers/helpers';
import {params} from '../params';

import {violationtypes} from '../violationtypes';

export default class DatabaseComponent extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.typechange = this.typechange.bind(this);
    this.collectionchange = this.collectionchange.bind(this);

    this.afterchange = this.afterchange.bind(this);
    this.beforechange = this.beforechange.bind(this);

    this.state = {
      searchterm: params.filters.term || this.props.filters.term,
      typing: false,
    };
  }

  componentDidMount() {
    // stuff in url gets priority over stuff from localstorage
    const h = params.unit;
    if (h) {
      this.props.getUnit(h);
    }
    this.props.update(params.filters);
  }

  search(e) {
    this.setState({typing: true});
    const term = e.target.value;
    this.setState({searchterm: term});
    timeMeOut(() => {
      this.props.update({term});
      this.setState({typing: false});
    });
  }

  typechange(val) {
    const v = val ? val.value : '';
    this.props.update({type_of_violation: v});
  }
  collectionchange(val) {
    const v = val ? val.value : '';
    this.props.update({collection: v});
  }
  selectchange(key, val) {
    const v = val ? val.value : '';
    this.props.update({[key]: v});
  }

  afterchange(e) {
    const date = e;
    timeMeOut(() => {
      const d = date ? moment(date).format('YYYY-MM-DD') : null;
      this.props.update({after: d});
    });
  }

  beforechange(e) {
    const date = e;
    timeMeOut(() => {
      const d = date ? moment(date).format('YYYY-MM-DD') : null;
      this.props.update({before: d});
    });
  }

  render() {
    const updating = this.props.updating || this.state.typing;
    const {
      filters,
      stats,
      clearUnit,
      selectUnit,
      reset,
      selectedUnit,
      meta,
      units,
    } = this.props;

    console.log(meta);

    const us = map(i =>
      <ListEvidence unit={i} selector={() => selectUnit(i)} />
      , units);
    return (
      <div className="container database">
        <Unit unit={selectedUnit} clear={clearUnit} />

        <div className="columns stats">
          <div className="col-3">
            
          </div>
          <div className="col-6">
            {t('Results')}: {stats.current} ({t('Page')} {stats.page})
          </div>
          <div className="col-3">
            {meta.verified} {t('verified')} {meta.total} {t('collected')}
          </div>
        </div>

        <div className="columns dbwrapper">

          <div className="col-3 col-sm-12 filters">

            <div className="filter">
              <h5>{ t('Search')}</h5>
              <input value={this.state.searchterm} type="text" onChange={this.search} />
              <h5><small>{ t('Limited to 100 results')}</small></h5>
            </div>

            <div className="filter">
              <h5>{t('Type of Violation')}</h5>
              <Select
                name="type_of_violation"
                value={filters.type_of_violation}
                options={violationtypes}
                onChange={this.typechange}
              />
            </div>

            <div className="filter">
              <h5>{t('Collection')}</h5>
              <Select
                name="collection"
                value={filters.collection}
                options={map(f => ({label: f, value: f}), meta.collections)}
                onChange={this.collectionchange}
              />
            </div>

            <div className="filter">
              <h5>{t('After Date')}</h5>
              <DatePicker
                selected={filters.after ? moment(filters.after) : undefined}
                onChange={this.afterchange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>{t('Before Date')}</h5>
              <DatePicker
                selected={filters.before ? moment(filters.before) : undefined}
                onChange={this.beforechange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>{t('Location')}</h5>
              <Select
                name="location"
                value={filters.location}
                options={map(w => ({value: w, label: location(w)}), meta.locations)}
                onChange={v => this.selectchange('location', v)}
              />
            </div>

            <div className="filter">
              <h5>{t('Weapons Used')}</h5>
              <Select
                name="weapons_used"
                value={filters.weapons_used}
                options={map(w => ({value: w, label: w}), meta.weapons)}
                onChange={v => this.selectchange('weapons_used', v)}
              />
            </div>

            <div className="filter">
              <button className="btn" onClick={reset}>
                {t('Reset')}
              </button>
            </div>
          </div>

          <div className="col-9 col-sm-12 db" style={updating ? {opacity: '.3'} : {}}>
            {isEmpty(us) ?
              <h4 className="noresults">{t('No results. Please try a different search.')}</h4>
            : us}
          </div>
        </div>

        <div className="columns">
          <div className="col-3 col-sm-12" />
          <div className="col-9 col-sm-12">
            {stats.current - 50 > 0 ?
              <h3>... {stats.current - 50} {t('more.  Contact us for the full set')}</h3>
            : ''}
          </div>
        </div>

      </div>
    );
  }
}
