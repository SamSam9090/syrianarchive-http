/* global locale */

import React, { Component } from 'react';
import {map, merge, omit} from 'lodash/fp';
import Select from 'react-select';
import {databaseApiUrl} from '../../../env';

import t from '../../../translations';

const mapW = map.convert({cap: false});

let timeout = null;

const timeMeOut = (func) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    func();
  }, 500);
};

const violationtypes = [
  {
    value: 'Massacres_and_other_unlawful_killing',
    label: 'Massacres_and_other_unlawful_killing'
  },
  {
    value: 'Arbitrary_arrest_and_unlawful_detention',
    label: 'Arbitrary_arrest_and_unlawful_detention'
  },
  {
    value: 'Hostage_taking',
    label: 'Hostage_taking'
  },
  {
    value: 'Enforced_disappearance',
    label: 'Enforced_disappearance'
  },
  {
    value: 'Torture_and_ill_treatment_of_detainees',
    label: 'Torture_and_ill_treatment_of_detainees'
  },
  {
    value: 'Sexual_and_gender_based_violence',
    label: 'Sexual_and_gender_based_violence'
  },
  {
    value: 'Violations_of_childrens_rights',
    label: 'Violations_of_childrens_rights'
  },
  {
    value: 'Unlawful_attacks',
    label: 'Unlawful_attacks'
  },
  {
    value: 'Violations_against_specifically_protected_persons_and_objects',
    label: 'Violations_against_specifically_protected_persons_and_objects'
  },
  {
    value: 'Use_of_illegal_weapons',
    label: 'Use_of_illegal_weapons'
  },
  {
    value: 'Sieges_and_violations_of_economic_social_and_cultural_rights',
    label: 'Sieges_and_violations_of_economic_social_and_cultural_rights'
  },
  {
    value: 'Arbitrary_and_forcible_displacement',
    label: 'Arbitrary_and_forcible_displacement'
  },
];

export default class Investigations extends Component {
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
      selectedUnit: {}
    };
  }

  componentDidMount() {
    this.updateFilters({});
  }

  updateFilters(filters) {
    const f = merge(this.state.filters, filters);
    fetch(`${databaseApiUrl}/units`, // eslint-disable-line
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(f)
      })
      .then(r => r.json())
      .then(d => this.setState({ds: d.units, filters: f, stats: d.stats}))
      .then(() => console.log(this.state));
  }

  search(e) {
    console.log(e.target.value);
    const term = e.target.value;
    timeMeOut(() => this.updateFilters({term}));
    // clearTimeout(timeout);
    // timeout = setTimeout(() => {
    //   this.updateFilters({term});
    // }, 500);
  }

  typechange(val) {
    const v = val ? val.value : '';
    this.updateFilters({type_of_violation: v});
  }

  afterchange(e) {
    const date = e.target.value;
    timeMeOut(() => {
      const d = Date.parse(date);
      console.log(d);
      if (d) {
        this.updateFilters({after: date});
      }
    });
  }

  beforechange(e) {
    const date = e.target.value;
    timeMeOut(() => {
      const d = Date.parse(date);
      console.log(d);
      if (d) {
        this.updateFilters({before: date});
      }
    });
  }

  selectUnit(u) {
    this.setState(merge(this.state, {selectedUnit: u}));
  }
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="col-3">
            <h6>{ t('Violations Evidence Database', locale)}</h6>
            <h3>Filters</h3>

            <h5>Search</h5>
            <input type="text" onChange={this.search} />
            <h5>Type of Violation</h5>
            <Select
              name="type_of_violation"
              value={this.state.filters.type_of_violation}
              options={violationtypes}
              onChange={this.typechange}
            />
            <h5>after date</h5>
            <input id="date" type="text" onChange={this.afterchange} />
            <h5>before date</h5>
            <input id="date" type="text" onChange={this.beforechange} />
            <hr />
          </div>
          <div className="col-6">
            <h3>Incidents</h3>
            page {this.state.stats.page}
            - {this.state.stats.current}
            /{this.state.stats.total} verified evidences
            <hr />
            {map(i =>
              <div>
                <div>{i.reference_code}</div>
                <div>{i.incident_date} - {i.description}</div>
                <button onClick={() => this.selectUnit(i)}>S</button>
                <hr />
              </div>
            , this.state.ds)}
          </div>
          <div className="col-3">
            {mapW((v, k) =>
              <div><b>{k}</b>: {String(v)}</div>
            , omit('type_of_violation', this.state.selectedUnit))}

          </div>
        </div>
      </div>
    );
  }
}
