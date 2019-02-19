import React, { Component } from 'react';
import Plot from 'react-plotly.js';
//import fuzzylogic from 'fuzzylogic';

class FuzzyGaussBell extends Component {
    constructor(props){
        super(props);
        this.state={
            members:props.members,
            height:props.height,
         width:props.width,
         value:props.value,
         title:props.title,
         x:props.x,
         decimals:this.GetDecimals(props.x[1])
        };
    }
    componentDidMount(){
        this.RenderGauss(this.CalculateX(this.state.x));
    }
    GetDecimals(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}
        
    RenderGauss(x){
        var members=this.state.members.map(function(item,i){
            var y=this.CalculateY(item,x);
            return {
            x:x,
            y:y,
            name:item.txt,
            membershipValue:y[x.findIndex(val=> val===this.state.value.toFixed(this.state.decimals))]
        };
        },this);
        var max= Math.max.apply(Math, members.map(function(o) { return o.membershipValue; }));
        
        var Dot= members.filter(val=> val.membershipValue===max);
        if(Dot.length>0){
        members.push({type:'scatter',name:Dot[0].name,x:[this.state.value],y:[Dot[0].membershipValue],showlegend:false});
        }
        this.setState({members:members});
    }
    CalculateX(x){
        var X=[];var auxVal=x[0];
        while(auxVal<x[2]){
            auxVal= auxVal+x[1];
            X.push(auxVal.toFixed(this.state.decimals));
        }
        return X;
    }
    CalculateY(member,xValues){
     return xValues.map(function(x){ 
         return (1/(1+Math.pow( (x-member.c)/member.a,(2*member.b) )));
     });
    }
    GetBellValues(x,params){
        var X=[];var auxVal=x[0];
        var Y=[];
        while(auxVal<x[2]){
            auxVal= auxVal+x[1];
            X.push(auxVal);
            Y.push(1/(1+Math.pow( (auxVal-params.c)/params.a,(2*params.b) )));
        }
        return {x:X,y:Y};
    }
    
  render() {
    return (
      <div>
        <Plot data={this.state.members}
        layout={ {width: this.state.width, height: this.state.height, title: this.state.title} }
        />
      </div>
    );
  }
}

export default FuzzyGaussBell;
