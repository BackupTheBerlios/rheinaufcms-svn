HTMLArea.version={"Release":"Trunk","Head":"$HeadURL: http://svn.xinha.python-hosting.com/trunk/htmlarea.js $".replace(/^[^:]*: (.*) \$$/,"$1"),"Date":"$LastChangedDate: 2006-08-22 05:28:24 +0200 (Di, 22 Aug 2006) $".replace(/^[^:]*: ([0-9-]*) ([0-9:]*) ([+0-9]*) \((.*)\) \$/,"$4 $2 $3"),"Revision":"$LastChangedRevision: 555 $".replace(/^[^:]*: (.*) \$$/,"$1"),"RevisionBy":"$LastChangedBy: mokhet $".replace(/^[^:]*: (.*) \$$/,"$1")};
if(typeof _editor_url=="string"){
_editor_url=_editor_url.replace(/\x2f*$/,"/");
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
var __htmlareas=[];
HTMLArea.agt=navigator.userAgent.toLowerCase();
HTMLArea.is_ie=((HTMLArea.agt.indexOf("msie")!=-1)&&(HTMLArea.agt.indexOf("opera")==-1));
HTMLArea.is_opera=(HTMLArea.agt.indexOf("opera")!=-1);
HTMLArea.is_mac=(HTMLArea.agt.indexOf("mac")!=-1);
HTMLArea.is_mac_ie=(HTMLArea.is_ie&&HTMLArea.is_mac);
HTMLArea.is_win_ie=(HTMLArea.is_ie&&!HTMLArea.is_mac);
HTMLArea.is_gecko=(navigator.product=="Gecko");
HTMLArea.isRunLocally=document.URL.toLowerCase().search(/^file:/)!=-1;
if(HTMLArea.isRunLocally){
alert("Xinha *must* be installed on a web server. Locally opened files (those that use the \"file://\" protocol) cannot properly function. Xinha will try to initialize but may not be correctly loaded.");
}
function HTMLArea(_1,_2){
if(!_1){
throw ("Tried to create HTMLArea without textarea specified.");
}
if(HTMLArea.checkSupportedBrowser()){
if(typeof _2=="undefined"){
this.config=new HTMLArea.Config();
}else{
this.config=_2;
}
this._htmlArea=null;
if(typeof _1!="object"){
_1=HTMLArea.getElementById("textarea",_1);
}
this._textArea=_1;
this._initial_ta_size={w:_1.style.width?_1.style.width:(_1.offsetWidth?(_1.offsetWidth+"px"):(_1.cols+"em")),h:_1.style.height?_1.style.height:(_1.offsetHeight?(_1.offsetHeight+"px"):(_1.rows+"em"))};
if(this.config.showLoading){
var _3=document.createElement("div");
_3.id="loading_"+_1.name;
_3.className="loading";
try{
_3.style.width=_1.offsetWidth+"px";
}
catch(ex){
_3.style.width=this._initial_ta_size.w;
}
_3.style.left=HTMLArea.findPosX(_1)+"px";
_3.style.top=(HTMLArea.findPosY(_1)+parseInt(this._initial_ta_size.h,10)/2)+"px";
var _4=document.createElement("div");
_4.className="loading_main";
_4.id="loading_main_"+_1.name;
_4.appendChild(document.createTextNode(HTMLArea._lc("Loading in progress. Please wait !")));
var _5=document.createElement("div");
_5.className="loading_sub";
_5.id="loading_sub_"+_1.name;
_5.appendChild(document.createTextNode(HTMLArea._lc("Constructing main object")));
_3.appendChild(_4);
_3.appendChild(_5);
document.body.appendChild(_3);
this.setLoadingMessage("Constructing object");
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
this.__htmlarea_id_num=__htmlareas.length;
__htmlareas[this.__htmlarea_id_num]=this;
this._notifyListeners={};
var _6={right:{on:true,container:document.createElement("td"),panels:[]},left:{on:true,container:document.createElement("td"),panels:[]},top:{on:true,container:document.createElement("td"),panels:[]},bottom:{on:true,container:document.createElement("td"),panels:[]}};
for(var i in _6){
if(!_6[i].container){
continue;
}
_6[i].div=_6[i].container;
_6[i].container.className="panels "+i;
HTMLArea.freeLater(_6[i],"container");
HTMLArea.freeLater(_6[i],"div");
}
this._panels=_6;
HTMLArea.freeLater(this,"_textArea");
}
}
HTMLArea.onload=function(){
};
HTMLArea.init=function(){
HTMLArea.onload();
};
HTMLArea.RE_tagName=/(<\/|<)\s*([^ \t\n>]+)/ig;
HTMLArea.RE_doctype=/(<!doctype((.|\n)*?)>)\n?/i;
HTMLArea.RE_head=/<head>((.|\n)*?)<\/head>/i;
HTMLArea.RE_body=/<body[^>]*>((.|\n|\r|\t)*?)<\/body>/i;
HTMLArea.RE_Specials=/([\/\^$*+?.()|{}[\]])/g;
HTMLArea.RE_email=/[_a-zA-Z\d\-\.]{3,}@[_a-zA-Z\d\-]{2,}(\.[_a-zA-Z\d\-]{2,})+/i;
HTMLArea.RE_url=/(https?:\/\/)?(([a-z0-9_]+:[a-z0-9_]+@)?[a-z0-9_-]{2,}(\.[a-z0-9_-]{2,}){2,}(:[0-9]+)?(\/\S+)*)/i;
HTMLArea.Config=function(){
var _8=this;
this.version=HTMLArea.version.Revision;
this.width="auto";
this.height="auto";
this.sizeIncludesBars=true;
this.sizeIncludesPanels=true;
this.panel_dimensions={left:"200px",right:"200px",top:"100px",bottom:"100px"};
this.statusBar=true;
this.htmlareaPaste=false;
this.mozParaHandler="best";
this.undoSteps=20;
this.undoTimeout=500;
this.changeJustifyWithDirection=false;
this.fullPage=false;
this.pageStyle="";
this.pageStyleSheets=[];
this.baseHref=null;
this.stripBaseHref=true;
this.stripSelfNamedAnchors=true;
this.only7BitPrintablesInURLs=true;
this.sevenBitClean=false;
this.specialReplacements={};
this.killWordOnPaste=true;
this.makeLinkShowsTarget=true;
this.charSet=HTMLArea.is_gecko?document.characterSet:document.charset;
this.imgURL="images/";
this.popupURL="popups/";
this.htmlRemoveTags=null;
this.flowToolbars=true;
this.showLoading=false;
this.colorPickerCellSize="6px";
this.colorPickerGranularity=18;
this.colorPickerPosition="bottom,right";
this.toolbar=[["popupeditor"],["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],["separator","forecolor","hilitecolor","textindicator"],["separator","subscript","superscript"],["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],["separator","insertorderedlist","insertunorderedlist","outdent","indent"],["separator","inserthorizontalrule","createlink","insertimage","inserttable"],["linebreak","separator","undo","redo","selectall","print"],(HTMLArea.is_gecko?[]:["cut","copy","paste","overwrite","saveas"]),["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright","righttoleft"],["separator","htmlmode","showhelp","about"]];
this.fontname={"&mdash; font &mdash;":"","Arial":"arial,helvetica,sans-serif","Courier New":"courier new,courier,monospace","Georgia":"georgia,times new roman,times,serif","Tahoma":"tahoma,arial,helvetica,sans-serif","Times New Roman":"times new roman,times,serif","Verdana":"verdana,arial,helvetica,sans-serif","impact":"impact","WingDings":"wingdings"};
this.fontsize={"&mdash; size &mdash;":"","1 (8 pt)":"1","2 (10 pt)":"2","3 (12 pt)":"3","4 (14 pt)":"4","5 (18 pt)":"5","6 (24 pt)":"6","7 (36 pt)":"7"};
this.formatblock={"&mdash; format &mdash;":"","Heading 1":"h1","Heading 2":"h2","Heading 3":"h3","Heading 4":"h4","Heading 5":"h5","Heading 6":"h6","Normal":"p","Address":"address","Formatted":"pre"};
this.customSelects={};
function cut_copy_paste(e,_a,_b){
e.execCommand(_a);
}
this.debug=true;
this.URIs={"blank":"popups/blank.html","link":"link.html","insert_image":"insert_image.html","insert_table":"insert_table.html","select_color":"select_color.html","about":"about.html","help":"editor_help.html"};
this.btnList={bold:["Bold",HTMLArea._lc({key:"button_bold",string:["ed_buttons_main.gif",3,2]},"HTMLArea"),false,function(e){
e.execCommand("bold");
}],italic:["Italic",HTMLArea._lc({key:"button_italic",string:["ed_buttons_main.gif",2,2]},"HTMLArea"),false,function(e){
e.execCommand("italic");
}],underline:["Underline",HTMLArea._lc({key:"button_underline",string:["ed_buttons_main.gif",2,0]},"HTMLArea"),false,function(e){
e.execCommand("underline");
}],strikethrough:["Strikethrough",HTMLArea._lc({key:"button_strikethrough",string:["ed_buttons_main.gif",3,0]},"HTMLArea"),false,function(e){
e.execCommand("strikethrough");
}],subscript:["Subscript",HTMLArea._lc({key:"button_subscript",string:["ed_buttons_main.gif",3,1]},"HTMLArea"),false,function(e){
e.execCommand("subscript");
}],superscript:["Superscript",HTMLArea._lc({key:"button_superscript",string:["ed_buttons_main.gif",2,1]},"HTMLArea"),false,function(e){
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
if(HTMLArea.is_gecko){
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
btn[0]=HTMLArea._lc(btn[0]);
}
};
HTMLArea.Config.prototype.registerButton=function(id,_36,_37,_38,_39,_3a){
var _3b;
if(typeof id=="string"){
_3b=id;
}else{
if(typeof id=="object"){
_3b=id.id;
}else{
alert("ERROR [HTMLArea.Config::registerButton]:\ninvalid arguments");
return false;
}
}
switch(typeof id){
case "string":
this.btnList[id]=[_36,_37,_38,_39,_3a];
break;
case "object":
this.btnList[id.id]=[id.tooltip,id.image,id.textMode,id.action,id.context];
break;
}
};
HTMLArea.prototype.registerPanel=function(_3c,_3d){
if(!_3c){
_3c="right";
}
this.setLoadingMessage("Register panel "+_3c);
var _3e=this.addPanel(_3c);
if(_3d){
_3d.drawPanelIn(_3e);
}
};
HTMLArea.Config.prototype.registerDropdown=function(_3f){
this.customSelects[_3f.id]=_3f;
};
HTMLArea.Config.prototype.hideSomeButtons=function(_40){
var _41=this.toolbar;
for(var i=_41.length;--i>=0;){
var _43=_41[i];
for(var j=_43.length;--j>=0;){
if(_40.indexOf(" "+_43[j]+" ")>=0){
var len=1;
if(/separator|space/.test(_43[j+1])){
len=2;
}
_43.splice(j,len);
}
}
}
};
HTMLArea.Config.prototype.addToolbarElement=function(id,_47,_48){
var _49=this.toolbar;
var a,i,j,o,sid;
var _4b=false;
var _4c=false;
var _4d=0;
var _4e=0;
var _4f=0;
var _50=false;
var _51=false;
if((id&&typeof id=="object")&&(id.constructor==Array)){
_4b=true;
}
if((_47&&typeof _47=="object")&&(_47.constructor==Array)){
_4c=true;
_4d=_47.length;
}
if(_4b){
for(i=0;i<id.length;++i){
if((id[i]!="separator")&&(id[i].indexOf("T[")!==0)){
sid=id[i];
}
}
}else{
sid=id;
}
for(i=0;!_50&&!_51&&i<_49.length;++i){
a=_49[i];
for(j=0;!_51&&j<a.length;++j){
if(a[i]==sid){
_50=true;
break;
}
if(_4c){
for(o=0;o<_4d;++o){
if(a[j]==_47[o]){
if(o===0){
_51=true;
j--;
break;
}else{
_4f=i;
_4e=j;
_4d=o;
}
}
}
}else{
if(a[j]==_47){
_51=true;
break;
}
}
}
}
if(!_50){
if(!_51&&_4c){
if(_47.length!=_4d){
j=_4e;
a=_49[_4f];
_51=true;
}
}
if(_51){
if(_48===0){
if(_4b){
a[j]=id[id.length-1];
for(i=id.length-1;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a[j]=id;
}
}else{
if(_48<0){
j=j+_48+1;
}else{
if(_48>0){
j=j+_48;
}
}
if(_4b){
for(i=id.length;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a.splice(j,0,id);
}
}
}else{
_49[0].splice(0,0,"separator");
if(_4b){
for(i=id.length;--i>=0;){
_49[0].splice(0,0,id[i]);
}
}else{
_49[0].splice(0,0,id);
}
}
}
};
HTMLArea.Config.prototype.removeToolbarElement=HTMLArea.Config.prototype.hideSomeButtons;
HTMLArea.replaceAll=function(_52){
var tas=document.getElementsByTagName("textarea");
for(var i=tas.length;i>0;(new HTMLArea(tas[--i],_52)).generate()){
}
};
HTMLArea.replace=function(id,_56){
var ta=HTMLArea.getElementById("textarea",id);
return ta?(new HTMLArea(ta,_56)).generate():null;
};
HTMLArea.prototype._createToolbar=function(){
this.setLoadingMessage("Create Toolbar");
var _58=this;
var _59=document.createElement("div");
this._toolBar=this._toolbar=_59;
_59.className="toolbar";
_59.unselectable="1";
HTMLArea.freeLater(this,"_toolBar");
HTMLArea.freeLater(this,"_toolbar");
var _5a=null;
var _5b={};
this._toolbarObjects=_5b;
this._createToolbar1(_58,_59,_5b);
this._htmlArea.appendChild(_59);
return _59;
};
HTMLArea.prototype._setConfig=function(_5c){
this.config=_5c;
};
HTMLArea.prototype._addToolbar=function(){
this._createToolbar1(this,this._toolbar,this._toolbarObjects);
};
HTMLArea._createToolbarBreakingElement=function(){
var brk=document.createElement("div");
brk.style.height="1px";
brk.style.width="1px";
brk.style.lineHeight="1px";
brk.style.fontSize="1px";
brk.style.clear="both";
return brk;
};
HTMLArea.prototype._createToolbar1=function(_5e,_5f,_60){
var _61;
if(_5e.config.flowToolbars){
_5f.appendChild(HTMLArea._createToolbarBreakingElement());
}
function newLine(){
if(typeof _61!="undefined"&&_61.childNodes.length===0){
return;
}
var _62=document.createElement("table");
_62.border="0px";
_62.cellSpacing="0px";
_62.cellPadding="0px";
if(_5e.config.flowToolbars){
if(HTMLArea.is_ie){
_62.style.styleFloat="left";
}else{
_62.style.cssFloat="left";
}
}
_5f.appendChild(_62);
var _63=document.createElement("tbody");
_62.appendChild(_63);
_61=document.createElement("tr");
_63.appendChild(_61);
_62.className="toolbarRow";
}
newLine();
function setButtonStatus(id,_65){
var _66=this[id];
var el=this.element;
if(_66!=_65){
switch(id){
case "enabled":
if(_65){
HTMLArea._removeClass(el,"buttonDisabled");
el.disabled=false;
}else{
HTMLArea._addClass(el,"buttonDisabled");
el.disabled=true;
}
break;
case "active":
if(_65){
HTMLArea._addClass(el,"buttonPressed");
}else{
HTMLArea._removeClass(el,"buttonPressed");
}
break;
}
this[id]=_65;
}
}
function createSelect(txt){
var _69=null;
var el=null;
var cmd=null;
var _6c=_5e.config.customSelects;
var _6d=null;
var _6e="";
switch(txt){
case "fontsize":
case "fontname":
case "formatblock":
_69=_5e.config[txt];
cmd=txt;
break;
default:
cmd=txt;
var _6f=_6c[cmd];
if(typeof _6f!="undefined"){
_69=_6f.options;
_6d=_6f.context;
if(typeof _6f.tooltip!="undefined"){
_6e=_6f.tooltip;
}
}else{
alert("ERROR [createSelect]:\nCan't find the requested dropdown definition");
}
break;
}
if(_69){
el=document.createElement("select");
el.title=_6e;
var obj={name:txt,element:el,enabled:true,text:false,cmd:cmd,state:setButtonStatus,context:_6d};
HTMLArea.freeLater(obj);
_60[txt]=obj;
for(var i in _69){
if(typeof (_69[i])!="string"){
continue;
}
var op=document.createElement("option");
op.innerHTML=HTMLArea._lc(i);
op.value=_69[i];
el.appendChild(op);
}
HTMLArea._addEvent(el,"change",function(){
_5e._comboSelected(el,txt);
});
}
return el;
}
function createButton(txt){
var el,btn,obj=null;
switch(txt){
case "separator":
if(_5e.config.flowToolbars){
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
el.title=HTMLArea._lc("Current style");
obj={name:txt,element:el,enabled:true,active:false,text:false,cmd:"textindicator",state:setButtonStatus};
HTMLArea.freeLater(obj);
_60[txt]=obj;
break;
default:
btn=_5e.config.btnList[txt];
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
HTMLArea.freeLater(el);
HTMLArea.freeLater(obj);
_60[txt]=obj;
el.ondrag=function(){
return false;
};
HTMLArea._addEvent(el,"mouseout",function(ev){
if(obj.enabled){
HTMLArea._removeClass(el,"buttonActive");
if(obj.active){
HTMLArea._addClass(el,"buttonPressed");
}
}
});
HTMLArea._addEvent(el,"mousedown",function(ev){
if(obj.enabled){
HTMLArea._addClass(el,"buttonActive");
HTMLArea._removeClass(el,"buttonPressed");
HTMLArea._stopEvent(HTMLArea.is_ie?window.event:ev);
}
});
HTMLArea._addEvent(el,"click",function(ev){
if(obj.enabled){
HTMLArea._removeClass(el,"buttonActive");
if(HTMLArea.is_gecko){
_5e.activateEditor();
}
obj.cmd(_5e,obj.name,obj);
HTMLArea._stopEvent(HTMLArea.is_ie?window.event:ev);
}
});
var _78=HTMLArea.makeBtnImg(btn[1]);
var img=_78.firstChild;
el.appendChild(_78);
obj.imgel=img;
obj.swapImage=function(_7a){
if(typeof _7a!="string"){
img.src=_7a[0];
img.style.position="relative";
img.style.top=_7a[2]?("-"+(18*(_7a[2]+1))+"px"):"-18px";
img.style.left=_7a[1]?("-"+(18*(_7a[1]+1))+"px"):"-18px";
}else{
obj.imgel.src=_7a;
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
var _7b=true;
for(var i=0;i<this.config.toolbar.length;++i){
if(!_7b){
}else{
_7b=false;
}
if(this.config.toolbar[i]===null){
this.config.toolbar[i]=["separator"];
}
var _7d=this.config.toolbar[i];
for(var j=0;j<_7d.length;++j){
var _7f=_7d[j];
var _80;
if(/^([IT])\[(.*?)\]/.test(_7f)){
var _81=RegExp.$1=="I";
var _82=RegExp.$2;
if(_81){
_82=HTMLArea._lc(_82);
}
_80=document.createElement("td");
_61.appendChild(_80);
_80.className="label";
_80.innerHTML=_82;
}else{
if(typeof _7f!="function"){
var _83=createButton(_7f);
if(_83){
_80=document.createElement("td");
_80.className="toolbarElement";
_61.appendChild(_80);
_80.appendChild(_83);
}else{
if(_83===null){
alert("FIXME: Unknown toolbar item: "+_7f);
}
}
}
}
}
}
if(_5e.config.flowToolbars){
_5f.appendChild(HTMLArea._createToolbarBreakingElement());
}
return _5f;
};
var use_clone_img=false;
HTMLArea.makeBtnImg=function(_84,doc){
if(!doc){
doc=document;
}
if(!doc._htmlareaImgCache){
doc._htmlareaImgCache={};
HTMLArea.freeLater(doc._htmlareaImgCache);
}
var _86=null;
if(HTMLArea.is_ie&&((!doc.compatMode)||(doc.compatMode&&doc.compatMode=="BackCompat"))){
_86=doc.createElement("span");
}else{
_86=doc.createElement("div");
_86.style.position="relative";
}
_86.style.overflow="hidden";
_86.style.width="18px";
_86.style.height="18px";
_86.className="buttonImageContainer";
var img=null;
if(typeof _84=="string"){
if(doc._htmlareaImgCache[_84]){
img=doc._htmlareaImgCache[_84].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84;
img.style.width="18px";
img.style.height="18px";
if(use_clone_img){
doc._htmlareaImgCache[_84]=img.cloneNode();
}
}
}else{
if(doc._htmlareaImgCache[_84[0]]){
img=doc._htmlareaImgCache[_84[0]].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84[0];
img.style.position="relative";
if(use_clone_img){
doc._htmlareaImgCache[_84[0]]=img.cloneNode();
}
}
img.style.top=_84[2]?("-"+(18*(_84[2]+1))+"px"):"-18px";
img.style.left=_84[1]?("-"+(18*(_84[1]+1))+"px"):"-18px";
}
_86.appendChild(img);
return _86;
};
HTMLArea.prototype._createStatusBar=function(){
this.setLoadingMessage("Create StatusBar");
var _88=document.createElement("div");
_88.className="statusBar";
this._statusBar=_88;
HTMLArea.freeLater(this,"_statusBar");
var div=document.createElement("span");
div.className="statusBarTree";
div.innerHTML=HTMLArea._lc("Path")+": ";
this._statusBarTree=div;
HTMLArea.freeLater(this,"_statusBarTree");
this._statusBar.appendChild(div);
div=document.createElement("span");
div.innerHTML=HTMLArea._lc("You are in TEXT MODE.  Use the [<>] button to switch back to WYSIWYG.");
div.style.display="none";
this._statusBarTextMode=div;
HTMLArea.freeLater(this,"_statusBarTextMode");
this._statusBar.appendChild(div);
if(!this.config.statusBar){
_88.style.display="none";
}
return _88;
};
HTMLArea.prototype.generate=function(){
var i;
var _8b=this;
this.setLoadingMessage("Generate Xinha object");
if(typeof Dialog=="undefined"){
HTMLArea._loadback(_editor_url+"dialog.js",this.generate,this);
return false;
}
if(typeof HTMLArea.Dialog=="undefined"){
HTMLArea._loadback(_editor_url+"inline-dialog.js",this.generate,this);
return false;
}
if(typeof PopupWin=="undefined"){
HTMLArea._loadback(_editor_url+"popupwin.js",this.generate,this);
return false;
}
if(typeof colorPicker=="undefined"){
HTMLArea._loadback(_editor_url+"popups/color_picker.js",this.generate,this);
return false;
}
if(_editor_skin!==""){
var _8c=false;
var _8d=document.getElementsByTagName("head")[0];
var _8e=document.getElementsByTagName("link");
for(i=0;i<_8e.length;i++){
if((_8e[i].rel=="stylesheet")&&(_8e[i].href==_editor_url+"skins/"+_editor_skin+"/skin.css")){
_8c=true;
}
}
if(!_8c){
var _8f=document.createElement("link");
_8f.type="text/css";
_8f.href=_editor_url+"skins/"+_editor_skin+"/skin.css";
_8f.rel="stylesheet";
_8d.appendChild(_8f);
}
}
var _90=_8b.config.toolbar;
for(i=_90.length;--i>=0;){
for(var j=_90[i].length;--j>=0;){
if(_90[i][j]=="popupeditor"){
if(typeof FullScreen=="undefined"){
HTMLArea.loadPlugin("FullScreen",function(){
_8b.generate();
});
return false;
}
_8b.registerPlugin("FullScreen");
}
}
}
if(HTMLArea.is_gecko&&_8b.config.mozParaHandler=="best"){
if(typeof EnterParagraphs=="undefined"){
HTMLArea.loadPlugin("EnterParagraphs",function(){
_8b.generate();
});
return false;
}
_8b.registerPlugin("EnterParagraphs");
}
this._framework={"table":document.createElement("table"),"tbody":document.createElement("tbody"),"tb_row":document.createElement("tr"),"tb_cell":document.createElement("td"),"tp_row":document.createElement("tr"),"tp_cell":this._panels.top.container,"ler_row":document.createElement("tr"),"lp_cell":this._panels.left.container,"ed_cell":document.createElement("td"),"rp_cell":this._panels.right.container,"bp_row":document.createElement("tr"),"bp_cell":this._panels.bottom.container,"sb_row":document.createElement("tr"),"sb_cell":document.createElement("td")};
HTMLArea.freeLater(this._framework);
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
var _93=this._framework.table;
this._htmlArea=_93;
HTMLArea.freeLater(this,"_htmlArea");
_93.className="htmlarea";
this._framework.tb_cell.appendChild(this._createToolbar());
var _94=document.createElement("iframe");
_94.src=_editor_url+_8b.config.URIs.blank;
this._framework.ed_cell.appendChild(_94);
this._iframe=_94;
this._iframe.className="xinha_iframe";
HTMLArea.freeLater(this,"_iframe");
var _95=this._createStatusBar();
this._framework.sb_cell.appendChild(_95);
var _96=this._textArea;
_96.parentNode.insertBefore(_93,_96);
_96.className="xinha_textarea";
HTMLArea.removeFromParent(_96);
this._framework.ed_cell.appendChild(_96);
if(_96.form){
HTMLArea.prependDom0Event(this._textArea.form,"submit",function(){
_8b._textArea.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
var _97=_96.value;
HTMLArea.prependDom0Event(this._textArea.form,"reset",function(){
_8b.setHTML(_8b.inwardHtml(_97));
_8b.updateToolbar();
return true;
});
}
HTMLArea.prependDom0Event(window,"unload",function(){
_96.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
_96.style.display="none";
_8b.initSize();
_8b._iframeLoadDone=false;
HTMLArea._addEvent(this._iframe,"load",function(e){
if(!_8b._iframeLoadDone){
_8b._iframeLoadDone=true;
_8b.initIframe();
}
return true;
});
};
HTMLArea.prototype.initSize=function(){
this.setLoadingMessage("Init editor size");
var _99=this;
var _9a=null;
var _9b=null;
switch(this.config.width){
case "auto":
_9a=this._initial_ta_size.w;
break;
case "toolbar":
_9a=this._toolBar.offsetWidth+"px";
break;
default:
_9a=/[^0-9]/.test(this.config.width)?this.config.width:this.config.width+"px";
break;
}
switch(this.config.height){
case "auto":
_9b=this._initial_ta_size.h;
break;
default:
_9b=/[^0-9]/.test(this.config.height)?this.config.height:this.config.height+"px";
break;
}
this.sizeEditor(_9a,_9b,this.config.sizeIncludesBars,this.config.sizeIncludesPanels);
this.notifyOn("panel_change",function(){
_99.sizeEditor();
});
};
HTMLArea.prototype.sizeEditor=function(_9c,_9d,_9e,_9f){
this._iframe.style.height="100%";
this._textArea.style.height="100%";
this._iframe.style.width="";
this._textArea.style.width="";
if(_9e!==null){
this._htmlArea.sizeIncludesToolbars=_9e;
}
if(_9f!==null){
this._htmlArea.sizeIncludesPanels=_9f;
}
if(_9c){
this._htmlArea.style.width=_9c;
if(!this._htmlArea.sizeIncludesPanels){
var _a0=this._panels.right;
if(_a0.on&&_a0.panels.length&&HTMLArea.hasDisplayedChildren(_a0.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.right,10))+"px";
}
var _a1=this._panels.left;
if(_a1.on&&_a1.panels.length&&HTMLArea.hasDisplayedChildren(_a1.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.left,10))+"px";
}
}
}
if(_9d){
this._htmlArea.style.height=_9d;
if(!this._htmlArea.sizeIncludesToolbars){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+this._toolbar.offsetHeight+this._statusBar.offsetHeight)+"px";
}
if(!this._htmlArea.sizeIncludesPanels){
var _a2=this._panels.top;
if(_a2.on&&_a2.panels.length&&HTMLArea.hasDisplayedChildren(_a2.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.top,10))+"px";
}
var _a3=this._panels.bottom;
if(_a3.on&&_a3.panels.length&&HTMLArea.hasDisplayedChildren(_a3.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.bottom,10))+"px";
}
}
}
_9c=this._htmlArea.offsetWidth;
_9d=this._htmlArea.offsetHeight;
var _a4=this._panels;
var _a5=this;
var _a6=1;
function panel_is_alive(pan){
if(_a4[pan].on&&_a4[pan].panels.length&&HTMLArea.hasDisplayedChildren(_a4[pan].container)){
_a4[pan].container.style.display="";
return true;
}else{
_a4[pan].container.style.display="none";
return false;
}
}
if(panel_is_alive("left")){
_a6+=1;
}
if(panel_is_alive("right")){
_a6+=1;
}
this._framework.tb_cell.colSpan=_a6;
this._framework.tp_cell.colSpan=_a6;
this._framework.bp_cell.colSpan=_a6;
this._framework.sb_cell.colSpan=_a6;
if(!this._framework.tp_row.childNodes.length){
HTMLArea.removeFromParent(this._framework.tp_row);
}else{
if(!HTMLArea.hasParentNode(this._framework.tp_row)){
this._framework.tbody.insertBefore(this._framework.tp_row,this._framework.ler_row);
}
}
if(!this._framework.bp_row.childNodes.length){
HTMLArea.removeFromParent(this._framework.bp_row);
}else{
if(!HTMLArea.hasParentNode(this._framework.bp_row)){
this._framework.tbody.insertBefore(this._framework.bp_row,this._framework.ler_row.nextSibling);
}
}
if(!this.config.statusBar){
HTMLArea.removeFromParent(this._framework.sb_row);
}else{
if(!HTMLArea.hasParentNode(this._framework.sb_row)){
this._framework.table.appendChild(this._framework.sb_row);
}
}
this._framework.lp_cell.style.width=this.config.panel_dimensions.left;
this._framework.rp_cell.style.width=this.config.panel_dimensions.right;
this._framework.tp_cell.style.height=this.config.panel_dimensions.top;
this._framework.bp_cell.style.height=this.config.panel_dimensions.bottom;
this._framework.tb_cell.style.height=this._toolBar.offsetHeight+"px";
this._framework.sb_cell.style.height=this._statusBar.offsetHeight+"px";
var _a8=_9d-this._toolBar.offsetHeight-this._statusBar.offsetHeight;
if(panel_is_alive("top")){
_a8-=parseInt(this.config.panel_dimensions.top,10);
}
if(panel_is_alive("bottom")){
_a8-=parseInt(this.config.panel_dimensions.bottom,10);
}
this._iframe.style.height=_a8+"px";
var _a9=_9c;
if(panel_is_alive("left")){
_a9-=parseInt(this.config.panel_dimensions.left,10);
}
if(panel_is_alive("right")){
_a9-=parseInt(this.config.panel_dimensions.right,10);
}
this._iframe.style.width=_a9+"px";
this._textArea.style.height=this._iframe.style.height;
this._textArea.style.width=this._iframe.style.width;
this.notifyOf("resize",{width:this._htmlArea.offsetWidth,height:this._htmlArea.offsetHeight});
};
HTMLArea.prototype.addPanel=function(_aa){
var div=document.createElement("div");
div.side=_aa;
if(_aa=="left"||_aa=="right"){
div.style.width=this.config.panel_dimensions[_aa];
if(this._iframe){
div.style.height=this._iframe.style.height;
}
}
HTMLArea.addClasses(div,"panel");
this._panels[_aa].panels.push(div);
this._panels[_aa].div.appendChild(div);
this.notifyOf("panel_change",{"action":"add","panel":div});
return div;
};
HTMLArea.prototype.removePanel=function(_ac){
this._panels[_ac.side].div.removeChild(_ac);
var _ad=[];
for(var i=0;i<this._panels[_ac.side].panels.length;i++){
if(this._panels[_ac.side].panels[i]!=_ac){
_ad.push(this._panels[_ac.side].panels[i]);
}
}
this._panels[_ac.side].panels=_ad;
this.notifyOf("panel_change",{"action":"remove","panel":_ac});
};
HTMLArea.prototype.hidePanel=function(_af){
if(_af&&_af.style.display!="none"){
_af.style.display="none";
this.notifyOf("panel_change",{"action":"hide","panel":_af});
}
};
HTMLArea.prototype.showPanel=function(_b0){
if(_b0&&_b0.style.display=="none"){
_b0.style.display="";
this.notifyOf("panel_change",{"action":"show","panel":_b0});
}
};
HTMLArea.prototype.hidePanels=function(_b1){
if(typeof _b1=="undefined"){
_b1=["left","right","top","bottom"];
}
var _b2=[];
for(var i=0;i<_b1.length;i++){
if(this._panels[_b1[i]].on){
_b2.push(_b1[i]);
this._panels[_b1[i]].on=false;
}
}
this.notifyOf("panel_change",{"action":"multi_hide","sides":_b1});
};
HTMLArea.prototype.showPanels=function(_b4){
if(typeof _b4=="undefined"){
_b4=["left","right","top","bottom"];
}
var _b5=[];
for(var i=0;i<_b4.length;i++){
if(!this._panels[_b4[i]].on){
_b5.push(_b4[i]);
this._panels[_b4[i]].on=true;
}
}
this.notifyOf("panel_change",{"action":"multi_show","sides":_b4});
};
HTMLArea.objectProperties=function(obj){
var _b8=[];
for(var x in obj){
_b8[_b8.length]=x;
}
return _b8;
};
HTMLArea.prototype.editorIsActivated=function(){
try{
return HTMLArea.is_gecko?this._doc.designMode=="on":this._doc.body.contentEditable;
}
catch(ex){
return false;
}
};
HTMLArea._someEditorHasBeenActivated=false;
HTMLArea._currentlyActiveEditor=false;
HTMLArea.prototype.activateEditor=function(){
if(HTMLArea._currentlyActiveEditor){
if(HTMLArea._currentlyActiveEditor==this){
return true;
}
HTMLArea._currentlyActiveEditor.deactivateEditor();
}
if(HTMLArea.is_gecko&&this._doc.designMode!="on"){
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
if(!HTMLArea.is_gecko&&this._doc.body.contentEditable!==true){
this._doc.body.contentEditable=true;
}
}
HTMLArea._someEditorHasBeenActivated=true;
HTMLArea._currentlyActiveEditor=this;
var _ba=this;
this.enableToolbar();
};
HTMLArea.prototype.deactivateEditor=function(){
this.disableToolbar();
if(HTMLArea.is_gecko&&this._doc.designMode!="off"){
try{
this._doc.designMode="off";
}
catch(ex){
}
}else{
if(!HTMLArea.is_gecko&&this._doc.body.contentEditable!==false){
this._doc.body.contentEditable=false;
}
}
if(HTMLArea._currentlyActiveEditor!=this){
return;
}
HTMLArea._currentlyActiveEditor=false;
};
HTMLArea.prototype.initIframe=function(){
this.setLoadingMessage("Init IFrame");
this.disableToolbar();
var doc=null;
var _bc=this;
try{
if(_bc._iframe.contentDocument){
this._doc=_bc._iframe.contentDocument;
}else{
this._doc=_bc._iframe.contentWindow.document;
}
doc=this._doc;
if(!doc){
if(HTMLArea.is_gecko){
setTimeout(function(){
_bc.initIframe();
},50);
return false;
}else{
alert("ERROR: IFRAME can't be initialized.");
}
}
}
catch(ex){
setTimeout(function(){
_bc.initIframe();
},50);
}
HTMLArea.freeLater(this,"_doc");
doc.open();
var _bd="";
if(!_bc.config.fullPage){
_bd="<html>\n";
_bd+="<head>\n";
_bd+="<meta http-equiv=\"Content-Type\" content=\"text/html; charset="+_bc.config.charSet+"\">\n";
if(typeof _bc.config.baseHref!="undefined"&&_bc.config.baseHref!==null){
_bd+="<base href=\""+_bc.config.baseHref+"\"/>\n";
}
_bd+="<style title=\"table borders\">";
_bd+=".htmtableborders, .htmtableborders td, .htmtableborders th {border : 1px dashed lightgrey ! important;} \n";
_bd+="</style>\n";
_bd+="<style type=\"text/css\">";
_bd+="html, body { border: 0px;  background-color: #ffffff; } \n";
_bd+="span.macro, span.macro ul, span.macro div, span.macro p {background : #CCCCCC;}\n";
_bd+="</style>\n";
if(_bc.config.pageStyle){
_bd+="<style type=\"text/css\">\n"+_bc.config.pageStyle+"\n</style>";
}
if(typeof _bc.config.pageStyleSheets!=="undefined"){
for(var i=0;i<_bc.config.pageStyleSheets.length;i++){
if(_bc.config.pageStyleSheets[i].length>0){
_bd+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_bc.config.pageStyleSheets[i]+"\">";
}
}
}
_bd+="</head>\n";
_bd+="<body>\n";
_bd+=_bc.inwardHtml(_bc._textArea.value);
_bd+="</body>\n";
_bd+="</html>";
}else{
_bd=_bc.inwardHtml(_bc._textArea.value);
if(_bd.match(HTMLArea.RE_doctype)){
_bc.setDoctype(RegExp.$1);
_bd=_bd.replace(HTMLArea.RE_doctype,"");
}
}
doc.write(_bd);
doc.close();
this.setEditorEvents();
};
HTMLArea.prototype.whenDocReady=function(F){
var E=this;
if(this._doc&&this._doc.body){
F();
}else{
setTimeout(function(){
E.whenDocReady(F);
},50);
}
};
HTMLArea.prototype.setMode=function(_c1){
var _c2;
if(typeof _c1=="undefined"){
_c1=this._editMode=="textmode"?"wysiwyg":"textmode";
}
switch(_c1){
case "textmode":
_c2=this.outwardHtml(this.getHTML());
this.setHTML(_c2);
this.deactivateEditor();
this._iframe.style.display="none";
this._textArea.style.display="";
if(this.config.statusBar){
this._statusBarTree.style.display="none";
this._statusBarTextMode.style.display="";
}
this.notifyOf("modechange",{"mode":"text"});
break;
case "wysiwyg":
_c2=this.inwardHtml(this.getHTML());
this.deactivateEditor();
this.setHTML(_c2);
this._iframe.style.display="";
this._textArea.style.display="none";
this.activateEditor();
if(this.config.statusBar){
this._statusBarTree.style.display="";
this._statusBarTextMode.style.display="none";
}
this.notifyOf("modechange",{"mode":"wysiwyg"});
break;
default:
alert("Mode <"+_c1+"> not defined!");
return false;
}
this._editMode=_c1;
for(var i in this.plugins){
var _c4=this.plugins[i].instance;
if(_c4&&typeof _c4.onMode=="function"){
_c4.onMode(_c1);
}
}
};
HTMLArea.prototype.setFullHTML=function(_c5){
var _c6=RegExp.multiline;
RegExp.multiline=true;
if(_c5.match(HTMLArea.RE_doctype)){
this.setDoctype(RegExp.$1);
_c5=_c5.replace(HTMLArea.RE_doctype,"");
}
RegExp.multiline=_c6;
if(!HTMLArea.is_ie){
if(_c5.match(HTMLArea.RE_head)){
this._doc.getElementsByTagName("head")[0].innerHTML=RegExp.$1;
}
if(_c5.match(HTMLArea.RE_body)){
this._doc.getElementsByTagName("body")[0].innerHTML=RegExp.$1;
}
}else{
var _c7=this.editorIsActivated();
if(_c7){
this.deactivateEditor();
}
var _c8=/<html>((.|\n)*?)<\/html>/i;
_c5=_c5.replace(_c8,"$1");
this._doc.open();
this._doc.write(_c5);
this._doc.close();
if(_c7){
this.activateEditor();
}
this.setEditorEvents();
return true;
}
};
HTMLArea.prototype.setEditorEvents=function(){
var _c9=this;
var doc=this._doc;
_c9.whenDocReady(function(){
HTMLArea._addEvents(doc,["mousedown"],function(){
_c9.activateEditor();
return true;
});
HTMLArea._addEvents(doc,["keydown","keypress","mousedown","mouseup","drag"],function(_cb){
return _c9._editorEvent(HTMLArea.is_ie?_c9._iframe.contentWindow.event:_cb);
});
for(var i in _c9.plugins){
var _cd=_c9.plugins[i].instance;
HTMLArea.refreshPlugin(_cd);
}
if(typeof _c9._onGenerate=="function"){
_c9._onGenerate();
}
HTMLArea.addDom0Event(window,"resize",function(e){
_c9.sizeEditor();
});
_c9.removeLoadingMessage();
});
};
HTMLArea.prototype.registerPlugin=function(){
var _cf=arguments[0];
if(_cf===null||typeof _cf=="undefined"||(typeof _cf=="string"&&eval("typeof "+_cf)=="undefined")){
return false;
}
var _d0=[];
for(var i=1;i<arguments.length;++i){
_d0.push(arguments[i]);
}
return this.registerPlugin2(_cf,_d0);
};
HTMLArea.prototype.registerPlugin2=function(_d2,_d3){
if(typeof _d2=="string"){
_d2=eval(_d2);
}
if(typeof _d2=="undefined"){
return false;
}
var obj=new _d2(this,_d3);
if(obj){
var _d5={};
var _d6=_d2._pluginInfo;
for(var i in _d6){
_d5[i]=_d6[i];
}
_d5.instance=obj;
_d5.args=_d3;
this.plugins[_d2._pluginInfo.name]=_d5;
return obj;
}else{
alert("Can't register plugin "+_d2.toString()+".");
}
};
HTMLArea.getPluginDir=function(_d8){
return _editor_url+"plugins/"+_d8;
};
HTMLArea.loadPlugin=function(_d9,_da){
if(eval("typeof "+_d9)!="undefined"){
if(_da){
_da(_d9);
}
return true;
}
var dir=this.getPluginDir(_d9);
var _dc=_d9.replace(/([a-z])([A-Z])([a-z])/g,function(str,l1,l2,l3){
return l1+"-"+l2.toLowerCase()+l3;
}).toLowerCase()+".js";
var _e1=dir+"/"+_dc;
HTMLArea._loadback(_e1,_da?function(){
_da(_d9);
}:null);
return false;
};
HTMLArea._pluginLoadStatus={};
HTMLArea.loadPlugins=function(_e2,_e3){
var _e4=true;
var _e5=HTMLArea.cloneObject(_e2);
while(_e5.length){
var p=_e5.pop();
if(typeof HTMLArea._pluginLoadStatus[p]=="undefined"){
HTMLArea._pluginLoadStatus[p]="loading";
HTMLArea.loadPlugin(p,function(_e7){
if(eval("typeof "+_e7)!="undefined"){
HTMLArea._pluginLoadStatus[_e7]="ready";
}else{
HTMLArea._pluginLoadStatus[_e7]="failed";
}
});
_e4=false;
}else{
switch(HTMLArea._pluginLoadStatus[p]){
case "failed":
case "ready":
break;
default:
_e4=false;
break;
}
}
}
if(_e4){
return true;
}
if(_e3){
setTimeout(function(){
if(HTMLArea.loadPlugins(_e2,_e3)){
_e3();
}
},150);
}
return _e4;
};
HTMLArea.refreshPlugin=function(_e8){
if(_e8&&typeof _e8.onGenerate=="function"){
_e8.onGenerate();
}
if(_e8&&typeof _e8.onGenerateOnce=="function"){
_e8.onGenerateOnce();
_e8.onGenerateOnce=null;
}
};
HTMLArea.loadStyle=function(_e9,_ea){
var url=_editor_url||"";
if(typeof _ea!="undefined"){
url+="plugins/"+_ea+"/";
}
url+=_e9;
if(/^\//.test(_e9)){
url=_e9;
}
var _ec=document.getElementsByTagName("head")[0];
var _ed=document.createElement("link");
_ed.rel="stylesheet";
_ed.href=url;
_ec.appendChild(_ed);
};
HTMLArea.loadStyle(typeof _editor_css=="string"?_editor_css:"htmlarea.css");
HTMLArea.prototype.debugTree=function(){
var ta=document.createElement("textarea");
ta.style.width="100%";
ta.style.height="20em";
ta.value="";
function debug(_ef,str){
for(;--_ef>=0;){
ta.value+=" ";
}
ta.value+=str+"\n";
}
function _dt(_f1,_f2){
var tag=_f1.tagName.toLowerCase(),i;
var ns=HTMLArea.is_ie?_f1.scopeName:_f1.prefix;
debug(_f2,"- "+tag+" ["+ns+"]");
for(i=_f1.firstChild;i;i=i.nextSibling){
if(i.nodeType==1){
_dt(i,_f2+2);
}
}
}
_dt(this._doc.body,0);
document.body.appendChild(ta);
};
HTMLArea.getInnerText=function(el){
var txt="",i;
for(i=el.firstChild;i;i=i.nextSibling){
if(i.nodeType==3){
txt+=i.data;
}else{
if(i.nodeType==1){
txt+=HTMLArea.getInnerText(i);
}
}
}
return txt;
};
HTMLArea.prototype._wordClean=function(){
var _f7=this;
var _f8={empty_tags:0,mso_class:0,mso_style:0,mso_xmlel:0,orig_len:this._doc.body.innerHTML.length,T:(new Date()).getTime()};
var _f9={empty_tags:"Empty tags removed: ",mso_class:"MSO class names removed: ",mso_style:"MSO inline style removed: ",mso_xmlel:"MSO XML elements stripped: "};
function showStats(){
var txt="HTMLArea word cleaner stats: \n\n";
for(var i in _f8){
if(_f9[i]){
txt+=_f9[i]+_f8[i]+"\n";
}
}
txt+="\nInitial document length: "+_f8.orig_len+"\n";
txt+="Final document length: "+_f7._doc.body.innerHTML.length+"\n";
txt+="Clean-up took "+(((new Date()).getTime()-_f8.T)/1000)+" seconds";
alert(txt);
}
function clearClass(_fc){
var _fd=_fc.className.replace(/(^|\s)mso.*?(\s|$)/ig," ");
if(_fd!=_fc.className){
_fc.className=_fd;
if(!(/\S/.test(_fc.className))){
_fc.removeAttribute("className");
++_f8.mso_class;
}
}
}
function clearStyle(_fe){
var _ff=_fe.style.cssText.split(/\s*;\s*/);
for(var i=_ff.length;--i>=0;){
if((/^mso|^tab-stops/i.test(_ff[i]))||(/^margin\s*:\s*0..\s+0..\s+0../i.test(_ff[i]))){
++_f8.mso_style;
_ff.splice(i,1);
}
}
_fe.style.cssText=_ff.join("; ");
}
var _101=null;
if(HTMLArea.is_ie){
_101=function(el){
el.outerHTML=HTMLArea.htmlEncode(el.innerText);
++_f8.mso_xmlel;
};
}else{
_101=function(el){
var txt=document.createTextNode(HTMLArea.getInnerText(el));
el.parentNode.insertBefore(txt,el);
HTMLArea.removeFromParent(el);
++_f8.mso_xmlel;
};
}
function checkEmpty(el){
if(/^(a|span|b|strong|i|em|font)$/i.test(el.tagName)&&!el.firstChild){
HTMLArea.removeFromParent(el);
++_f8.empty_tags;
}
}
function parseTree(root){
var tag=root.tagName.toLowerCase(),i,next;
if((HTMLArea.is_ie&&root.scopeName!="HTML")||(!HTMLArea.is_ie&&(/:/.test(tag)))){
_101(root);
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
HTMLArea.prototype._clearFonts=function(){
var D=this.getInnerHTML();
if(confirm(HTMLArea._lc("Would you like to clear font typefaces?"))){
D=D.replace(/face="[^"]*"/gi,"");
D=D.replace(/font-family:[^;}"']+;?/gi,"");
}
if(confirm(HTMLArea._lc("Would you like to clear font sizes?"))){
D=D.replace(/size="[^"]*"/gi,"");
D=D.replace(/font-size:[^;}"']+;?/gi,"");
}
if(confirm(HTMLArea._lc("Would you like to clear font colours?"))){
D=D.replace(/color="[^"]*"/gi,"");
D=D.replace(/([^-])color:[^;}"']+;?/gi,"$1");
}
D=D.replace(/(style|class)="\s*"/gi,"");
D=D.replace(/<(font|span)\s*>/gi,"");
this.setHTML(D);
this.updateToolbar();
};
HTMLArea.prototype._splitBlock=function(){
this._doc.execCommand("formatblock",false,"div");
};
HTMLArea.prototype.forceRedraw=function(){
this._doc.body.style.visibility="hidden";
this._doc.body.style.visibility="visible";
};
HTMLArea.prototype.focusEditor=function(){
switch(this._editMode){
case "wysiwyg":
try{
if(HTMLArea._someEditorHasBeenActivated){
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
HTMLArea.prototype._undoTakeSnapshot=function(){
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
HTMLArea.prototype.undo=function(){
if(this._undoPos>0){
var txt=this._undoQueue[--this._undoPos];
if(txt){
this.setHTML(txt);
}else{
++this._undoPos;
}
}
};
HTMLArea.prototype.redo=function(){
if(this._undoPos<this._undoQueue.length-1){
var txt=this._undoQueue[++this._undoPos];
if(txt){
this.setHTML(txt);
}else{
--this._undoPos;
}
}
};
HTMLArea.prototype.disableToolbar=function(_10d){
if(this._timerToolbar){
clearTimeout(this._timerToolbar);
}
if(typeof _10d=="undefined"){
_10d=[];
}else{
if(typeof _10d!="object"){
_10d=[_10d];
}
}
for(var i in this._toolbarObjects){
var btn=this._toolbarObjects[i];
if(_10d.contains(i)){
continue;
}
if(typeof (btn.state)!="function"){
continue;
}
btn.state("enabled",false);
}
};
HTMLArea.prototype.enableToolbar=function(){
this.updateToolbar();
};
if(!Array.prototype.contains){
Array.prototype.contains=function(_110){
var _111=this;
for(var i=0;i<_111.length;i++){
if(_110==_111[i]){
return true;
}
}
return false;
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_113){
var _114=this;
for(var i=0;i<_114.length;i++){
if(_113==_114[i]){
return i;
}
}
return null;
};
}
HTMLArea.prototype.updateToolbar=function(_116){
var doc=this._doc;
var text=(this._editMode=="textmode");
var _119=null;
if(!text){
_119=this.getAllAncestors();
if(this.config.statusBar&&!_116){
this._statusBarTree.innerHTML=HTMLArea._lc("Path")+": ";
for(var i=_119.length;--i>=0;){
var el=_119[i];
if(!el){
continue;
}
var a=document.createElement("a");
a.href="javascript:void(0)";
a.el=el;
a.editor=this;
HTMLArea.addDom0Event(a,"click",function(){
this.blur();
this.editor.selectNodeContents(this.el);
this.editor.updateToolbar(true);
return false;
});
HTMLArea.addDom0Event(a,"contextmenu",function(){
this.blur();
var info="Inline style:\n\n";
info+=this.el.style.cssText.split(/;\s*/).join(";\n");
alert(info);
return false;
});
var txt=el.tagName.toLowerCase();
a.title=el.style.cssText;
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
}
}
}
for(var cmd in this._toolbarObjects){
var btn=this._toolbarObjects[cmd];
var _121=true;
if(typeof (btn.state)!="function"){
continue;
}
if(btn.context&&!text){
_121=false;
var _122=btn.context;
var _123=[];
if(/(.*)\[(.*?)\]/.test(_122)){
_122=RegExp.$1;
_123=RegExp.$2.split(",");
}
_122=_122.toLowerCase();
var _124=(_122=="*");
for(var k=0;k<_119.length;++k){
if(!_119[k]){
continue;
}
if(_124||(_119[k].tagName.toLowerCase()==_122)){
_121=true;
for(var ka=0;ka<_123.length;++ka){
if(!eval("ancestors[k]."+_123[ka])){
_121=false;
break;
}
}
if(_121){
break;
}
}
}
}
btn.state("enabled",(!text||btn.text)&&_121);
if(typeof cmd=="function"){
continue;
}
var _127=this.config.customSelects[cmd];
if((!text||btn.text)&&(typeof _127!="undefined")){
_127.refresh(this);
continue;
}
switch(cmd){
case "fontname":
case "fontsize":
if(!text){
try{
var _128=(""+doc.queryCommandValue(cmd)).toLowerCase();
if(!_128){
btn.element.selectedIndex=0;
break;
}
var _129=this.config[cmd];
var _12a=0;
for(var j in _129){
if((j.toLowerCase()==_128)||(_129[j].substr(0,_128.length).toLowerCase()==_128)){
btn.element.selectedIndex=_12a;
throw "ok";
}
++_12a;
}
btn.element.selectedIndex=0;
}
catch(ex){
}
}
break;
case "formatblock":
var _12c=[];
for(var _12d in this.config.formatblock){
if(typeof this.config.formatblock[_12d]=="string"){
_12c[_12c.length]=this.config.formatblock[_12d];
}
}
var _12e=this._getFirstAncestor(this._getSelection(),_12c);
if(_12e){
for(var x=0;x<_12c.length;x++){
if(_12c[x].toLowerCase()==_12e.tagName.toLowerCase()){
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
var _130=btn.element.style;
_130.backgroundColor=HTMLArea._makeColor(doc.queryCommandValue(HTMLArea.is_ie?"backcolor":"hilitecolor"));
if(/transparent/i.test(_130.backgroundColor)){
_130.backgroundColor=HTMLArea._makeColor(doc.queryCommandValue("backcolor"));
}
_130.color=HTMLArea._makeColor(doc.queryCommandValue("forecolor"));
_130.fontFamily=doc.queryCommandValue("fontname");
_130.fontWeight=doc.queryCommandState("bold")?"bold":"normal";
_130.fontStyle=doc.queryCommandState("italic")?"italic":"normal";
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
var _131=this.getParentElement();
while(_131&&!HTMLArea.isBlockElement(_131)){
_131=_131.parentNode;
}
if(_131){
btn.state("active",(_131.style.direction==((cmd=="righttoleft")?"rtl":"ltr")));
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
var _132=this;
this._timerUndo=setTimeout(function(){
_132._timerUndo=null;
},this.config.undoTimeout);
}
if(0&&HTMLArea.is_gecko){
var s=this._getSelection();
if(s&&s.isCollapsed&&s.anchorNode&&s.anchorNode.parentNode.tagName.toLowerCase()!="body"&&s.anchorNode.nodeType==3&&s.anchorOffset==s.anchorNode.length&&!(s.anchorNode.parentNode.nextSibling&&s.anchorNode.parentNode.nextSibling.nodeType==3)&&!HTMLArea.isBlockElement(s.anchorNode.parentNode)){
try{
s.anchorNode.parentNode.parentNode.insertBefore(this._doc.createTextNode("\t"),s.anchorNode.parentNode.nextSibling);
}
catch(ex){
}
}
}
for(var _134 in this.plugins){
var _135=this.plugins[_134].instance;
if(_135&&typeof _135.onUpdateToolbar=="function"){
_135.onUpdateToolbar();
}
}
};
if(!HTMLArea.is_ie){
HTMLArea.prototype.insertNodeAtSelection=function(_136){
var sel=this._getSelection();
var _138=this._createRange(sel);
sel.removeAllRanges();
_138.deleteContents();
var node=_138.startContainer;
var pos=_138.startOffset;
var _13b=_136;
switch(node.nodeType){
case 3:
if(_136.nodeType==3){
node.insertData(pos,_136.data);
_138=this._createRange();
_138.setEnd(node,pos+_136.length);
_138.setStart(node,pos+_136.length);
sel.addRange(_138);
}else{
node=node.splitText(pos);
if(_136.nodeType==11){
_13b=_13b.firstChild;
}
node.parentNode.insertBefore(_136,node);
this.selectNodeContents(_13b);
this.updateToolbar();
}
break;
case 1:
if(_136.nodeType==11){
_13b=_13b.firstChild;
}
node.insertBefore(_136,node.childNodes[pos]);
this.selectNodeContents(_13b);
this.updateToolbar();
break;
}
};
}else{
HTMLArea.prototype.insertNodeAtSelection=function(_13c){
return null;
};
}
if(HTMLArea.is_ie){
HTMLArea.prototype.getParentElement=function(sel){
if(typeof sel=="undefined"){
sel=this._getSelection();
}
var _13e=this._createRange(sel);
switch(sel.type){
case "Text":
var _13f=_13e.parentElement();
while(true){
var _140=_13e.duplicate();
_140.moveToElementText(_13f);
if(_140.inRange(_13e)){
break;
}
if((_13f.nodeType!=1)||(_13f.tagName.toLowerCase()=="body")){
break;
}
_13f=_13f.parentElement;
}
return _13f;
case "None":
return _13e.parentElement();
case "Control":
return _13e.item(0);
default:
return this._doc.body;
}
};
}else{
HTMLArea.prototype.getParentElement=function(sel){
if(typeof sel=="undefined"){
sel=this._getSelection();
}
var _142=this._createRange(sel);
try{
var p=_142.commonAncestorContainer;
if(!_142.collapsed&&_142.startContainer==_142.endContainer&&_142.startOffset-_142.endOffset<=1&&_142.startContainer.hasChildNodes()){
p=_142.startContainer.childNodes[_142.startOffset];
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
}
HTMLArea.prototype.getAllAncestors=function(){
var p=this.getParentElement();
var a=[];
while(p&&(p.nodeType==1)&&(p.tagName.toLowerCase()!="body")){
a.push(p);
p=p.parentNode;
}
a.push(this._doc.body);
return a;
};
HTMLArea.prototype._getFirstAncestor=function(sel,_147){
var prnt=this._activeElement(sel);
if(prnt===null){
try{
prnt=(HTMLArea.is_ie?this._createRange(sel).parentElement():this._createRange(sel).commonAncestorContainer);
}
catch(ex){
return null;
}
}
if(typeof _147=="string"){
_147=[_147];
}
while(prnt){
if(prnt.nodeType==1){
if(_147===null){
return prnt;
}
if(_147.contains(prnt.tagName.toLowerCase())){
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
if(HTMLArea.is_ie){
HTMLArea.prototype._activeElement=function(sel){
if((sel===null)||this._selectionEmpty(sel)){
return null;
}
if(sel.type.toLowerCase()=="control"){
return sel.createRange().item(0);
}else{
var _14a=sel.createRange();
var _14b=this.getParentElement(sel);
if(_14b.innerHTML==_14a.htmlText){
return _14b;
}
return null;
}
};
}else{
HTMLArea.prototype._activeElement=function(sel){
if((sel===null)||this._selectionEmpty(sel)){
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
}
if(HTMLArea.is_ie){
HTMLArea.prototype._selectionEmpty=function(sel){
if(!sel){
return true;
}
return this._createRange(sel).htmlText==="";
};
}else{
HTMLArea.prototype._selectionEmpty=function(sel){
if(!sel){
return true;
}
if(typeof sel.isCollapsed!="undefined"){
return sel.isCollapsed;
}
return true;
};
}
HTMLArea.prototype._getAncestorBlock=function(sel){
var prnt=(HTMLArea.is_ie?this._createRange(sel).parentElement:this._createRange(sel).commonAncestorContainer);
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
HTMLArea.prototype._createImplicitBlock=function(type){
var sel=this._getSelection();
if(HTMLArea.is_ie){
sel.empty();
}else{
sel.collapseToStart();
}
var rng=this._createRange(sel);
};
HTMLArea.prototype._formatBlock=function(_154){
var _155=this.getAllAncestors();
var _156,x=null;
var _157=null;
var _158=[];
if(_154.indexOf(".")>=0){
_157=_154.substr(0,_154.indexOf(".")).toLowerCase();
_158=_154.substr(_154.indexOf("."),_154.length-_154.indexOf(".")).replace(/\./g,"").replace(/^\s*/,"").replace(/\s*$/,"").split(" ");
}else{
_157=_154.toLowerCase();
}
var sel=this._getSelection();
var rng=this._createRange(sel);
if(HTMLArea.is_gecko){
if(sel.isCollapsed){
_156=this._getAncestorBlock(sel);
if(_156===null){
_156=this._createImplicitBlock(sel,_157);
}
}else{
switch(_157){
case "h1":
case "h2":
case "h3":
case "h4":
case "h5":
case "h6":
case "h7":
_156=[];
var _15b=["h1","h2","h3","h4","h5","h6","h7"];
for(var y=0;y<_15b.length;y++){
var _15d=this._doc.getElementsByTagName(_15b[y]);
for(x=0;x<_15d.length;x++){
if(sel.containsNode(_15d[x])){
_156[_156.length]=_15d[x];
}
}
}
if(_156.length>0){
break;
}
case "div":
_156=this._doc.createElement(_157);
_156.appendChild(rng.extractContents());
rng.insertNode(_156);
break;
case "p":
case "center":
case "pre":
case "ins":
case "del":
case "blockquote":
case "address":
_156=[];
var _15e=this._doc.getElementsByTagName(_157);
for(x=0;x<_15e.length;x++){
if(sel.containsNode(_15e[x])){
_156[_156.length]=_15e[x];
}
}
if(_156.length===0){
sel.collapseToStart();
return this._formatBlock(_154);
}
break;
}
}
}
};
if(HTMLArea.is_ie){
HTMLArea.prototype.selectNodeContents=function(node,pos){
this.focusEditor();
this.forceRedraw();
var _161;
var _162=typeof pos=="undefined"?true:false;
if(_162&&node.tagName&&node.tagName.toLowerCase().match(/table|img|input|select|textarea/)){
_161=this._doc.body.createControlRange();
_161.add(node);
}else{
_161=this._doc.body.createTextRange();
_161.moveToElementText(node);
}
_161.select();
};
}else{
HTMLArea.prototype.selectNodeContents=function(node,pos){
this.focusEditor();
this.forceRedraw();
var _165;
var _166=typeof pos=="undefined"?true:false;
var sel=this._getSelection();
_165=this._doc.createRange();
if(_166&&node.tagName&&node.tagName.toLowerCase().match(/table|img|input|textarea|select/)){
_165.selectNode(node);
}else{
_165.selectNodeContents(node);
}
sel.removeAllRanges();
sel.addRange(_165);
};
}
if(HTMLArea.is_ie){
HTMLArea.prototype.insertHTML=function(html){
var sel=this._getSelection();
var _16a=this._createRange(sel);
this.focusEditor();
_16a.pasteHTML(html);
};
}else{
HTMLArea.prototype.insertHTML=function(html){
var sel=this._getSelection();
var _16d=this._createRange(sel);
this.focusEditor();
var _16e=this._doc.createDocumentFragment();
var div=this._doc.createElement("div");
div.innerHTML=html;
while(div.firstChild){
_16e.appendChild(div.firstChild);
}
var node=this.insertNodeAtSelection(_16e);
};
}
HTMLArea.prototype.surroundHTML=function(_171,_172){
var html=this.getSelectedHTML();
this.insertHTML(_171+html+_172);
};
if(HTMLArea.is_ie){
HTMLArea.prototype.getSelectedHTML=function(){
var sel=this._getSelection();
var _175=this._createRange(sel);
if(_175.htmlText){
return _175.htmlText;
}else{
if(_175.length>=1){
return _175.item(0).outerHTML;
}
}
return "";
};
}else{
HTMLArea.prototype.getSelectedHTML=function(){
var sel=this._getSelection();
var _177=this._createRange(sel);
return HTMLArea.getHTML(_177.cloneContents(),false,this);
};
}
HTMLArea.prototype.hasSelectedText=function(){
return this.getSelectedHTML()!=="";
};
HTMLArea.prototype._createLink=function(link){
var _179=this;
var _17a=null;
if(typeof link=="undefined"){
link=this.getParentElement();
if(link){
while(link&&!/^a$/i.test(link.tagName)){
link=link.parentNode;
}
}
}
if(!link){
var sel=_179._getSelection();
var _17c=_179._createRange(sel);
var _17d=0;
if(HTMLArea.is_ie){
if(sel.type=="Control"){
_17d=_17c.length;
}else{
_17d=_17c.compareEndPoints("StartToEnd",_17c);
}
}else{
_17d=_17c.compareBoundaryPoints(_17c.START_TO_END,_17c);
}
if(_17d===0){
alert(HTMLArea._lc("You need to select some text before creating a link"));
return;
}
_17a={f_href:"",f_title:"",f_target:"",f_usetarget:_179.config.makeLinkShowsTarget};
}else{
_17a={f_href:HTMLArea.is_ie?_179.stripBaseURL(link.href):link.getAttribute("href"),f_title:link.title,f_target:link.target,f_usetarget:_179.config.makeLinkShowsTarget};
}
this._popupDialog(_179.config.URIs.link,function(_17e){
if(!_17e){
return false;
}
var a=link;
if(!a){
try{
_179._doc.execCommand("createlink",false,_17e.f_href);
a=_179.getParentElement();
var sel=_179._getSelection();
var _181=_179._createRange(sel);
if(!HTMLArea.is_ie){
a=_181.startContainer;
if(!(/^a$/i.test(a.tagName))){
a=a.nextSibling;
if(a===null){
a=_181.startContainer.parentNode;
}
}
}
}
catch(ex){
}
}else{
var href=_17e.f_href.trim();
_179.selectNodeContents(a);
if(href===""){
_179._doc.execCommand("unlink",false,null);
_179.updateToolbar();
return false;
}else{
a.href=href;
}
}
if(!(a&&a.tagName.toLowerCase()=="a")){
return false;
}
a.target=_17e.f_target.trim();
a.title=_17e.f_title.trim();
_179.selectNodeContents(a);
_179.updateToolbar();
},_17a);
};
HTMLArea.prototype._insertImage=function(_183){
var _184=this;
var _185=null;
if(typeof _183=="undefined"){
_183=this.getParentElement();
if(_183&&_183.tagName.toLowerCase()!="img"){
_183=null;
}
}
if(_183){
_185={f_base:_184.config.baseHref,f_url:HTMLArea.is_ie?_184.stripBaseURL(_183.src):_183.getAttribute("src"),f_alt:_183.alt,f_border:_183.border,f_align:_183.align,f_vert:_183.vspace,f_horiz:_183.hspace};
}
this._popupDialog(_184.config.URIs.insert_image,function(_186){
if(!_186){
return false;
}
var img=_183;
if(!img){
if(HTMLArea.is_ie){
var sel=_184._getSelection();
var _189=_184._createRange(sel);
_184._doc.execCommand("insertimage",false,_186.f_url);
img=_189.parentElement();
if(img.tagName.toLowerCase()!="img"){
img=img.previousSibling;
}
}else{
img=document.createElement("img");
img.src=_186.f_url;
_184.insertNodeAtSelection(img);
if(!img.tagName){
img=_189.startContainer.firstChild;
}
}
}else{
img.src=_186.f_url;
}
for(var _18a in _186){
var _18b=_186[_18a];
switch(_18a){
case "f_alt":
img.alt=_18b;
break;
case "f_border":
img.border=parseInt(_18b||"0",10);
break;
case "f_align":
img.align=_18b;
break;
case "f_vert":
img.vspace=parseInt(_18b||"0",10);
break;
case "f_horiz":
img.hspace=parseInt(_18b||"0",10);
break;
}
}
},_185);
};
HTMLArea.prototype._insertTable=function(){
var sel=this._getSelection();
var _18d=this._createRange(sel);
var _18e=this;
this._popupDialog(_18e.config.URIs.insert_table,function(_18f){
if(!_18f){
return false;
}
var doc=_18e._doc;
var _191=doc.createElement("table");
for(var _192 in _18f){
var _193=_18f[_192];
if(!_193){
continue;
}
switch(_192){
case "f_width":
_191.style.width=_193+_18f.f_unit;
break;
case "f_align":
_191.align=_193;
break;
case "f_border":
_191.border=parseInt(_193,10);
break;
case "f_spacing":
_191.cellSpacing=parseInt(_193,10);
break;
case "f_padding":
_191.cellPadding=parseInt(_193,10);
break;
}
}
var _194=0;
if(_18f.f_fixed){
_194=Math.floor(100/parseInt(_18f.f_cols,10));
}
var _195=doc.createElement("tbody");
_191.appendChild(_195);
for(var i=0;i<_18f.f_rows;++i){
var tr=doc.createElement("tr");
_195.appendChild(tr);
for(var j=0;j<_18f.f_cols;++j){
var td=doc.createElement("td");
if(_194){
td.style.width=_194+"%";
}
tr.appendChild(td);
td.appendChild(doc.createTextNode("\xa0"));
}
}
if(HTMLArea.is_ie){
_18d.pasteHTML(_191.outerHTML);
}else{
_18e.insertNodeAtSelection(_191);
}
return true;
},null);
};
HTMLArea.prototype._comboSelected=function(el,txt){
this.focusEditor();
var _19c=el.options[el.selectedIndex].value;
switch(txt){
case "fontname":
case "fontsize":
this.execCommand(txt,false,_19c);
break;
case "formatblock":
if(!HTMLArea.is_gecko||_19c!=="blockquote"){
_19c="<"+_19c+">";
}
this.execCommand(txt,false,_19c);
break;
default:
var _19d=this.config.customSelects[txt];
if(typeof _19d!="undefined"){
_19d.action(this);
}else{
alert("FIXME: combo box "+txt+" not implemented");
}
break;
}
};
HTMLArea.prototype._colorSelector=function(_19e){
var _19f=this;
var btn=_19f._toolbarObjects[_19e].element;
if(_19e=="hilitecolor"){
if(HTMLArea.is_ie){
_19e="backcolor";
}
if(HTMLArea.is_gecko){
try{
_19f._doc.execCommand("useCSS",false,false);
}
catch(ex){
}
}
}
var _1a1=function(_1a2){
_19f._doc.execCommand(_19e,false,_1a2);
};
if(HTMLArea.is_ie){
var _1a3=_19f._createRange(_19f._getSelection());
_1a1=function(_1a4){
_1a3.select();
_19f._doc.execCommand(_19e,false,_1a4);
};
}
var _1a5=new colorPicker({cellsize:_19f.config.colorPickerCellSize,callback:_1a1,granularity:_19f.config.colorPickerGranularity});
_1a5.open(_19f.config.colorPickerPosition,btn);
};
HTMLArea.prototype.execCommand=function(_1a6,UI,_1a8){
var _1a9=this;
this.focusEditor();
_1a6=_1a6.toLowerCase();
if(HTMLArea.is_gecko){
try{
this._doc.execCommand("useCSS",false,true);
}
catch(ex){
}
}
switch(_1a6){
case "htmlmode":
this.setMode();
break;
case "hilitecolor":
case "forecolor":
this._colorSelector(_1a6);
break;
case "createlink":
this._createLink();
break;
case "undo":
case "redo":
if(this._customUndo){
this[_1a6]();
}else{
this._doc.execCommand(_1a6,UI,_1a8);
}
break;
case "inserttable":
this._insertTable();
break;
case "insertimage":
this._insertImage();
break;
case "about":
this._popupDialog(_1a9.config.URIs.about,null,this);
break;
case "showhelp":
this._popupDialog(_1a9.config.URIs.help,null,this);
break;
case "killword":
this._wordClean();
break;
case "cut":
case "copy":
case "paste":
try{
this._doc.execCommand(_1a6,UI,_1a8);
if(this.config.killWordOnPaste){
this._wordClean();
}
}
catch(ex){
if(HTMLArea.is_gecko){
alert(HTMLArea._lc("The Paste button does not work in Mozilla based web browsers (technical security reasons). Press CTRL-V on your keyboard to paste directly."));
}
}
break;
case "lefttoright":
case "righttoleft":
if(this.config.changeJustifyWithDirection){
this._doc.execCommand((_1a6=="righttoleft")?"justifyright":"justifyleft",UI,_1a8);
}
var dir=(_1a6=="righttoleft")?"rtl":"ltr";
var el=this.getParentElement();
while(el&&!HTMLArea.isBlockElement(el)){
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
default:
try{
this._doc.execCommand(_1a6,UI,_1a8);
}
catch(ex){
if(this.config.debug){
alert(e+"\n\nby execCommand("+_1a6+");");
}
}
break;
}
this.updateToolbar();
return false;
};
HTMLArea.prototype._editorEvent=function(ev){
var _1ad=this;
var _1ae=(HTMLArea.is_ie&&ev.type=="keydown")||(!HTMLArea.is_ie&&ev.type=="keypress");
if(typeof _1ad._textArea["on"+ev.type]=="function"){
_1ad._textArea["on"+ev.type]();
}
if(HTMLArea.is_gecko&&_1ae&&ev.ctrlKey&&this._unLink&&this._unlinkOnUndo){
if(String.fromCharCode(ev.charCode).toLowerCase()=="z"){
HTMLArea._stopEvent(ev);
this._unLink();
_1ad.updateToolbar();
return;
}
}
if(_1ae){
for(var i in _1ad.plugins){
var _1b0=_1ad.plugins[i].instance;
if(_1b0&&typeof _1b0.onKeyPress=="function"){
if(_1b0.onKeyPress(ev)){
return false;
}
}
}
}
if(_1ae&&ev.ctrlKey&&!ev.altKey){
var sel=null;
var _1b2=null;
var key=String.fromCharCode(HTMLArea.is_ie?ev.keyCode:ev.charCode).toLowerCase();
var cmd=null;
var _1b5=null;
switch(key){
case "a":
if(!HTMLArea.is_ie){
sel=this._getSelection();
sel.removeAllRanges();
_1b2=this._createRange();
_1b2.selectNodeContents(this._doc.body);
sel.addRange(_1b2);
HTMLArea._stopEvent(ev);
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
if(HTMLArea.is_ie||_1ad.config.htmlareaPaste){
cmd="paste";
}
break;
case "n":
cmd="formatblock";
_1b5=HTMLArea.is_ie?"<p>":"p";
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
_1b5="h"+key;
if(HTMLArea.is_ie){
_1b5="<"+_1b5+">";
}
break;
}
if(cmd){
this.execCommand(cmd,false,_1b5);
HTMLArea._stopEvent(ev);
}
}else{
if(_1ae){
if(HTMLArea.is_gecko){
var s=_1ad._getSelection();
var _1b7=function(_1b8,tag){
var _1ba=_1b8.nextSibling;
if(typeof tag=="string"){
tag=_1ad._doc.createElement(tag);
}
var a=_1b8.parentNode.insertBefore(tag,_1ba);
HTMLArea.removeFromParent(_1b8);
a.appendChild(_1b8);
_1ba.data=" "+_1ba.data;
if(HTMLArea.is_ie){
var r=_1ad._createRange(s);
s.moveToElementText(_1ba);
s.move("character",1);
}else{
s.collapse(_1ba,1);
}
HTMLArea._stopEvent(ev);
_1ad._unLink=function(){
var t=a.firstChild;
a.removeChild(t);
a.parentNode.insertBefore(t,a);
HTMLArea.removeFromParent(a);
_1ad._unLink=null;
_1ad._unlinkOnUndo=false;
};
_1ad._unlinkOnUndo=true;
return a;
};
switch(ev.which){
case 32:
if(s&&s.isCollapsed&&s.anchorNode.nodeType==3&&s.anchorNode.data.length>3&&s.anchorNode.data.indexOf(".")>=0){
var _1be=s.anchorNode.data.substring(0,s.anchorOffset).search(/\S{4,}$/);
if(_1be==-1){
break;
}
if(this._getFirstAncestor(s,"a")){
break;
}
var _1bf=s.anchorNode.data.substring(0,s.anchorOffset).replace(/^.*?(\S*)$/,"$1");
var _1c0=_1bf.match(HTMLArea.RE_email);
if(_1c0){
var _1c1=s.anchorNode;
var _1c2=_1c1.splitText(s.anchorOffset);
var _1c3=_1c1.splitText(_1be);
_1b7(_1c3,"a").href="mailto:"+_1c0[0];
break;
}
RE_date=/[0-9\.]*/;
RE_ip=/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
var mUrl=_1bf.match(HTMLArea.RE_url);
if(mUrl){
if(RE_date.test(_1bf)){
if(!RE_ip.test(_1bf)){
break;
}
}
var _1c5=s.anchorNode;
var _1c6=_1c5.splitText(s.anchorOffset);
var _1c7=_1c5.splitText(_1be);
_1b7(_1c7,"a").href=(mUrl[1]?mUrl[1]:"http://")+mUrl[2];
break;
}
}
break;
default:
if(ev.keyCode==27||(this._unlinkOnUndo&&ev.ctrlKey&&ev.which==122)){
if(this._unLink){
this._unLink();
HTMLArea._stopEvent(ev);
}
break;
}else{
if(ev.which||ev.keyCode==8||ev.keyCode==46){
this._unlinkOnUndo=false;
if(s.anchorNode&&s.anchorNode.nodeType==3){
var a=this._getFirstAncestor(s,"a");
if(!a){
break;
}
if(!a._updateAnchTimeout){
if(s.anchorNode.data.match(HTMLArea.RE_email)&&a.href.match("mailto:"+s.anchorNode.data.trim())){
var _1c9=s.anchorNode;
var _1ca=function(){
a.href="mailto:"+_1c9.data.trim();
a._updateAnchTimeout=setTimeout(_1ca,250);
};
a._updateAnchTimeout=setTimeout(_1ca,1000);
break;
}
var m=s.anchorNode.data.match(HTMLArea.RE_url);
if(m&&a.href.match(s.anchorNode.data.trim())){
var _1cc=s.anchorNode;
var _1cd=function(){
var m=_1cc.data.match(HTMLArea.RE_url);
a.href=(m[1]?m[1]:"http://")+m[2];
a._updateAnchTimeout=setTimeout(_1cd,250);
};
a._updateAnchTimeout=setTimeout(_1cd,1000);
}
}
}
}
}
break;
}
}
switch(ev.keyCode){
case 13:
if(HTMLArea.is_gecko&&!ev.shiftKey&&this.config.mozParaHandler=="dirty"){
this.dom_checkInsertP();
HTMLArea._stopEvent(ev);
}
break;
case 8:
case 46:
if((HTMLArea.is_gecko&&!ev.shiftKey)||HTMLArea.is_ie){
if(this.checkBackspace()){
HTMLArea._stopEvent(ev);
}
}
break;
}
}
}
if(_1ad._timerToolbar){
clearTimeout(_1ad._timerToolbar);
}
_1ad._timerToolbar=setTimeout(function(){
_1ad.updateToolbar();
_1ad._timerToolbar=null;
},250);
};
HTMLArea.prototype.convertNode=function(el,_1d0){
var _1d1=this._doc.createElement(_1d0);
while(el.firstChild){
_1d1.appendChild(el.firstChild);
}
return _1d1;
};
if(HTMLArea.is_ie){
HTMLArea.prototype.checkBackspace=function(){
var sel=this._getSelection();
if(sel.type=="Control"){
var elm=this._activeElement(sel);
HTMLArea.removeFromParent(elm);
return true;
}
var _1d4=this._createRange(sel);
var r2=_1d4.duplicate();
r2.moveStart("character",-1);
var a=r2.parentElement();
if(a!=_1d4.parentElement()&&(/^a$/i.test(a.tagName))){
r2.collapse(true);
r2.moveEnd("character",1);
r2.pasteHTML("");
r2.select();
return true;
}
};
}else{
HTMLArea.prototype.checkBackspace=function(){
var self=this;
setTimeout(function(){
var sel=self._getSelection();
var _1d9=self._createRange(sel);
var SC=_1d9.startContainer;
var SO=_1d9.startOffset;
var EC=_1d9.endContainer;
var EO=_1d9.endOffset;
var newr=SC.nextSibling;
if(SC.nodeType==3){
SC=SC.parentNode;
}
if(!(/\S/.test(SC.tagName))){
var p=document.createElement("p");
while(SC.firstChild){
p.appendChild(SC.firstChild);
}
SC.parentNode.insertBefore(p,SC);
HTMLArea.removeFromParent(SC);
var r=_1d9.cloneRange();
r.setStartBefore(newr);
r.setEndAfter(newr);
r.extractContents();
sel.removeAllRanges();
sel.addRange(r);
}
},10);
};
}
HTMLArea.prototype.dom_checkInsertP=function(){
var p,body;
var sel=this._getSelection();
var _1e3=this._createRange(sel);
if(!_1e3.collapsed){
_1e3.deleteContents();
}
this.deactivateEditor();
var SC=_1e3.startContainer;
var SO=_1e3.startOffset;
var EC=_1e3.endContainer;
var EO=_1e3.endOffset;
if(SC==EC&&SC==body&&!SO&&!EO){
p=this._doc.createTextNode(" ");
body.insertBefore(p,body.firstChild);
_1e3.selectNodeContents(p);
SC=_1e3.startContainer;
SO=_1e3.startOffset;
EC=_1e3.endContainer;
EO=_1e3.endOffset;
}
p=this.getAllAncestors();
var _1e8=null;
body=this._doc.body;
for(var i=0;i<p.length;++i){
if(HTMLArea.isParaContainer(p[i])){
break;
}else{
if(HTMLArea.isBlockElement(p[i])&&!(/body|html/i.test(p[i].tagName))){
_1e8=p[i];
break;
}
}
}
if(!_1e8){
var wrap=_1e3.startContainer;
while(wrap.parentNode&&!HTMLArea.isParaContainer(wrap.parentNode)){
wrap=wrap.parentNode;
}
var _1eb=wrap;
var end=wrap;
while(_1eb.previousSibling){
if(_1eb.previousSibling.tagName){
if(!HTMLArea.isBlockElement(_1eb.previousSibling)){
_1eb=_1eb.previousSibling;
}else{
break;
}
}else{
_1eb=_1eb.previousSibling;
}
}
while(end.nextSibling){
if(end.nextSibling.tagName){
if(!HTMLArea.isBlockElement(end.nextSibling)){
end=end.nextSibling;
}else{
break;
}
}else{
end=end.nextSibling;
}
}
_1e3.setStartBefore(_1eb);
_1e3.setEndAfter(end);
_1e3.surroundContents(this._doc.createElement("p"));
_1e8=_1e3.startContainer.firstChild;
_1e3.setStart(SC,SO);
}
_1e3.setEndAfter(_1e8);
var r2=_1e3.cloneRange();
sel.removeRange(_1e3);
var df=r2.extractContents();
if(df.childNodes.length===0){
df.appendChild(this._doc.createElement("p"));
df.firstChild.appendChild(this._doc.createElement("br"));
}
if(df.childNodes.length>1){
var nb=this._doc.createElement("p");
while(df.firstChild){
var s=df.firstChild;
df.removeChild(s);
nb.appendChild(s);
}
df.appendChild(nb);
}
if(!(/\S/.test(_1e8.innerHTML))){
_1e8.innerHTML="&nbsp;";
}
p=df.firstChild;
if(!(/\S/.test(p.innerHTML))){
p.innerHTML="<br />";
}
if((/^\s*<br\s*\/?>\s*$/.test(p.innerHTML))&&(/^h[1-6]$/i.test(p.tagName))){
df.appendChild(this.convertNode(p,"p"));
df.removeChild(p);
}
var _1f1=_1e8.parentNode.insertBefore(df.firstChild,_1e8.nextSibling);
this.activateEditor();
sel=this._getSelection();
sel.removeAllRanges();
sel.collapse(_1f1,0);
this.scrollToElement(_1f1);
};
HTMLArea.prototype.scrollToElement=function(e){
if(HTMLArea.is_gecko){
var top=0;
var left=0;
while(e){
top+=e.offsetTop;
left+=e.offsetLeft;
if(e.offsetParent&&e.offsetParent.tagName.toLowerCase()!="body"){
e=e.offsetParent;
}else{
e=null;
}
}
this._iframe.contentWindow.scrollTo(left,top);
}
};
HTMLArea.prototype.getHTML=function(){
var html="";
switch(this._editMode){
case "wysiwyg":
if(!this.config.fullPage){
html=HTMLArea.getHTML(this._doc.body,false,this);
}else{
html=this.doctype+"\n"+HTMLArea.getHTML(this._doc.documentElement,true,this);
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
HTMLArea.prototype.outwardHtml=function(html){
html=html.replace(/<(\/?)b(\s|>|\/)/ig,"<$1strong$2");
html=html.replace(/<(\/?)i(\s|>|\/)/ig,"<$1em$2");
html=html.replace(/<(\/?)strike(\s|>|\/)/ig,"<$1del$2");
html=html.replace("onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(","onclick=\"window.open(");
var _1f7=location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/";
html=html.replace(/https?:\/\/null\//g,_1f7);
html=html.replace(/((href|src|background)=[\'\"])\/+/ig,"$1"+_1f7);
html=this.outwardSpecialReplacements(html);
html=this.fixRelativeLinks(html);
if(this.config.sevenBitClean){
html=html.replace(/[^ -~\r\n\t]/g,function(c){
return "&#"+c.charCodeAt(0)+";";
});
}
if(HTMLArea.is_gecko){
html=html.replace(/<script[\s]*src[\s]*=[\s]*['"]chrome:\/\/.*?["']>[\s]*<\/script>/ig,"");
}
return html;
};
HTMLArea.prototype.inwardHtml=function(html){
if(HTMLArea.is_gecko){
html=html.replace(/<(\/?)strong(\s|>|\/)/ig,"<$1b$2");
html=html.replace(/<(\/?)em(\s|>|\/)/ig,"<$1i$2");
}
html=html.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");
html=html.replace("onclick=\"window.open(","onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(");
html=this.inwardSpecialReplacements(html);
var _1fa=new RegExp("((href|src|background)=['\"])/+","gi");
html=html.replace(_1fa,"$1"+location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/");
html=this.fixRelativeLinks(html);
return html;
};
HTMLArea.prototype.outwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=this.config.specialReplacements[i];
var to=i;
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(HTMLArea.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
HTMLArea.prototype.inwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=i;
var to=this.config.specialReplacements[i];
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(HTMLArea.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
HTMLArea.prototype.fixRelativeLinks=function(html){
if(typeof this.config.stripSelfNamedAnchors!="undefined"&&this.config.stripSelfNamedAnchors){
var _206=new RegExp(document.location.href.replace(HTMLArea.RE_Specials,"\\$1")+"(#[^'\" ]*)","g");
html=html.replace(_206,"$1");
}
if(typeof this.config.stripBaseHref!="undefined"&&this.config.stripBaseHref){
var _207=null;
if(typeof this.config.baseHref!="undefined"&&this.config.baseHref!==null){
_207=new RegExp(this.config.baseHref.replace(HTMLArea.RE_Specials,"\\$1"),"g");
}else{
_207=new RegExp(document.location.href.replace(/([^\/]*\/?)$/,"").replace(HTMLArea.RE_Specials,"\\$1"),"g");
}
html=html.replace(_207,"");
}
return html;
};
HTMLArea.prototype.getInnerHTML=function(){
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
HTMLArea.prototype.setHTML=function(html){
if(!this.config.fullPage){
this._doc.body.innerHTML=html;
}else{
this.setFullHTML(html);
}
this._textArea.value=html;
};
HTMLArea.prototype.setDoctype=function(_20a){
this.doctype=_20a;
};
HTMLArea._object=null;
HTMLArea.cloneObject=function(obj){
if(!obj){
return null;
}
var _20c={};
if(obj.constructor.toString().match(/\s*function Array\(/)){
_20c=obj.constructor();
}
if(obj.constructor.toString().match(/\s*function Function\(/)){
_20c=obj;
}else{
for(var n in obj){
var node=obj[n];
if(typeof node=="object"){
_20c[n]=HTMLArea.cloneObject(node);
}else{
_20c[n]=node;
}
}
}
return _20c;
};
HTMLArea.checkSupportedBrowser=function(){
if(HTMLArea.is_gecko){
if(navigator.productSub<20021201){
alert("You need at least Mozilla-1.3 Alpha.\nSorry, your Gecko is not supported.");
return false;
}
if(navigator.productSub<20030210){
alert("Mozilla < 1.3 Beta is not supported!\nI'll try, though, but it might not work.");
}
}
return HTMLArea.is_gecko||HTMLArea.is_ie;
};
if(HTMLArea.is_ie){
HTMLArea.prototype._getSelection=function(){
return this._doc.selection;
};
}else{
HTMLArea.prototype._getSelection=function(){
return this._iframe.contentWindow.getSelection();
};
}
if(HTMLArea.is_ie){
HTMLArea.prototype._createRange=function(sel){
return sel.createRange();
};
}else{
HTMLArea.prototype._createRange=function(sel){
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
}
HTMLArea._eventFlushers=[];
HTMLArea.flushEvents=function(){
var x=0;
var e=HTMLArea._eventFlushers.pop();
while(e){
try{
if(e.length==3){
HTMLArea._removeEvent(e[0],e[1],e[2]);
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
e=HTMLArea._eventFlushers.pop();
}
};
if(document.addEventListener){
HTMLArea._addEvent=function(el,_214,func){
el.addEventListener(_214,func,true);
HTMLArea._eventFlushers.push([el,_214,func]);
};
HTMLArea._removeEvent=function(el,_217,func){
el.removeEventListener(_217,func,true);
};
HTMLArea._stopEvent=function(ev){
ev.preventDefault();
ev.stopPropagation();
};
}else{
if(document.attachEvent){
HTMLArea._addEvent=function(el,_21b,func){
el.attachEvent("on"+_21b,func);
HTMLArea._eventFlushers.push([el,_21b,func]);
};
HTMLArea._removeEvent=function(el,_21e,func){
el.detachEvent("on"+_21e,func);
};
HTMLArea._stopEvent=function(ev){
try{
ev.cancelBubble=true;
ev.returnValue=false;
}
catch(ex){
}
};
}else{
HTMLArea._addEvent=function(el,_222,func){
alert("_addEvent is not supported");
};
HTMLArea._removeEvent=function(el,_225,func){
alert("_removeEvent is not supported");
};
HTMLArea._stopEvent=function(ev){
alert("_stopEvent is not supported");
};
}
}
HTMLArea._addEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
HTMLArea._addEvent(el,evs[i],func);
}
};
HTMLArea._removeEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
HTMLArea._removeEvent(el,evs[i],func);
}
};
HTMLArea.addDom0Event=function(el,ev,fn){
HTMLArea._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].unshift(fn);
};
HTMLArea.prependDom0Event=function(el,ev,fn){
HTMLArea._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].push(fn);
};
HTMLArea._prepareForDom0Events=function(el,ev){
if(typeof el._xinha_dom0Events=="undefined"){
el._xinha_dom0Events={};
HTMLArea.freeLater(el,"_xinha_dom0Events");
}
if(typeof el._xinha_dom0Events[ev]=="undefined"){
el._xinha_dom0Events[ev]=[];
if(typeof el["on"+ev]=="function"){
el._xinha_dom0Events[ev].push(el["on"+ev]);
}
el["on"+ev]=function(_238){
var a=el._xinha_dom0Events[ev];
var _23a=true;
for(var i=a.length;--i>=0;){
el._xinha_tempEventHandler=a[i];
if(el._xinha_tempEventHandler(_238)===false){
el._xinha_tempEventHandler=null;
_23a=false;
break;
}
el._xinha_tempEventHandler=null;
}
return _23a;
};
HTMLArea._eventFlushers.push([el,ev]);
}
};
HTMLArea.prototype.notifyOn=function(ev,fn){
if(typeof this._notifyListeners[ev]=="undefined"){
this._notifyListeners[ev]=[];
HTMLArea.freeLater(this,"_notifyListeners");
}
this._notifyListeners[ev].push(fn);
};
HTMLArea.prototype.notifyOf=function(ev,args){
if(this._notifyListeners[ev]){
for(var i=0;i<this._notifyListeners[ev].length;i++){
this._notifyListeners[ev][i](ev,args);
}
}
};
HTMLArea._removeClass=function(el,_242){
if(!(el&&el.className)){
return;
}
var cls=el.className.split(" ");
var ar=[];
for(var i=cls.length;i>0;){
if(cls[--i]!=_242){
ar[ar.length]=cls[i];
}
}
el.className=ar.join(" ");
};
HTMLArea._addClass=function(el,_247){
HTMLArea._removeClass(el,_247);
el.className+=" "+_247;
};
HTMLArea._hasClass=function(el,_249){
if(!(el&&el.className)){
return false;
}
var cls=el.className.split(" ");
for(var i=cls.length;i>0;){
if(cls[--i]==_249){
return true;
}
}
return false;
};
HTMLArea._blockTags=" body form textarea fieldset ul ol dl li div "+"p h1 h2 h3 h4 h5 h6 quote pre table thead "+"tbody tfoot tr td th iframe address blockquote";
HTMLArea.isBlockElement=function(el){
return el&&el.nodeType==1&&(HTMLArea._blockTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
HTMLArea._paraContainerTags=" body td th caption fieldset div";
HTMLArea.isParaContainer=function(el){
return el&&el.nodeType==1&&(HTMLArea._paraContainerTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
HTMLArea._closingTags=" a abbr acronym address applet b bdo big blockquote button caption center cite code del dfn dir div dl em fieldset font form frameset h1 h2 h3 h4 h5 h6 i iframe ins kbd label legend map menu noframes noscript object ol optgroup pre q s samp script select small span strike strong style sub sup table textarea title tt u ul var ";
HTMLArea.needsClosingTag=function(el){
return el&&el.nodeType==1&&(HTMLArea._closingTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
HTMLArea.htmlEncode=function(str){
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
HTMLArea.getHTML=function(root,_251,_252){
try{
return HTMLArea.getHTMLWrapper(root,_251,_252);
}
catch(ex){
alert(HTMLArea._lc("Your Document is not well formed. Check JavaScript console for details."));
return _252._iframe.contentWindow.document.body.innerHTML;
}
};
HTMLArea.getHTMLWrapper=function(root,_254,_255,_256){
var html="";
if(!_256){
_256="";
}
switch(root.nodeType){
case 10:
case 6:
case 12:
break;
case 2:
break;
case 4:
html+=(HTMLArea.is_ie?("\n"+_256):"")+"<![CDATA["+root.data+"]]>";
break;
case 5:
html+="&"+root.nodeValue+";";
break;
case 7:
html+=(HTMLArea.is_ie?("\n"+_256):"")+"<?"+root.target+" "+root.data+" ?>";
break;
case 1:
case 11:
case 9:
var _258;
var i;
var _25a=(root.nodeType==1)?root.tagName.toLowerCase():"";
if(_254){
_254=!(_255.config.htmlRemoveTags&&_255.config.htmlRemoveTags.test(_25a));
}
if(HTMLArea.is_ie&&_25a=="head"){
if(_254){
html+=(HTMLArea.is_ie?("\n"+_256):"")+"<head>";
}
var _25b=RegExp.multiline;
RegExp.multiline=true;
var txt=root.innerHTML.replace(HTMLArea.RE_tagName,function(str,p1,p2){
return p1+p2.toLowerCase();
});
RegExp.multiline=_25b;
html+=txt+"\n";
if(_254){
html+=(HTMLArea.is_ie?("\n"+_256):"")+"</head>";
}
break;
}else{
if(_254){
_258=(!(root.hasChildNodes()||HTMLArea.needsClosingTag(root)));
html+=(HTMLArea.is_ie&&HTMLArea.isBlockElement(root)?("\n"+_256):"")+"<"+root.tagName.toLowerCase();
var _260=root.attributes;
for(i=0;i<_260.length;++i){
var a=_260.item(i);
if(!a.specified&&!(root.tagName.toLowerCase().match(/input|option/)&&a.nodeName=="value")){
continue;
}
var name=a.nodeName.toLowerCase();
if(/_moz_editor_bogus_node/.test(name)){
html="";
break;
}
if(/(_moz)|(contenteditable)|(_msh)/.test(name)){
continue;
}
var _263;
if(name!="style"){
if(typeof root[a.nodeName]!="undefined"&&name!="href"&&name!="src"&&!(/^on/.test(name))){
_263=root[a.nodeName];
}else{
_263=a.nodeValue;
if(HTMLArea.is_ie&&(name=="href"||name=="src")){
_263=_255.stripBaseURL(_263);
}
if(_255.config.only7BitPrintablesInURLs&&(name=="href"||name=="src")){
_263=_263.replace(/([^!-~]+)/g,function(_264){
return escape(_264);
});
}
}
}else{
_263=root.style.cssText;
}
if(/^(_moz)?$/.test(_263)){
continue;
}
html+=" "+name+"=\""+HTMLArea.htmlEncode(_263)+"\"";
}
if(html!==""){
if(_258&&_25a=="p"){
html+=">&nbsp;</p>";
}else{
if(_258){
html+=" />";
}else{
html+=">";
}
}
}
}
}
var _265=false;
for(i=root.firstChild;i;i=i.nextSibling){
if(!_265&&i.nodeType==1&&HTMLArea.isBlockElement(i)){
_265=true;
}
html+=HTMLArea.getHTMLWrapper(i,true,_255,_256+"  ");
}
if(_254&&!_258){
html+=(HTMLArea.is_ie&&HTMLArea.isBlockElement(root)&&_265?("\n"+_256):"")+"</"+root.tagName.toLowerCase()+">";
}
break;
case 3:
html=/^script|style$/i.test(root.parentNode.tagName)?root.data:HTMLArea.htmlEncode(root.data);
break;
case 8:
html="<!--"+root.data+"-->";
break;
}
return html;
};
HTMLArea.prototype.stripBaseURL=function(_266){
if(this.config.baseHref===null||!this.config.stripBaseHref){
return _266;
}
var _267=this.config.baseHref.replace(/^(https?:\/\/[^\/]+)(.*)$/,"$1");
var _268=new RegExp(_267);
return _266.replace(_268,"");
};
String.prototype.trim=function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
};
HTMLArea._makeColor=function(v){
if(typeof v!="number"){
return v;
}
var r=v&255;
var g=(v>>8)&255;
var b=(v>>16)&255;
return "rgb("+r+","+g+","+b+")";
};
HTMLArea._colorToRgb=function(v){
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
HTMLArea.prototype._popupDialog=function(url,_272,init){
Dialog(this.popupURL(url),_272,init);
};
HTMLArea.prototype.imgURL=function(file,_275){
if(typeof _275=="undefined"){
return _editor_url+file;
}else{
return _editor_url+"plugins/"+_275+"/img/"+file;
}
};
HTMLArea.prototype.popupURL=function(file){
var url="";
if(file.match(/^plugin:\/\/(.*?)\/(.*)/)){
var _278=RegExp.$1;
var _279=RegExp.$2;
if(!(/\.html$/.test(_279))){
_279+=".html";
}
url=_editor_url+"plugins/"+_278+"/popups/"+_279;
}else{
if(file.match(/^\/.*?/)){
url=file;
}else{
url=_editor_url+this.config.popupURL+file;
}
}
return url;
};
HTMLArea.getElementById=function(tag,id){
var el,i,objs=document.getElementsByTagName(tag);
for(i=objs.length;--i>=0&&(el=objs[i]);){
if(el.id==id){
return el;
}
}
return null;
};
HTMLArea.prototype._toggleBorders=function(){
var _27d=this._doc.getElementsByTagName("TABLE");
if(_27d.length!==0){
if(!this.borders){
name="bordered";
this.borders=true;
}else{
name="";
this.borders=false;
}
for(var i=0;i<_27d.length;i++){
if(this.borders){
if(HTMLArea.is_gecko){
_27d[i].style.display="none";
_27d[i].style.display="table";
}
HTMLArea._addClass(_27d[i],"htmtableborders");
}else{
HTMLArea._removeClass(_27d[i],"htmtableborders");
}
}
}
return true;
};
HTMLArea.addClasses=function(el,_280){
if(el!==null){
var _281=el.className.trim().split(" ");
var ours=_280.split(" ");
for(var x=0;x<ours.length;x++){
var _284=false;
for(var i=0;_284===false&&i<_281.length;i++){
if(_281[i]==ours[x]){
_284=true;
}
}
if(_284===false){
_281[_281.length]=ours[x];
}
}
el.className=_281.join(" ").trim();
}
};
HTMLArea.removeClasses=function(el,_287){
var _288=el.className.trim().split();
var _289=[];
var _28a=_287.trim().split();
for(var i=0;i<_288.length;i++){
var _28c=false;
for(var x=0;x<_28a.length&&!_28c;x++){
if(_288[i]==_28a[x]){
_28c=true;
}
}
if(!_28c){
_289[_289.length]=_288[i];
}
}
return _289.join(" ");
};
HTMLArea.addClass=HTMLArea._addClass;
HTMLArea.removeClass=HTMLArea._removeClass;
HTMLArea._addClasses=HTMLArea.addClasses;
HTMLArea._removeClasses=HTMLArea.removeClasses;
HTMLArea._postback=function(url,data,_290){
var req=null;
if(HTMLArea.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
var _292="";
for(var i in data){
_292+=(_292.length?"&":"")+i+"="+encodeURIComponent(data[i]);
}
function callBack(){
if(req.readyState==4){
if(req.status==200||HTMLArea.isRunLocally&&req.status==0){
if(typeof _290=="function"){
_290(req.responseText,req);
}
}else{
alert("An error has occurred: "+req.statusText);
}
}
}
req.onreadystatechange=callBack;
req.open("POST",url,true);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
req.send(_292);
};
HTMLArea._getback=function(url,_295){
var req=null;
if(HTMLArea.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
function callBack(){
if(req.readyState==4){
if(req.status==200||HTMLArea.isRunLocally&&req.status==0){
_295(req.responseText,req);
}else{
alert("An error has occurred: "+req.statusText);
}
}
}
req.onreadystatechange=callBack;
req.open("GET",url,true);
req.send(null);
};
HTMLArea._geturlcontent=function(url){
var req=null;
if(HTMLArea.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
req.open("GET",url,false);
req.send(null);
if(req.status==200||HTMLArea.isRunLocally&&req.status==0){
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
HTMLArea.arrayContainsArray=function(a1,a2){
var _29f=true;
for(var x=0;x<a2.length;x++){
var _2a1=false;
for(var i=0;i<a1.length;i++){
if(a1[i]==a2[x]){
_2a1=true;
break;
}
}
if(!_2a1){
_29f=false;
break;
}
}
return _29f;
};
HTMLArea.arrayFilter=function(a1,_2a4){
var _2a5=[];
for(var x=0;x<a1.length;x++){
if(_2a4(a1[x])){
_2a5[_2a5.length]=a1[x];
}
}
return _2a5;
};
HTMLArea.uniq_count=0;
HTMLArea.uniq=function(_2a7){
return _2a7+HTMLArea.uniq_count++;
};
HTMLArea._loadlang=function(_2a8){
var url,lang;
if(typeof _editor_lcbackend=="string"){
url=_editor_lcbackend;
url=url.replace(/%lang%/,_editor_lang);
url=url.replace(/%context%/,_2a8);
}else{
if(_2a8!="HTMLArea"){
url=_editor_url+"plugins/"+_2a8+"/lang/"+_editor_lang+".js";
}else{
url=_editor_url+"lang/"+_editor_lang+".js";
}
}
var _2aa=HTMLArea._geturlcontent(url);
if(_2aa!==""){
try{
eval("lang = "+_2aa);
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
HTMLArea._lc=function(_2ab,_2ac,_2ad){
var ret;
if(_editor_lang=="en"){
if(typeof _2ab=="object"&&_2ab.string){
ret=_2ab.string;
}else{
ret=_2ab;
}
}else{
if(typeof HTMLArea._lc_catalog=="undefined"){
HTMLArea._lc_catalog=[];
}
if(typeof _2ac=="undefined"){
_2ac="HTMLArea";
}
if(typeof HTMLArea._lc_catalog[_2ac]=="undefined"){
HTMLArea._lc_catalog[_2ac]=HTMLArea._loadlang(_2ac);
}
var key;
if(typeof _2ab=="object"&&_2ab.key){
key=_2ab.key;
}else{
if(typeof _2ab=="object"&&_2ab.string){
key=_2ab.string;
}else{
key=_2ab;
}
}
if(typeof HTMLArea._lc_catalog[_2ac][key]=="undefined"){
if(_2ac=="HTMLArea"){
if(typeof _2ab=="object"&&_2ab.string){
ret=_2ab.string;
}else{
ret=_2ab;
}
}else{
return HTMLArea._lc(_2ab,"HTMLArea",_2ad);
}
}else{
ret=HTMLArea._lc_catalog[_2ac][key];
}
}
if(typeof _2ab=="object"&&_2ab.replace){
_2ad=_2ab.replace;
}
if(typeof _2ad!="undefined"){
for(var i in _2ad){
ret=ret.replace("$"+i,_2ad[i]);
}
}
return ret;
};
HTMLArea.hasDisplayedChildren=function(el){
var _2b2=el.childNodes;
for(var i=0;i<_2b2.length;i++){
if(_2b2[i].tagName){
if(_2b2[i].style.display!="none"){
return true;
}
}
}
return false;
};
HTMLArea._loadback=function(U,C,O,B){
var T=HTMLArea.is_ie?"onreadystatechange":"onload";
var S=document.createElement("script");
S.type="text/javascript";
S.src=U;
if(C){
S[T]=function(){
if(HTMLArea.is_ie&&!(/loaded|complete/.test(window.event.srcElement.readyState))){
return;
}
C.call(O?O:this,B);
S[T]=null;
};
}
document.getElementsByTagName("head")[0].appendChild(S);
};
HTMLArea.collectionToArray=function(_2ba){
var _2bb=[];
for(var i=0;i<_2ba.length;i++){
_2bb.push(_2ba.item(i));
}
return _2bb;
};
if(!Array.prototype.append){
Array.prototype.append=function(a){
for(var i=0;i<a.length;i++){
this.push(a[i]);
}
return this;
};
}
HTMLArea.makeEditors=function(_2bf,_2c0,_2c1){
if(typeof _2c0=="function"){
_2c0=_2c0();
}
var _2c2={};
for(var x=0;x<_2bf.length;x++){
var _2c4=new HTMLArea(_2bf[x],HTMLArea.cloneObject(_2c0));
_2c4.registerPlugins(_2c1);
_2c2[_2bf[x]]=_2c4;
}
return _2c2;
};
HTMLArea.startEditors=function(_2c5){
for(var i in _2c5){
if(_2c5[i].generate){
_2c5[i].generate();
}
}
};
HTMLArea.prototype.registerPlugins=function(_2c7){
if(_2c7){
for(var i=0;i<_2c7.length;i++){
this.setLoadingMessage("Register plugin $plugin","HTMLArea",{"plugin":_2c7[i]});
this.registerPlugin(eval(_2c7[i]));
}
}
};
HTMLArea.base64_encode=function(_2c9){
var _2ca="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _2cb="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
do{
chr1=_2c9.charCodeAt(i++);
chr2=_2c9.charCodeAt(i++);
chr3=_2c9.charCodeAt(i++);
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
_2cb=_2cb+_2ca.charAt(enc1)+_2ca.charAt(enc2)+_2ca.charAt(enc3)+_2ca.charAt(enc4);
}while(i<_2c9.length);
return _2cb;
};
HTMLArea.base64_decode=function(_2cf){
var _2d0="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _2d1="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
_2cf=_2cf.replace(/[^A-Za-z0-9\+\/\=]/g,"");
do{
enc1=_2d0.indexOf(_2cf.charAt(i++));
enc2=_2d0.indexOf(_2cf.charAt(i++));
enc3=_2d0.indexOf(_2cf.charAt(i++));
enc4=_2d0.indexOf(_2cf.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
_2d1=_2d1+String.fromCharCode(chr1);
if(enc3!=64){
_2d1=_2d1+String.fromCharCode(chr2);
}
if(enc4!=64){
_2d1=_2d1+String.fromCharCode(chr3);
}
}while(i<_2cf.length);
return _2d1;
};
HTMLArea.removeFromParent=function(el){
if(!el.parentNode){
return;
}
var pN=el.parentNode;
pN.removeChild(el);
return el;
};
HTMLArea.hasParentNode=function(el){
if(el.parentNode){
if(el.parentNode.nodeType==11){
return false;
}
return true;
}
return false;
};
if(HTMLArea.is_ie){
HTMLArea.getOuterHTML=function(_2d8){
return _2d8.outerHTML;
};
}else{
HTMLArea.getOuterHTML=function(_2d9){
return (new XMLSerializer()).serializeToString(_2d9);
};
}
HTMLArea.findPosX=function(obj){
var _2db=0;
if(obj.offsetParent){
while(obj.offsetParent){
_2db+=obj.offsetLeft;
obj=obj.offsetParent;
}
}else{
if(obj.x){
_2db+=obj.x;
}
}
return _2db;
};
HTMLArea.findPosY=function(obj){
var _2dd=0;
if(obj.offsetParent){
while(obj.offsetParent){
_2dd+=obj.offsetTop;
obj=obj.offsetParent;
}
}else{
if(obj.y){
_2dd+=obj.y;
}
}
return _2dd;
};
HTMLArea.prototype.setLoadingMessage=function(_2de,_2df,_2e0){
if(!this.config.showLoading||!document.getElementById("loading_sub_"+this._textArea.name)){
return;
}
var elt=document.getElementById("loading_sub_"+this._textArea.name);
elt.innerHTML=HTMLArea._lc(_2de,_2df,_2e0);
};
HTMLArea.prototype.removeLoadingMessage=function(){
if(!this.config.showLoading||!document.getElementById("loading_"+this._textArea.name)){
return;
}
document.body.removeChild(document.getElementById("loading_"+this._textArea.name));
};
HTMLArea.toFree=[];
HTMLArea.freeLater=function(obj,prop){
HTMLArea.toFree.push({o:obj,p:prop});
};
HTMLArea.free=function(obj,prop){
if(obj&&!prop){
for(var p in obj){
HTMLArea.free(obj,p);
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
HTMLArea.collectGarbageForIE=function(){
HTMLArea.flushEvents();
for(var x=0;x<HTMLArea.toFree.length;x++){
if(!HTMLArea.toFree[x].o){
alert("What is "+x+" "+HTMLArea.toFree[x].o);
}
HTMLArea.free(HTMLArea.toFree[x].o,HTMLArea.toFree[x].p);
HTMLArea.toFree[x].o=null;
}
};
HTMLArea.init();
HTMLArea.addDom0Event(window,"unload",HTMLArea.collectGarbageForIE);

