import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import fuzzylogic from 'fuzzylogic';
import {fuzzy} from './fuzzy-basic';
class InputFuzzy extends Component {
    constructor(props){
        super(props);
        this.state={type:props.type,
                    members:[],//[{a:0,b:0,c:30,txt:'poco'}],
                    isEditing:false,
                    x:[0,0.1,100],
                    selectedMember:{
                        txt:'',
                        a:0,
                        b:0,
                        c:0,
                        d:0
                    },
                    json:[],
                    decimals:0
                   };
        this.RenderType= this.RenderType.bind(this);
        this.CancelEdit= this.CancelEdit.bind(this);
        this.ChangeName= this.ChangeName.bind(this);
        this.ChangeX= this.ChangeX.bind(this);
        this.ChangeA= this.ChangeA.bind(this);
        this.ChangeB= this.ChangeB.bind(this);
        this.ChangeC= this.ChangeC.bind(this);
        this.AddMember= this.AddMember.bind(this);
        this.ChangeValue= this.ChangeValue.bind(this);
        this.Edit= this.Edit.bind(this);
        this.RemoveMember= this.RemoveMember.bind(this);
    }
 
    ReloadMember(members,json,member){
        members.push(member);
        var x= fuzzy.CalculateX(this.state.x);
        var y=[];
        switch(this.state.type){
            case 'triangle':
                y= fuzzy.CalculateYTriangle(member,x);
                break;
            case 'gauss':
                y= fuzzy.CalculateYGauss(member,x);
                break;
            case 'trapezoid':
                
                break;
        }
        json.push({
            x: x,
            y: y,
            type: 'scatter',
            name:member.txt,
            membershipValue:0,
            element:'line',
            showlegend:true,
            mode: 'lines+points',
        });
        this.setState({selectedMember:member,members:members,json:json});
    }
    AddMember(){
        var members=this.state.members;
        var x= fuzzy.CalculateX(this.state.x);
        var data=[];
        members.push(this.state.selectedMember);
        switch(this.state.type){
            case 'triangle':
                data=members.map(function(item,i){
            return fuzzy.FuzzyTriangle(x,item);
        },this);
                break;
            case 'trapezoid':
                
                break;
            case 'gauss':
                data=members.map(function(item,i){
            return fuzzy.FuzzyGaussBell(x,item);
        },this);
                break;
        }
        this.setState({members:members,json:data});
        this.refs.name.value='';
        this.refs.a.value='';
        this.refs.b.value='';
        this.refs.c.value='';
    }
    ChangeName(val){
        //console.log(val.target.value);
        var selectedMember= this.state.selectedMember;
        selectedMember.txt=val.target.value;
        this.setState({selectedMember:selectedMember});
    }
    ChangeX(val){
        try{
            var x=JSON.parse('['.concat(val.target.value,']'));
            var decimals= fuzzy.GetDecimals(x);
            this.setState({x:x,decimals:decimals});   
        }catch{
            
            }
    }
    ChangeA(val){
        var member=this.state.selectedMember;
        member.a=val.target.value;
        if(this.state.isEditing){
            var members= this.state.members.filter(f=> f.txt!==this.refs.name.value);
            var json= this.state.json.filter(f=> f.name!==this.refs.name.value);
          this.ReloadMember(members,json,member);
        }else{
            this.setState({selectedMember:member});
        }
    }
    ChangeB(val){
        var member=this.state.selectedMember;
        member.b=val.target.value;
         if(this.state.isEditing){
            var members= this.state.members.filter(f=> f.txt!==this.refs.name.value);
            var json= this.state.json.filter(f=> f.name!==this.refs.name.value);
             this.ReloadMember(members,json,member);
         }else{
           this.setState({selectedMember:member});  
         }
    }
    ChangeC(val){
        var member=this.state.selectedMember;
        member.c=val.target.value;
        if(this.state.isEditing){
            var members= this.state.members.filter(f=> f.txt!==this.refs.name.value);
            var json= this.state.json.filter(f=> f.name!==this.refs.name.value);
         this.ReloadMember(members,json,member);
        }else{
            this.setState({selectedMember:member});
        }
    }
    ChangeValue(val){
        var fuzzyInput= fuzzy.FuzzyInput(val.target.value,this.state.json);
        this.setState({
            value:fuzzyInput.value,
            json:fuzzyInput.json
        });
        console.log(fuzzyInput.fuzzyValue);
    }
    SimpleInputs(){
        return <div style={{background:'gray'}}>
            <div style={{marginTop:'10px',background:'darkgray'}}>
            <div style={{display:'flex', flexDirection:'row',marginTop:'10px',background:'darkgray'}}>
                <label style={{width:'50px',float:'left'}}>x: </label>
                    <input onChange={this.ChangeX} style={{width:'100px',borderRadius:'5px'}} ref='x' type='text' placeholder='0,0.1,100' />
            </div>
            
                    <div style={{display:'flex', flexDirection:'row',marginTop:'10px',background:'darkgray'}}>
                <label style={{width:'50px',float:'left'}}>Value: </label>
                    <input onChange={this.ChangeValue} style={{width:'100px',borderRadius:'5px'}} ref='value' type='number' step={this.state.x[1]} max={this.state.x[2]} min={this.state.x[0]} placeholder='value' />
            </div>
                   </div>
                    <br></br>
            
            <div style={{display:'flex', flexDirection:'row',marginTop:'10px'}}>
                <label style={{width:'50px'}}>Name: </label>
                    <input onChange={this.ChangeName} style={{width:'100px',borderRadius:'5px'}} type='text' ref='name' placeholder={'Member '.concat(this.state.members.length+1)} />
            </div>
            
            <div style={{display:'flex', flexDirection:'row'}}>
                <label style={{width:'50px',float:'left'}}>a: </label>
                    <input onChange={this.ChangeA} style={{width:'100px',borderRadius:'5px'}} type='number' ref='a'  placeholder='0' step={this.state.x[1]} max={this.state.x[2]} min={this.state.x[0]}/>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
                <label style={{width:'50px',float:'left'}}>b: </label>
                    <input onChange={this.ChangeB} style={{width:'100px',borderRadius:'5px'}} type='number' ref='b' placeholder='0' step={this.state.x[1]} max={this.state.x[2]} min={this.state.x[0]}/>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
                <label style={{width:'50px',float:'left'}}>c: </label>
                    <input onChange={this.ChangeC} style={{width:'100px',borderRadius:'5px'}} type='number' ref='c' placeholder='0' step={this.state.x[1]} max={this.state.x[2]} min={this.state.x[0]}/>
            </div>
{this.Buttons()}
            </div>;
    }
    
    Buttons(){
        if(!this.state.isEditing){
        return <div><button style={{float:'right',borderRadius:'5px',border:'none',color:'white',background:'#0095ff',marginTop:'5px'}} onClick={this.AddMember}>Add member</button></div>;
    }else{
        return <div><button style={{float:'left',borderRadius:'5px',border:'none',color:'white',background:'darkred',marginTop:'5px'}} onClick={this.RemoveMember}>Remove</button>
            <button onClick={this.CancelEdit} style={{float:'right',borderRadius:'5px',border:'none',color:'white',background:'darkgray',marginTop:'5px'}}>Done</button>
            </div>;
    }
    }
    CancelEdit(){
        this.setState({isEditing:false});
        this.refs.name.value='';
        this.refs.a.value='';
        this.refs.b.value='';
        this.refs.c.value='';
        this.refs.name.disabled=false;
        this.refs.value.disabled=false;
        this.refs.x.disabled=false;
    }
    RemoveMember(){
        var members= this.state.members.filter(f=> f.txt!==this.state.selectedMember.txt);
        var json= this.state.json.filter(f=> f.name!==this.state.selectedMember.txt);
        this.setState({json:json,members:members,isEditing:false});
        this.refs.name.value='';
        this.refs.a.value='';
        this.refs.b.value='';
        this.refs.c.value='';
        this.refs.name.disabled=false;
        this.refs.value.disabled=false;
        this.refs.x.disabled=false;
    }
    Edit(data){
        if(data.points.length===1){
        var member=this.state.members.filter(f=> f.txt===data.points[0].data.name);
        this.refs.name.value=member[0].txt;
        this.refs.name.disabled=true;
        this.refs.value.disabled=true;
        this.refs.x.disabled=true;
        this.refs.a.value=member[0].a;
        this.refs.b.value=member[0].b;
        this.refs.c.value=member[0].c;
            this.setState({isEditing:true,selectedMember:member[0]});
        }else{
            alert('Please, leave just one member on plot to edit :)');
        }
        
    }
    RenderTriangleInputs(){
        return <div style={{display:'flex', flexDirection:'row'}}>
            {this.SimpleInputs()}
            <Plot
                data={this.state.json}
                layout={ {width: 400, height: 300, title: 'Fuzzy Input',dragmode:'lasso'} }
                config={{displayModeBar: false}}
                onClick={this.Edit}     
/>
            </div>
    }
    
    RenderTrapezoidInputs(){
        
    }
    
    RenderGaussInputs(){
        return <div style={{display:'flex', flexDirection:'row'}}>
            {this.SimpleInputs()}
        <Plot
                data={this.state.json}
                layout={ {width: 400, height: 300, title: 'Fuzzy Input'} }
                config={{displayModeBar: false}}
                onClick={this.Edit}
/>
            </div>;
    }
    
    RenderType(){
        switch(this.state.type){
                case 'triangle':
                return this.RenderTriangleInputs();
                case 'trapezoid':
                
                break;
                
                case 'gauss':
                return this.RenderGaussInputs();
            default:
                return <div></div>
        }
    }
  render() {
    return (
      <div>
        {this.RenderType()}
      </div>
    );
  }
}

export default InputFuzzy;