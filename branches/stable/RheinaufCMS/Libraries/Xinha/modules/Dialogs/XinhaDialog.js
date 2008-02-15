Xinha.Dialog=function(_1,_2,_3,_4,_5){
var _6=this;
this.id={};
this.r_id={};
this.editor=_1;
this.document=document;
this.size=_4;
this.modal=(_5&&_5.modal===false)?false:true;
this.closable=(_5&&_5.closable===false)?false:true;
this.layer=(_5&&_5.layer)?_5.layer:0;
if(Xinha.is_ie){
var _7=document.createElement("iframe");
_7.src="about:blank";
_7.onreadystatechange=function(){
var _8=window.event.srcElement.contentWindow.document;
if(_8&&_8.body){
_8.body.style.backgroundColor="#666666";
}
};
}else{
var _7=document.createElement("div");
}
_7.className="xinha_dialog_background";
with(_7.style){
position="absolute";
top=0;
left=0;
border="none";
overflow="hidden";
display="none";
zIndex=(this.modal?1025:1001)+this.layer;
}
document.body.appendChild(_7);
this.background=_7;
_7=null;
Xinha.freeLater(this,"background");
var _9=document.createElement("div");
_9.style.position=(Xinha.is_ie||!this.modal)?"absolute":"fixed";
_9.style.zIndex=(this.modal?1027:1003)+this.layer;
_9.style.display="none";
if(!this.modal){
Xinha._addEvent(_9,"mousedown",function(){
Xinha.Dialog.activateModeless(_6);
});
}
_9.className="dialog";
document.body.appendChild(_9);
_9.style.paddingBottom="10px";
_9.style.width=(_4&&_4.width)?_4.width+"px":"";
if(_4&&_4.height){
if(Xinha.ie_version<7){
_9.style.height=_4.height+"px";
}else{
_9.style.minHeight=_4.height+"px";
}
}
_2=this.translateHtml(_2,_3);
var _a=document.createElement("div");
_9.appendChild(_a);
_a.innerHTML=_2;
var _b=_a.removeChild(_a.getElementsByTagName("h1")[0]);
_9.insertBefore(_b,_a);
_b.onmousedown=function(ev){
_6._dragStart(ev);
};
_b.style.MozUserSelect="none";
this.buttons=document.createElement("div");
with(this.buttons.style){
position="absolute";
top="0";
right="2px";
}
_9.appendChild(this.buttons);
this.closer=null;
if(this.closable){
this.closer=document.createElement("div");
this.closer.className="closeButton";
this.closer.onmousedown=function(ev){
this.className="closeButton buttonClick";
Xinha._stopEvent((ev)?ev:window.event);
return false;
};
this.closer.onmouseout=function(ev){
this.className="closeButton";
Xinha._stopEvent((ev)?ev:window.event);
return false;
};
this.closer.onmouseup=function(){
this.className="closeButton";
_6.hide();
return false;
};
this.buttons.appendChild(this.closer);
var _f=document.createElement("span");
_f.className="innerX";
_f.style.position="relative";
_f.style.top="-3px";
_f.appendChild(document.createTextNode("\xd7"));
this.closer.appendChild(_f);
_f=null;
}
this.icon=document.createElement("img");
with(this.icon){
className="icon";
src=_editor_url+"images/xinha-small-icon.gif";
style.position="absolute";
style.top="3px";
style.left="2px";
ondrag=function(){
return false;
};
}
_b.style.paddingLeft="22px";
_9.appendChild(this.icon);
var all=_9.getElementsByTagName("*");
for(var i=0;i<all.length;i++){
var el=all[i];
if(el.tagName.toLowerCase()=="textarea"||el.tagName.toLowerCase()=="input"){
}else{
el.unselectable="on";
}
}
this.resizer=document.createElement("div");
this.resizer.className="resizeHandle";
with(this.resizer.style){
position="absolute";
bottom="0px";
right="0px";
}
this.resizer.onmousedown=function(ev){
_6._resizeStart(ev);
};
_9.appendChild(this.resizer);
this.rootElem=_9;
this.captionBar=_b;
this.main=_a;
_b=null;
_9=null;
_a=null;
resizeHandle=null;
Xinha.freeLater(this,"rootElem");
Xinha.freeLater(this,"captionBar");
Xinha.freeLater(this,"main");
Xinha.freeLater(this,"buttons");
Xinha.freeLater(this,"closer");
Xinha.freeLater(this,"icon");
Xinha.freeLater(this,"resizer");
Xinha.freeLater(this,"document");
this.size={};
};
Xinha.Dialog.prototype.onresize=function(){
return true;
};
Xinha.Dialog.prototype.show=function(_14){
var _15=this.rootElem;
var _16=_15.style;
var _17=this.modal;
var _18=this.scrollPos=this.editor.scrollPos();
var _19=this;
if(this.attached){
this.editor.showPanel(_15);
}
if(_17){
this.posBackground({top:0,left:0});
}
this._lastRange=this.editor.saveSelection();
if(Xinha.is_ie&&!_17){
_19.saveSelection=function(){
_19._lastRange=_19.editor.saveSelection();
};
Xinha._addEvent(this.editor._doc,"mouseup",_19.saveSelection);
}
if(_17){
this.editor.deactivateEditor();
}
if(Xinha.is_gecko&&_17){
this._restoreTo=[this.editor._textArea.style.display,this.editor._iframe.style.visibility,this.editor.hidePanels()];
this.editor._textArea.style.display="none";
this.editor._iframe.style.visibility="hidden";
}
if(!this.attached){
this.showBackground();
var _1a=Xinha.viewportSize();
if(_17){
var _1b=Xinha.pageSize();
this.resizeBackground({width:_1b.x+"px",height:_1b.y+"px"});
}
var _1c=_1a.y;
var _1d=_1a.x;
Xinha.Dialog.fadeIn(this.rootElem);
var _1e=_15.offsetHeight;
var _1f=_15.offsetWidth;
if(_1e>_1c){
_16.height=_1c+"px";
if(_15.scrollHeight>_1e){
_19.main.style.overflowY="auto";
}
}
if(this.size.top&&this.size.left){
_16.top=parseInt(this.size.top,10)+"px";
_16.left=parseInt(this.size.left,10)+"px";
}else{
if(this.editor.btnClickEvent){
var _20=this.editor.btnClickEvent;
if(_16.position=="absolute"){
_16.top=_20.clientY+this.scrollPos.y+"px";
}else{
_16.top=_20.clientY+"px";
}
if(_1e+_15.offsetTop>_1c){
_16.top=(_16.position=="absolute"?this.scrollPos.y:0)+"px";
}
if(_16.position=="absolute"){
_16.left=_20.clientX+this.scrollPos.x+"px";
}else{
_16.left=_20.clientX+"px";
}
if(_1f+_15.offsetLeft>_1d){
_16.left=_20.clientX-_1f+"px";
if(_15.offsetLeft<0){
_16.left=0;
}
}
this.editor.btnClickEvent=null;
}else{
var top=(_1c-_1e)/2;
var _22=(_1d-_1f)/2;
_16.top=((top>0)?top:0)+"px";
_16.left=((_22>0)?_22:0)+"px";
}
}
}
this.width=_1f;
this.height=_1e;
if(!_17){
this.resizeBackground({width:_1f+"px",height:_1e+"px"});
this.posBackground({top:_16.top,left:_16.left});
}
if(typeof _14!="undefined"){
this.setValues(_14);
}
this.dialogShown=true;
};
Xinha.Dialog.prototype.hide=function(){
if(this.attached){
this.editor.hidePanel(this.rootElem);
}else{
Xinha.Dialog.fadeOut(this.rootElem);
this.hideBackground();
var _23=this;
if(Xinha.is_gecko&&this.modal){
this.editor._textArea.style.display=this._restoreTo[0];
this.editor._iframe.style.visibility=this._restoreTo[1];
this.editor.showPanels(this._restoreTo[2]);
}
if(!this.editor._isFullScreen&&this.modal){
window.scroll(this.scrollPos.x,this.scrollPos.y);
}
if(Xinha.is_ie&&!this.modal){
Xinha._removeEvent(this.editor._doc,"mouseup",_23.saveSelection);
}
if(this.modal){
this.editor.activateEditor();
}
}
this.editor.restoreSelection(this._lastRange);
this.dialogShown=false;
this.editor.updateToolbar();
return this.getValues();
};
Xinha.Dialog.prototype.toggle=function(){
if(this.rootElem.style.display=="none"){
this.show();
}else{
this.hide();
}
};
Xinha.Dialog.prototype.collapse=function(){
if(this.collapsed){
this.collapsed=false;
this.show();
}else{
this.main.style.height=0;
this.collapsed=true;
}
};
Xinha.Dialog.prototype.getElementById=function(id){
return this.document.getElementById(this.id[id]?this.id[id]:id);
};
Xinha.Dialog.prototype.getElementsByName=function(_25){
return this.document.getElementsByName(this.id[_25]?this.id[_25]:_25);
};
Xinha.Dialog.prototype._dragStart=function(ev){
if(this.attached||this.dragging){
return;
}
this.editor.suspendUpdateToolbar=true;
var _27=this;
_27.dragging=true;
_27.scrollPos=_27.editor.scrollPos();
var st=_27.rootElem.style;
_27.xOffs=((Xinha.is_ie)?window.event.offsetX:ev.layerX);
_27.yOffs=((Xinha.is_ie)?window.event.offsetY:ev.layerY);
_27.mouseMove=function(ev){
_27.dragIt(ev);
};
Xinha._addEvent(document,"mousemove",_27.mouseMove);
_27.mouseUp=function(ev){
_27.dragEnd(ev);
};
Xinha._addEvent(document,"mouseup",_27.mouseUp);
};
Xinha.Dialog.prototype.dragIt=function(ev){
var _2c=this;
if(!_2c.dragging){
return false;
}
ev=(Xinha.is_ie)?window.event:ev;
if(_2c.rootElem.style.position=="absolute"){
var _2d=(ev.clientY+this.scrollPos.y)-_2c.yOffs+"px";
var _2e=(ev.clientX+this.scrollPos.x)-_2c.xOffs+"px";
var _2f={top:_2d,left:_2e};
}else{
if(_2c.rootElem.style.position=="fixed"){
var _2d=ev.clientY-_2c.yOffs+"px";
var _2e=ev.clientX-_2c.xOffs+"px";
var _2f={top:_2d,left:_2e};
}
}
_2c.posDialog(_2f);
if(!_2c.modal){
_2c.posBackground(_2f);
}
};
Xinha.Dialog.prototype.dragEnd=function(ev){
var _31=this;
this.editor.suspendUpdateToolbar=false;
if(!_31.dragging){
return false;
}
_31.dragging=false;
Xinha._removeEvent(document,"mousemove",_31.mouseMove);
Xinha._removeEvent(document,"mouseup",_31.mouseUp);
_31.size.top=_31.rootElem.style.top;
_31.size.left=_31.rootElem.style.left;
};
Xinha.Dialog.prototype._resizeStart=function(ev){
var _33=this;
this.editor.suspendUpdateToolbar=true;
if(_33.resizing){
return;
}
_33.resizing=true;
_33.scrollPos=_33.editor.scrollPos();
var st=_33.rootElem.style;
st.minHeight="";
st.overflow="hidden";
_33.xOffs=parseInt(st.left,10);
_33.yOffs=parseInt(st.top,10);
_33.mouseMove=function(ev){
_33.resizeIt(ev);
};
Xinha._addEvent(document,"mousemove",_33.mouseMove);
_33.mouseUp=function(ev){
_33.resizeEnd(ev);
};
Xinha._addEvent(document,"mouseup",_33.mouseUp);
};
Xinha.Dialog.prototype.resizeIt=function(ev){
var _38=this;
if(!_38.resizing){
return false;
}
if(_38.rootElem.style.position=="absolute"){
var _39=ev.clientY+_38.scrollPos.y;
var _3a=ev.clientX+_38.scrollPos.x;
}else{
var _39=ev.clientY;
var _3a=ev.clientX;
}
_3a-=_38.xOffs;
_39-=_38.yOffs;
var _3b={};
_3b.width=((_3a>10)?_3a:10)+8+"px";
_3b.height=((_39>10)?_39:10)+"px";
_38.sizeDialog(_3b);
if(!this.modal){
_38.resizeBackground(_3b);
}
_38.width=_38.rootElem.offsetWidth;
_38.height=_38.rootElem.offsetHeight;
_38.onresize();
};
Xinha.Dialog.prototype.resizeEnd=function(ev){
var _3d=this;
_3d.resizing=false;
this.editor.suspendUpdateToolbar=false;
Xinha._removeEvent(document,"mousemove",_3d.mouseMove);
Xinha._removeEvent(document,"mouseup",_3d.mouseUp);
_3d.size.width=_3d.rootElem.offsetWidth;
_3d.size.height=_3d.rootElem.offsetHeight;
};
Xinha.Dialog.prototype.attachToPanel=function(_3e){
var _3f=this;
var _40=this.rootElem;
var _41=this.editor;
this.attached=true;
this.rootElem.side=_3e;
this.captionBar.ondblclick=function(ev){
_3f.detachFromPanel(ev?ev:window.event);
};
_40.style.position="static";
_40.parentNode.removeChild(_40);
this.captionBar.style.paddingLeft="3px";
this.resizer.style.display="none";
if(this.closable){
this.closer.style.display="none";
}
this.icon.style.display="none";
if(_3e=="left"||_3e=="right"){
_40.style.width=_41.config.panel_dimensions[_3e];
}else{
_40.style.width="";
}
Xinha.addClasses(_40,"panel");
_41._panels[_3e].panels.push(_40);
_41._panels[_3e].div.appendChild(_40);
_41.notifyOf("panel_change",{"action":"add","panel":_40});
};
Xinha.Dialog.prototype.detachFromPanel=function(ev){
var _44=this;
var _45=_44.rootElem;
var _46=_44.editor;
_44.attached=false;
_45.style.position="absolute";
_44.captionBar.style.paddingLeft="22px";
_44.resizer.style.display="";
if(_44.closable){
_44.closer.style.display="";
}
_44.icon.style.display="";
if(_44.size.width){
_45.style.width=_44.size.width+"px";
}
Xinha.removeClasses(_45,"panel");
_46.removePanel(_45);
document.body.appendChild(_45);
if(ev){
var _47=_44.editor.scrollPos();
_45.style.top=(ev.clientY+_47.y)-((Xinha.is_ie)?window.event.offsetY:ev.layerY)+"px";
_45.style.left=(ev.clientX+_47.x)-((Xinha.is_ie)?window.event.offsetX:ev.layerX)+"px";
}
_44.captionBar.ondblclick=function(){
_44.attachToPanel(_45.side);
};
};
Xinha.Dialog.prototype.hideBackground=function(){
Xinha.Dialog.fadeOut(this.background);
};
Xinha.Dialog.prototype.showBackground=function(){
Xinha.Dialog.fadeIn(this.background,70);
};
Xinha.Dialog.prototype.posBackground=function(pos){
if(this.background.style.display!="none"){
this.background.style.top=pos.top;
this.background.style.left=pos.left;
}
};
Xinha.Dialog.prototype.resizeBackground=function(_49){
if(this.background.style.display!="none"){
this.background.style.width=_49.width;
this.background.style.height=_49.height;
}
};
Xinha.Dialog.prototype.posDialog=function(pos){
var st=this.rootElem.style;
st.left=pos.left;
st.top=pos.top;
};
Xinha.Dialog.prototype.sizeDialog=function(_4c){
var st=this.rootElem.style;
st.height=_4c.height;
st.width=_4c.width;
this.main.style.height=parseInt(_4c.height,10)-this.captionBar.offsetHeight+"px";
this.main.style.width=_4c.width;
};
Xinha.Dialog.prototype.setValues=function(_4e){
for(var i in _4e){
var _50=this.getElementsByName(i);
if(!_50){
continue;
}
for(var x=0;x<_50.length;x++){
var e=_50[x];
switch(e.tagName.toLowerCase()){
case "select":
for(var j=0;j<e.options.length;j++){
if(typeof _4e[i]=="object"){
for(var k=0;k<_4e[i].length;k++){
if(_4e[i][k]==e.options[j].value){
e.options[j].selected=true;
}
}
}else{
if(_4e[i]==e.options[j].value){
e.options[j].selected=true;
}
}
}
break;
case "textarea":
case "input":
switch(e.getAttribute("type")){
case "radio":
if(e.value==_4e[i]){
e.checked=true;
}
break;
case "checkbox":
if(typeof _4e[i]=="object"){
for(var j in _4e[i]){
if(_4e[i][j]==e.value){
e.checked=true;
}
}
}else{
if(_4e[i]==e.value){
e.checked=true;
}
}
break;
default:
e.value=_4e[i];
}
break;
default:
break;
}
}
}
};
Xinha.Dialog.prototype.getValues=function(){
var _55=[];
var _56=Xinha.collectionToArray(this.rootElem.getElementsByTagName("input")).append(Xinha.collectionToArray(this.rootElem.getElementsByTagName("textarea"))).append(Xinha.collectionToArray(this.rootElem.getElementsByTagName("select")));
for(var x=0;x<_56.length;x++){
var i=_56[x];
if(!(i.name&&this.r_id[i.name])){
continue;
}
if(typeof _55[this.r_id[i.name]]=="undefined"){
_55[this.r_id[i.name]]=null;
}
var v=_55[this.r_id[i.name]];
switch(i.tagName.toLowerCase()){
case "select":
if(i.multiple){
if(!v.push){
if(v!=null){
v=[v];
}else{
v=new Array();
}
}
for(var j=0;j<i.options.length;j++){
if(i.options[j].selected){
v.push(i.options[j].value);
}
}
}else{
if(i.selectedIndex>=0){
v=i.options[i.selectedIndex];
}
}
break;
case "textarea":
case "input":
default:
switch(i.type.toLowerCase()){
case "radio":
if(i.checked){
v=i.value;
break;
}
case "checkbox":
if(v==null){
if(this.getElementsByName(this.r_id[i.name]).length>1){
v=new Array();
}
}
if(i.checked){
if(v!=null&&typeof v=="object"&&v.push){
v.push(i.value);
}else{
v=i.value;
}
}
break;
default:
v=i.value;
break;
}
}
_55[this.r_id[i.name]]=v;
}
return _55;
};
Xinha.Dialog.prototype.translateHtml=function(_5b,_5c){
var _5d=this;
if(typeof _5c=="function"){
_5d._lc=_5c;
}else{
if(_5c){
this._lc=function(_5e){
return Xinha._lc(_5e,_5c);
};
}else{
this._lc=function(_5f){
return _5f;
};
}
}
_5b=_5b.replace(/\[([a-z0-9_]+)\]/ig,function(_60,id){
if(typeof _5d.id[id]=="undefined"){
_5d.id[id]=Xinha.uniq("Dialog");
_5d.r_id[_5d.id[id]]=id;
}
return _5d.id[id];
}).replace(/<l10n>(.*?)<\/l10n>/ig,function(_62,_63){
return _5d._lc(_63);
}).replace(/="_\((.*?)\)"/g,function(_64,_65){
return "=\""+_5d._lc(_65)+"\"";
});
return _5b;
};
Xinha.Dialog.activateModeless=function(_66){
var _67;
if(Xinha.Dialog.activeModeless==_66||_66.attached){
return;
}
if(Xinha.Dialog.activeModeless){
Xinha.Dialog.activeModeless.rootElem.style.zIndex=parseInt(Xinha.Dialog.activeModeless.rootElem.style.zIndex)-10;
}
Xinha.Dialog.activeModeless=_66;
Xinha.Dialog.activeModeless.rootElem.style.zIndex=parseInt(Xinha.Dialog.activeModeless.rootElem.style.zIndex)+10;
};
Xinha.Dialog.setOpacity=function(el,_69){
if(typeof el.style.filter!="undefined"){
el.style.filter=(_69<100)?"alpha(opacity="+_69+")":"";
}else{
el.style.opacity=_69/100;
}
};
Xinha.Dialog.fadeIn=function(el,_6b,_6c,_6d){
_6c=_6c||1;
_6d=_6d||25;
_6b=_6b||100;
el.op=el.op||0;
var op=el.op;
if(el.style.display=="none"){
Xinha.Dialog.setOpacity(el,0);
el.style.display="";
}
if(op<_6b){
el.op+=_6d;
Xinha.Dialog.setOpacity(el,op);
el.timeOut=setTimeout(function(){
Xinha.Dialog.fadeIn(el,_6b,_6c,_6d);
},_6c);
}else{
Xinha.Dialog.setOpacity(el,_6b);
el.op=_6b;
el.timeOut=null;
}
};
Xinha.Dialog.fadeOut=function(el,_70,_71){
_70=_70||1;
_71=_71||30;
if(typeof el.op=="undefined"){
el.op=100;
}
var op=el.op;
if(op>=0){
el.op-=_71;
Xinha.Dialog.setOpacity(el,op);
el.timeOut=setTimeout(function(){
Xinha.Dialog.fadeOut(el,_70,_71);
},_70);
}else{
Xinha.Dialog.setOpacity(el,0);
el.style.display="none";
el.op=0;
el.timeOut=null;
}
};

