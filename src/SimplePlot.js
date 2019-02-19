import React, { Component } from 'react';
import Plot from 'react-plotly.js';
class SimplePlot extends Component {
    constructor(props){
        super(props);
    }

  render() {
    return (
      <div>
        <Plot data={[{
            x: [1, 2, 3],
            y: [0, 1, 0],
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'red'},
        },{
            x: [2.5, 4, 5],
            y: [0, 1, 0],
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'blue'},
        }]}
        layout={ {width: 500, height: 400, title: 'Input one'} }
        />
      </div>
    );
  }
}

export default SimplePlot;
