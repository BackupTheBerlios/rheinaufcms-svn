function colorPicker(_1){
var _2=this;
this.callback=_1.callback?_1.callback:function(_3){
alert("You picked "+_3);
};
this.cellsize=_1.cellsize?_1.cellsize:"10px";
this.side=_1.granularity?_1.granularity:18;
this.value=1;
this.saved_cells=null;
this.table=document.createElement("table");
this.table.cellSpacing=this.table.cellPadding=0;
this.tbody=document.createElement("tbody");
this.table.appendChild(this.tbody);
this.table.style.border="1px solid WindowFrame";
this.table.style.backgroundColor="Window";
var tr=document.createElement("tr");
var td=document.createElement("td");
var _6=document.createElement("button");
_6.onclick=function(){
_2.close();
};
_6.appendChild(document.createTextNode("x"));
td.appendChild(_6);
td.style.position="relative";
td.style.verticalAlign="middle";
_6.style.cssFloat="right";
_6.style.styleFloat="right";
td.colSpan=this.side+3;
td.style.backgroundColor="ActiveCaption";
td.style.color="CaptionText";
td.style.fontFamily="small-caption,caption,sans-serif";
td.style.fontSize="x-small";
td.appendChild(document.createTextNode("Click a color..."));
td.style.borderBottom="1px solid WindowFrame";
tr.appendChild(td);
this.tbody.appendChild(tr);
_6=tr=td=null;
this.constrain_cb=document.createElement("input");
this.constrain_cb.type="checkbox";
this.chosenColor=document.createElement("input");
this.chosenColor.type="text";
this.chosenColor.size="7";
this.backSample=document.createElement("div");
this.backSample.appendChild(document.createTextNode("\xa0"));
this.backSample.style.fontWeight="bold";
this.backSample.style.fontFamily="small-caption,caption,sans-serif";
this.backSample.fontSize="x-small";
this.foreSample=document.createElement("div");
this.foreSample.appendChild(document.createTextNode("Sample"));
this.foreSample.style.fontWeight="bold";
this.foreSample.style.fontFamily="small-caption,caption,sans-serif";
this.foreSample.fontSize="x-small";
function toHex(_7){
var h=_7.toString(16);
if(h.length<2){
h="0"+h;
}
return h;
}
function tupleToColor(_9){
return "#"+toHex(_9.red)+toHex(_9.green)+toHex(_9.blue);
}
function nearestPowerOf(_a,_b){
return Math.round(Math.round(_a/_b)*_b);
}
function doubleHexDec(_c){
return parseInt(_c.toString(16)+_c.toString(16),16);
}
function rgbToWebsafe(_d){
_d.red=doubleHexDec(nearestPowerOf(parseInt(toHex(_d.red).charAt(0),16),3));
_d.blue=doubleHexDec(nearestPowerOf(parseInt(toHex(_d.blue).charAt(0),16),3));
_d.green=doubleHexDec(nearestPowerOf(parseInt(toHex(_d.green).charAt(0),16),3));
return _d;
}
function hsvToRGB(h,s,v){
var _11;
if(s==0){
_11={red:v,green:v,blue:v};
}else{
h/=60;
var i=Math.floor(h);
var f=h-i;
var p=v*(1-s);
var q=v*(1-s*f);
var t=v*(1-s*(1-f));
switch(i){
case 0:
_11={red:v,green:t,blue:p};
break;
case 1:
_11={red:q,green:v,blue:p};
break;
case 2:
_11={red:p,green:v,blue:t};
break;
case 3:
_11={red:p,green:q,blue:v};
break;
case 4:
_11={red:t,green:p,blue:v};
break;
case 5:
default:
_11={red:v,green:p,blue:q};
break;
}
}
_11.red=Math.ceil(_11.red*255);
_11.green=Math.ceil(_11.green*255);
_11.blue=Math.ceil(_11.blue*255);
return _11;
}
this.open=function(_17,_18){
this.table.style.display="";
this.pick_color();
this.table.style.position="absolute";
var e=_18;
var top=0;
var _1b=0;
do{
top+=e.offsetTop;
_1b+=e.offsetLeft;
e=e.offsetParent;
}while(e);
var x,y;
if(/top/.test(_17)){
this.table.style.top=(top-this.table.offsetHeight)+"px";
}else{
this.table.style.top=(top+_18.offsetHeight)+"px";
}
if(/left/.test(_17)){
this.table.style.left=_1b+"px";
}else{
this.table.style.left=(_1b-(this.table.offsetWidth-_18.offsetWidth))+"px";
}
};
this.pick_color=function(){
var _1d,cols;
var _1e=this;
var _1f=359/this.side;
var _20=1/this.side;
var _21=1/this.side;
var _22=this.constrain_cb.checked;
if(this.saved_cells==null){
this.saved_cells=new Array();
for(var row=0;row<=this.side;row++){
var tr=document.createElement("tr");
this.saved_cells[row]=new Array();
for(var col=0;col<=this.side;col++){
var td=document.createElement("td");
if(_22){
td.colorCode=tupleToColor(rgbToWebsafe(hsvToRGB(_1f*row,_20*col,this.value)));
}else{
td.colorCode=tupleToColor(hsvToRGB(_1f*row,_20*col,this.value));
}
this.saved_cells[row][col]=td;
td.style.height=td.style.width=this.cellsize;
td.style.backgroundColor=td.colorCode;
td.hue=_1f*row;
td.saturation=_20*col;
td.onmouseover=function(){
_1e.chosenColor.value=this.colorCode;
_1e.backSample.style.backgroundColor=this.colorCode;
_1e.foreSample.style.color=this.colorCode;
if((this.hue>=195&&this.saturation>0.25)||_1e.value<0.75){
_1e.backSample.style.color="white";
}else{
_1e.backSample.style.color="black";
}
};
td.onclick=function(){
_1e.callback(this.colorCode);
_1e.close();
};
td.appendChild(document.createTextNode(" "));
td.style.cursor="pointer";
tr.appendChild(td);
td=null;
}
var td=document.createElement("td");
td.appendChild(document.createTextNode(" "));
td.style.width=this.cellsize;
tr.appendChild(td);
td=null;
var td=document.createElement("td");
td.appendChild(document.createTextNode(" "));
td.style.width=this.cellsize;
td.style.height=this.cellsize;
td.constrainedColorCode=tupleToColor(rgbToWebsafe(hsvToRGB(0,0,_21*row)));
td.style.backgroundColor=td.colorCode=tupleToColor(hsvToRGB(0,0,_21*row));
td.hue=_1f*row;
td.saturation=_20*col;
td.hsv_value=_21*row;
td.onclick=function(){
_1e.value=this.hsv_value;
_1e.pick_color();
if(_1e.constrain_cb.checked){
_1e.chosenColor.value=this.constrainedColorCode;
}else{
_1e.chosenColor.value=this.colorCode;
}
};
td.style.cursor="pointer";
tr.appendChild(td);
td=null;
this.tbody.appendChild(tr);
tr=null;
}
var tr=document.createElement("tr");
this.saved_cells[row]=new Array();
for(var col=0;col<=this.side;col++){
var td=document.createElement("td");
if(_22){
td.colorCode=tupleToColor(rgbToWebsafe(hsvToRGB(0,0,_21*(this.side-col))));
}else{
td.colorCode=tupleToColor(hsvToRGB(0,0,_21*(this.side-col)));
}
this.saved_cells[row][col]=td;
td.style.height=td.style.width=this.cellsize;
td.style.backgroundColor=td.colorCode;
td.hue=0;
td.saturation=0;
td.onmouseover=function(){
_1e.chosenColor.value=this.colorCode;
_1e.backSample.style.backgroundColor=this.colorCode;
_1e.foreSample.style.color=this.colorCode;
if((this.hue>=195&&this.saturation>0.25)||_1e.value<0.75){
_1e.backSample.style.color="white";
}else{
_1e.backSample.style.color="black";
}
};
td.onclick=function(){
_1e.callback(this.colorCode);
_1e.close();
};
td.appendChild(document.createTextNode(" "));
td.style.cursor="pointer";
tr.appendChild(td);
td=null;
}
this.tbody.appendChild(tr);
tr=null;
var tr=document.createElement("tr");
var td=document.createElement("td");
tr.appendChild(td);
td.colSpan=this.side+3;
td.style.padding="3px";
var div=document.createElement("div");
var _28=document.createElement("label");
_28.appendChild(document.createTextNode("Web Safe: "));
this.constrain_cb.onclick=function(){
_1e.pick_color();
};
_28.appendChild(this.constrain_cb);
_28.style.fontFamily="small-caption,caption,sans-serif";
_28.style.fontSize="x-small";
div.appendChild(_28);
td.appendChild(div);
var div=document.createElement("div");
var _28=document.createElement("label");
_28.style.fontFamily="small-caption,caption,sans-serif";
_28.style.fontSize="x-small";
_28.appendChild(document.createTextNode("Color: "));
_28.appendChild(this.chosenColor);
div.appendChild(_28);
td.appendChild(div);
var _29=document.createElement("table");
_29.style.width="100%";
var _2a=document.createElement("tbody");
_29.appendChild(_2a);
var _2b=document.createElement("tr");
_2a.appendChild(_2b);
var _2c=document.createElement("td");
_2b.appendChild(_2c);
_2c.appendChild(this.backSample);
_2c.style.width="50%";
var _2d=document.createElement("td");
_2b.appendChild(_2d);
_2d.appendChild(this.foreSample);
_2d.style.width="50%";
td.appendChild(_29);
this.tbody.appendChild(tr);
document.body.appendChild(this.table);
}else{
for(var row=0;row<=this.side;row++){
for(var col=0;col<=this.side;col++){
if(_22){
this.saved_cells[row][col].colorCode=tupleToColor(rgbToWebsafe(hsvToRGB(_1f*row,_20*col,this.value)));
}else{
this.saved_cells[row][col].colorCode=tupleToColor(hsvToRGB(_1f*row,_20*col,this.value));
}
this.saved_cells[row][col].style.backgroundColor=this.saved_cells[row][col].colorCode;
}
}
}
};
this.close=function(){
this.table.style.display="none";
};
}

