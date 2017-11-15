import React, { Component } from 'react';

import {map} from 'lodash/fp';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ListEvidence from './ListEvidence';
import Unit from './Unit';

import t from '../../../translations';
import {timeMeOut} from '../containers/helpers';
import {params} from '../params';

import {violationtypes} from '../violationtypes';

export default class DatabaseComponent extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.typechange = this.typechange.bind(this);
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

  selectchange(key, val) {
    const v = val ? val.value : '';
    this.props.update({[key]: v});
  }

  afterchange(e) {
    const date = e;
    timeMeOut(() => {
      const d = Date.parse(date);
      if (d) {
        this.props.update({after: date});
      }
    });
  }

  beforechange(e) {
    const date = e;
    timeMeOut(() => {
      const d = Date.parse(date);
      if (d) {
        this.props.update({before: date});
      }
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

    return (
      <div className="container database">
        <Unit unit={selectedUnit} clear={clearUnit} />

        <div className="columns stats">
          <div className="col-3">
            {t('Filters')}
          </div>
          <div className="col-6">
            {t('Results')}: {stats.current} ({t('Page')} {stats.page})
          </div>
          <div className="col-3">
            {meta.verified} {t('verified')} {meta.total} {t('collected')}
          </div>
        </div>

        <div className="columns dbwrapper">

          <div className="col-3 filters">

            <div className="filter">
              <h5>{ t('Search')}</h5>
              <input value={this.state.searchterm} type="text" onChange={this.search} />
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
              <h5>{t('After Date')}</h5>
              <DatePicker
                selected={filters.after}
                onChange={this.afterchange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>{t('Before Date')}</h5>
              <DatePicker
                selected={filters.before}
                onChange={this.beforechange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>{t('Location')}</h5>
              <Select
                name="location"
                value={filters.location}
                options={map(w => ({value: w, label: t(w)}), meta.locations)}
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

          <div className="col-9 db" style={updating ? {opacity: '.3'} : {}}>
            {map(i =>
              <ListEvidence unit={i} selector={() => selectUnit(i)} />
            , units)}
          </div>
        </div>

        <div className="columns">
          <div className="col-3" />
          <div className="col-9">
            <h3>... {stats.current} {t('more.  Contact us for the full set')}</h3>
          </div>
        </div>

      </div>
    );
  }
}
