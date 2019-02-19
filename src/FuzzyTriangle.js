import React, { Component } from 'react';
import fuzzylogic from 'fuzzylogic';
import Plot from 'react-plotly.js';
class FuzzyTriangle extends Component {
    constructor(props){
        super(props);
        console.log(props);
     this.state={
         y:100,
         x:props.x,
         members:props.members,
         height:props.height,
         width:props.width,
         value:props.value,
         title:props.title,
         valueY:0,
         higherMember:'None',
         plotValues:[],
         decimals:this.GetDecimals(props.x[1])
     };   
        console.log(this.state);
        this.EditMember= this.EditMember.bind(this);
    }
    
    componentDidMount(){
        this.RenderTriangles(this.CalculateX(this.state.x));
    }
     GetDecimals(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
    }
    CalculateY(member,xValues){
     return xValues.map(function(x){ 
         return Math.max(Math.min( (x-member.a)/(member.b-member.a),(member.c-x)/(member.c-member.b) ),0);
     });
    }
    RenderTriangles(x){
        var pv=this.state.members.map(function(item,i){
            return {
            x: x,
            y: this.CalculateY(item,x),//[0, 1, 0],
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: this.getRandomColor()},
            name:item.txt,
            membershipValue:fuzzylogic.triangle(this.state.value, item.a, item.b, item.c),
            
        };
        },this);
        
        var max= Math.max.apply(Math, pv.map(function(o) { return o.membershipValue; }));
        var Dot= pv.filter(val=> val.membershipValue===max);
        //console.log(Dot[0]);
        if(Dot.length>0){
        pv.push({type:'scatter',name:Dot[0].name,x:[this.state.value],y:[Dot[0].membershipValue],showlegend:false})
        }
        this.setState({plotValues:pv});
        
        
    }
    
    getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
    CalculateX(x){
        var X=[];var auxVal=x[0];
        while(auxVal<x[2]){
            auxVal= auxVal+x[1];
            //console.log(auxVal);
            X.push(auxVal.toFixed(this.state.decimals));
        }
        
        return X;
    }
    EditMember(a){
        console.log('member');
        console.log(a);
        //console.log(a[0].data);
    }
  render() {
//      const styles={
//canvas:{
//    transform:'rotate(270deg)',
//    background:'white',
//    height:this.state.width,
//    width:this.state.height
//}
//};
    return (
        <div>
        <Plot 
        data={this.state.plotValues}
        layout={ {width: this.state.width, height: this.state.height, title: this.state.title} }
        />
        </div>
    );
  }
}

export default FuzzyTriangle;



//    RenderTriangles(){
//        const ctx = this.refs.canvas.getContext('2d');
//        var triangleArray=[];
//        this.state.members.forEach(function(triangle,i){
//            ctx.beginPath();
//            ctx.moveTo(0,triangle.a);
//            ctx.lineTo(this.state.y,triangle.b);
//            ctx.strokeStyle = '#'+Math.round((Math.random()*10)-1)+Math.round((Math.random()*10)-1)+''+Math.round((Math.random()*10)-1);
//            ctx.moveTo(this.state.y,triangle.b);
//            ctx.lineTo(0,triangle.c);
//            ctx.stroke();
//            triangleArray.push(fuzzylogic.triangle(this.state.value, triangle.a, triangle.b, triangle.c));
//        },this);
//        var maxMember=Math.max.apply(null,triangleArray);
//        ctx.beginPath();
//        ctx.strokeStyle='red';
//        console.log(maxMember*100);
//        console.log(triangleArray);
//        ctx.arc(maxMember*100,this.state.value,2,0,Math.PI*2);
//        ctx.stroke();
//        ctx.beginPath();
//        //ctx.rotate(Math.PI*3/(90*6));
//        
//        var label = maxMember+' '+ this.state.members[triangleArray.findIndex(item=> item===maxMember)].txt;
//        ctx.font= '5px Arial';
//        ctx.fillText(label, maxMember*100,this.state.value);
//        ctx.stroke();
//        this.setState({valueY:maxMember,higherMember:label});
//    }
//    
    