/* global locale */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

import {map} from 'lodash/fp';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import ListEvidence from './listevidence';
import Unit from './Unit';

import t from '../../../translations';
import {timeMeOut} from './helpers';
import {params} from '../params';

import {violationtypes} from '../violationtypes';

import {updateFilters, resetFilters, selectUnit, retrieveUnit, unsetUnit} from '../redux/actions';

export class DatabaseComponent extends Component {
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

  clearUnit() {
    this.setState({selectedUnit: {}, filters: {unit: ''}});
  }

  selectUnit(u) {
    this.props.selectUnit(u);
  }

  render() {
    const updating = this.props.updating || this.state.typing;

    return (
      <div className="container database">
        <Unit unit={this.props.selectedUnit} clear={this.props.clearUnit} />

        <div className="columns stats">
          <div className="col-8">
            Results: {this.props.stats.current} (page {this.props.stats.page})
          </div>
          <div className="col-4">
            {this.props.meta.verified} verified public units
            {this.props.meta.total} total collected
          </div>
        </div>

        <div className="columns dbwrapper">

          <div className="col-3 filters">

            <div className="filter">
              <h5>{ t('Search', locale)}</h5>
              <input value={this.state.searchterm} type="text" onChange={this.search} />
            </div>

            <div className="filter">
              <h5>Type of Violation</h5>
              <Select
                name="type_of_violation"
                value={this.props.filters.type_of_violation}
                options={violationtypes}
                onChange={this.typechange}
              />
            </div>

            <div className="filter">
              <h5>After Date</h5>
              <DatePicker
                selected={this.props.filters.after}
                onChange={this.afterchange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>Fefore Date</h5>
              <DatePicker
                selected={this.props.filters.before}
                onChange={this.beforechange}
                dateFormat="YYYY-MM-DD"
              />
            </div>

            <div className="filter">
              <h5>Location</h5>
              <Select
                name="location"
                value={this.props.filters.location}
                options={map(w => ({value: w, label: w}), this.props.meta.locations)}
                onChange={v => this.selectchange('location', v)}
              />
            </div>

            <div className="filter">
              <h5>Weapons Used</h5>
              <Select
                name="weapons_used"
                value={this.props.filters.weapons_used}
                options={map(w => ({value: w, label: w}), this.props.meta.weapons)}
                onChange={v => this.selectchange('weapons_used', v)}
              />
            </div>

            <div className="filter">
              <button className="btn" onClick={this.props.reset}>Reset</button>
            </div>
          </div>

          <div className="col-9 db" style={updating ? {opacity: '.3'} : {}}>
            {map(i =>
              <ListEvidence unit={i} selector={() => this.selectUnit(i)} />
            , this.props.units)}
          </div>
        </div>

        <div className="columns">
          <div className="col-3" />
          <div className="col-9">
            <h3>and {this.props.stats.current} more.  Contact us for the full set</h3>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('mapping', state, ownProps);
  return {
    filters: state.database.filters,
    stats: state.database.stats,
    updating: state.database.updating,
    units: state.database.ds,
    meta: state.meta,
    selectedUnit: state.unit.meat,
  };
};

const mapDispatchToProps = dispatch => ({
  update: (f) => dispatch(updateFilters(f)),
  reset: () => dispatch(resetFilters()),
  getUnit: (id) => dispatch(retrieveUnit(id)),
  selectUnit: (u) => dispatch(selectUnit(u)),
  clearUnit: () => dispatch(unsetUnit()),
});

const Database = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DatabaseComponent));

export default Database;
