Gecko._pluginInfo={name:"Gecko",origin:"Xinha Core",version:"$LastChangedRevision: 707 $".replace(/^[^:]*: (.*) \$$/,"$1"),developer:"The Xinha Core Developer Team",developer_url:"$HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/Gecko/Gecko.js $".replace(/^[^:]*: (.*) \$$/,"$1"),sponsor:"",sponsor_url:"",license:"htmlArea"};
function Gecko(_1){
this.editor=_1;
_1.Gecko=this;
}
Gecko.prototype.onKeyPress=function(ev){
var _3=this.editor;
var s=_3.getSelection();
if(_3.isShortCut(ev)){
switch(_3.getKey(ev).toLowerCase()){
case "z":
if(_3._unLink&&_3._unlinkOnUndo){
Xinha._stopEvent(ev);
_3._unLink();
_3.updateToolbar();
return true;
}
break;
case "a":
sel=_3.getSelection();
sel.removeAllRanges();
range=_3.createRange();
range.selectNodeContents(_3._doc.body);
sel.addRange(range);
Xinha._stopEvent(ev);
return true;
break;
case "v":
if(!_3.config.htmlareaPaste){
return true;
}
break;
}
}
switch(_3.getKey(ev)){
case " ":
var _5=function(_6,_7){
var _8=_6.nextSibling;
if(typeof _7=="string"){
_7=_3._doc.createElement(_7);
}
var a=_6.parentNode.insertBefore(_7,_8);
Xinha.removeFromParent(_6);
a.appendChild(_6);
_8.data=" "+_8.data;
s.collapse(_8,1);
_3._unLink=function(){
var t=a.firstChild;
a.removeChild(t);
a.parentNode.insertBefore(t,a);
Xinha.removeFromParent(a);
_3._unLink=null;
_3._unlinkOnUndo=false;
};
_3._unlinkOnUndo=true;
return a;
};
if(_3.config.convertUrlsToLinks&&s&&s.isCollapsed&&s.anchorNode.nodeType==3&&s.anchorNode.data.length>3&&s.anchorNode.data.indexOf(".")>=0){
var _b=s.anchorNode.data.substring(0,s.anchorOffset).search(/\S{4,}$/);
if(_b==-1){
break;
}
if(_3._getFirstAncestor(s,"a")){
break;
}
var _c=s.anchorNode.data.substring(0,s.anchorOffset).replace(/^.*?(\S*)$/,"$1");
var _d=_c.match(Xinha.RE_email);
if(_d){
var _e=s.anchorNode;
var _f=_e.splitText(s.anchorOffset);
var _10=_e.splitText(_b);
_5(_10,"a").href="mailto:"+_d[0];
break;
}
RE_date=/([0-9]+\.)+/;
RE_ip=/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
var _11=_c.match(Xinha.RE_url);
if(_11){
if(RE_date.test(_c)){
if(!RE_ip.test(_c)){
break;
}
}
var _12=s.anchorNode;
var _13=_12.splitText(s.anchorOffset);
var _14=_12.splitText(_b);
_5(_14,"a").href=(_11[1]?_11[1]:"http://")+_11[2];
break;
}
}
break;
}
switch(ev.keyCode){
case 27:
if(_3._unLink){
_3._unLink();
Xinha._stopEvent(ev);
}
break;
break;
case 8:
case 46:
if(!ev.shiftKey&&this.handleBackspace()){
Xinha._stopEvent(ev);
}
default:
_3._unlinkOnUndo=false;
if(s.anchorNode&&s.anchorNode.nodeType==3){
var a=_3._getFirstAncestor(s,"a");
if(!a){
break;
}
if(!a._updateAnchTimeout){
if(s.anchorNode.data.match(Xinha.RE_email)&&a.href.match("mailto:"+s.anchorNode.data.trim())){
var _16=s.anchorNode;
var _17=function(){
a.href="mailto:"+_16.data.trim();
a._updateAnchTimeout=setTimeout(_17,250);
};
a._updateAnchTimeout=setTimeout(_17,1000);
break;
}
var m=s.anchorNode.data.match(Xinha.RE_url);
if(m&&a.href.match(s.anchorNode.data.trim())){
var _19=s.anchorNode;
var _1a=function(){
m=_19.data.match(Xinha.RE_url);
if(m){
a.href=(m[1]?m[1]:"http://")+m[2];
}
a._updateAnchTimeout=setTimeout(_1a,250);
};
a._updateAnchTimeout=setTimeout(_1a,1000);
}
}
}
break;
}
return false;
};
Gecko.prototype.handleBackspace=function(){
var _1b=this.editor;
setTimeout(function(){
var sel=_1b.getSelection();
var _1d=_1b.createRange(sel);
var SC=_1d.startContainer;
var SO=_1d.startOffset;
var EC=_1d.endContainer;
var EO=_1d.endOffset;
var _22=SC.nextSibling;
if(SC.nodeType==3){
SC=SC.parentNode;
}
if(!(/\S/.test(SC.tagName))){
var p=document.createElement("p");
while(SC.firstChild){
p.appendChild(SC.firstChild);
}
SC.parentNode.insertBefore(p,SC);
Xinha.removeFromParent(SC);
var r=_1d.cloneRange();
r.setStartBefore(_22);
r.setEndAfter(_22);
r.extractContents();
sel.removeAllRanges();
sel.addRange(r);
}
},10);
};
Gecko.prototype.inwardHtml=function(_25){
_25=_25.replace(/<(\/?)strong(\s|>|\/)/ig,"<$1b$2");
_25=_25.replace(/<(\/?)em(\s|>|\/)/ig,"<$1i$2");
_25=_25.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");
return _25;
};
Gecko.prototype.outwardHtml=function(_26){
_26=_26.replace(/<script[\s]*src[\s]*=[\s]*['"]chrome:\/\/.*?["']>[\s]*<\/script>/ig,"");
return _26;
};
Gecko.prototype.onExecCommand=function(_27,UI,_29){
try{
this.editor._doc.execCommand("useCSS",false,true);
this.editor._doc.execCommand("styleWithCSS",false,false);
}
catch(ex){
}
switch(_27){
case "paste":
alert(Xinha._lc("The Paste button does not work in Mozilla based web browsers (technical security reasons). Press CTRL-V on your keyboard to paste directly."));
return true;
}
return false;
};
Xinha.prototype.insertNodeAtSelection=function(_2a){
var sel=this.getSelection();
var _2c=this.createRange(sel);
sel.removeAllRanges();
_2c.deleteContents();
var _2d=_2c.startContainer;
var pos=_2c.startOffset;
var _2f=_2a;
switch(_2d.nodeType){
case 3:
if(_2a.nodeType==3){
_2d.insertData(pos,_2a.data);
_2c=this.createRange();
_2c.setEnd(_2d,pos+_2a.length);
_2c.setStart(_2d,pos+_2a.length);
sel.addRange(_2c);
}else{
_2d=_2d.splitText(pos);
if(_2a.nodeType==11){
_2f=_2f.firstChild;
}
_2d.parentNode.insertBefore(_2a,_2d);
this.selectNodeContents(_2f);
this.updateToolbar();
}
break;
case 1:
if(_2a.nodeType==11){
_2f=_2f.firstChild;
}
_2d.insertBefore(_2a,_2d.childNodes[pos]);
this.selectNodeContents(_2f);
this.updateToolbar();
break;
}
};
Xinha.prototype.getParentElement=function(sel){
if(typeof sel=="undefined"){
sel=this.getSelection();
}
var _31=this.createRange(sel);
try{
var p=_31.commonAncestorContainer;
if(!_31.collapsed&&_31.startContainer==_31.endContainer&&_31.startOffset-_31.endOffset<=1&&_31.startContainer.hasChildNodes()){
p=_31.startContainer.childNodes[_31.startOffset];
}
while(p.nodeType==3){
p=p.parentNode;
}
return p;
}
catch(ex){
return null;
}
};
Xinha.prototype.activeElement=function(sel){
if((sel===null)||this.selectionEmpty(sel)){
return null;
}
if(!sel.isCollapsed){
if(sel.anchorNode.childNodes.length>sel.anchorOffset&&sel.anchorNode.childNodes[sel.anchorOffset].nodeType==1){
return sel.anchorNode.childNodes[sel.anchorOffset];
}else{
if(sel.anchorNode.nodeType==1){
return sel.anchorNode;
}else{
return null;
}
}
}
return null;
};
Xinha.prototype.selectionEmpty=function(sel){
if(!sel){
return true;
}
if(typeof sel.isCollapsed!="undefined"){
return sel.isCollapsed;
}
return true;
};
Xinha.prototype.selectNodeContents=function(_35,pos){
this.focusEditor();
this.forceRedraw();
var _37;
var _38=typeof pos=="undefined"?true:false;
var sel=this.getSelection();
_37=this._doc.createRange();
if(_38&&_35.tagName&&_35.tagName.toLowerCase().match(/table|img|input|textarea|select/)){
_37.selectNode(_35);
}else{
_37.selectNodeContents(_35);
}
sel.removeAllRanges();
sel.addRange(_37);
};
Xinha.prototype.insertHTML=function(_3a){
var sel=this.getSelection();
var _3c=this.createRange(sel);
this.focusEditor();
var _3d=this._doc.createDocumentFragment();
var div=this._doc.createElement("div");
div.innerHTML=_3a;
while(div.firstChild){
_3d.appendChild(div.firstChild);
}
var _3f=this.insertNodeAtSelection(_3d);
};
Xinha.prototype.getSelectedHTML=function(){
var sel=this.getSelection();
var _41=this.createRange(sel);
return Xinha.getHTML(_41.cloneContents(),false,this);
};
Xinha.prototype.getSelection=function(){
return this._iframe.contentWindow.getSelection();
};
Xinha.prototype.createRange=function(sel){
this.activateEditor();
if(typeof sel!="undefined"){
try{
return sel.getRangeAt(0);
}
catch(ex){
return this._doc.createRange();
}
}else{
return this._doc.createRange();
}
};
Xinha.prototype.isKeyEvent=function(_43){
return _43.type=="keypress";
};
Xinha.prototype.getKey=function(_44){
return String.fromCharCode(_44.charCode);
};
Xinha.getOuterHTML=function(_45){
return (new XMLSerializer()).serializeToString(_45);
};
Xinha.prototype.cc=String.fromCharCode(173);
Xinha.prototype.setCC=function(_46){
if(_46=="textarea"){
var ta=this._textArea;
var _48=ta.selectionStart;
var _49=ta.value.substring(0,_48);
var _4a=ta.value.substring(_48,ta.value.length);
if(_4a.match(/^[^<]*>/)){
var _4b=_4a.indexOf(">")+1;
ta.value=_49+_4a.substring(0,_4b)+this.cc+_4a.substring(_4b,_4a.length);
}else{
ta.value=_49+this.cc+_4a;
}
}else{
var sel=this.getSelection();
sel.getRangeAt(0).insertNode(document.createTextNode(this.cc));
}
};
Xinha.prototype.findCC=function(_4d){
var _4e=(_4d=="textarea")?window:this._iframe.contentWindow;
if(_4e.find(this.cc)){
if(_4d=="textarea"){
var ta=this._textArea;
var _50=pos=ta.selectionStart;
var end=ta.selectionEnd;
var _52=ta.scrollTop;
ta.value=ta.value.substring(0,_50)+ta.value.substring(end,ta.value.length);
ta.selectionStart=pos;
ta.selectionEnd=pos;
ta.scrollTop=_52;
ta.focus();
}else{
var sel=this.getSelection();
sel.getRangeAt(0).deleteContents();
}
}
};
Xinha.prototype._standardToggleBorders=Xinha.prototype._toggleBorders;
Xinha.prototype._toggleBorders=function(){
var _54=this._standardToggleBorders();
var _55=this._doc.getElementsByTagName("TABLE");
for(var i=0;i<_55.length;i++){
_55[i].style.display="none";
_55[i].style.display="table";
}
return _54;
};

