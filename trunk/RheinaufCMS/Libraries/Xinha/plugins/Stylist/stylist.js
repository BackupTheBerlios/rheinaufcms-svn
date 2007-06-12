Xinha.Config.prototype.css_style={};
Xinha.Config.prototype.stylistLoadStylesheet=function(_1,_2){
if(!_2){
_2={};
}
var _3=Xinha.ripStylesFromCSSFile(_1);
for(var i in _3){
if(_2[i]){
this.css_style[i]=_2[i];
}else{
this.css_style[i]=_3[i];
}
}
this.pageStyleSheets[this.pageStyleSheets.length]=_1;
};
Xinha.Config.prototype.stylistLoadStyles=function(_5,_6){
if(!_6){
_6={};
}
var _7=Xinha.ripStylesFromCSSString(_5);
for(var i in _7){
if(_6[i]){
this.css_style[i]=_6[i];
}else{
this.css_style[i]=_7[i];
}
}
this.pageStyle+=_5;
};
Xinha.prototype._fillStylist=function(){
if(!this.plugins.Stylist.instance.dialog){
return false;
}
var _9=this.plugins.Stylist.instance.dialog.main;
_9.innerHTML="";
var _a=true;
var _b=this._getSelection();
var _c=this._activeElement(_b);
for(var x in this.config.css_style){
var _e=null;
var _f=x.trim();
var _10=true;
var _11=_c;
if(_10&&/[^a-zA-Z0-9_.-]/.test(_f)){
_10=false;
}
if(_f.indexOf(".")<0){
_10=false;
}
if(_10&&(_f.indexOf(".")>0)){
_e=_f.substring(0,_f.indexOf(".")).toLowerCase();
_f=_f.substring(_f.indexOf("."),_f.length);
if(_c!=null&&_c.tagName.toLowerCase()==_e){
_10=true;
_11=_c;
}else{
if(this._getFirstAncestor(this._getSelection(),[_e])!=null){
_10=true;
_11=this._getFirstAncestor(this._getSelection(),[_e]);
}else{
if((_e=="div"||_e=="span"||_e=="p"||(_e.substr(0,1)=="h"&&_e.length==2&&_e!="hr"))){
if(!this._selectionEmpty(this._getSelection())){
_10=true;
_11="new";
}else{
_11=this._getFirstAncestor(_b,["p","h1","h2","h3","h4","h5","h6","h7"]);
if(_11!=null){
_10=true;
}
}
}else{
_10=false;
}
}
}
}
if(_10){
_f=_f.substring(_f.indexOf("."),_f.length);
_f=_f.replace("."," ");
if(_11==null){
if(this._selectionEmpty(this._getSelection())){
_11=this._getFirstAncestor(this._getSelection(),null);
}else{
_11="new";
_e="span";
}
}
}
var _12=(this._ancestorsWithClasses(_b,_e,_f).length>0?true:false);
var _13=this._ancestorsWithClasses(_b,_e,_f);
if(_10){
var _14=document.createElement("a");
_14._stylist_className=_f.trim();
_14._stylist_applied=_12;
_14._stylist_appliedTo=_13;
_14._stylist_applyTo=_11;
_14._stylist_applyTag=_e;
_14.innerHTML=this.config.css_style[x];
_14.href="javascript:void(0)";
var _15=this;
_14.onclick=function(){
if(this._stylist_applied==true){
_15._stylistRemoveClasses(this._stylist_className,this._stylist_appliedTo);
}else{
_15._stylistAddClasses(this._stylist_applyTo,this._stylist_applyTag,this._stylist_className);
}
return false;
};
_14.style.display="block";
_14.style.paddingLeft="3px";
_14.style.paddingTop="1px";
_14.style.paddingBottom="1px";
_14.style.textDecoration="none";
if(_12){
_14.style.background="Highlight";
_14.style.color="HighlightText";
}
_9.appendChild(_14);
}
}
};
Xinha.prototype._stylistAddClasses=function(el,tag,_18){
if(el=="new"){
this.insertHTML("<"+tag+" class=\""+_18+"\">"+this.getSelectedHTML()+"</"+tag+">");
}else{
if(tag!=null&&el.tagName.toLowerCase()!=tag){
var _19=this.switchElementTag(el,tag);
if(typeof el._stylist_usedToBe!="undefined"){
_19._stylist_usedToBe=el._stylist_usedToBe;
_19._stylist_usedToBe[_19._stylist_usedToBe.length]={"tagName":el.tagName,"className":el.getAttribute("class")};
}else{
_19._stylist_usedToBe=[{"tagName":el.tagName,"className":el.getAttribute("class")}];
}
Xinha.addClasses(_19,_18);
}else{
Xinha._addClasses(el,_18);
}
}
this.focusEditor();
this.updateToolbar();
};
Xinha.prototype._stylistRemoveClasses=function(_1a,_1b){
for(var x=0;x<_1b.length;x++){
this._stylistRemoveClassesFull(_1b[x],_1a);
}
this.focusEditor();
this.updateToolbar();
};
Xinha.prototype._stylistRemoveClassesFull=function(el,_1e){
if(el!=null){
var _1f=el.className.trim().split(" ");
var _20=[];
var _21=_1e.split(" ");
for(var x=0;x<_1f.length;x++){
var _23=false;
for(var i=0;_23==false&&i<_21.length;i++){
if(_21[i]==_1f[x]){
_23=true;
}
}
if(_23==false){
_20[_20.length]=_1f[x];
}
}
if(_20.length==0&&el._stylist_usedToBe&&el._stylist_usedToBe.length>0&&el._stylist_usedToBe[el._stylist_usedToBe.length-1].className!=null){
var _25=el._stylist_usedToBe[el._stylist_usedToBe.length-1];
var _26=Xinha.arrayFilter(_25.className.trim().split(" "),function(c){
if(c==null||c.trim()==""){
return false;
}
return true;
});
if((_20.length==0)||(Xinha.arrayContainsArray(_20,_26)&&Xinha.arrayContainsArray(_26,_20))){
el=this.switchElementTag(el,_25.tagName);
_20=_26;
}else{
el._stylist_usedToBe=[];
}
}
if(_20.length>0||el.tagName.toLowerCase()!="span"||(el.id&&el.id!="")){
el.className=_20.join(" ").trim();
}else{
var _28=el.parentNode;
var _29=el.childNodes;
for(var x=0;x<_29.length;x++){
_28.insertBefore(_29[x],el);
}
_28.removeChild(el);
}
}
};
Xinha.prototype.switchElementTag=function(el,tag){
var _2c=el.parentNode;
var _2d=this._doc.createElement(tag);
if(Xinha.is_ie||el.hasAttribute("id")){
_2d.setAttribute("id",el.getAttribute("id"));
}
if(Xinha.is_ie||el.hasAttribute("style")){
_2d.setAttribute("style",el.getAttribute("style"));
}
var _2e=el.childNodes;
for(var x=0;x<_2e.length;x++){
_2d.appendChild(_2e[x].cloneNode(true));
}
_2c.insertBefore(_2d,el);
_2d._stylist_usedToBe=[el.tagName];
_2c.removeChild(el);
this.selectNodeContents(_2d);
return _2d;
};
Xinha.prototype._getAncestorsClassNames=function(sel){
var _31=this._activeElement(sel);
if(_31==null){
_31=(Xinha.is_ie?this._createRange(sel).parentElement():this._createRange(sel).commonAncestorContainer);
}
var _32=[];
while(_31){
if(_31.nodeType==1){
var _33=_31.className.trim().split(" ");
for(var x=0;x<_33.length;x++){
_32[_32.length]=_33[x];
}
if(_31.tagName.toLowerCase()=="body"){
break;
}
if(_31.tagName.toLowerCase()=="table"){
break;
}
}
_31=_31.parentNode;
}
return _32;
};
Xinha.prototype._ancestorsWithClasses=function(sel,tag,_37){
var _38=[];
var _39=this._activeElement(sel);
if(_39==null){
try{
_39=(Xinha.is_ie?this._createRange(sel).parentElement():this._createRange(sel).commonAncestorContainer);
}
catch(e){
return _38;
}
}
var _3a=_37.trim().split(" ");
while(_39){
if(_39.nodeType==1&&_39.className){
if(tag==null||_39.tagName.toLowerCase()==tag){
var _37=_39.className.trim().split(" ");
var _3b=true;
for(var i=0;i<_3a.length;i++){
var _3d=false;
for(var x=0;x<_37.length;x++){
if(_3a[i]==_37[x]){
_3d=true;
break;
}
}
if(!_3d){
_3b=false;
break;
}
}
if(_3b){
_38[_38.length]=_39;
}
}
if(_39.tagName.toLowerCase()=="body"){
break;
}
if(_39.tagName.toLowerCase()=="table"){
break;
}
}
_39=_39.parentNode;
}
return _38;
};
Xinha.ripStylesFromCSSFile=function(URL){
Xinha.setLoadingMessage("Loading Styles");
var css=Xinha._geturlcontent(URL);
return Xinha.ripStylesFromCSSString(css);
};
Xinha.ripStylesFromCSSString=function(css){
RE_comment=/\/\*(.|\r|\n)*?\*\//g;
RE_rule=/\{(.|\r|\n)*?\}/g;
css=css.replace(RE_comment,"");
css=css.replace(RE_rule,",");
css=css.split(",");
var _42={};
for(var x=0;x<css.length;x++){
if(css[x].trim()){
_42[css[x].trim()]=css[x].trim();
}
}
return _42;
};
function Stylist(_44,_45){
this.editor=_44;
var _46=this;
}
Stylist._pluginInfo={name:"Stylist",version:"1.0",developer:"James Sleeman",developer_url:"http://www.gogo.co.nz/",c_owner:"Gogo Internet Services",license:"htmlArea",sponsor:"Gogo Internet Services",sponsor_url:"http://www.gogo.co.nz/"};
Stylist.prototype.onGenerateOnce=function(){
var cfg=this.editor.config;
if(typeof cfg.css_style!="undefined"&&Xinha.objectProperties(cfg.css_style).length!=0){
this._prepareDialog();
}
};
Stylist.prototype._prepareDialog=function(){
var _48=this.editor;
var _49=this;
var _4a="<h1><l10n>Styles</l10n></h1>";
this.dialog=new Xinha.Dialog(_48,_4a,"Stylist",{width:200},{modal:false,closable:false});
Xinha._addClass(this.dialog.rootElem,"Stylist");
this.dialog.attachToPanel("right");
this.dialog.show();
var _4b=this.dialog;
var _4c=this.dialog.main;
var _4d=this.dialog.captionBar;
_4c.style.overflow="auto";
_4c.style.height=this.editor._framework.ed_cell.offsetHeight-_4d.offsetHeight+"px";
_48.notifyOn("modechange",function(e,_4f){
if(!_4b.attached){
return;
}
switch(_4f.mode){
case "text":
_4b.hide();
break;
case "wysiwyg":
_4b.show();
break;
}
});
_48.notifyOn("panel_change",function(e,_51){
if(!_4b.attached){
return;
}
switch(_51.action){
case "show":
var _52=_4c.offsetHeight-_51.panel.offsetHeight;
_4c.style.height=((_52>0)?_4c.offsetHeight-_51.panel.offsetHeight:0)+"px";
_4b.rootElem.style.height=_4d.offsetHeight+"px";
_48.sizeEditor();
break;
case "hide":
_49.resize();
break;
}
});
_48.notifyOn("before_resize",function(){
if(!_4b.attached){
return;
}
_4b.rootElem.style.height=_4d.offsetHeight+"px";
});
_48.notifyOn("resize",function(){
if(!_4b.attached){
return;
}
_49.resize();
});
};
Stylist.prototype.resize=function(){
var _53=this.editor;
var _54=this.dialog.rootElem;
var _55=_54.parentNode;
var _56=_55.offsetHeight;
for(var i=0;i<_55.childNodes.length;++i){
if(_55.childNodes[i]==_54||!_55.childNodes[i].offsetHeight){
continue;
}
_56-=_55.childNodes[i].offsetHeight;
}
_54.style.height=_56-5+"px";
this.dialog.main.style.height=_56-this.dialog.captionBar.offsetHeight-5+"px";
};
Stylist.prototype.onUpdateToolbar=function(){
if(this.dialog){
if(this._timeoutID){
window.clearTimeout(this._timeoutID);
}
var e=this.editor;
this._timeoutID=window.setTimeout(function(){
e._fillStylist();
},250);
}
};

