HTMLArea.Config.prototype.Properties={"_attributes":[{"name":"Id","attribute":"id","context":""},{"name":"Title","attribute":"title","context":""},{"name":"Alt","attribute":"alt","context":"img|area","required":true},{"name":"Accesskey","attribute":"accesskey","context":"A|AREA|BUTTON|INPUT|LABEL|LEGEND|TEXTAREA"},{"name":"Link","attribute":"href","context":"A|AREA|LINK"}],"_accesskeys":["1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]};
function Properties(_1){
this.editor=_1;
var _2=this;
_1._Properties=_1.addPanel("right");
HTMLArea.freeLater(_1,"_Properties");
_1.notifyOn("modechange",function(e,_4){
if(_4.mode=="text"){
_2.editor.hidePanel(_2.editor._Properties);
}
});
var _5=document.createElement("div");
_5.innerHTML="<h1>"+this._lc("Properties")+"</h1>";
var _6=document.createElement("table");
this.tbody=document.createElement("tbody");
_6.appendChild(this.tbody);
_5.appendChild(_6);
_1._Properties.appendChild(_5);
_1.hidePanel(_1._Properties);
this.accesskeys=this.editor.config.Properties._accesskeys;
}
Properties.prototype.compileAccesskeys=function(){
var _7=this.editor.getHTML();
var _8,newOption,thisKey,thisCurrentKey;
var _9=[];
var _a=document.createElement("select");
_a.size=1;
newOption=new Option(this._lc("None"),"");
_a.options[0]=newOption;
for(var i=0;i<this.accesskeys.length;i++){
thisKey=this.accesskeys[i];
thisCurrentKey=this.currentPropertiesParent.getAttribute("accesskey");
_8=new RegExp("accesskey=\""+thisKey,"i");
if(!_7.match(_8)||thisKey==thisCurrentKey){
newOption=new Option(thisKey,thisKey,(thisCurrentKey==thisKey));
_a.options[_a.length]=newOption;
}
}
return _a;
};
Properties.prototype.onUpdateToolbar=function(){
var _c=this.editor.getParentElement();
if(typeof _c.tagName=="undefined"){
this.editor.hidePanel(this.editor._Properties);
}else{
if(_c){
this.showPanel(_c);
}else{
alert("How did you get here?");
}
}
};
Properties.prototype.createOKButton=function(_d){
var _e=this;
var _f=this.editor;
try{
this.removeOKButton();
}
catch(e){
}
var img=document.createElement("img");
img.id="xinhaPropertyOK";
img.style.border="none";
img.src=_editor_url+"plugins/Properties/img/apply.gif";
HTMLArea._addEvent(img,"click",function(){
_e.removeOKButton();
_e.doOK(_d);
return false;
});
return img;
};
Properties.prototype.removeOKButton=function(){
var el=document.getElementById("xinhaPropertyOK").parentNode;
el.removeChild(el.lastChild);
};
Properties.prototype.doOK=function(_12){
var _13=document.createAttribute(_12);
var _14=document.getElementById("xinhaPropertyInput_"+_12).value;
if(_12=="id"){
var _15=false,id_unique=false;
var _16,id_RE;
var _17=this.editor.getHTML();
while(!_15||!id_unique){
id_RE=/^[0-9]+|[^0-9a-z-_.:%[\]]/ig;
if(id_RE.test(_14)){
_14=prompt(this._lc("Ids must not start with a number and may only contain the following characters:\n0-9a-z-_.:%[]"),_14.replace(id_RE,""));
}else{
_15=true;
}
_16=new RegExp("id=\""+_14+"\"","i");
if(_16.test(_17)){
_14=prompt(this._lc("This id is already assigned. Ids have to be unique document-wide.\n Please enter a different id"));
}else{
id_unique=true;
}
}
document.getElementById("xinhaPropertyInput_"+_12).value=_14;
}
_13.nodeValue=_14;
this.currentPropertiesParent.setAttributeNode(_13);
};
Properties.prototype.elBlink=function(_18){
var el=this.currentPropertiesParent;
switch(_18){
case "down":
this.borderCache=el.style.border;
el.style.border="dotted red 1px";
break;
case "up":
el.style.border=this.borderCache;
this.borderCache=null;
break;
}
};
Properties.prototype.showPanel=function(_1a){
this.currentPropertiesParent=_1a;
this.createForm(_1a);
this.editor.showPanel(this.editor._Properties);
};
Properties.prototype.createForm=function(_1b){
var _1c=this;
while(this.tbody.hasChildNodes()){
this.tbody.removeChild(this.tbody.lastChild);
}
var _1d=this.editor.config.Properties._attributes;
var tag=_1b.tagName.toLowerCase();
try{
var _1f=_1b.firstChild.nodeValue.substring(0,30);
}
catch(e){
var _1f="";
}
var _20,input,trow,td,td1,td2,td3,context_RE,required_attr=false;
var _21=document.createTextNode(tag+" "+_1f);
var _22=document.createElement("a");
_22.href="javascript:;";
HTMLArea._addEvent(_22,"mousedown",function(){
_1c.elBlink("down");
return false;
});
HTMLArea._addEvent(_22,"mouseup",function(){
_1c.elBlink("up");
return false;
});
trow=document.createElement("tr");
td=document.createElement("td");
td.style.overflow="hidden";
td.style.height="11px";
td.style.fontSize="10px";
td.colSpan=3;
_22.appendChild(_21);
td.appendChild(_22);
trow.appendChild(td);
this.tbody.appendChild(trow);
for(var i=0;i<_1d.length;i++){
context_RE=new RegExp("("+_1d[i].context+")$","i");
if(_1d[i].context==""||context_RE.test(tag)){
trow=document.createElement("tr");
td1=document.createElement("td");
td2=document.createElement("td");
td3=document.createElement("td");
td3.style.width="16px";
_20=this._lc(_1d[i].name);
attribute=_1d[i].attribute;
switch(attribute){
case "accesskey":
input=this.compileAccesskeys();
break;
case "href":
input=document.createElement("input");
input.value=this.editor.fixRelativeLinks(_1b.getAttribute(attribute));
break;
default:
input=document.createElement("input");
input.value=_1b.getAttribute(attribute);
break;
}
if(attribute=="alt"){
input.value=(input.value=="")?this._lc("Image"):input.value;
}
input.name=attribute;
input.id="xinhaPropertyInput_"+attribute;
input.onfocus=function(){
_1c.currentInput=this;
this.parentNode.nextSibling.appendChild(_1c.createOKButton(this.name));
};
if(_1d[i].required){
_20+="*";
required_attr=true;
}
_20=document.createTextNode(_20);
td1.appendChild(_20);
td2.appendChild(input);
trow.appendChild(td1);
trow.appendChild(td2);
trow.appendChild(td3);
this.tbody.appendChild(trow);
}
}
if(required_attr){
var _24=document.createTextNode(this._lc("* Attribute is required for that element"));
trow=document.createElement("tr");
td=document.createElement("td");
td.style.fontSize="10px";
td.colSpan=3;
td.appendChild(_24);
trow.appendChild(td);
this.tbody.appendChild(trow);
}
};
Properties._pluginInfo={name:"Properties",version:"0.1",developer:"Raimund Meyer",developer_url:"http://www.rheinauf.de/",c_owner:"Raimund Meyer",sponsor:"",sponsor_url:"",license:"htmlArea"};
Properties.prototype._lc=function(_25){
return HTMLArea._lc(_25,"Properties");
};

