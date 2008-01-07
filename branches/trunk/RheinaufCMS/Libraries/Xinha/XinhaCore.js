Xinha.version={"Release":"Trunk","Head":"$HeadURL: http://svn.xinha.python-hosting.com/branches/ray/XinhaCore.js $".replace(/^[^:]*: (.*) \$$/,"$1"),"Date":"$LastChangedDate: 2007-03-23 21:31:32 +0100 (Fr, 23 Mrz 2007) $".replace(/^[^:]*: ([0-9-]*) ([0-9:]*) ([+0-9]*) \((.*)\) \$/,"$4 $2 $3"),"Revision":"$LastChangedRevision: 796 $".replace(/^[^:]*: (.*) \$$/,"$1"),"RevisionBy":"$LastChangedBy: ray $".replace(/^[^:]*: (.*) \$$/,"$1")};
Xinha._resolveRelativeUrl=function(_1,_2){
if(_2.match(/^([^:]+\:)?\//)){
return _2;
}else{
var b=_1.split("/");
if(b[b.length-1]==""){
b.pop();
}
var p=_2.split("/");
if(p[0]=="."){
p.shift();
}
while(p[0]==".."){
b.pop();
p.shift();
}
return b.join("/")+"/"+p.join("/");
}
};
if(typeof _editor_url=="string"){
_editor_url=_editor_url.replace(/\x2f*$/,"/");
if(!_editor_url.match(/^([^:]+\:)?\//)){
var path=window.location.toString().split("/");
path.pop();
_editor_url=Xinha._resolveRelativeUrl(path.join("/"),_editor_url);
}
}else{
alert("WARNING: _editor_url is not set!  You should set this variable to the editor files path; it should preferably be an absolute path, like in '/htmlarea/', but it can be relative if you prefer.  Further we will try to load the editor files correctly but we'll probably fail.");
_editor_url="";
}
if(typeof _editor_lang=="string"){
_editor_lang=_editor_lang.toLowerCase();
}else{
_editor_lang="en";
}
if(typeof _editor_skin!=="string"){
_editor_skin="";
}
var __xinhas=[];
Xinha.agt=navigator.userAgent.toLowerCase();
Xinha.is_ie=((Xinha.agt.indexOf("msie")!=-1)&&(Xinha.agt.indexOf("opera")==-1));
Xinha.ie_version=parseFloat(Xinha.agt.substring(Xinha.agt.indexOf("msie")+5));
Xinha.is_opera=(Xinha.agt.indexOf("opera")!=-1);
Xinha.is_khtml=(Xinha.agt.indexOf("khtml")!=-1);
Xinha.is_safari=(Xinha.agt.indexOf("safari")!=-1);
Xinha.opera_version=navigator.appVersion.substring(0,navigator.appVersion.indexOf(" "))*1;
Xinha.is_mac=(Xinha.agt.indexOf("mac")!=-1);
Xinha.is_mac_ie=(Xinha.is_ie&&Xinha.is_mac);
Xinha.is_win_ie=(Xinha.is_ie&&!Xinha.is_mac);
Xinha.is_gecko=(navigator.product=="Gecko"&&!Xinha.is_safari);
Xinha.isRunLocally=document.URL.toLowerCase().search(/^file:/)!=-1;
Xinha.is_designMode=(typeof document.designMode!="undefined"&&!Xinha.is_ie);
Xinha.checkSupportedBrowser=function(){
if(Xinha.is_gecko){
if(navigator.productSub<20021201){
alert("You need at least Mozilla-1.3 Alpha.\nSorry, your Gecko is not supported.");
return false;
}
if(navigator.productSub<20030210){
alert("Mozilla < 1.3 Beta is not supported!\nI'll try, though, but it might not work.");
}
}
if(Xinha.is_opera){
alert("Sorry, Opera is not yet supported by Xinha.");
}
return Xinha.is_gecko||(Xinha.is_opera&&Xinha.opera_version>=9.1)||Xinha.ie_version>=5.5;
};
Xinha.isSupportedBrowser=Xinha.checkSupportedBrowser();
if(Xinha.isRunLocally&&Xinha.isSupportedBrowser){
alert("Xinha *must* be installed on a web server. Locally opened files (those that use the \"file://\" protocol) cannot properly function. Xinha will try to initialize but may not be correctly loaded.");
}
function Xinha(_5,_6){
if(!Xinha.isSupportedBrowser){
return;
}
if(!_5){
throw ("Tried to create Xinha without textarea specified.");
}
if(typeof _6=="undefined"){
this.config=new Xinha.Config();
}else{
this.config=_6;
}
this._htmlArea=null;
if(typeof _5!="object"){
_5=Xinha.getElementById("textarea",_5);
}
this._textArea=_5;
this._textArea.spellcheck=false;
this._initial_ta_size={w:_5.style.width?_5.style.width:(_5.offsetWidth?(_5.offsetWidth+"px"):(_5.cols+"em")),h:_5.style.height?_5.style.height:(_5.offsetHeight?(_5.offsetHeight+"px"):(_5.rows+"em"))};
if(document.getElementById("loading_"+_5.id)||this.config.showLoading){
if(!document.getElementById("loading_"+_5.id)){
Xinha.createLoadingMessage(_5);
}
this.setLoadingMessage(Xinha._lc("Constructing object"));
}
this._editMode="wysiwyg";
this.plugins={};
this._timerToolbar=null;
this._timerUndo=null;
this._undoQueue=[this.config.undoSteps];
this._undoPos=-1;
this._customUndo=true;
this._mdoc=document;
this.doctype="";
this.__htmlarea_id_num=__xinhas.length;
__xinhas[this.__htmlarea_id_num]=this;
this._notifyListeners={};
var _7={right:{on:true,container:document.createElement("td"),panels:[]},left:{on:true,container:document.createElement("td"),panels:[]},top:{on:true,container:document.createElement("td"),panels:[]},bottom:{on:true,container:document.createElement("td"),panels:[]}};
for(var i in _7){
if(!_7[i].container){
continue;
}
_7[i].div=_7[i].container;
_7[i].container.className="panels "+i;
Xinha.freeLater(_7[i],"container");
Xinha.freeLater(_7[i],"div");
}
this._panels=_7;
Xinha.freeLater(this,"_textArea");
}
Xinha.onload=function(){
};
Xinha.init=function(){
Xinha.onload();
};
Xinha.RE_tagName=/(<\/|<)\s*([^ \t\n>]+)/ig;
Xinha.RE_doctype=/(<!doctype((.|\n)*?)>)\n?/i;
Xinha.RE_head=/<head>((.|\n)*?)<\/head>/i;
Xinha.RE_body=/<body[^>]*>((.|\n|\r|\t)*?)<\/body>/i;
Xinha.RE_Specials=/([\/\^$*+?.()|{}[\]])/g;
Xinha.RE_email=/[_a-z\d\-\.]{3,}@[_a-z\d\-]{2,}(\.[_a-z\d\-]{2,})+/i;
Xinha.RE_url=/(https?:\/\/)?(([a-z0-9_]+:[a-z0-9_]+@)?[a-z0-9_-]{2,}(\.[a-z0-9_-]{2,}){2,}(:[0-9]+)?(\/\S+)*)/i;
Xinha.Config=function(){
var _9=this;
this.version=Xinha.version.Revision;
this.width="auto";
this.height="auto";
this.sizeIncludesBars=true;
this.sizeIncludesPanels=true;
this.panel_dimensions={left:"200px",right:"200px",top:"100px",bottom:"100px"};
this.statusBar=true;
this.htmlareaPaste=false;
this.mozParaHandler="best";
this.getHtmlMethod="DOMwalk";
this.undoSteps=20;
this.undoTimeout=500;
this.changeJustifyWithDirection=false;
this.fullPage=false;
this.pageStyle="";
this.pageStyleSheets=[];
this.baseHref=null;
this.expandRelativeUrl=true;
this.stripBaseHref=true;
this.stripSelfNamedAnchors=true;
this.only7BitPrintablesInURLs=true;
this.sevenBitClean=false;
this.specialReplacements={};
this.killWordOnPaste=true;
this.makeLinkShowsTarget=true;
this.charSet=(typeof document.characterSet!="undefined")?document.characterSet:document.charset;
this.browserQuirksMode="";
this.imgURL="images/";
this.popupURL="popups/";
this.htmlRemoveTags=null;
this.flowToolbars=true;
this.showLoading=false;
this.stripScripts=true;
this.convertUrlsToLinks=true;
this.colorPickerCellSize="6px";
this.colorPickerGranularity=18;
this.colorPickerPosition="bottom,right";
this.colorPickerWebSafe=false;
this.colorPickerSaveColors=20;
this.fullScreen=false;
this.fullScreenMargins=[0,0,0,0];
this.toolbar=[["popupeditor"],["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],["separator","forecolor","hilitecolor","textindicator"],["separator","subscript","superscript"],["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],["separator","insertorderedlist","insertunorderedlist","outdent","indent"],["separator","inserthorizontalrule","createlink","insertimage","inserttable"],["linebreak","separator","undo","redo","selectall","print"],(Xinha.is_gecko?[]:["cut","copy","paste","overwrite","saveas"]),["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright","righttoleft"],["separator","htmlmode","showhelp","about"]];
this.fontname={"&mdash; font &mdash;":"","Arial":"arial,helvetica,sans-serif","Courier New":"courier new,courier,monospace","Georgia":"georgia,times new roman,times,serif","Tahoma":"tahoma,arial,helvetica,sans-serif","Times New Roman":"times new roman,times,serif","Verdana":"verdana,arial,helvetica,sans-serif","impact":"impact","WingDings":"wingdings"};
this.fontsize={"&mdash; size &mdash;":"","1 (8 pt)":"1","2 (10 pt)":"2","3 (12 pt)":"3","4 (14 pt)":"4","5 (18 pt)":"5","6 (24 pt)":"6","7 (36 pt)":"7"};
this.formatblock={"&mdash; format &mdash;":"","Heading 1":"h1","Heading 2":"h2","Heading 3":"h3","Heading 4":"h4","Heading 5":"h5","Heading 6":"h6","Normal":"p","Address":"address","Formatted":"pre"};
this.customSelects={};
function cut_copy_paste(e,_b,_c){
e.execCommand(_b);
}
this.debug=true;
this.URIs={"blank":"popups/blank.html","link":_editor_url+"modules/CreateLink/link.html","insert_image":_editor_url+"modules/InsertImage/insert_image.html","insert_table":_editor_url+"modules/InsertTable/insert_table.html","select_color":"select_color.html","about":"about.html","help":"editor_help.html"};
this.btnList={bold:["Bold",Xinha._lc({key:"button_bold",string:["ed_buttons_main.gif",3,2]},"Xinha"),false,function(e){
e.execCommand("bold");
}],italic:["Italic",Xinha._lc({key:"button_italic",string:["ed_buttons_main.gif",2,2]},"Xinha"),false,function(e){
e.execCommand("italic");
}],underline:["Underline",Xinha._lc({key:"button_underline",string:["ed_buttons_main.gif",2,0]},"Xinha"),false,function(e){
e.execCommand("underline");
}],strikethrough:["Strikethrough",Xinha._lc({key:"button_strikethrough",string:["ed_buttons_main.gif",3,0]},"Xinha"),false,function(e){
e.execCommand("strikethrough");
}],subscript:["Subscript",Xinha._lc({key:"button_subscript",string:["ed_buttons_main.gif",3,1]},"Xinha"),false,function(e){
e.execCommand("subscript");
}],superscript:["Superscript",Xinha._lc({key:"button_superscript",string:["ed_buttons_main.gif",2,1]},"Xinha"),false,function(e){
e.execCommand("superscript");
}],justifyleft:["Justify Left",["ed_buttons_main.gif",0,0],false,function(e){
e.execCommand("justifyleft");
}],justifycenter:["Justify Center",["ed_buttons_main.gif",1,1],false,function(e){
e.execCommand("justifycenter");
}],justifyright:["Justify Right",["ed_buttons_main.gif",1,0],false,function(e){
e.execCommand("justifyright");
}],justifyfull:["Justify Full",["ed_buttons_main.gif",0,1],false,function(e){
e.execCommand("justifyfull");
}],orderedlist:["Ordered List",["ed_buttons_main.gif",0,3],false,function(e){
e.execCommand("insertorderedlist");
}],unorderedlist:["Bulleted List",["ed_buttons_main.gif",1,3],false,function(e){
e.execCommand("insertunorderedlist");
}],insertorderedlist:["Ordered List",["ed_buttons_main.gif",0,3],false,function(e){
e.execCommand("insertorderedlist");
}],insertunorderedlist:["Bulleted List",["ed_buttons_main.gif",1,3],false,function(e){
e.execCommand("insertunorderedlist");
}],outdent:["Decrease Indent",["ed_buttons_main.gif",1,2],false,function(e){
e.execCommand("outdent");
}],indent:["Increase Indent",["ed_buttons_main.gif",0,2],false,function(e){
e.execCommand("indent");
}],forecolor:["Font Color",["ed_buttons_main.gif",3,3],false,function(e){
e.execCommand("forecolor");
}],hilitecolor:["Background Color",["ed_buttons_main.gif",2,3],false,function(e){
e.execCommand("hilitecolor");
}],undo:["Undoes your last action",["ed_buttons_main.gif",4,2],false,function(e){
e.execCommand("undo");
}],redo:["Redoes your last action",["ed_buttons_main.gif",5,2],false,function(e){
e.execCommand("redo");
}],cut:["Cut selection",["ed_buttons_main.gif",5,0],false,cut_copy_paste],copy:["Copy selection",["ed_buttons_main.gif",4,0],false,cut_copy_paste],paste:["Paste from clipboard",["ed_buttons_main.gif",4,1],false,cut_copy_paste],selectall:["Select all","ed_selectall.gif",false,function(e){
e.execCommand("selectall");
}],inserthorizontalrule:["Horizontal Rule",["ed_buttons_main.gif",6,0],false,function(e){
e.execCommand("inserthorizontalrule");
}],createlink:["Insert Web Link",["ed_buttons_main.gif",6,1],false,function(e){
e._createLink();
}],insertimage:["Insert/Modify Image",["ed_buttons_main.gif",6,3],false,function(e){
e.execCommand("insertimage");
}],inserttable:["Insert Table",["ed_buttons_main.gif",6,2],false,function(e){
e.execCommand("inserttable");
}],htmlmode:["Toggle HTML Source",["ed_buttons_main.gif",7,0],true,function(e){
e.execCommand("htmlmode");
}],toggleborders:["Toggle Borders",["ed_buttons_main.gif",7,2],false,function(e){
e._toggleBorders();
}],print:["Print document",["ed_buttons_main.gif",8,1],false,function(e){
if(Xinha.is_gecko){
e._iframe.contentWindow.print();
}else{
e.focusEditor();
print();
}
}],saveas:["Save as","ed_saveas.gif",false,function(e){
e.execCommand("saveas",false,"noname.htm");
}],about:["About this editor",["ed_buttons_main.gif",8,2],true,function(e){
e.execCommand("about");
}],showhelp:["Help using editor",["ed_buttons_main.gif",9,2],true,function(e){
e.execCommand("showhelp");
}],splitblock:["Split Block","ed_splitblock.gif",false,function(e){
e._splitBlock();
}],lefttoright:["Direction left to right",["ed_buttons_main.gif",0,4],false,function(e){
e.execCommand("lefttoright");
}],righttoleft:["Direction right to left",["ed_buttons_main.gif",1,4],false,function(e){
e.execCommand("righttoleft");
}],overwrite:["Insert/Overwrite","ed_overwrite.gif",false,function(e){
e.execCommand("overwrite");
}],wordclean:["MS Word Cleaner",["ed_buttons_main.gif",5,3],false,function(e){
e._wordClean();
}],clearfonts:["Clear Inline Font Specifications",["ed_buttons_main.gif",5,4],true,function(e){
e._clearFonts();
}],removeformat:["Remove formatting",["ed_buttons_main.gif",4,4],false,function(e){
e.execCommand("removeformat");
}],killword:["Clear MSOffice tags",["ed_buttons_main.gif",4,3],false,function(e){
e.execCommand("killword");
}]};
for(var i in this.btnList){
var btn=this.btnList[i];
if(typeof btn!="object"){
continue;
}
if(typeof btn[1]!="string"){
btn[1][0]=_editor_url+this.imgURL+btn[1][0];
}else{
btn[1]=_editor_url+this.imgURL+btn[1];
}
btn[0]=Xinha._lc(btn[0]);
}
};
Xinha.Config.prototype.registerButton=function(id,_37,_38,_39,_3a,_3b){
var _3c;
if(typeof id=="string"){
_3c=id;
}else{
if(typeof id=="object"){
_3c=id.id;
}else{
alert("ERROR [Xinha.Config::registerButton]:\ninvalid arguments");
return false;
}
}
switch(typeof id){
case "string":
this.btnList[id]=[_37,_38,_39,_3a,_3b];
break;
case "object":
this.btnList[id.id]=[id.tooltip,id.image,id.textMode,id.action,id.context];
break;
}
};
Xinha.prototype.registerPanel=function(_3d,_3e){
if(!_3d){
_3d="right";
}
this.setLoadingMessage(Xinha._lc("Register "+_3d+"panel"));
var _3f=this.addPanel(_3d);
if(_3e){
_3e.drawPanelIn(_3f);
}
};
Xinha.Config.prototype.registerDropdown=function(_40){
this.customSelects[_40.id]=_40;
};
Xinha.Config.prototype.hideSomeButtons=function(_41){
var _42=this.toolbar;
for(var i=_42.length;--i>=0;){
var _44=_42[i];
for(var j=_44.length;--j>=0;){
if(_41.indexOf(" "+_44[j]+" ")>=0){
var len=1;
if(/separator|space/.test(_44[j+1])){
len=2;
}
_44.splice(j,len);
}
}
}
};
Xinha.Config.prototype.addToolbarElement=function(id,_48,_49){
var _4a=this.toolbar;
var a,i,j,o,sid;
var _4c=false;
var _4d=false;
var _4e=0;
var _4f=0;
var _50=0;
var _51=false;
var _52=false;
if((id&&typeof id=="object")&&(id.constructor==Array)){
_4c=true;
}
if((_48&&typeof _48=="object")&&(_48.constructor==Array)){
_4d=true;
_4e=_48.length;
}
if(_4c){
for(i=0;i<id.length;++i){
if((id[i]!="separator")&&(id[i].indexOf("T[")!==0)){
sid=id[i];
}
}
}else{
sid=id;
}
for(i=0;i<_4a.length;++i){
a=_4a[i];
for(j=0;j<a.length;++j){
if(a[j]==sid){
return;
}
}
}
for(i=0;!_52&&i<_4a.length;++i){
a=_4a[i];
for(j=0;!_52&&j<a.length;++j){
if(_4d){
for(o=0;o<_4e;++o){
if(a[j]==_48[o]){
if(o===0){
_52=true;
j--;
break;
}else{
_50=i;
_4f=j;
_4e=o;
}
}
}
}else{
if(a[j]==_48){
_52=true;
break;
}
}
}
}
if(!_52&&_4d){
if(_48.length!=_4e){
j=_4f;
a=_4a[_50];
_52=true;
}
}
if(_52){
if(_49===0){
if(_4c){
a[j]=id[id.length-1];
for(i=id.length-1;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a[j]=id;
}
}else{
if(_49<0){
j=j+_49+1;
}else{
if(_49>0){
j=j+_49;
}
}
if(_4c){
for(i=id.length;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a.splice(j,0,id);
}
}
}else{
_4a[0].splice(0,0,"separator");
if(_4c){
for(i=id.length;--i>=0;){
_4a[0].splice(0,0,id[i]);
}
}else{
_4a[0].splice(0,0,id);
}
}
};
Xinha.Config.prototype.removeToolbarElement=Xinha.Config.prototype.hideSomeButtons;
Xinha.replaceAll=function(_53){
var tas=document.getElementsByTagName("textarea");
for(var i=tas.length;i>0;(new Xinha(tas[--i],_53)).generate()){
}
};
Xinha.replace=function(id,_57){
var ta=Xinha.getElementById("textarea",id);
return ta?(new Xinha(ta,_57)).generate():null;
};
Xinha.prototype._createToolbar=function(){
this.setLoadingMessage(Xinha._lc("Create Toolbar"));
var _59=this;
var _5a=document.createElement("div");
this._toolBar=this._toolbar=_5a;
_5a.className="toolbar";
_5a.unselectable="1";
Xinha.freeLater(this,"_toolBar");
Xinha.freeLater(this,"_toolbar");
var _5b=null;
var _5c={};
this._toolbarObjects=_5c;
this._createToolbar1(_59,_5a,_5c);
this._htmlArea.appendChild(_5a);
return _5a;
};
Xinha.prototype._setConfig=function(_5d){
this.config=_5d;
};
Xinha.prototype._addToolbar=function(){
this._createToolbar1(this,this._toolbar,this._toolbarObjects);
};
Xinha._createToolbarBreakingElement=function(){
var brk=document.createElement("div");
brk.style.height="1px";
brk.style.width="1px";
brk.style.lineHeight="1px";
brk.style.fontSize="1px";
brk.style.clear="both";
return brk;
};
Xinha.prototype._createToolbar1=function(_5f,_60,_61){
var _62;
if(_5f.config.flowToolbars){
_60.appendChild(Xinha._createToolbarBreakingElement());
}
function newLine(){
if(typeof _62!="undefined"&&_62.childNodes.length===0){
return;
}
var _63=document.createElement("table");
_63.border="0px";
_63.cellSpacing="0px";
_63.cellPadding="0px";
if(_5f.config.flowToolbars){
if(Xinha.is_ie){
_63.style.styleFloat="left";
}else{
_63.style.cssFloat="left";
}
}
_60.appendChild(_63);
var _64=document.createElement("tbody");
_63.appendChild(_64);
_62=document.createElement("tr");
_64.appendChild(_62);
_63.className="toolbarRow";
}
newLine();
function setButtonStatus(id,_66){
var _67=this[id];
var el=this.element;
if(_67!=_66){
switch(id){
case "enabled":
if(_66){
Xinha._removeClass(el,"buttonDisabled");
el.disabled=false;
}else{
Xinha._addClass(el,"buttonDisabled");
el.disabled=true;
}
break;
case "active":
if(_66){
Xinha._addClass(el,"buttonPressed");
}else{
Xinha._removeClass(el,"buttonPressed");
}
break;
}
this[id]=_66;
}
}
function createSelect(txt){
var _6a=null;
var el=null;
var cmd=null;
var _6d=_5f.config.customSelects;
var _6e=null;
var _6f="";
switch(txt){
case "fontsize":
case "fontname":
case "formatblock":
_6a=_5f.config[txt];
cmd=txt;
break;
default:
cmd=txt;
var _70=_6d[cmd];
if(typeof _70!="undefined"){
_6a=_70.options;
_6e=_70.context;
if(typeof _70.tooltip!="undefined"){
_6f=_70.tooltip;
}
}else{
alert("ERROR [createSelect]:\nCan't find the requested dropdown definition");
}
break;
}
if(_6a){
el=document.createElement("select");
el.title=_6f;
var obj={name:txt,element:el,enabled:true,text:false,cmd:cmd,state:setButtonStatus,context:_6e};
Xinha.freeLater(obj);
_61[txt]=obj;
for(var i in _6a){
if(typeof (_6a[i])!="string"){
continue;
}
var op=document.createElement("option");
op.innerHTML=Xinha._lc(i);
op.value=_6a[i];
el.appendChild(op);
}
Xinha._addEvent(el,"change",function(){
_5f._comboSelected(el,txt);
});
}
return el;
}
function createButton(txt){
var el,btn,obj=null;
switch(txt){
case "separator":
if(_5f.config.flowToolbars){
newLine();
}
el=document.createElement("div");
el.className="separator";
break;
case "space":
el=document.createElement("div");
el.className="space";
break;
case "linebreak":
newLine();
return false;
case "textindicator":
el=document.createElement("div");
el.appendChild(document.createTextNode("A"));
el.className="indicator";
el.title=Xinha._lc("Current style");
obj={name:txt,element:el,enabled:true,active:false,text:false,cmd:"textindicator",state:setButtonStatus};
Xinha.freeLater(obj);
_61[txt]=obj;
break;
default:
btn=_5f.config.btnList[txt];
}
if(!el&&btn){
el=document.createElement("a");
el.style.display="block";
el.href="javascript:void(0)";
el.style.textDecoration="none";
el.title=btn[0];
el.className="button";
el.style.direction="ltr";
obj={name:txt,element:el,enabled:true,active:false,text:btn[2],cmd:btn[3],state:setButtonStatus,context:btn[4]||null};
Xinha.freeLater(el);
Xinha.freeLater(obj);
_61[txt]=obj;
el.ondrag=function(){
return false;
};
Xinha._addEvent(el,"mouseout",function(ev){
if(obj.enabled){
Xinha._removeClass(el,"buttonActive");
if(obj.active){
Xinha._addClass(el,"buttonPressed");
}
}
});
Xinha._addEvent(el,"mousedown",function(ev){
if(obj.enabled){
Xinha._addClass(el,"buttonActive");
Xinha._removeClass(el,"buttonPressed");
Xinha._stopEvent(Xinha.is_ie?window.event:ev);
}
});
Xinha._addEvent(el,"click",function(ev){
ev=Xinha.is_ie?window.event:ev;
_5f.btnClickEvent=ev;
if(obj.enabled){
Xinha._removeClass(el,"buttonActive");
if(Xinha.is_gecko){
_5f.activateEditor();
}
obj.cmd(_5f,obj.name,obj);
Xinha._stopEvent(ev);
}
});
var _79=Xinha.makeBtnImg(btn[1]);
var img=_79.firstChild;
Xinha.freeLater(_79);
Xinha.freeLater(img);
el.appendChild(_79);
obj.imgel=img;
obj.swapImage=function(_7b){
if(typeof _7b!="string"){
img.src=_7b[0];
img.style.position="relative";
img.style.top=_7b[2]?("-"+(18*(_7b[2]+1))+"px"):"-18px";
img.style.left=_7b[1]?("-"+(18*(_7b[1]+1))+"px"):"-18px";
}else{
obj.imgel.src=_7b;
img.style.top="0px";
img.style.left="0px";
}
};
}else{
if(!el){
el=createSelect(txt);
}
}
return el;
}
var _7c=true;
for(var i=0;i<this.config.toolbar.length;++i){
if(!_7c){
}else{
_7c=false;
}
if(this.config.toolbar[i]===null){
this.config.toolbar[i]=["separator"];
}
var _7e=this.config.toolbar[i];
for(var j=0;j<_7e.length;++j){
var _80=_7e[j];
var _81;
if(/^([IT])\[(.*?)\]/.test(_80)){
var _82=RegExp.$1=="I";
var _83=RegExp.$2;
if(_82){
_83=Xinha._lc(_83);
}
_81=document.createElement("td");
_62.appendChild(_81);
_81.className="label";
_81.innerHTML=_83;
}else{
if(typeof _80!="function"){
var _84=createButton(_80);
if(_84){
_81=document.createElement("td");
_81.className="toolbarElement";
_62.appendChild(_81);
_81.appendChild(_84);
}else{
if(_84===null){
alert("FIXME: Unknown toolbar item: "+_80);
}
}
}
}
}
}
if(_5f.config.flowToolbars){
_60.appendChild(Xinha._createToolbarBreakingElement());
}
return _60;
};
var use_clone_img=false;
Xinha.makeBtnImg=function(_85,doc){
if(!doc){
doc=document;
}
if(!doc._xinhaImgCache){
doc._xinhaImgCache={};
Xinha.freeLater(doc._xinhaImgCache);
}
var _87=null;
if(Xinha.is_ie&&((!doc.compatMode)||(doc.compatMode&&doc.compatMode=="BackCompat"))){
_87=doc.createElement("span");
}else{
_87=doc.createElement("div");
_87.style.position="relative";
}
_87.style.overflow="hidden";
_87.style.width="18px";
_87.style.height="18px";
_87.className="buttonImageContainer";
var img=null;
if(typeof _85=="string"){
if(doc._xinhaImgCache[_85]){
img=doc._xinhaImgCache[_85].cloneNode();
}else{
img=doc.createElement("img");
img.src=_85;
img.style.width="18px";
img.style.height="18px";
if(use_clone_img){
doc._xinhaImgCache[_85]=img.cloneNode();
}
}
}else{
if(doc._xinhaImgCache[_85[0]]){
img=doc._xinhaImgCache[_85[0]].cloneNode();
}else{
img=doc.createElement("img");
img.src=_85[0];
img.style.position="relative";
if(use_clone_img){
doc._xinhaImgCache[_85[0]]=img.cloneNode();
}
}
img.style.top=_85[2]?("-"+(18*(_85[2]+1))+"px"):"-18px";
img.style.left=_85[1]?("-"+(18*(_85[1]+1))+"px"):"-18px";
}
_87.appendChild(img);
return _87;
};
Xinha.prototype._createStatusBar=function(){
this.setLoadingMessage(Xinha._lc("Create StatusBar"));
var _89=document.createElement("div");
_89.className="statusBar";
this._statusBar=_89;
Xinha.freeLater(this,"_statusBar");
var div=document.createElement("span");
div.className="statusBarTree";
div.innerHTML=Xinha._lc("Path")+": ";
this._statusBarTree=div;
Xinha.freeLater(this,"_statusBarTree");
this._statusBar.appendChild(div);
div=document.createElement("span");
div.innerHTML=Xinha._lc("You are in TEXT MODE.  Use the [<>] button to switch back to WYSIWYG.");
div.style.display="none";
this._statusBarTextMode=div;
Xinha.freeLater(this,"_statusBarTextMode");
this._statusBar.appendChild(div);
if(!this.config.statusBar){
_89.style.display="none";
}
this._statusBarItems=[];
return _89;
};
Xinha.prototype.generate=function(){
if(!Xinha.isSupportedBrowser){
return;
}
var i;
var _8c=this;
var url;
if(!document.getElementById("XinhaCoreDesign")){
Xinha.loadStyle(typeof _editor_css=="string"?_editor_css:"Xinha.css",null,"XinhaCoreDesign");
}
if(Xinha.is_ie){
url=_editor_url+"modules/InternetExplorer/InternetExplorer.js";
if(typeof InternetExplorer=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("InternetExplorer",function(){
_8c.generate();
},url);
return false;
}
_8c._browserSpecificPlugin=_8c.registerPlugin("InternetExplorer");
}else{
url=_editor_url+"modules/Gecko/Gecko.js";
if(typeof Gecko=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("Gecko",function(){
_8c.generate();
},url);
return false;
}
_8c._browserSpecificPlugin=_8c.registerPlugin("Gecko");
}
url=_editor_url+"modules/Dialogs/dialog.js";
if(typeof Dialog=="undefined"&&!document.getElementById(url)){
Xinha._loadback(url,this.generate,this);
return false;
}
url=_editor_url+"modules/Dialogs/XinhaDialog.js";
if(typeof Xinha.Dialog=="undefined"&&!document.getElementById(url)){
Xinha._loadback(url,this.generate,this);
return false;
}
url=_editor_url+"modules/FullScreen/full-screen.js";
if(typeof FullScreen=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("FullScreen",function(){
_8c.generate();
},url);
return false;
}
url=_editor_url+"modules/ColorPicker/ColorPicker.js";
if(typeof ColorPicker=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("ColorPicker",function(){
_8c.generate();
},url);
return false;
}else{
if(typeof ColorPicker!="undefined"){
_8c.registerPlugin("ColorPicker");
}
}
var _8e=_8c.config.toolbar;
for(i=_8e.length;--i>=0;){
for(var j=_8e[i].length;--j>=0;){
switch(_8e[i][j]){
case "popupeditor":
_8c.registerPlugin("FullScreen");
break;
case "insertimage":
url=_editor_url+"modules/InsertImage/InsertImage.js";
if(typeof InsertImage=="undefined"&&typeof Xinha.prototype._insertImage=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("InsertImage",function(){
_8c.generate();
},url);
return false;
}else{
if(typeof InsertImage!="undefined"){
_8c.registerPlugin("InsertImage");
}
}
break;
case "createlink":
url=_editor_url+"modules/CreateLink/CreateLink.js";
if(typeof CreateLink=="undefined"&&typeof Xinha.prototype._createLink=="undefined"&&typeof Linker=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("CreateLink",function(){
_8c.generate();
},url);
return false;
}else{
if(typeof CreateLink!="undefined"){
_8c.registerPlugin("CreateLink");
}
}
break;
case "inserttable":
url=_editor_url+"modules/InsertTable/InsertTable.js";
if(typeof InsertTable=="undefined"&&typeof Xinha.prototype._insertTable=="undefined"&&!document.getElementById(url)){
Xinha.loadPlugin("InsertTable",function(){
_8c.generate();
},url);
return false;
}else{
if(typeof InsertTable!="undefined"){
_8c.registerPlugin("InsertTable");
}
}
break;
}
}
}
if(Xinha.is_gecko&&(_8c.config.mozParaHandler=="best"||_8c.config.mozParaHandler=="dirty")){
switch(this.config.mozParaHandler){
case "dirty":
var _90=_editor_url+"modules/Gecko/paraHandlerDirty.js";
break;
default:
var _90=_editor_url+"modules/Gecko/paraHandlerBest.js";
break;
}
if(typeof EnterParagraphs=="undefined"&&!document.getElementById(_90)){
Xinha.loadPlugin("EnterParagraphs",function(){
_8c.generate();
},_90);
return false;
}
_8c.registerPlugin("EnterParagraphs");
}
switch(this.config.getHtmlMethod){
case "TransformInnerHTML":
var _91=_editor_url+"modules/GetHtml/TransformInnerHTML.js";
break;
default:
var _91=_editor_url+"modules/GetHtml/DOMwalk.js";
break;
}
if(typeof GetHtmlImplementation=="undefined"&&!document.getElementById(_91)){
Xinha.loadPlugin("GetHtmlImplementation",function(){
_8c.generate();
},_91);
return false;
}else{
_8c.registerPlugin("GetHtmlImplementation");
}
if(_editor_skin!==""){
var _92=false;
var _93=document.getElementsByTagName("head")[0];
var _94=document.getElementsByTagName("link");
for(i=0;i<_94.length;i++){
if((_94[i].rel=="stylesheet")&&(_94[i].href==_editor_url+"skins/"+_editor_skin+"/skin.css")){
_92=true;
}
}
if(!_92){
var _95=document.createElement("link");
_95.type="text/css";
_95.href=_editor_url+"skins/"+_editor_skin+"/skin.css";
_95.rel="stylesheet";
_93.appendChild(_95);
}
}
this.setLoadingMessage(Xinha._lc("Generate Xinha framework"));
this._framework={"table":document.createElement("table"),"tbody":document.createElement("tbody"),"tb_row":document.createElement("tr"),"tb_cell":document.createElement("td"),"tp_row":document.createElement("tr"),"tp_cell":this._panels.top.container,"ler_row":document.createElement("tr"),"lp_cell":this._panels.left.container,"ed_cell":document.createElement("td"),"rp_cell":this._panels.right.container,"bp_row":document.createElement("tr"),"bp_cell":this._panels.bottom.container,"sb_row":document.createElement("tr"),"sb_cell":document.createElement("td")};
Xinha.freeLater(this._framework);
var fw=this._framework;
fw.table.border="0";
fw.table.cellPadding="0";
fw.table.cellSpacing="0";
fw.tb_row.style.verticalAlign="top";
fw.tp_row.style.verticalAlign="top";
fw.ler_row.style.verticalAlign="top";
fw.bp_row.style.verticalAlign="top";
fw.sb_row.style.verticalAlign="top";
fw.ed_cell.style.position="relative";
fw.tb_row.appendChild(fw.tb_cell);
fw.tb_cell.colSpan=3;
fw.tp_row.appendChild(fw.tp_cell);
fw.tp_cell.colSpan=3;
fw.ler_row.appendChild(fw.lp_cell);
fw.ler_row.appendChild(fw.ed_cell);
fw.ler_row.appendChild(fw.rp_cell);
fw.bp_row.appendChild(fw.bp_cell);
fw.bp_cell.colSpan=3;
fw.sb_row.appendChild(fw.sb_cell);
fw.sb_cell.colSpan=3;
fw.tbody.appendChild(fw.tb_row);
fw.tbody.appendChild(fw.tp_row);
fw.tbody.appendChild(fw.ler_row);
fw.tbody.appendChild(fw.bp_row);
fw.tbody.appendChild(fw.sb_row);
fw.table.appendChild(fw.tbody);
var _97=this._framework.table;
this._htmlArea=_97;
Xinha.freeLater(this,"_htmlArea");
_97.className="htmlarea";
this._framework.tb_cell.appendChild(this._createToolbar());
var _98=document.createElement("iframe");
_98.src=_editor_url+_8c.config.URIs.blank;
_98.id="XinhaIFrame_"+this._textArea.id;
this._framework.ed_cell.appendChild(_98);
this._iframe=_98;
this._iframe.className="xinha_iframe";
Xinha.freeLater(this,"_iframe");
var _99=this._createStatusBar();
this._framework.sb_cell.appendChild(_99);
var _9a=this._textArea;
_9a.parentNode.insertBefore(_97,_9a);
_9a.className="xinha_textarea";
Xinha.removeFromParent(_9a);
this._framework.ed_cell.appendChild(_9a);
Xinha.addDom0Event(this._textArea,"click",function(){
if(Xinha._currentlyActiveEditor!=this){
_8c.updateToolbar();
}
return true;
});
if(_9a.form){
Xinha.prependDom0Event(this._textArea.form,"submit",function(){
_8c._textArea.value=_8c.outwardHtml(_8c.getHTML());
return true;
});
var _9b=_9a.value;
Xinha.prependDom0Event(this._textArea.form,"reset",function(){
_8c.setHTML(_8c.inwardHtml(_9b));
_8c.updateToolbar();
return true;
});
if(!_9a.form.xinha_submit){
try{
_9a.form.xinha_submit=_9a.form.submit;
_9a.form.submit=function(){
this.onsubmit();
this.xinha_submit();
};
}
catch(ex){
}
}
}
Xinha.prependDom0Event(window,"unload",function(){
_9a.value=_8c.outwardHtml(_8c.getHTML());
var x=_97.parentNode.replaceChild(_9a,_97);
_9a.style.display="";
x.style.display="none";
document.body.appendChild(x);
return true;
});
_9a.style.display="none";
_8c.initSize();
this.setLoadingMessage(Xinha._lc("Finishing"));
_8c._iframeLoadDone=false;
if(Xinha.is_opera){
Xinha._addEvent(this._iframe.contentWindow,"load",function(e){
if(!_8c._iframeLoadDone){
_8c._iframeLoadDone=true;
_8c.initIframe();
}
return true;
});
}else{
Xinha._addEvent(this._iframe,"load",function(e){
if(!_8c._iframeLoadDone){
_8c._iframeLoadDone=true;
_8c.initIframe();
}
return true;
});
}
};
Xinha.prototype.initSize=function(){
this.setLoadingMessage(Xinha._lc("Init editor size"));
var _9f=this;
var _a0=null;
var _a1=null;
switch(this.config.width){
case "auto":
_a0=this._initial_ta_size.w;
break;
case "toolbar":
_a0=this._toolBar.offsetWidth+"px";
break;
default:
_a0=/[^0-9]/.test(this.config.width)?this.config.width:this.config.width+"px";
break;
}
switch(this.config.height){
case "auto":
_a1=this._initial_ta_size.h;
break;
default:
_a1=/[^0-9]/.test(this.config.height)?this.config.height:this.config.height+"px";
break;
}
this.sizeEditor(_a0,_a1,this.config.sizeIncludesBars,this.config.sizeIncludesPanels);
this.notifyOn("panel_change",function(){
_9f.sizeEditor();
});
};
Xinha.prototype.sizeEditor=function(_a2,_a3,_a4,_a5){
if(this._risizing){
return;
}
this._risizing=true;
this.notifyOf("before_resize",{width:_a2,height:_a3});
this._iframe.style.height="100%";
this._textArea.style.height="100%";
this._iframe.style.width="";
this._textArea.style.width="";
if(_a4!==null){
this._htmlArea.sizeIncludesToolbars=_a4;
}
if(_a5!==null){
this._htmlArea.sizeIncludesPanels=_a5;
}
if(_a2){
this._htmlArea.style.width=_a2;
if(!this._htmlArea.sizeIncludesPanels){
var _a6=this._panels.right;
if(_a6.on&&_a6.panels.length&&Xinha.hasDisplayedChildren(_a6.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.right,10))+"px";
}
var _a7=this._panels.left;
if(_a7.on&&_a7.panels.length&&Xinha.hasDisplayedChildren(_a7.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.left,10))+"px";
}
}
}
if(_a3){
this._htmlArea.style.height=_a3;
if(!this._htmlArea.sizeIncludesToolbars){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+this._toolbar.offsetHeight+this._statusBar.offsetHeight)+"px";
}
if(!this._htmlArea.sizeIncludesPanels){
var _a8=this._panels.top;
if(_a8.on&&_a8.panels.length&&Xinha.hasDisplayedChildren(_a8.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.top,10))+"px";
}
var _a9=this._panels.bottom;
if(_a9.on&&_a9.panels.length&&Xinha.hasDisplayedChildren(_a9.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.bottom,10))+"px";
}
}
}
_a2=this._htmlArea.offsetWidth;
_a3=this._htmlArea.offsetHeight;
var _aa=this._panels;
var _ab=this;
var _ac=1;
function panel_is_alive(pan){
if(_aa[pan].on&&_aa[pan].panels.length&&Xinha.hasDisplayedChildren(_aa[pan].container)){
_aa[pan].container.style.display="";
return true;
}else{
_aa[pan].container.style.display="none";
return false;
}
}
if(panel_is_alive("left")){
_ac+=1;
}
if(panel_is_alive("right")){
_ac+=1;
}
this._framework.tb_cell.colSpan=_ac;
this._framework.tp_cell.colSpan=_ac;
this._framework.bp_cell.colSpan=_ac;
this._framework.sb_cell.colSpan=_ac;
if(!this._framework.tp_row.childNodes.length){
Xinha.removeFromParent(this._framework.tp_row);
}else{
if(!Xinha.hasParentNode(this._framework.tp_row)){
this._framework.tbody.insertBefore(this._framework.tp_row,this._framework.ler_row);
}
}
if(!this._framework.bp_row.childNodes.length){
Xinha.removeFromParent(this._framework.bp_row);
}else{
if(!Xinha.hasParentNode(this._framework.bp_row)){
this._framework.tbody.insertBefore(this._framework.bp_row,this._framework.ler_row.nextSibling);
}
}
if(!this.config.statusBar){
Xinha.removeFromParent(this._framework.sb_row);
}else{
if(!Xinha.hasParentNode(this._framework.sb_row)){
this._framework.table.appendChild(this._framework.sb_row);
}
}
this._framework.lp_cell.style.width=this.config.panel_dimensions.left;
this._framework.rp_cell.style.width=this.config.panel_dimensions.right;
this._framework.tp_cell.style.height=this.config.panel_dimensions.top;
this._framework.bp_cell.style.height=this.config.panel_dimensions.bottom;
this._framework.tb_cell.style.height=this._toolBar.offsetHeight+"px";
this._framework.sb_cell.style.height=this._statusBar.offsetHeight+"px";
var _ae=_a3-this._toolBar.offsetHeight-this._statusBar.offsetHeight;
if(panel_is_alive("top")){
_ae-=parseInt(this.config.panel_dimensions.top,10);
}
if(panel_is_alive("bottom")){
_ae-=parseInt(this.config.panel_dimensions.bottom,10);
}
this._iframe.style.height=_ae+"px";
var _af=_a2;
if(panel_is_alive("left")){
_af-=parseInt(this.config.panel_dimensions.left,10);
}
if(panel_is_alive("right")){
_af-=parseInt(this.config.panel_dimensions.right,10);
}
this._iframe.style.width=_af+"px";
this._textArea.style.height=this._iframe.style.height;
this._textArea.style.width=this._iframe.style.width;
this.notifyOf("resize",{width:this._htmlArea.offsetWidth,height:this._htmlArea.offsetHeight});
this._risizing=false;
};
Xinha.prototype.addPanel=function(_b0){
var div=document.createElement("div");
div.side=_b0;
if(_b0=="left"||_b0=="right"){
div.style.width=this.config.panel_dimensions[_b0];
if(this._iframe){
div.style.height=this._iframe.style.height;
}
}
Xinha.addClasses(div,"panel");
this._panels[_b0].panels.push(div);
this._panels[_b0].div.appendChild(div);
this.notifyOf("panel_change",{"action":"add","panel":div});
return div;
};
Xinha.prototype.removePanel=function(_b2){
this._panels[_b2.side].div.removeChild(_b2);
var _b3=[];
for(var i=0;i<this._panels[_b2.side].panels.length;i++){
if(this._panels[_b2.side].panels[i]!=_b2){
_b3.push(this._panels[_b2.side].panels[i]);
}
}
this._panels[_b2.side].panels=_b3;
this.notifyOf("panel_change",{"action":"remove","panel":_b2});
};
Xinha.prototype.hidePanel=function(_b5){
if(_b5&&_b5.style.display!="none"){
try{
var pos=this.scrollPos(this._iframe.contentWindow);
}
catch(e){
}
_b5.style.display="none";
this.notifyOf("panel_change",{"action":"hide","panel":_b5});
try{
this._iframe.contentWindow.scrollTo(pos.x,pos.y);
}
catch(e){
}
}
};
Xinha.prototype.showPanel=function(_b7){
if(_b7&&_b7.style.display=="none"){
try{
var pos=this.scrollPos(this._iframe.contentWindow);
}
catch(e){
}
_b7.style.display="";
this.notifyOf("panel_change",{"action":"show","panel":_b7});
try{
this._iframe.contentWindow.scrollTo(pos.x,pos.y);
}
catch(e){
}
}
};
Xinha.prototype.hidePanels=function(_b9){
if(typeof _b9=="undefined"){
_b9=["left","right","top","bottom"];
}
var _ba=[];
for(var i=0;i<_b9.length;i++){
if(this._panels[_b9[i]].on){
_ba.push(_b9[i]);
this._panels[_b9[i]].on=false;
}
}
this.notifyOf("panel_change",{"action":"multi_hide","sides":_b9});
};
Xinha.prototype.showPanels=function(_bc){
if(typeof _bc=="undefined"){
_bc=["left","right","top","bottom"];
}
var _bd=[];
for(var i=0;i<_bc.length;i++){
if(!this._panels[_bc[i]].on){
_bd.push(_bc[i]);
this._panels[_bc[i]].on=true;
}
}
this.notifyOf("panel_change",{"action":"multi_show","sides":_bc});
};
Xinha.objectProperties=function(obj){
var _c0=[];
for(var x in obj){
_c0[_c0.length]=x;
}
return _c0;
};
Xinha.prototype.editorIsActivated=function(){
try{
return Xinha.is_designMode?this._doc.designMode=="on":this._doc.body.contentEditable;
}
catch(ex){
return false;
}
};
Xinha._someEditorHasBeenActivated=false;
Xinha._currentlyActiveEditor=false;
Xinha.prototype.activateEditor=function(){
if(Xinha._currentlyActiveEditor){
if(Xinha._currentlyActiveEditor==this){
return true;
}
Xinha._currentlyActiveEditor.deactivateEditor();
}
if(Xinha.is_designMode&&this._doc.designMode!="on"){
try{
if(this._iframe.style.display=="none"){
this._iframe.style.display="";
this._doc.designMode="on";
this._iframe.style.display="none";
}else{
this._doc.designMode="on";
}
}
catch(ex){
}
}else{
if(!Xinha.is_gecko&&this._doc.body.contentEditable!==true){
this._doc.body.contentEditable=true;
}
}
Xinha._someEditorHasBeenActivated=true;
Xinha._currentlyActiveEditor=this;
var _c2=this;
this.enableToolbar();
};
Xinha.prototype.deactivateEditor=function(){
this.disableToolbar();
if(Xinha.is_designMode&&this._doc.designMode!="off"){
try{
this._doc.designMode="off";
}
catch(ex){
}
}else{
if(!Xinha.is_gecko&&this._doc.body.contentEditable!==false){
this._doc.body.contentEditable=false;
}
}
if(Xinha._currentlyActiveEditor!=this){
return;
}
Xinha._currentlyActiveEditor=false;
};
Xinha.prototype.initIframe=function(){
this.disableToolbar();
var doc=null;
var _c4=this;
try{
if(_c4._iframe.contentDocument){
this._doc=_c4._iframe.contentDocument;
}else{
this._doc=_c4._iframe.contentWindow.document;
}
doc=this._doc;
if(!doc){
if(Xinha.is_gecko){
setTimeout(function(){
_c4.initIframe();
},50);
return false;
}else{
alert("ERROR: IFRAME can't be initialized.");
}
}
}
catch(ex){
setTimeout(function(){
_c4.initIframe();
},50);
}
Xinha.freeLater(this,"_doc");
doc.open("text/html","replace");
var _c5="";
if(_c4.config.browserQuirksMode===false){
var _c6="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">";
}else{
if(_c4.config.browserQuirksMode===true){
var _c6="";
}else{
var _c6=Xinha.getDoctype(document);
}
}
if(!_c4.config.fullPage){
_c5+=_c6+"\n";
_c5+="<html>\n";
_c5+="<head>\n";
_c5+="<meta http-equiv=\"Content-Type\" content=\"text/html; charset="+_c4.config.charSet+"\">\n";
if(typeof _c4.config.baseHref!="undefined"&&_c4.config.baseHref!==null){
_c5+="<base href=\""+_c4.config.baseHref+"\"/>\n";
}
_c5+=Xinha.addCoreCSS();
if(_c4.config.pageStyle){
_c5+="<style type=\"text/css\">\n"+_c4.config.pageStyle+"\n</style>";
}
if(typeof _c4.config.pageStyleSheets!=="undefined"){
for(var i=0;i<_c4.config.pageStyleSheets.length;i++){
if(_c4.config.pageStyleSheets[i].length>0){
_c5+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_c4.config.pageStyleSheets[i]+"\">";
}
}
}
_c5+="</head>\n";
_c5+="<body>\n";
_c5+=_c4.inwardHtml(_c4._textArea.value);
_c5+="</body>\n";
_c5+="</html>";
}else{
_c5=_c4.inwardHtml(_c4._textArea.value);
if(_c5.match(Xinha.RE_doctype)){
_c4.setDoctype(RegExp.$1);
}
var _c8=_c5.match(/<link\s+[\s\S]*?["']\s*\/?>/gi);
_c5=_c5.replace(/<link\s+[\s\S]*?["']\s*\/?>\s*/gi,"");
_c8?_c5=_c5.replace(/<\/head>/i,_c8.join("\n")+"\n</head>"):null;
}
doc.write(_c5);
doc.close();
if(this.config.fullScreen){
this._fullScreen();
}
this.setEditorEvents();
};
Xinha.prototype.whenDocReady=function(F){
var E=this;
if(this._doc&&this._doc.body){
F();
}else{
setTimeout(function(){
E.whenDocReady(F);
},50);
}
};
Xinha.prototype.setMode=function(_cb){
var _cc;
if(typeof _cb=="undefined"){
_cb=this._editMode=="textmode"?"wysiwyg":"textmode";
}
switch(_cb){
case "textmode":
this.setCC("iframe");
_cc=this.outwardHtml(this.getHTML());
this.setHTML(_cc);
this.deactivateEditor();
this._iframe.style.display="none";
this._textArea.style.display="";
if(this.config.statusBar){
this._statusBarTree.style.display="none";
this._statusBarTextMode.style.display="";
}
this.notifyOf("modechange",{"mode":"text"});
this.findCC("textarea");
break;
case "wysiwyg":
this.setCC("textarea");
_cc=this.inwardHtml(this.getHTML());
this.deactivateEditor();
this.setHTML(_cc);
this._iframe.style.display="";
this._textArea.style.display="none";
this.activateEditor();
if(this.config.statusBar){
this._statusBarTree.style.display="";
this._statusBarTextMode.style.display="none";
}
this.notifyOf("modechange",{"mode":"wysiwyg"});
this.findCC("iframe");
break;
default:
alert("Mode <"+_cb+"> not defined!");
return false;
}
this._editMode=_cb;
for(var i in this.plugins){
var _ce=this.plugins[i].instance;
if(_ce&&typeof _ce.onMode=="function"){
_ce.onMode(_cb);
}
}
};
Xinha.prototype.setFullHTML=function(_cf){
var _d0=RegExp.multiline;
RegExp.multiline=true;
if(_cf.match(Xinha.RE_doctype)){
this.setDoctype(RegExp.$1);
}
RegExp.multiline=_d0;
if(0){
if(_cf.match(Xinha.RE_head)){
this._doc.getElementsByTagName("head")[0].innerHTML=RegExp.$1;
}
if(_cf.match(Xinha.RE_body)){
this._doc.getElementsByTagName("body")[0].innerHTML=RegExp.$1;
}
}else{
var _d1=this.editorIsActivated();
if(_d1){
this.deactivateEditor();
}
var _d2=/<html>((.|\n)*?)<\/html>/i;
_cf=_cf.replace(_d2,"$1");
this._doc.open("text/html","replace");
this._doc.write(_cf);
this._doc.close();
if(_d1){
this.activateEditor();
}
this.setEditorEvents();
return true;
}
};
Xinha.prototype.setEditorEvents=function(){
var _d3=this;
var doc=this._doc;
_d3.whenDocReady(function(){
Xinha._addEvents(doc,["mousedown"],function(){
_d3.activateEditor();
return true;
});
Xinha._addEvents(doc,["keydown","keypress","mousedown","mouseup","drag"],function(_d5){
return _d3._editorEvent(Xinha.is_ie?_d3._iframe.contentWindow.event:_d5);
});
for(var i in _d3.plugins){
var _d7=_d3.plugins[i].instance;
Xinha.refreshPlugin(_d7);
}
if(typeof _d3._onGenerate=="function"){
_d3._onGenerate();
}
Xinha.addDom0Event(window,"resize",function(e){
_d3.sizeEditor();
});
_d3.removeLoadingMessage();
});
};
Xinha.prototype.registerPlugin=function(){
if(!Xinha.isSupportedBrowser){
return;
}
var _d9=arguments[0];
if(_d9===null||typeof _d9=="undefined"||(typeof _d9=="string"&&eval("typeof "+_d9)=="undefined")){
return false;
}
var _da=[];
for(var i=1;i<arguments.length;++i){
_da.push(arguments[i]);
}
return this.registerPlugin2(_d9,_da);
};
Xinha.prototype.registerPlugin2=function(_dc,_dd){
if(typeof _dc=="string"){
_dc=eval(_dc);
}
if(typeof _dc=="undefined"){
return false;
}
var obj=new _dc(this,_dd);
if(obj){
var _df={};
var _e0=_dc._pluginInfo;
for(var i in _e0){
_df[i]=_e0[i];
}
_df.instance=obj;
_df.args=_dd;
this.plugins[_dc._pluginInfo.name]=_df;
return obj;
}else{
alert("Can't register plugin "+_dc.toString()+".");
}
};
Xinha.getPluginDir=function(_e2){
return _editor_url+"plugins/"+_e2;
};
Xinha.loadPlugin=function(_e3,_e4,_e5){
if(!Xinha.isSupportedBrowser){
return;
}
Xinha.setLoadingMessage(Xinha._lc("Loading plugin $plugin="+_e3+"$"));
if(eval("typeof "+_e3)!="undefined"){
if(_e4){
_e4(_e3);
}
return true;
}
if(!_e5){
var dir=this.getPluginDir(_e3);
var _e7=_e3.replace(/([a-z])([A-Z])([a-z])/g,function(str,l1,l2,l3){
return l1+"-"+l2.toLowerCase()+l3;
}).toLowerCase()+".js";
_e5=dir+"/"+_e7;
}
Xinha._loadback(_e5,_e4?function(){
_e4(_e3);
}:null);
return false;
};
Xinha._pluginLoadStatus={};
Xinha.loadPlugins=function(_ec,_ed){
if(!Xinha.isSupportedBrowser){
return;
}
var _ee=true;
var _ef=Xinha.cloneObject(_ec);
while(_ef.length){
var p=_ef.pop();
if(typeof Xinha._pluginLoadStatus[p]=="undefined"){
Xinha._pluginLoadStatus[p]="loading";
Xinha.loadPlugin(p,function(_f1){
if(eval("typeof "+_f1)!="undefined"){
Xinha._pluginLoadStatus[_f1]="ready";
}else{
Xinha._pluginLoadStatus[_f1]="failed";
}
});
_ee=false;
}else{
switch(Xinha._pluginLoadStatus[p]){
case "failed":
case "ready":
break;
default:
_ee=false;
break;
}
}
}
if(_ee){
return true;
}
if(_ed){
setTimeout(function(){
if(Xinha.loadPlugins(_ec,_ed)){
_ed();
}
},150);
}
return _ee;
};
Xinha.refreshPlugin=function(_f2){
if(_f2&&typeof _f2.onGenerate=="function"){
_f2.onGenerate();
}
if(_f2&&typeof _f2.onGenerateOnce=="function"){
_f2.onGenerateOnce();
_f2.onGenerateOnce=null;
}
};
Xinha.prototype.firePluginEvent=function(_f3){
var _f4=[];
for(var i=1;i<arguments.length;i++){
_f4[i-1]=arguments[i];
}
for(var i in this.plugins){
var _f6=this.plugins[i].instance;
if(_f6==this._browserSpecificPlugin){
continue;
}
if(_f6&&typeof _f6[_f3]=="function"){
if(_f6[_f3].apply(_f6,_f4)){
return true;
}
}
}
var _f6=this._browserSpecificPlugin;
if(_f6&&typeof _f6[_f3]=="function"){
if(_f6[_f3].apply(_f6,_f4)){
return true;
}
}
return false;
};
Xinha.loadStyle=function(_f7,_f8,id){
var url=_editor_url||"";
if(_f8){
url+="plugins/"+_f8+"/";
}
url+=_f7;
if(/^\//.test(_f7)){
url=_f7;
}
var _fb=document.getElementsByTagName("head")[0];
var _fc=document.createElement("link");
_fc.rel="stylesheet";
_fc.href=url;
if(id){
_fc.id=id;
}
_fb.appendChild(_fc);
};
Xinha.prototype.debugTree=function(){
var ta=document.createElement("textarea");
ta.style.width="100%";
ta.style.height="20em";
ta.value="";
function debug(_fe,str){
for(;--_fe>=0;){
ta.value+=" ";
}
ta.value+=str+"\n";
}
function _dt(root,_101){
var tag=root.tagName.toLowerCase(),i;
var ns=Xinha.is_ie?root.scopeName:root.prefix;
debug(_101,"- "+tag+" ["+ns+"]");
for(i=root.firstChild;i;i=i.nextSibling){
if(i.nodeType==1){
_dt(i,_101+2);
}
}
}
_dt(this._doc.body,0);
document.body.appendChild(ta);
};
Xinha.getInnerText=function(el){
var txt="",i;
for(i=el.firstChild;i;i=i.nextSibling){
if(i.nodeType==3){
txt+=i.data;
}else{
if(i.nodeType==1){
txt+=Xinha.getInnerText(i);
}
}
}
return txt;
};
Xinha.prototype._wordClean=function(){
var _106=this;
var _107={empty_tags:0,mso_class:0,mso_style:0,mso_xmlel:0,orig_len:this._doc.body.innerHTML.length,T:(new Date()).getTime()};
var _108={empty_tags:"Empty tags removed: ",mso_class:"MSO class names removed: ",mso_style:"MSO inline style removed: ",mso_xmlel:"MSO XML elements stripped: "};
function showStats(){
var txt="Xinha word cleaner stats: \n\n";
for(var i in _107){
if(_108[i]){
txt+=_108[i]+_107[i]+"\n";
}
}
txt+="\nInitial document length: "+_107.orig_len+"\n";
txt+="Final document length: "+_106._doc.body.innerHTML.length+"\n";
txt+="Clean-up took "+(((new Date()).getTime()-_107.T)/1000)+" seconds";
alert(txt);
}
function clearClass(node){
var newc=node.className.replace(/(^|\s)mso.*?(\s|$)/ig," ");
if(newc!=node.className){
node.className=newc;
if(!(/\S/.test(node.className))){
node.removeAttribute("className");
++_107.mso_class;
}
}
}
function clearStyle(node){
var _10e=node.style.cssText.split(/\s*;\s*/);
for(var i=_10e.length;--i>=0;){
if((/^mso|^tab-stops/i.test(_10e[i]))||(/^margin\s*:\s*0..\s+0..\s+0../i.test(_10e[i]))){
++_107.mso_style;
_10e.splice(i,1);
}
}
node.style.cssText=_10e.join("; ");
}
var _110=null;
if(Xinha.is_ie){
_110=function(el){
el.outerHTML=Xinha.htmlEncode(el.innerText);
++_107.mso_xmlel;
};
}else{
_110=function(el){
var txt=document.createTextNode(Xinha.getInnerText(el));
el.parentNode.insertBefore(txt,el);
Xinha.removeFromParent(el);
++_107.mso_xmlel;
};
}
function checkEmpty(el){
if(/^(span|b|strong|i|em|font|div|p)$/i.test(el.tagName)&&!el.firstChild){
Xinha.removeFromParent(el);
++_107.empty_tags;
}
}
function parseTree(root){
var tag=root.tagName.toLowerCase(),i,next;
if((Xinha.is_ie&&root.scopeName!="HTML")||(!Xinha.is_ie&&(/:/.test(tag)))){
_110(root);
return false;
}else{
clearClass(root);
clearStyle(root);
for(i=root.firstChild;i;i=next){
next=i.nextSibling;
if(i.nodeType==1&&parseTree(i)){
checkEmpty(i);
}
}
}
return true;
}
parseTree(this._doc.body);
this.updateToolbar();
};
Xinha.prototype._clearFonts=function(){
var D=this.getInnerHTML();
if(confirm(Xinha._lc("Would you like to clear font typefaces?"))){
D=D.replace(/face="[^"]*"/gi,"");
D=D.replace(/font-family:[^;}"']+;?/gi,"");
}
if(confirm(Xinha._lc("Would you like to clear font sizes?"))){
D=D.replace(/size="[^"]*"/gi,"");
D=D.replace(/font-size:[^;}"']+;?/gi,"");
}
if(confirm(Xinha._lc("Would you like to clear font colours?"))){
D=D.replace(/color="[^"]*"/gi,"");
D=D.replace(/([^-])color:[^;}"']+;?/gi,"$1");
}
D=D.replace(/(style|class)="\s*"/gi,"");
D=D.replace(/<(font|span)\s*>/gi,"");
this.setHTML(D);
this.updateToolbar();
};
Xinha.prototype._splitBlock=function(){
this._doc.execCommand("formatblock",false,"div");
};
Xinha.prototype.forceRedraw=function(){
this._doc.body.style.visibility="hidden";
this._doc.body.style.visibility="";
};
Xinha.prototype.focusEditor=function(){
switch(this._editMode){
case "wysiwyg":
try{
if(Xinha._someEditorHasBeenActivated){
this.activateEditor();
this._iframe.contentWindow.focus();
}
}
catch(ex){
}
break;
case "textmode":
try{
this._textArea.focus();
}
catch(e){
}
break;
default:
alert("ERROR: mode "+this._editMode+" is not defined");
}
return this._doc;
};
Xinha.prototype._undoTakeSnapshot=function(){
++this._undoPos;
if(this._undoPos>=this.config.undoSteps){
this._undoQueue.shift();
--this._undoPos;
}
var take=true;
var txt=this.getInnerHTML();
if(this._undoPos>0){
take=(this._undoQueue[this._undoPos-1]!=txt);
}
if(take){
this._undoQueue[this._undoPos]=txt;
}else{
this._undoPos--;
}
};
Xinha.prototype.undo=function(){
if(this._undoPos>0){
var txt=this._undoQueue[--this._undoPos];
if(txt){
this.setHTML(txt);
}else{
++this._undoPos;
}
}
};
Xinha.prototype.redo=function(){
if(this._undoPos<this._undoQueue.length-1){
var txt=this._undoQueue[++this._undoPos];
if(txt){
this.setHTML(txt);
}else{
--this._undoPos;
}
}
};
Xinha.prototype.disableToolbar=function(_11c){
if(this._timerToolbar){
clearTimeout(this._timerToolbar);
}
if(typeof _11c=="undefined"){
_11c=[];
}else{
if(typeof _11c!="object"){
_11c=[_11c];
}
}
for(var i in this._toolbarObjects){
var btn=this._toolbarObjects[i];
if(_11c.contains(i)){
continue;
}
if(typeof (btn.state)!="function"){
continue;
}
btn.state("enabled",false);
}
};
Xinha.prototype.enableToolbar=function(){
this.updateToolbar();
};
if(!Array.prototype.contains){
Array.prototype.contains=function(_11f){
var _120=this;
for(var i=0;i<_120.length;i++){
if(_11f==_120[i]){
return true;
}
}
return false;
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_122){
var _123=this;
for(var i=0;i<_123.length;i++){
if(_122==_123[i]){
return i;
}
}
return null;
};
}
Xinha.prototype.updateToolbar=function(_125){
if(this.suspendUpdateToolbar){
return;
}
var doc=this._doc;
var text=(this._editMode=="textmode");
var _128=null;
if(!text){
_128=this.getAllAncestors();
if(this.config.statusBar&&!_125){
while(this._statusBarItems.length){
var item=this._statusBarItems.pop();
item.el=null;
item.editor=null;
item.onclick=null;
item.oncontextmenu=null;
item._xinha_dom0Events["click"]=null;
item._xinha_dom0Events["contextmenu"]=null;
item=null;
}
this._statusBarTree.innerHTML=Xinha._lc("Path")+": ";
for(var i=_128.length;--i>=0;){
var el=_128[i];
if(!el){
continue;
}
var a=document.createElement("a");
a.href="javascript:void(0)";
a.el=el;
a.editor=this;
this._statusBarItems.push(a);
Xinha.addDom0Event(a,"click",function(){
this.blur();
this.editor.selectNodeContents(this.el);
this.editor.updateToolbar(true);
return false;
});
Xinha.addDom0Event(a,"contextmenu",function(){
this.blur();
var info="Inline style:\n\n";
info+=this.el.style.cssText.split(/;\s*/).join(";\n");
alert(info);
return false;
});
var txt=el.tagName.toLowerCase();
if(typeof el.style!="undefined"){
a.title=el.style.cssText;
}
if(el.id){
txt+="#"+el.id;
}
if(el.className){
txt+="."+el.className;
}
a.appendChild(document.createTextNode(txt));
this._statusBarTree.appendChild(a);
if(i!==0){
this._statusBarTree.appendChild(document.createTextNode(String.fromCharCode(187)));
}
Xinha.freeLater(a);
}
}
}
for(var cmd in this._toolbarObjects){
var btn=this._toolbarObjects[cmd];
var _131=true;
if(typeof (btn.state)!="function"){
continue;
}
if(btn.context&&!text){
_131=false;
var _132=btn.context;
var _133=[];
if(/(.*)\[(.*?)\]/.test(_132)){
_132=RegExp.$1;
_133=RegExp.$2.split(",");
}
_132=_132.toLowerCase();
var _134=(_132=="*");
for(var k=0;k<_128.length;++k){
if(!_128[k]){
continue;
}
if(_134||(_128[k].tagName.toLowerCase()==_132)){
_131=true;
var _136=null;
var att=null;
var comp=null;
var _139=null;
for(var ka=0;ka<_133.length;++ka){
_136=_133[ka].match(/(.*)(==|!=|===|!==|>|>=|<|<=)(.*)/);
att=_136[1];
comp=_136[2];
_139=_136[3];
if(!eval(_128[k][att]+comp+_139)){
_131=false;
break;
}
}
if(_131){
break;
}
}
}
}
btn.state("enabled",(!text||btn.text)&&_131);
if(typeof cmd=="function"){
continue;
}
var _13b=this.config.customSelects[cmd];
if((!text||btn.text)&&(typeof _13b!="undefined")){
_13b.refresh(this);
continue;
}
switch(cmd){
case "fontname":
case "fontsize":
if(!text){
try{
var _13c=(""+doc.queryCommandValue(cmd)).toLowerCase();
if(!_13c){
btn.element.selectedIndex=0;
break;
}
var _13d=this.config[cmd];
var _13e=0;
for(var j in _13d){
if((j.toLowerCase()==_13c)||(_13d[j].substr(0,_13c.length).toLowerCase()==_13c)){
btn.element.selectedIndex=_13e;
throw "ok";
}
++_13e;
}
btn.element.selectedIndex=0;
}
catch(ex){
}
}
break;
case "formatblock":
var _140=[];
for(var _141 in this.config.formatblock){
if(typeof this.config.formatblock[_141]=="string"){
_140[_140.length]=this.config.formatblock[_141];
}
}
var _142=this._getFirstAncestor(this.getSelection(),_140);
if(_142){
for(var x=0;x<_140.length;x++){
if(_140[x].toLowerCase()==_142.tagName.toLowerCase()){
btn.element.selectedIndex=x;
}
}
}else{
btn.element.selectedIndex=0;
}
break;
case "textindicator":
if(!text){
try{
var _144=btn.element.style;
_144.backgroundColor=Xinha._makeColor(doc.queryCommandValue(Xinha.is_ie?"backcolor":"hilitecolor"));
if(/transparent/i.test(_144.backgroundColor)){
_144.backgroundColor=Xinha._makeColor(doc.queryCommandValue("backcolor"));
}
_144.color=Xinha._makeColor(doc.queryCommandValue("forecolor"));
_144.fontFamily=doc.queryCommandValue("fontname");
_144.fontWeight=doc.queryCommandState("bold")?"bold":"normal";
_144.fontStyle=doc.queryCommandState("italic")?"italic":"normal";
}
catch(ex){
}
}
break;
case "htmlmode":
btn.state("active",text);
break;
case "lefttoright":
case "righttoleft":
var _145=this.getParentElement();
while(_145&&!Xinha.isBlockElement(_145)){
_145=_145.parentNode;
}
if(_145){
btn.state("active",(_145.style.direction==((cmd=="righttoleft")?"rtl":"ltr")));
}
break;
default:
cmd=cmd.replace(/(un)?orderedlist/i,"insert$1orderedlist");
try{
btn.state("active",(!text&&doc.queryCommandState(cmd)));
}
catch(ex){
}
break;
}
}
if(this._customUndo&&!this._timerUndo){
this._undoTakeSnapshot();
var _146=this;
this._timerUndo=setTimeout(function(){
_146._timerUndo=null;
},this.config.undoTimeout);
}
if(0&&Xinha.is_gecko){
var s=this.getSelection();
if(s&&s.isCollapsed&&s.anchorNode&&s.anchorNode.parentNode.tagName.toLowerCase()!="body"&&s.anchorNode.nodeType==3&&s.anchorOffset==s.anchorNode.length&&!(s.anchorNode.parentNode.nextSibling&&s.anchorNode.parentNode.nextSibling.nodeType==3)&&!Xinha.isBlockElement(s.anchorNode.parentNode)){
try{
s.anchorNode.parentNode.parentNode.insertBefore(this._doc.createTextNode("\t"),s.anchorNode.parentNode.nextSibling);
}
catch(ex){
}
}
}
for(var _148 in this.plugins){
var _149=this.plugins[_148].instance;
if(_149&&typeof _149.onUpdateToolbar=="function"){
_149.onUpdateToolbar();
}
}
};
Xinha.prototype.getAllAncestors=function(){
var p=this.getParentElement();
var a=[];
while(p&&(p.nodeType==1)&&(p.tagName.toLowerCase()!="body")){
a.push(p);
p=p.parentNode;
}
a.push(this._doc.body);
return a;
};
Xinha.prototype._getFirstAncestor=function(sel,_14d){
var prnt=this.activeElement(sel);
if(prnt===null){
try{
prnt=(Xinha.is_ie?this.createRange(sel).parentElement():this.createRange(sel).commonAncestorContainer);
}
catch(ex){
return null;
}
}
if(typeof _14d=="string"){
_14d=[_14d];
}
while(prnt){
if(prnt.nodeType==1){
if(_14d===null){
return prnt;
}
if(_14d.contains(prnt.tagName.toLowerCase())){
return prnt;
}
if(prnt.tagName.toLowerCase()=="body"){
break;
}
if(prnt.tagName.toLowerCase()=="table"){
break;
}
}
prnt=prnt.parentNode;
}
return null;
};
Xinha.prototype._getAncestorBlock=function(sel){
var prnt=(Xinha.is_ie?this.createRange(sel).parentElement:this.createRange(sel).commonAncestorContainer);
while(prnt&&(prnt.nodeType==1)){
switch(prnt.tagName.toLowerCase()){
case "div":
case "p":
case "address":
case "blockquote":
case "center":
case "del":
case "ins":
case "pre":
case "h1":
case "h2":
case "h3":
case "h4":
case "h5":
case "h6":
case "h7":
return prnt;
case "body":
case "noframes":
case "dd":
case "li":
case "th":
case "td":
case "noscript":
return null;
default:
break;
}
}
return null;
};
Xinha.prototype._createImplicitBlock=function(type){
var sel=this.getSelection();
if(Xinha.is_ie){
sel.empty();
}else{
sel.collapseToStart();
}
var rng=this.createRange(sel);
};
Xinha.prototype.surroundHTML=function(_154,_155){
var html=this.getSelectedHTML();
this.insertHTML(_154+html+_155);
};
Xinha.prototype.hasSelectedText=function(){
return this.getSelectedHTML()!=="";
};
Xinha.prototype._comboSelected=function(el,txt){
this.focusEditor();
var _159=el.options[el.selectedIndex].value;
switch(txt){
case "fontname":
case "fontsize":
this.execCommand(txt,false,_159);
break;
case "formatblock":
if(!_159){
this.updateToolbar();
break;
}
if(!Xinha.is_gecko||_159!=="blockquote"){
_159="<"+_159+">";
}
this.execCommand(txt,false,_159);
break;
default:
var _15a=this.config.customSelects[txt];
if(typeof _15a!="undefined"){
_15a.action(this);
}else{
alert("FIXME: combo box "+txt+" not implemented");
}
break;
}
};
Xinha.prototype._colorSelector=function(_15b){
var _15c=this;
if(Xinha.is_gecko){
try{
_15c._doc.execCommand("useCSS",false,false);
_15c._doc.execCommand("styleWithCSS",false,true);
}
catch(ex){
}
}
var btn=_15c._toolbarObjects[_15b].element;
var _15e;
if(_15b=="hilitecolor"){
if(Xinha.is_ie){
_15b="backcolor";
_15e=Xinha._colorToRgb(_15c._doc.queryCommandValue("backcolor"));
}else{
_15e=Xinha._colorToRgb(_15c._doc.queryCommandValue("hilitecolor"));
}
}else{
_15e=Xinha._colorToRgb(_15c._doc.queryCommandValue("forecolor"));
}
var _15f=function(_160){
_15c._doc.execCommand(_15b,false,_160);
};
if(Xinha.is_ie){
var _161=_15c.createRange(_15c.getSelection());
_15f=function(_162){
_161.select();
_15c._doc.execCommand(_15b,false,_162);
};
}
var _163=new Xinha.colorPicker({cellsize:_15c.config.colorPickerCellSize,callback:_15f,granularity:_15c.config.colorPickerGranularity,websafe:_15c.config.colorPickerWebSafe,savecolors:_15c.config.colorPickerSaveColors});
_163.open(_15c.config.colorPickerPosition,btn,_15e);
};
Xinha.prototype.execCommand=function(_164,UI,_166){
var _167=this;
this.focusEditor();
_164=_164.toLowerCase();
if(this.firePluginEvent("onExecCommand",_164,UI,_166)){
this.updateToolbar();
return false;
}
switch(_164){
case "htmlmode":
this.setMode();
break;
case "hilitecolor":
case "forecolor":
this._colorSelector(_164);
break;
case "createlink":
this._createLink();
break;
case "undo":
case "redo":
if(this._customUndo){
this[_164]();
}else{
this._doc.execCommand(_164,UI,_166);
}
break;
case "inserttable":
this._insertTable();
break;
case "insertimage":
this._insertImage();
break;
case "about":
this._popupDialog(_167.config.URIs.about,null,this);
break;
case "showhelp":
this._popupDialog(_167.config.URIs.help,null,this);
break;
case "killword":
this._wordClean();
break;
case "cut":
case "copy":
case "paste":
this._doc.execCommand(_164,UI,_166);
if(this.config.killWordOnPaste){
this._wordClean();
}
break;
case "lefttoright":
case "righttoleft":
if(this.config.changeJustifyWithDirection){
this._doc.execCommand((_164=="righttoleft")?"justifyright":"justifyleft",UI,_166);
}
var dir=(_164=="righttoleft")?"rtl":"ltr";
var el=this.getParentElement();
while(el&&!Xinha.isBlockElement(el)){
el=el.parentNode;
}
if(el){
if(el.style.direction==dir){
el.style.direction="";
}else{
el.style.direction=dir;
}
}
break;
case "justifyleft":
case "justifyright":
_164.match(/^justify(.*)$/);
var ae=this.activeElement(this.getSelection());
if(ae&&ae.tagName.toLowerCase()=="img"){
ae.align=ae.align==RegExp.$1?"":RegExp.$1;
}else{
this._doc.execCommand(_164,UI,_166);
}
break;
default:
try{
this._doc.execCommand(_164,UI,_166);
}
catch(ex){
if(this.config.debug){
alert(ex+"\n\nby execCommand("+_164+");");
}
}
break;
}
this.updateToolbar();
return false;
};
Xinha.prototype._editorEvent=function(ev){
var _16c=this;
if(typeof _16c._textArea["on"+ev.type]=="function"){
_16c._textArea["on"+ev.type]();
}
if(this.isKeyEvent(ev)){
if(_16c.firePluginEvent("onKeyPress",ev)){
return false;
}
if(this.isShortCut(ev)){
this._shortCuts(ev);
}
}
if(ev.type=="mousedown"){
if(_16c.firePluginEvent("onMouseDown",ev)){
return false;
}
}
if(_16c._timerToolbar){
clearTimeout(_16c._timerToolbar);
}
if(!this.suspendUpdateToolbar){
_16c._timerToolbar=setTimeout(function(){
_16c.updateToolbar();
_16c._timerToolbar=null;
},250);
}
};
Xinha.prototype._shortCuts=function(ev){
var key=this.getKey(ev).toLowerCase();
var cmd=null;
var _170=null;
switch(key){
case "b":
cmd="bold";
break;
case "i":
cmd="italic";
break;
case "u":
cmd="underline";
break;
case "s":
cmd="strikethrough";
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
cmd="paste";
break;
case "n":
cmd="formatblock";
_170="p";
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
_170="h"+key;
break;
}
if(cmd){
this.execCommand(cmd,false,_170);
Xinha._stopEvent(ev);
}
};
Xinha.prototype.convertNode=function(el,_172){
var _173=this._doc.createElement(_172);
while(el.firstChild){
_173.appendChild(el.firstChild);
}
return _173;
};
Xinha.prototype.scrollToElement=function(e){
if(!e){
e=this.getParentElement();
if(!e){
return;
}
}
var _175=Xinha.getElementTopLeft(e);
this._iframe.contentWindow.scrollTo(_175.left,_175.top);
};
Xinha.prototype.getHTML=function(){
var html="";
switch(this._editMode){
case "wysiwyg":
if(!this.config.fullPage){
html=Xinha.getHTML(this._doc.body,false,this);
}else{
html=this.doctype+"\n"+Xinha.getHTML(this._doc.documentElement,true,this);
}
break;
case "textmode":
html=this._textArea.value;
break;
default:
alert("Mode <"+this._editMode+"> not defined!");
return false;
}
return html;
};
Xinha.prototype.outwardHtml=function(html){
for(var i in this.plugins){
var _179=this.plugins[i].instance;
if(_179&&typeof _179.outwardHtml=="function"){
html=_179.outwardHtml(html);
}
}
html=html.replace(/<(\/?)b(\s|>|\/)/ig,"<$1strong$2");
html=html.replace(/<(\/?)i(\s|>|\/)/ig,"<$1em$2");
html=html.replace(/<(\/?)strike(\s|>|\/)/ig,"<$1del$2");
html=html.replace(/(<[^>]*onclick=['"])if\(window\.top &amp;&amp; window\.top\.Xinha\)\{return false\}/gi,"$1");
html=html.replace(/(<[^>]*onmouseover=['"])if\(window\.top &amp;&amp; window\.top\.Xinha\)\{return false\}/gi,"$1");
html=html.replace(/(<[^>]*onmouseout=['"])if\(window\.top &amp;&amp; window\.top\.Xinha\)\{return false\}/gi,"$1");
html=html.replace(/(<[^>]*onmousedown=['"])if\(window\.top &amp;&amp; window\.top\.Xinha\)\{return false\}/gi,"$1");
html=html.replace(/(<[^>]*onmouseup=['"])if\(window\.top &amp;&amp; window\.top\.Xinha\)\{return false\}/gi,"$1");
var _17a=location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/";
html=html.replace(/https?:\/\/null\//g,_17a);
html=html.replace(/((href|src|background)=[\'\"])\/+/ig,"$1"+_17a);
html=this.outwardSpecialReplacements(html);
html=this.fixRelativeLinks(html);
if(this.config.sevenBitClean){
html=html.replace(/[^ -~\r\n\t]/g,function(c){
return "&#"+c.charCodeAt(0)+";";
});
}
html=html.replace(/(<script[^>]*)(freezescript)/gi,"$1javascript");
if(this.config.fullPage){
html=Xinha.stripCoreCSS(html);
}
return html;
};
Xinha.prototype.inwardHtml=function(html){
for(var i in this.plugins){
var _17e=this.plugins[i].instance;
if(_17e&&typeof _17e.inwardHtml=="function"){
html=_17e.inwardHtml(html);
}
}
html=html.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");
html=html.replace(/(<[^>]*onclick=["'])/gi,"$1if(window.top &amp;&amp; window.top.Xinha){return false}");
html=html.replace(/(<[^>]*onmouseover=["'])/gi,"$1if(window.top &amp;&amp; window.top.Xinha){return false}");
html=html.replace(/(<[^>]*onmouseout=["'])/gi,"$1if(window.top &amp;&amp; window.top.Xinha){return false}");
html=html.replace(/(<[^>]*onmouseodown=["'])/gi,"$1if(window.top &amp;&amp; window.top.Xinha){return false}");
html=html.replace(/(<[^>]*onmouseup=["'])/gi,"$1if(window.top &amp;&amp; window.top.Xinha){return false}");
html=this.inwardSpecialReplacements(html);
html=html.replace(/(<script[^>]*)(javascript)/gi,"$1freezescript");
var _17f=new RegExp("((href|src|background)=['\"])/+","gi");
html=html.replace(_17f,"$1"+location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/");
html=this.fixRelativeLinks(html);
if(this.config.fullPage){
html=Xinha.addCoreCSS(html);
}
return html;
};
Xinha.prototype.outwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=this.config.specialReplacements[i];
var to=i;
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(Xinha.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
Xinha.prototype.inwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=i;
var to=this.config.specialReplacements[i];
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(Xinha.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
Xinha.prototype.fixRelativeLinks=function(html){
if(typeof this.config.expandRelativeUrl!="undefined"&&this.config.expandRelativeUrl){
var src=html.match(/(src|href)="([^"]*)"/gi);
}
var b=document.location.href;
if(src){
var url,url_m,relPath,base_m,absPath;
for(var i=0;i<src.length;++i){
url=src[i].match(/(src|href)="([^"]*)"/i);
url_m=url[2].match(/\.\.\//g);
if(url_m){
relPath=new RegExp("(.*?)(([^/]*/){"+url_m.length+"})[^/]*$");
base_m=b.match(relPath);
absPath=url[2].replace(/(\.\.\/)*/,base_m[1]);
html=html.replace(new RegExp(url[2].replace(Xinha.RE_Specials,"\\$1")),absPath);
}
}
}
if(typeof this.config.stripSelfNamedAnchors!="undefined"&&this.config.stripSelfNamedAnchors){
var _18f=new RegExp(document.location.href.replace(/&/g,"&amp;").replace(Xinha.RE_Specials,"\\$1")+"(#[^'\" ]*)","g");
html=html.replace(_18f,"$1");
}
if(typeof this.config.stripBaseHref!="undefined"&&this.config.stripBaseHref){
var _190=null;
if(typeof this.config.baseHref!="undefined"&&this.config.baseHref!==null){
_190=new RegExp("((href|src|background)=\")("+this.config.baseHref.replace(Xinha.RE_Specials,"\\$1")+")","g");
}else{
_190=new RegExp("((href|src|background)=\")("+document.location.href.replace(/^(https?:\/\/[^\/]*)(.*)/,"$1").replace(Xinha.RE_Specials,"\\$1")+")","g");
}
html=html.replace(_190,"$1");
}
return html;
};
Xinha.prototype.getInnerHTML=function(){
if(!this._doc.body){
return "";
}
var html="";
switch(this._editMode){
case "wysiwyg":
if(!this.config.fullPage){
html=this._doc.body.innerHTML;
}else{
html=this.doctype+"\n"+this._doc.documentElement.innerHTML;
}
break;
case "textmode":
html=this._textArea.value;
break;
default:
alert("Mode <"+this._editMode+"> not defined!");
return false;
}
return html;
};
Xinha.prototype.setHTML=function(html){
if(!this.config.fullPage){
this._doc.body.innerHTML=html;
}else{
this.setFullHTML(html);
}
this._textArea.value=html;
};
Xinha.prototype.setDoctype=function(_193){
this.doctype=_193;
};
Xinha._object=null;
Xinha.cloneObject=function(obj){
if(!obj){
return null;
}
var _195={};
if(obj.constructor.toString().match(/\s*function Array\(/)){
_195=obj.constructor();
}
if(obj.constructor.toString().match(/\s*function Function\(/)){
_195=obj;
}else{
for(var n in obj){
var node=obj[n];
if(typeof node=="object"){
_195[n]=Xinha.cloneObject(node);
}else{
_195[n]=node;
}
}
}
return _195;
};
Xinha._eventFlushers=[];
Xinha.flushEvents=function(){
var x=0;
var e=Xinha._eventFlushers.pop();
while(e){
try{
if(e.length==3){
Xinha._removeEvent(e[0],e[1],e[2]);
x++;
}else{
if(e.length==2){
e[0]["on"+e[1]]=null;
e[0]._xinha_dom0Events[e[1]]=null;
x++;
}
}
}
catch(ex){
}
e=Xinha._eventFlushers.pop();
}
};
if(document.addEventListener){
Xinha._addEvent=function(el,_19b,func){
el.addEventListener(_19b,func,true);
Xinha._eventFlushers.push([el,_19b,func]);
};
Xinha._removeEvent=function(el,_19e,func){
el.removeEventListener(_19e,func,true);
};
Xinha._stopEvent=function(ev){
ev.preventDefault();
ev.stopPropagation();
};
}else{
if(document.attachEvent){
Xinha._addEvent=function(el,_1a2,func){
el.attachEvent("on"+_1a2,func);
Xinha._eventFlushers.push([el,_1a2,func]);
};
Xinha._removeEvent=function(el,_1a5,func){
el.detachEvent("on"+_1a5,func);
};
Xinha._stopEvent=function(ev){
try{
ev.cancelBubble=true;
ev.returnValue=false;
}
catch(ex){
}
};
}else{
Xinha._addEvent=function(el,_1a9,func){
alert("_addEvent is not supported");
};
Xinha._removeEvent=function(el,_1ac,func){
alert("_removeEvent is not supported");
};
Xinha._stopEvent=function(ev){
alert("_stopEvent is not supported");
};
}
}
Xinha._addEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
Xinha._addEvent(el,evs[i],func);
}
};
Xinha._removeEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
Xinha._removeEvent(el,evs[i],func);
}
};
Xinha.addDom0Event=function(el,ev,fn){
Xinha._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].unshift(fn);
};
Xinha.prependDom0Event=function(el,ev,fn){
Xinha._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].push(fn);
};
Xinha._prepareForDom0Events=function(el,ev){
if(typeof el._xinha_dom0Events=="undefined"){
el._xinha_dom0Events={};
Xinha.freeLater(el,"_xinha_dom0Events");
}
if(typeof el._xinha_dom0Events[ev]=="undefined"){
el._xinha_dom0Events[ev]=[];
if(typeof el["on"+ev]=="function"){
el._xinha_dom0Events[ev].push(el["on"+ev]);
}
el["on"+ev]=function(_1bf){
var a=el._xinha_dom0Events[ev];
var _1c1=true;
for(var i=a.length;--i>=0;){
el._xinha_tempEventHandler=a[i];
if(el._xinha_tempEventHandler(_1bf)===false){
el._xinha_tempEventHandler=null;
_1c1=false;
break;
}
el._xinha_tempEventHandler=null;
}
return _1c1;
};
Xinha._eventFlushers.push([el,ev]);
}
};
Xinha.prototype.notifyOn=function(ev,fn){
if(typeof this._notifyListeners[ev]=="undefined"){
this._notifyListeners[ev]=[];
Xinha.freeLater(this,"_notifyListeners");
}
this._notifyListeners[ev].push(fn);
};
Xinha.prototype.notifyOf=function(ev,args){
if(this._notifyListeners[ev]){
for(var i=0;i<this._notifyListeners[ev].length;i++){
this._notifyListeners[ev][i](ev,args);
}
}
};
Xinha._removeClass=function(el,_1c9){
if(!(el&&el.className)){
return;
}
var cls=el.className.split(" ");
var ar=[];
for(var i=cls.length;i>0;){
if(cls[--i]!=_1c9){
ar[ar.length]=cls[i];
}
}
el.className=ar.join(" ");
};
Xinha._addClass=function(el,_1ce){
Xinha._removeClass(el,_1ce);
el.className+=" "+_1ce;
};
Xinha._hasClass=function(el,_1d0){
if(!(el&&el.className)){
return false;
}
var cls=el.className.split(" ");
for(var i=cls.length;i>0;){
if(cls[--i]==_1d0){
return true;
}
}
return false;
};
Xinha._blockTags=" body form textarea fieldset ul ol dl li div "+"p h1 h2 h3 h4 h5 h6 quote pre table thead "+"tbody tfoot tr td th iframe address blockquote ";
Xinha.isBlockElement=function(el){
return el&&el.nodeType==1&&(Xinha._blockTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha._paraContainerTags=" body td th caption fieldset div";
Xinha.isParaContainer=function(el){
return el&&el.nodeType==1&&(Xinha._paraContainerTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha._closingTags=" a abbr acronym address applet b bdo big blockquote button caption center cite code del dfn dir div dl em fieldset font form frameset h1 h2 h3 h4 h5 h6 i iframe ins kbd label legend map menu noframes noscript object ol optgroup pre q s samp script select small span strike strong style sub sup table textarea title tt u ul var ";
Xinha.needsClosingTag=function(el){
return el&&el.nodeType==1&&(Xinha._closingTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha.htmlEncode=function(str){
if(typeof str.replace=="undefined"){
str=str.toString();
}
str=str.replace(/&/ig,"&amp;");
str=str.replace(/</ig,"&lt;");
str=str.replace(/>/ig,"&gt;");
str=str.replace(/\xA0/g,"&nbsp;");
str=str.replace(/\x22/g,"&quot;");
return str;
};
Xinha.prototype.stripBaseURL=function(_1d7){
if(this.config.baseHref===null||!this.config.stripBaseHref){
return _1d7;
}
var _1d8=this.config.baseHref.replace(/^(https?:\/\/[^\/]+)(.*)$/,"$1");
var _1d9=new RegExp(_1d8);
return _1d7.replace(_1d9,"");
};
String.prototype.trim=function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
};
Xinha._makeColor=function(v){
if(typeof v!="number"){
return v;
}
var r=v&255;
var g=(v>>8)&255;
var b=(v>>16)&255;
return "rgb("+r+","+g+","+b+")";
};
Xinha._colorToRgb=function(v){
if(!v){
return "";
}
var r,g,b;
function hex(d){
return (d<16)?("0"+d.toString(16)):d.toString(16);
}
if(typeof v=="number"){
r=v&255;
g=(v>>8)&255;
b=(v>>16)&255;
return "#"+hex(r)+hex(g)+hex(b);
}
if(v.substr(0,3)=="rgb"){
var re=/rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/;
if(v.match(re)){
r=parseInt(RegExp.$1,10);
g=parseInt(RegExp.$2,10);
b=parseInt(RegExp.$3,10);
return "#"+hex(r)+hex(g)+hex(b);
}
return null;
}
if(v.substr(0,1)=="#"){
return v;
}
return null;
};
Xinha.prototype._popupDialog=function(url,_1e3,init){
Dialog(this.popupURL(url),_1e3,init);
};
Xinha.prototype.imgURL=function(file,_1e6){
if(typeof _1e6=="undefined"){
return _editor_url+file;
}else{
return _editor_url+"plugins/"+_1e6+"/img/"+file;
}
};
Xinha.prototype.popupURL=function(file){
var url="";
if(file.match(/^plugin:\/\/(.*?)\/(.*)/)){
var _1e9=RegExp.$1;
var _1ea=RegExp.$2;
if(!(/\.html$/.test(_1ea))){
_1ea+=".html";
}
url=_editor_url+"plugins/"+_1e9+"/popups/"+_1ea;
}else{
if(file.match(/^\/.*?/)){
url=file;
}else{
url=_editor_url+this.config.popupURL+file;
}
}
return url;
};
Xinha.getElementById=function(tag,id){
var el,i,objs=document.getElementsByTagName(tag);
for(i=objs.length;--i>=0&&(el=objs[i]);){
if(el.id==id){
return el;
}
}
return null;
};
Xinha.prototype._toggleBorders=function(){
var _1ee=this._doc.getElementsByTagName("TABLE");
if(_1ee.length!==0){
if(!this.borders){
this.borders=true;
}else{
this.borders=false;
}
for(var i=0;i<_1ee.length;i++){
if(this.borders){
Xinha._addClass(_1ee[i],"htmtableborders");
}else{
Xinha._removeClass(_1ee[i],"htmtableborders");
}
}
}
return true;
};
Xinha.addCoreCSS=function(html){
var _1f1="<style title=\"Xinha Internal CSS\" type=\"text/css\">"+".htmtableborders, .htmtableborders td, .htmtableborders th {border : 1px dashed lightgrey ! important;}\n"+"html, body { border: 0px; } \n"+"body { background-color: #ffffff; } \n"+"</style>\n";
if(html&&/<head>/i.test(html)){
return html.replace(/<head>/i,"<head>"+_1f1);
}else{
if(html){
return _1f1+html;
}else{
return _1f1;
}
}
};
Xinha.stripCoreCSS=function(html){
return html.replace(/<style[^>]+title="Xinha Internal CSS"(.|\n)*?<\/style>/i,"");
};
Xinha.addClasses=function(el,_1f4){
if(el!==null){
var _1f5=el.className.trim().split(" ");
var ours=_1f4.split(" ");
for(var x=0;x<ours.length;x++){
var _1f8=false;
for(var i=0;_1f8===false&&i<_1f5.length;i++){
if(_1f5[i]==ours[x]){
_1f8=true;
}
}
if(_1f8===false){
_1f5[_1f5.length]=ours[x];
}
}
el.className=_1f5.join(" ").trim();
}
};
Xinha.removeClasses=function(el,_1fb){
var _1fc=el.className.trim().split();
var _1fd=[];
var _1fe=_1fb.trim().split();
for(var i=0;i<_1fc.length;i++){
var _200=false;
for(var x=0;x<_1fe.length&&!_200;x++){
if(_1fc[i]==_1fe[x]){
_200=true;
}
}
if(!_200){
_1fd[_1fd.length]=_1fc[i];
}
}
return _1fd.join(" ");
};
Xinha.addClass=Xinha._addClass;
Xinha.removeClass=Xinha._removeClass;
Xinha._addClasses=Xinha.addClasses;
Xinha._removeClasses=Xinha.removeClasses;
Xinha._postback=function(url,data,_204){
var req=null;
req=Xinha.getXMLHTTPRequestObject();
var _206="";
if(typeof data=="string"){
_206=data;
}else{
if(typeof data=="object"){
for(var i in data){
_206+=(_206.length?"&":"")+i+"="+encodeURIComponent(data[i]);
}
}
}
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
if(typeof _204=="function"){
_204(req.responseText,req);
}
}else{
alert("An error has occurred: "+req.statusText+"\nURL: "+url);
}
}
}
req.onreadystatechange=callBack;
req.open("POST",url,true);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
req.send(_206);
};
Xinha._getback=function(url,_209){
var req=null;
req=Xinha.getXMLHTTPRequestObject();
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
_209(req.responseText,req);
}else{
alert("An error has occurred: "+req.statusText+"\nURL: "+url);
}
}
}
req.onreadystatechange=callBack;
req.open("GET",url,true);
req.send(null);
};
Xinha._geturlcontent=function(url){
var req=null;
req=Xinha.getXMLHTTPRequestObject();
req.open("GET",url,false);
req.send(null);
if(req.status==200||Xinha.isRunLocally&&req.status==0){
return req.responseText;
}else{
return "";
}
};
if(typeof dump=="undefined"){
function dump(o){
var s="";
for(var prop in o){
s+=prop+" = "+o[prop]+"\n";
}
var x=window.open("","debugger");
x.document.write("<pre>"+s+"</pre>");
}
}
Xinha.arrayContainsArray=function(a1,a2){
var _213=true;
for(var x=0;x<a2.length;x++){
var _215=false;
for(var i=0;i<a1.length;i++){
if(a1[i]==a2[x]){
_215=true;
break;
}
}
if(!_215){
_213=false;
break;
}
}
return _213;
};
Xinha.arrayFilter=function(a1,_218){
var _219=[];
for(var x=0;x<a1.length;x++){
if(_218(a1[x])){
_219[_219.length]=a1[x];
}
}
return _219;
};
Xinha.uniq_count=0;
Xinha.uniq=function(_21b){
return _21b+Xinha.uniq_count++;
};
Xinha._loadlang=function(_21c,url){
var lang;
if(typeof _editor_lcbackend=="string"){
url=_editor_lcbackend;
url=url.replace(/%lang%/,_editor_lang);
url=url.replace(/%context%/,_21c);
}else{
if(!url){
if(_21c!="Xinha"){
url=_editor_url+"plugins/"+_21c+"/lang/"+_editor_lang+".js";
}else{
Xinha.setLoadingMessage("Language is loaded");
url=_editor_url+"lang/"+_editor_lang+".js";
}
}
}
var _21f=Xinha._geturlcontent(url);
if(_21f!==""){
try{
eval("lang = "+_21f);
}
catch(ex){
alert("Error reading Language-File ("+url+"):\n"+Error.toString());
lang={};
}
}else{
lang={};
}
return lang;
};
Xinha._lc=function(_220,_221,_222){
var url,ret;
if(typeof _221=="object"&&_221.url&&_221.context){
url=_221.url+_editor_lang+".js";
_221=_221.context;
}
var m=null;
if(typeof _220=="string"){
m=_220.match(/\$(.*?)=(.*?)\$/g);
}
if(m){
if(!_222){
_222={};
}
for(var i=0;i<m.length;i++){
var n=m[i].match(/\$(.*?)=(.*?)\$/);
_222[n[1]]=n[2];
_220=_220.replace(n[0],"$"+n[1]);
}
}
if(_editor_lang=="en"){
if(typeof _220=="object"&&_220.string){
ret=_220.string;
}else{
ret=_220;
}
}else{
if(typeof Xinha._lc_catalog=="undefined"){
Xinha._lc_catalog=[];
}
if(typeof _221=="undefined"){
_221="Xinha";
}
if(typeof Xinha._lc_catalog[_221]=="undefined"){
Xinha._lc_catalog[_221]=Xinha._loadlang(_221,url);
}
var key;
if(typeof _220=="object"&&_220.key){
key=_220.key;
}else{
if(typeof _220=="object"&&_220.string){
key=_220.string;
}else{
key=_220;
}
}
if(typeof Xinha._lc_catalog[_221][key]=="undefined"){
if(_221=="Xinha"){
if(typeof _220=="object"&&_220.string){
ret=_220.string;
}else{
ret=_220;
}
}else{
return Xinha._lc(_220,"Xinha",_222);
}
}else{
ret=Xinha._lc_catalog[_221][key];
}
}
if(typeof _220=="object"&&_220.replace){
_222=_220.replace;
}
if(typeof _222!="undefined"){
for(var i in _222){
ret=ret.replace("$"+i,_222[i]);
}
}
return ret;
};
Xinha.hasDisplayedChildren=function(el){
var _229=el.childNodes;
for(var i=0;i<_229.length;i++){
if(_229[i].tagName){
if(_229[i].style.display!="none"){
return true;
}
}
}
return false;
};
Xinha._loadback=function(url,_22c,_22d,_22e){
if(document.getElementById(url)){
return true;
}
var t=!Xinha.is_ie?"onload":"onreadystatechange";
var s=document.createElement("script");
s.type="text/javascript";
s.src=url;
s.id=url;
if(_22c){
s[t]=function(){
if(Xinha.is_ie&&(!(/loaded|complete/.test(window.event.srcElement.readyState)))){
return;
}
_22c.call(_22d?_22d:this,_22e);
s[t]=null;
};
}
document.getElementsByTagName("head")[0].appendChild(s);
return false;
};
Xinha.collectionToArray=function(_231){
var _232=[];
for(var i=0;i<_231.length;i++){
_232.push(_231.item(i));
}
return _232;
};
if(!Array.prototype.append){
Array.prototype.append=function(a){
for(var i=0;i<a.length;i++){
this.push(a[i]);
}
return this;
};
}
Xinha.makeEditors=function(_236,_237,_238){
if(!Xinha.isSupportedBrowser){
return;
}
if(typeof _237=="function"){
_237=_237();
}
var _239={};
for(var x=0;x<_236.length;x++){
if(typeof _236[x]!="object"){
var _23b=Xinha.getElementById("textarea",_236[x]);
if(!_23b){
continue;
}
}
var _23c=new Xinha(_23b,Xinha.cloneObject(_237));
_23c.registerPlugins(_238);
_239[_236[x]]=_23c;
}
return _239;
};
Xinha.startEditors=function(_23d){
if(!Xinha.isSupportedBrowser){
return;
}
for(var i in _23d){
if(_23d[i].generate){
_23d[i].generate();
}
}
};
Xinha.prototype.registerPlugins=function(_23f){
if(!Xinha.isSupportedBrowser){
return;
}
if(_23f){
for(var i=0;i<_23f.length;i++){
this.setLoadingMessage(Xinha._lc("Register plugin $plugin","Xinha",{"plugin":_23f[i]}));
this.registerPlugin(eval(_23f[i]));
}
}
};
Xinha.base64_encode=function(_241){
var _242="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _243="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
do{
chr1=_241.charCodeAt(i++);
chr2=_241.charCodeAt(i++);
chr3=_241.charCodeAt(i++);
enc1=chr1>>2;
enc2=((chr1&3)<<4)|(chr2>>4);
enc3=((chr2&15)<<2)|(chr3>>6);
enc4=chr3&63;
if(isNaN(chr2)){
enc3=enc4=64;
}else{
if(isNaN(chr3)){
enc4=64;
}
}
_243=_243+_242.charAt(enc1)+_242.charAt(enc2)+_242.charAt(enc3)+_242.charAt(enc4);
}while(i<_241.length);
return _243;
};
Xinha.base64_decode=function(_247){
var _248="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _249="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
_247=_247.replace(/[^A-Za-z0-9\+\/\=]/g,"");
do{
enc1=_248.indexOf(_247.charAt(i++));
enc2=_248.indexOf(_247.charAt(i++));
enc3=_248.indexOf(_247.charAt(i++));
enc4=_248.indexOf(_247.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
_249=_249+String.fromCharCode(chr1);
if(enc3!=64){
_249=_249+String.fromCharCode(chr2);
}
if(enc4!=64){
_249=_249+String.fromCharCode(chr3);
}
}while(i<_247.length);
return _249;
};
Xinha.removeFromParent=function(el){
if(!el.parentNode){
return;
}
var pN=el.parentNode;
pN.removeChild(el);
return el;
};
Xinha.hasParentNode=function(el){
if(el.parentNode){
if(el.parentNode.nodeType==11){
return false;
}
return true;
}
return false;
};
Xinha.viewportSize=function(_250){
_250=(_250)?_250:window;
var x,y;
if(_250.innerHeight){
x=_250.innerWidth;
y=_250.innerHeight;
}else{
if(_250.document.documentElement&&_250.document.documentElement.clientHeight){
x=_250.document.documentElement.clientWidth;
y=_250.document.documentElement.clientHeight;
}else{
if(_250.document.body){
x=_250.document.body.clientWidth;
y=_250.document.body.clientHeight;
}
}
}
return {"x":x,"y":y};
};
Xinha.pageSize=function(_252){
_252=(_252)?_252:window;
var x,y;
var _254=_252.document.body.scrollHeight;
var _255=_252.document.documentElement.scrollHeight;
if(_254>_255){
x=_252.document.body.scrollWidth;
y=_252.document.body.scrollHeight;
}else{
x=_252.document.documentElement.scrollWidth;
y=_252.document.documentElement.scrollHeight;
}
return {"x":x,"y":y};
};
Xinha.prototype.scrollPos=function(_256){
_256=(_256)?_256:window;
var x,y;
if(_256.pageYOffset){
x=_256.pageXOffset;
y=_256.pageYOffset;
}else{
if(_256.document.documentElement&&document.documentElement.scrollTop){
x=_256.document.documentElement.scrollLeft;
y=_256.document.documentElement.scrollTop;
}else{
if(_256.document.body){
x=_256.document.body.scrollLeft;
y=_256.document.body.scrollTop;
}
}
}
return {"x":x,"y":y};
};
Xinha.getElementTopLeft=function(_258){
var _259=curtop=0;
if(_258.offsetParent){
_259=_258.offsetLeft;
curtop=_258.offsetTop;
while(_258=_258.offsetParent){
_259+=_258.offsetLeft;
curtop+=_258.offsetTop;
}
}
return {top:curtop,left:_259};
};
Xinha.findPosX=function(obj){
var _25b=0;
if(obj.offsetParent){
return Xinha.getElementTopLeft(obj).left;
}else{
if(obj.x){
_25b+=obj.x;
}
}
return _25b;
};
Xinha.findPosY=function(obj){
var _25d=0;
if(obj.offsetParent){
return Xinha.getElementTopLeft(obj).top;
}else{
if(obj.y){
_25d+=obj.y;
}
}
return _25d;
};
Xinha.createLoadingMessages=function(_25e){
if(Xinha.loadingMessages||!Xinha.isSupportedBrowser){
return;
}
Xinha.loadingMessages=[];
for(var i=0;i<_25e.length;i++){
Xinha.loadingMessages.push(Xinha.createLoadingMessage(Xinha.getElementById("textarea",_25e[i])));
}
};
Xinha.createLoadingMessage=function(_260,text){
if(document.getElementById("loading_"+_260.id)||!Xinha.isSupportedBrowser){
return;
}
var _262=document.createElement("div");
_262.id="loading_"+_260.id;
_262.className="loading";
_262.style.left=(Xinha.findPosX(_260)+_260.offsetWidth/2)-106+"px";
_262.style.top=(Xinha.findPosY(_260)+_260.offsetHeight/2)-50+"px";
var _263=document.createElement("div");
_263.className="loading_main";
_263.id="loading_main_"+_260.id;
_263.appendChild(document.createTextNode(Xinha._lc("Loading in progress. Please wait!")));
var _264=document.createElement("div");
_264.className="loading_sub";
_264.id="loading_sub_"+_260.id;
text=text?text:Xinha._lc("Constructing main object");
_264.appendChild(document.createTextNode(text));
_262.appendChild(_263);
_262.appendChild(_264);
document.body.appendChild(_262);
Xinha.freeLater(_262);
Xinha.freeLater(_263);
Xinha.freeLater(_264);
return _264;
};
Xinha.prototype.setLoadingMessage=function(_265){
if(!document.getElementById("loading_sub_"+this._textArea.id)){
return;
}
document.getElementById("loading_main_"+this._textArea.id).innerHTML=Xinha._lc("Loading in progress. Please wait!");
document.getElementById("loading_sub_"+this._textArea.id).innerHTML=_265;
};
Xinha.setLoadingMessage=function(_266){
if(!Xinha.loadingMessages){
return;
}
for(var i=0;i<Xinha.loadingMessages.length;i++){
Xinha.loadingMessages[i].innerHTML=_266;
}
};
Xinha.prototype.removeLoadingMessage=function(){
if(document.getElementById("loading_"+this._textArea.id)){
document.body.removeChild(document.getElementById("loading_"+this._textArea.id));
}
};
Xinha.removeLoadingMessages=function(_268){
for(var i=0;i<_268.length;i++){
var main=document.getElementById("loading_"+document.getElementById(_268[i]).id);
main.parentNode.removeChild(main);
}
Xinha.loadingMessages=null;
};
Xinha.toFree=[];
Xinha.freeLater=function(obj,prop){
Xinha.toFree.push({o:obj,p:prop});
};
Xinha.free=function(obj,prop){
if(obj&&!prop){
for(var p in obj){
Xinha.free(obj,p);
}
}else{
if(obj){
try{
obj[prop]=null;
}
catch(x){
}
}
}
};
Xinha.collectGarbageForIE=function(){
Xinha.flushEvents();
for(var x=0;x<Xinha.toFree.length;x++){
Xinha.free(Xinha.toFree[x].o,Xinha.toFree[x].p);
Xinha.toFree[x].o=null;
}
};
Xinha.prototype.insertNodeAtSelection=function(_271){
Xinha.notImplemented("insertNodeAtSelection");
};
Xinha.prototype.getParentElement=function(sel){
Xinha.notImplemented("getParentElement");
};
Xinha.prototype.activeElement=function(sel){
Xinha.notImplemented("activeElement");
};
Xinha.prototype.selectionEmpty=function(sel){
Xinha.notImplemented("selectionEmpty");
};
Xinha.prototype.selectNodeContents=function(node,pos){
Xinha.notImplemented("selectNodeContents");
};
Xinha.prototype.insertHTML=function(html){
Xinha.notImplemented("insertHTML");
};
Xinha.prototype.getSelectedHTML=function(){
Xinha.notImplemented("getSelectedHTML");
};
Xinha.prototype.getSelection=function(){
Xinha.notImplemented("getSelection");
};
Xinha.prototype.createRange=function(sel){
Xinha.notImplemented("createRange");
};
Xinha.prototype.isKeyEvent=function(_279){
Xinha.notImplemented("isKeyEvent");
};
Xinha.prototype.isShortCut=function(_27a){
if(_27a.ctrlKey&&!_27a.altKey){
return true;
}
return false;
};
Xinha.prototype.getKey=function(_27b){
Xinha.notImplemented("getKey");
};
Xinha.getOuterHTML=function(_27c){
Xinha.notImplemented("getOuterHTML");
};
Xinha.getXMLHTTPRequestObject=function(){
try{
if(typeof XMLHttpRequest=="function"){
return new XMLHttpRequest();
}else{
if(typeof ActiveXObject=="function"){
return new ActiveXObject("Microsoft.XMLHTTP");
}
}
}
catch(e){
Xinha.notImplemented("getXMLHTTPRequestObject");
}
};
Xinha.prototype._activeElement=function(sel){
return this.activeElement(sel);
};
Xinha.prototype._selectionEmpty=function(sel){
return this.selectionEmpty(sel);
};
Xinha.prototype._getSelection=function(){
return this.getSelection();
};
Xinha.prototype._createRange=function(sel){
return this.createRange(sel);
};
HTMLArea=Xinha;
Xinha.init();
if (Xinha.is_ie)
{
Xinha.addDom0Event(window,"unload",Xinha.collectGarbageForIE);
}
Xinha.notImplemented=function(_280){
throw new Error("Method Not Implemented","Part of Xinha has tried to call the "+_280+" method which has not been implemented.");
};

