export const fuzzy= {
  decimals:0,
  jsonData:[],
  members:[],
  isEditing:false,
  x:[0,0.1,100],
  selectedMember:{
    txt:'',
    a:0,
    b:0,
    c:0
  },
  CalculateX:function(x){
       var X=[];var auxVal=x[0];
      this.decimals= this.GetDecimals(x);
        while(auxVal<x[2]){
            auxVal= auxVal+x[1];
            //console.log(auxVal);
            X.push(auxVal.toFixed(this.decimals));
        }
        return X;
  },
   GetDecimals:function(value) {
         try{
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
         }catch{
             return 0;
         }
    },
    CalculateYTriangle:function(member,xValues){
     return xValues.map(function(x){ 
         return Math.max(Math.min( (x-member.a)/(member.b-member.a),(member.c-x)/(member.c-member.b) ),0);
     });
    },
    CalculateYGauss:function(member,xValues){
     return xValues.map(function(x){ 
         return (1/(1+Math.pow( (x-member.c)/member.a,(2*member.b) )));
     });
    },
    CalculateYTrapezoid:function(member,xValues){
        return xValues.map(function(x){
            return Math.max(Math.min(((x-member.a)/(member.b-member.a)),1,((member.d-x)/(member.d-member.c))),0);
        });
    },
    FuzzyInput:function(val,members){
        var data= members;
        if(data.length>0 || val!==''){
            data= data.filter(f=> f.element!=='dot');
            data.forEach(function(item,i){
                data[i].membershipValue=item.y[item.x.findIndex(mv=> mv===parseFloat(val).toFixed(this.decimals))];
           // console.log(data[i]);
            },this);
            //console.log(data);
        var max= Math.max.apply(Math, data.map(function(o) { return o.membershipValue; }));
        var Dot= data.filter(val=> val.membershipValue===max);
        //console.log(Dot[0]);
        if(Dot.length>0){
        data.push({type:'scatter',name:Dot[0].name,x:[val],y:[Dot[0].membershipValue],showlegend:false,element:'dot'})
        }
        }
        return {value:val,json:data,fuzzyValue:Dot[0].membershipValue};
    },
    FuzzyTriangle:function(x,memberValues){
        return {
            x: x,
            y: this.CalculateYTriangle(memberValues,x),//[0, 1, 0],
            type: 'scatter',
            name:memberValues.txt, 
            membershipValue:0,
            element:'line',
            showlegend:true,
            mode: 'lines+points'
        };
    },
    FuzzyGaussBell:function(x,memberValues){
        return {
            x: x,
            y: this.CalculateYGauss(memberValues,x),
            type: 'scatter',
            name:memberValues.txt,
            membershipValue:0,
            element:'line',
            showlegend:true,
            mode: 'lines+points'
        };
    },
    FuzzyTrapezoid:function(x,memberValues){
        return {
            x: x,
            y: this.CalculateYTrapezoid(memberValues,x),
            type: 'scatter',
            name:memberValues.txt,
            membershipValue:0,
            element:'line',
            showlegend:true,
            mode: 'lines+points'
        };
    },
   AddMember(member){
    this.jsonData.push(member);
   },
   RemoveMember(memberName){
    this.jsonData= this.jsonData.filter(f=> f.name!==memberName);
   }
};