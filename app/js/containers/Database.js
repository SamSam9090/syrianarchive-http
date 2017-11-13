/* global locale */
import React, { Component } from 'react';
import {map, merge} from 'lodash/fp';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ListEvidence from './listevidence';
import Unit from './Unit';

import t from '../../../translations';
import {api, timeMeOut, updateQS} from './helpers';

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

    this.state = {
      ds: [],
      filters: {
        term: '',
        type_of_violation: '',
        before: '',
        after: '',
        page: 1,
      },
      stats: { page: 1 },
      meta: {},
      selectedUnit: {}
    };
  }

  componentDidMount() {
    this.getMeta()
      .then(() => this.updateFilters({}))
      .catch(console.log);
    const h = window.location.hash.substr(1);
    console.log('aaaaaaaaaaaa', h);
    console.log(`units/${h}`);
    if (h) {
      return api.get(`units/${h}`)
        .then(r => {
          console.log(r);
          console.log('wehheheheheh');
          this.setState({selectedUnit: r});
          return '';
        });
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
    timeMeOut(() => this.updateFilters({term}));
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

  selectUnit(u) {
    this.setState(merge(this.state, {selectedUnit: u}));
    window.location.hash = u.reference_code;
  }

  render() {
    return (
      <div className="container database">

        <Unit unit={this.state.selectedUnit} />


        <div className="columns stats">
          <div className="col-8">
            {this.state.meta.verified} verified units
            {this.state.meta.total} collected
          </div>
        </div>

        <div className="columns filters">

          <div className="col-2">
            <h5>{ t('Search', locale)}</h5>
            <input type="text" onChange={this.search} />
          </div>

          <div className="col-2">
            <h5>Type of Violation</h5>
            <Select
              name="type_of_violation"
              value={this.state.filters.type_of_violation}
              options={violationtypes}
              onChange={this.typechange}
            />
          </div>

          <div className="col-2">
            <h5>After Date</h5>
            <DatePicker
              selected={this.state.filters.after}
              onChange={this.afterchange}
              dateFormat="YYYY-MM-DD"
            />
          </div>

          <div className="col-2">
            <h5>Fefore Date</h5>
            <DatePicker
              selected={this.state.filters.before}
              onChange={this.beforechange}
              dateFormat="YYYY-MM-DD"
            />
          </div>

          <div className="col-2">
            <h5>Location</h5>
            <Select
              name="location"
              value={this.state.filters.location}
              options={map(w => ({value: w, label: w}), this.state.meta.locations)}
              onChange={v => this.selectchange('location', v)}
            />
          </div>

          <div className="col-2">
            <h5>Weapons Used</h5>
            <Select
              name="weapons_used"
              value={this.state.filters.weapons_used}
              options={map(w => ({value: w, label: w}), this.state.meta.weapons)}
              onChange={v => this.selectchange('weapons_used', v)}
            />
          </div>

          <hr />
        </div>

        <div className="columns">
          <div className="col-12">
            page {this.state.stats.page}
            - {this.state.stats.current}
            /{this.state.stats.total} verified evidences
            <hr />
            {map(i =>
              <ListEvidence unit={i} selector={() => this.selectUnit(i)} />
            , this.state.ds)}
          </div>
        </div>

        <div className="columns">
          <div className="col-12">
            <h3>and {this.state.stats.current} more.  Contact us for the full set</h3>
          </div>
        </div>

      </div>
    );
  }
}
