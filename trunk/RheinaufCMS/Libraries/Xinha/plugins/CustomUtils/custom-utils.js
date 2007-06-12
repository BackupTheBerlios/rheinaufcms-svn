function CustomUtils(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
}
CustomUtils._pluginInfo={name:"CustomUtils",version:"1.0",developer:"Raimund Meyer",developer_url:"http://rheinauf.de",c_owner:"Raimund Meyer",sponsor:"Raimund Meyer",sponsor_url:"http://ray-of-light.org/",license:"htmlArea"};
CustomUtils.prototype._lc=function(_4){
return Xinha._lc(_4,"OutlineElements");
};
CustomUtils.prototype.onGenerate=function(){
var _5=this;
this.editor._doc.getElementsByTagName("html")[0].id="editorhtml";
this.editor._doc.getElementsByTagName("body")[0].id="editorbody";
var _6=this.editor._doc.createElement("link");
_6.type="text/css";
_6.rel="stylesheet";
_6.href=_editor_url+"plugins/CustomUtils/outline-elements.css";
this.OEstyleSheet=_6;
this.headElement=this.editor._doc.getElementsByTagName("HEAD")[0];
this.outlined=false;
var _7=function(){
var _8=_5.editor;
var _9=_8.plugins.SaveSubmit.instance;
if(!_9.changed){
return true;
}
if(confirm("Sie haben noch ungespeicherte \xc4nderungen.\nWollen Sie die Seite jetzt speichern?")){
_9.save(_8);
alert("Bitte warten Sie einige Sekunden bis das Speichern abgeschlossen ist und klicken dann OK.");
}
return true;
};
this.resize();
Xinha.addDom0Event(window,"resize",function(e){
_5.resize();
});
Xinha.prependDom0Event(window,"unload",_7);
xinha_editors.editor.activateEditor();
xinha_editors.editor.focusEditor();
};
CustomUtils.prototype.onUpdateToolbar=function(){
if(/<[^>]*class="?mso/i.test(this.editor._doc.body.innerHTML)){
this.editor._wordClean();
}
};
CustomUtils.prototype.resize=function(){
var _b=Xinha.viewportSize();
var x=_b.x-5+"px";
var y=_b.y-30+"px";
this.editor.sizeEditor(x,y,true,true);
this.editor.config.height=y;
this.editor.config.width=x;
return true;
};
CustomUtils.prototype.togglePanels=function(el){
var _f=(this.panels_hidden==true)?"show":"hide";
switch(_f){
case "hide":
this.editor.hidePanels();
this.panels_hidden=true;
el.innerHTML="&nbsp;&nbsp;Panels";
break;
case "show":
this.editor.showPanels();
this.panels_hidden=false;
el.innerHTML="&bull;&nbsp;Panels";
break;
}
};
CustomUtils.prototype.toggleOutlineElements=function(el){
if(this.outlined){
this.outlined=false;
this.headElement.removeChild(this.OEstyleSheet);
el.innerHTML="&nbsp;&nbsp;Elementumrahmung";
}else{
this.outlined=true;
this.headElement.appendChild(this.OEstyleSheet);
el.innerHTML="&bull;&nbsp;Elementumrahmung";
}
};
function debug(_11){
for(var i in _11){
if(!confirm(i+"=>"+_11[i])){
break;
}
}
}
Xinha.prototype.customWordClean=function(_13){
var _14=["valign","cellpadding","cellspacing","border","width","style","bgcolor","background","text","link","vlink","leftmargin","topmargin","marginwidth","marginheight"];
_13=_13.replace(/<!--[\w\s\d@{}:.;,'"%!#_=&|?~()[*+\/\-\]]*-->/gi,"");
_13=_13.replace(/<!--[^\0]*-->/gi,"");
_13=_13.replace(/<\/?\s*HTML[^>]*>/gi,"");
_13=_13.replace(/<\/?\s*BODY[^>]*>/gi,"");
_13=_13.replace(/<\/?\s*META[^>]*>/gi,"");
_13=_13.replace(/<\/?\s*FONT[^>]*>/gi,"");
_13=_13.replace(/<\/?\s*IFRAME[^>]*>/gi,"");
_13=_13.replace(/<\/?\s*STYLE[^>]*>(.|[\n\r\t])*<\/\s*STYLE\s*>/gi,"");
_13=_13.replace(/<\s*TITLE[^>]*>(.|[\n\r\t])*<\/\s*TITLE\s*>/gi,"");
_13=_13.replace(/<\s*HEAD[^>]*>(.|[\n\r\t])*<\/\s*HEAD\s*>/gi,"");
_13=_13.replace(/<\s*(\w[^>]*) lang=([^ |>]*)([^>]*)/gi,"<$1$3");
_13=_13.replace(/<\\?\?xml[^>]*>/gi,"");
_13=_13.replace(/<\/?\w+:[^>]*>/gi,"");
var re=new RegExp("w?("+_14.join("|")+")=(\"[^\"]*\"w?|[s]*)","gim");
_13=_13.replace(re,"");
_13=_13.replace(/<\s*p[^>]*><\s*br\s*\/?>\s*<\/\s*p[^>]*>/gi,"<br />");
_13=_13.replace(/(\s*<br>|<br \/>\s*)*$/,"");
_13=_13.replace(/<span ?>(.*?)<\/span>/gim,"$1");
_13=_13.trim();
return _13;
};
Xinha.prototype._wordClean=function(){
var _16=this;
var _17={empty_tags:0,mso_class:0,mso_style:0,mso_xmlel:0,orig_len:this._doc.body.innerHTML.length,T:(new Date()).getTime()};
var _18={empty_tags:Xinha._lc("Leere Tags entfernt: "),mso_class:Xinha._lc("MSO classes entfernt: "),mso_style:Xinha._lc("MSO inline styles entfernt: "),mso_xmlel:Xinha._lc("MSO XML Elemente entfernt: ")};
function showStats(){
var txt="Xinha Word Cleaner Ergebnis: \n\n";
txt+="Anf\xe4ngliche L\xe4nge: "+_17.orig_len+"\n";
txt+="Nach dem Aufr\xe4umen: "+_16._doc.body.innerHTML.length+"\n\n";
for(var i in _17){
if(_18[i]){
txt+=_18[i]+_17[i]+"\n";
}
}
alert(txt);
}
function clearClass(_1b){
var _1c=_1b.className.replace(/(^|\s)mso.*?(\s|$)/ig," ");
if(_1c!=_1b.className){
_1b.className=_1c;
if(!(/\S/.test(_1b.className))){
_1b.removeAttribute("className");
++_17.mso_class;
}
}
}
function clearStyle(_1d){
var _1e=_1d.style.cssText.split(/\s*;\s*/);
for(var i=_1e.length;--i>=0;){
if((/^mso|^tab-stops/i.test(_1e[i]))||(/^margin\s*:\s*0..\s+0..\s+0../i.test(_1e[i]))){
++_17.mso_style;
_1e.splice(i,1);
}
}
_1d.style.cssText=_1e.join("; ");
}
var _20=null;
if(Xinha.is_ie){
_20=function(el){
el.outerHTML=Xinha.htmlEncode(el.innerText);
++_17.mso_xmlel;
};
}else{
_20=function(el){
var txt=document.createTextNode(Xinha.getInnerText(el));
el.parentNode.insertBefore(txt,el);
Xinha.removeFromParent(el);
++_17.mso_xmlel;
};
}
function checkEmpty(el){
if(/^(a|span|b|strong|i|em|font)$/i.test(el.tagName)&&!el.firstChild){
Xinha.removeFromParent(el);
++_17.empty_tags;
}
}
function parseTree(_25){
var tag=_25.tagName.toLowerCase(),i,next;
if((Xinha.is_ie&&_25.scopeName!="HTML")||(!Xinha.is_ie&&(/:/.test(tag)))){
_20(_25);
return false;
}else{
clearClass(_25);
clearStyle(_25);
for(i=_25.firstChild;i;i=next){
next=i.nextSibling;
if(i.nodeType==1&&parseTree(i)){
checkEmpty(i);
}
}
}
return true;
}
this._doc.body.innerHTML=this.customWordClean(this._doc.body.innerHTML);
parseTree(this._doc.body);
showStats();
this.updateToolbar();
};
Xinha.prototype._shortCuts=function(ev){
var _28=this;
var sel=null;
var _2a=null;
var key=String.fromCharCode(Xinha.is_ie?ev.keyCode:ev.charCode).toLowerCase();
var cmd=null;
var _2d=null;
switch(key){
case "a":
if(!Xinha.is_ie){
sel=this._getSelection();
sel.removeAllRanges();
_2a=this._createRange();
_2a.selectNodeContents(this._doc.body);
sel.addRange(_2a);
Xinha._stopEvent(ev);
}
break;
case "b":
cmd="bold";
break;
case "i":
cmd="italic";
break;
case "u":
cmd="underline";
break;
case "l":
cmd="justifyleft";
break;
case "e":
cmd="justifycenter";
break;
case "r":
cmd="justifyright";
break;
case "j":
cmd="justifyfull";
break;
case "z":
cmd="undo";
break;
case "y":
cmd="redo";
break;
case "v":
if(Xinha.is_ie||_28.config.htmlareaPaste){
cmd="paste";
}
break;
case "n":
cmd="formatblock";
_2d=Xinha.is_ie?"<p>":"p";
break;
case "0":
cmd="killword";
break;
case "1":
case "2":
case "3":
case "4":
case "5":
case "6":
cmd="formatblock";
_2d="h"+key;
if(Xinha.is_ie){
_2d="<"+_2d+">";
}
break;
}
if(cmd){
this.execCommand(cmd,false,_2d);
Xinha._stopEvent(ev);
}
};

