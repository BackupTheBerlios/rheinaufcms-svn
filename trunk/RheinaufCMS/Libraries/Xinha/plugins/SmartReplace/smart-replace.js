function SmartReplace(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_2.registerButton({id:"smartreplace",tooltip:this._lc("SmartReplace"),image:_editor_url+"plugins/SmartReplace/img/smartquotes.gif",textMode:false,action:function(e,_5,_6){
_3.buttonPress(null,_6);
}});
_2.addToolbarElement("smartreplace","htmlmode",1);
}
SmartReplace._pluginInfo={name:"SmartReplace",version:"1.0",developer:"Raimund Meyer",developer_url:"http://rheinauf.de",c_owner:"Raimund Meyer",sponsor:"",sponsor_url:"",license:"htmlArea"};
SmartReplace.prototype._lc=function(_7){
return Xinha._lc(_7,"SmartReplace");
};
Xinha.Config.prototype.SmartReplace={"defaultActive":true,"quotes":null};
SmartReplace.prototype.toggleActivity=function(_8){
if(typeof _8!="undefined"){
this.active=_8;
}else{
this.active=this.active?false:true;
}
this.editor._toolbarObjects.smartreplace.state("active",this.active);
};
SmartReplace.prototype.onUpdateToolbar=function(){
this.editor._toolbarObjects.smartreplace.state("active",this.active);
};
SmartReplace.prototype.onGenerate=function(){
this.active=this.editor.config.SmartReplace.defaultActive;
this.editor._toolbarObjects.smartreplace.state("active",this.active);
var _9=this;
Xinha._addEvents(_9.editor._doc,["keypress"],function(_a){
return _9.keyEvent(Xinha.is_ie?_9.editor._iframe.contentWindow.event:_a);
});
var _b=this.editor.config.SmartReplace.quotes;
if(_b&&typeof _b=="object"){
this.openingQuotes=_b[0];
this.closingQuotes=_b[1];
this.openingQuote=_b[2];
this.closingQuote=_b[3];
}else{
this.openingQuotes=this._lc("OpeningDoubleQuotes");
this.closingQuote=this._lc("ClosingSingleQuote");
this.closingQuotes=this._lc("ClosingDoubleQuotes");
this.openingQuote=this._lc("OpeningSingleQuote");
}
if(this.openingQuotes=="OpeningDoubleQuotes"){
this.openingQuotes=String.fromCharCode(8220);
this.closingQuotes=String.fromCharCode(8221);
this.openingQuote=String.fromCharCode(8216);
this.closingQuote=String.fromCharCode(8217);
}
};
SmartReplace.prototype.keyEvent=function(ev){
if(!this.active){
return true;
}
var _d=this.editor;
var _e=Xinha.is_ie?ev.keyCode:ev.charCode;
var _f=String.fromCharCode(_e);
if(_e==32){
return this.smartDash();
}
if(_f=="\""||_f=="'"){
Xinha._stopEvent(ev);
return this.smartQuotes(_f);
}
return true;
};
SmartReplace.prototype.smartQuotes=function(_10){
if(_10=="'"){
var _11=this.openingQuote;
var _12=this.closingQuote;
}else{
var _11=this.openingQuotes;
var _12=this.closingQuotes;
}
var _13=this.editor;
var sel=_13.getSelection();
if(Xinha.is_ie){
var r=_13.createRange(sel);
if(r.text!==""){
r.text="";
}
r.moveStart("character",-1);
if(r.text.match(/\S/)){
r.moveStart("character",+1);
r.text=_12;
}else{
r.moveStart("character",+1);
r.text=_11;
}
}else{
if(!sel.isCollapsed){
_13.insertNodeAtSelection(document.createTextNode(""));
}
if(sel.anchorOffset>0){
sel.extend(sel.anchorNode,sel.anchorOffset-1);
}
if(sel.toString().match(/\S/)){
sel.collapse(sel.anchorNode,sel.anchorOffset);
_13.insertNodeAtSelection(document.createTextNode(_12));
}else{
sel.collapse(sel.anchorNode,sel.anchorOffset);
_13.insertNodeAtSelection(document.createTextNode(_11));
}
}
};
SmartReplace.prototype.smartDash=function(){
var _16=this.editor;
var sel=this.editor.getSelection();
if(Xinha.is_ie){
var r=this.editor.createRange(sel);
r.moveStart("character",-2);
if(r.text.match(/\s-/)){
r.text=" "+String.fromCharCode(8211);
}
}else{
sel.extend(sel.anchorNode,sel.anchorOffset-2);
if(sel.toString().match(/^-/)){
this.editor.insertNodeAtSelection(document.createTextNode(" "+String.fromCharCode(8211)));
}
sel.collapse(sel.anchorNode,sel.anchorOffset);
}
};
SmartReplace.prototype.replaceAll=function(){
var _19=["&quot;",String.fromCharCode(8220),String.fromCharCode(8221),String.fromCharCode(8222),String.fromCharCode(187),String.fromCharCode(171)];
var _1a=["'",String.fromCharCode(8216),String.fromCharCode(8217),String.fromCharCode(8218),String.fromCharCode(8250),String.fromCharCode(8249)];
var _1b=this.editor.getHTML();
var _1c=new RegExp("(\\s|^|>)("+_19.join("|")+")(\\S)","g");
_1b=_1b.replace(_1c,"$1"+this.openingQuotes+"$3");
var _1d=new RegExp("(\\s|^|>)("+_1a.join("|")+")(\\S)","g");
_1b=_1b.replace(_1d,"$1"+this.openingQuote+"$3");
var _1e=new RegExp("(\\S)("+_19.join("|")+")","g");
_1b=_1b.replace(_1e,"$1"+this.closingQuotes);
var _1f=new RegExp("(\\S)("+_1a.join("|")+")","g");
_1b=_1b.replace(_1f,"$1"+this.closingQuote);
var _20=new RegExp("( |&nbsp;)(-)( |&nbsp;)","g");
_1b=_1b.replace(_20," "+String.fromCharCode(8211)+" ");
this.editor.setHTML(_1b);
};
SmartReplace.prototype.buttonPress=function(_21,obj){
var _23=this;
if(this.dialog.rootElem.style.display!="none"){
return this.dialog.hide();
}
var _24=function(){
var _25=_23.dialog.hide();
_23.toggleActivity((_25.enable)?true:false);
if(_25.convert){
_23.replaceAll();
_23.dialog.getElementById("convert").checked=false;
}
};
var _26={enable:_23.active?"on":"",convert:""};
this.show(_26,_24);
};
SmartReplace.prototype.onGenerateOnce=function(){
this._prepareDialog();
};
SmartReplace.prototype._prepareDialog=function(){
var _27=this;
var _28=this.editor;
if(!this.html){
Xinha._getback(_editor_url+"plugins/SmartReplace/dialog.html",function(_29){
_27.html=_29;
_27._prepareDialog();
});
return;
}
this.dialog=new Xinha.Dialog(_28,this.html,"SmartReplace",{},{modal:false});
this.dialog.attachToPanel("top");
this.dialog.getElementById("enable").onchange=function(){
_27.toggleActivity(this.checked);
};
this.dialog.getElementById("convert").onchange=function(){
_27.dialog.getElementById("ok").style.display=(this.checked)?"":"none";
};
this.dialog.getElementById("ok").onclick=function(){
_27.replaceAll();
_27.dialog.getElementById("convert").checked=false;
this.style.display="none";
};
this.ready=true;
};
SmartReplace.prototype.show=function(_2a){
if(!this.ready){
var _2b=this;
window.setTimeout(function(){
_2b.show(_2a,ok,cancel);
},100);
return;
}
var _2b=this;
this.dialog.show(_2a);
this.dialog.onresize();
};

