/* global locale */
import React, { Component } from 'react';
import {map, merge} from 'lodash/fp';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ListEvidence from './listevidence';
import Unit from './Unit';

import t from '../../../translations';
import {api, timeMeOut, updateQS, query} from './helpers';

import {violationtypes} from '../violationtypes';

export default class Database extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.typechange = this.typechange.bind(this);
    this.afterchange = this.afterchange.bind(this);
    this.beforechange = this.beforechange.bind(this);
    this.selectUnit = this.selectUnit.bind(this);
    this.clearUnit = this.clearUnit.bind(this);
    this.resetFilters = this.resetFilters.bind(this);

    this.state = {
      ds: [],
      filters: {
        term: '',
        type_of_violation: '',
        before: '',
        after: '',
        page: 1,
        unit: '',
      },
      stats: { page: 1 },
      meta: {},
      selectedUnit: {}
    };
  }

  componentDidMount() {
    this.getMeta()
      .then(() => this.updateFilters(query()))
      .catch(console.log);
    const h = query().unit;
    if (h) {
      return api.get(`units/${h}`)
        .then(r => this.selectUnit(r));
    }
  }

  getMeta() {
    return api.get('meta').then(r => this.setState({meta: r}));
  }

  updateFilters(filters) {
    const f = merge(this.state.filters, filters);
    return api.post('units', f)
      .then(d => this.setState({ds: d.units, filters: f, stats: d.stats}))
      .then(() => updateQS(f));
  }

  search(e) {
    const term = e.target.value;
    const f = merge(this.state.filters, {term});
    this.setState({filters: f});
    timeMeOut(() => this.updateFilters(f));
  }

  typechange(val) {
    const v = val ? val.value : '';
    this.updateFilters({type_of_violation: v});
  }

  selectchange(key, val) {
    const v = val ? val.value : '';
    this.updateFilters({[key]: v});
  }

  afterchange(e) {
    const date = e;
    timeMeOut(() => {
      const d = Date.parse(date);
      if (d) {
        this.updateFilters({after: date});
      }
    });
  }

  beforechange(e) {
    const date = e;
    timeMeOut(() => {
      const d = Date.parse(date);
      if (d) {
        this.updateFilters({before: date});
      }
    });
  }

  clearUnit() {
    this.setState({selectedUnit: {}, filters: {unit: ''}});
    updateQS(merge(this.state.filters, {unit: ''}));
  }

  selectUnit(u) {
    this.setState(merge(this.state, {selectedUnit: u, filters: {unit: u.reference_code}}));
    updateQS(merge(this.state.filters, {unit: u.reference_code}));
  }

  resetFilters() {
    const f = {};
    return api.post('units', f)
      .then(d => this.setState({ds: d.units, filters: f, stats: d.stats}))
      .then(() => updateQS(f));
  }

  render() {
    return (
      <div className="container database">

        <Unit unit={this.state.selectedUnit} clear={this.clearUnit} />

        <div className="columns stats">
          <div className="col-8">
            Results: {this.state.stats.current} (page {this.state.stats.page})
          </div>
          <div className="col-4">
            {this.state.meta.verified} verified public units
            {this.state.meta.total} total collected
          </div>
        </div>

        <div className="columns dbwrapper">

          <div className="col-3 filters">

            <div className="filter">
              <h5>{ t('Search', locale)}</h5>
              <input value={this.state.filters.term} type="text" onChange={this.search} />
            </div>

            <div className="filter">
              <h5>Type of Violation</h5>
              <Select
                name="type_of_violation"
                value={this.state.filters.type_of_violation}
                options={violationtypes}
                onChange={this.typechange}
              />
            </div>

            <div className="filter">
              <h5>After Date</h5>
              <DatePicker
                selected={this.state.filters.after}
                onChange={this.afterchange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>Fefore Date</h5>
              <DatePicker
                selected={this.state.filters.before}
                onChange={this.beforechange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>Location</h5>
              <Select
                name="location"
                value={this.state.filters.location}
                options={map(w => ({value: w, label: w}), this.state.meta.locations)}
                onChange={v => this.selectchange('location', v)}
              />
            </div>

            <div className="filter">
              <h5>Weapons Used</h5>
              <Select
                name="weapons_used"
                value={this.state.filters.weapons_used}
                options={map(w => ({value: w, label: w}), this.state.meta.weapons)}
                onChange={v => this.selectchange('weapons_used', v)}
              />
            </div>

            <div className="filter">
              <button className="btn" onClick={this.resetFilters}>Reset</button>
            </div>
          </div>

          <div className="col-9 db">
            {map(i =>
              <ListEvidence unit={i} selector={() => this.selectUnit(i)} />
            , this.state.ds)}
          </div>
        </div>

        <div className="columns">
          <div className="col-3" />
          <div className="col-9">
            <h3>and {this.state.stats.current} more.  Contact us for the full set</h3>
          </div>
        </div>

      </div>
    );
  }
}
