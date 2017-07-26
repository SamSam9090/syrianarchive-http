import React, { Component } from 'react';

export default class ListEvidence extends Component {
  render() {
    const i = this.props.unit;
    return (
      <div className="columns">
        <div className="col-2">{i.reference_code}</div>
        <div className="col-2">{i.incident_date}</div>
        <div className="col-4">{i.summary_en}</div>
        <div className="col-2">{i.location}</div>
        <div className="col-2">
          <button onClick={this.props.selector}>view</button>
        </div>
      </div>
    );
  }
}
