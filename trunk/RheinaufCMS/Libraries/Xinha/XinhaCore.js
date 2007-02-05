Xinha.version={"Release":"Trunk","Head":"$HeadURL: http://svn.xinha.python-hosting.com/trunk/XinhaCore.js $".replace(/^[^:]*: (.*) \$$/,"$1"),"Date":"$LastChangedDate: 2007-02-02 14:11:56 +0100 (Fr, 02 Feb 2007) $".replace(/^[^:]*: ([0-9-]*) ([0-9:]*) ([+0-9]*) \((.*)\) \$/,"$4 $2 $3"),"Revision":"$LastChangedRevision: 711 $".replace(/^[^:]*: (.*) \$$/,"$1"),"RevisionBy":"$LastChangedBy: ray $".replace(/^[^:]*: (.*) \$$/,"$1")};
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
var __xinhas=[];
Xinha.agt=navigator.userAgent.toLowerCase();
Xinha.is_ie=((Xinha.agt.indexOf("msie")!=-1)&&(Xinha.agt.indexOf("opera")==-1));
Xinha.is_opera=(Xinha.agt.indexOf("opera")!=-1);
Xinha.is_mac=(Xinha.agt.indexOf("mac")!=-1);
Xinha.is_mac_ie=(Xinha.is_ie&&Xinha.is_mac);
Xinha.is_win_ie=(Xinha.is_ie&&!Xinha.is_mac);
Xinha.is_gecko=(navigator.product=="Gecko");
Xinha.isRunLocally=document.URL.toLowerCase().search(/^file:/)!=-1;
if(Xinha.isRunLocally){
alert("Xinha *must* be installed on a web server. Locally opened files (those that use the \"file://\" protocol) cannot properly function. Xinha will try to initialize but may not be correctly loaded.");
}
function Xinha(_1,_2){
if(!_1){
throw ("Tried to create Xinha without textarea specified.");
}
if(Xinha.checkSupportedBrowser()){
if(typeof _2=="undefined"){
this.config=new Xinha.Config();
}else{
this.config=_2;
}
this._htmlArea=null;
if(typeof _1!="object"){
_1=Xinha.getElementById("textarea",_1);
}
this._textArea=_1;
this._textArea.spellcheck=false;
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
_3.style.left=Xinha.findPosX(_1)+"px";
_3.style.top=(Xinha.findPosY(_1)+parseInt(this._initial_ta_size.h,10)/2)+"px";
var _4=document.createElement("div");
_4.className="loading_main";
_4.id="loading_main_"+_1.name;
_4.appendChild(document.createTextNode(Xinha._lc("Loading in progress. Please wait !")));
var _5=document.createElement("div");
_5.className="loading_sub";
_5.id="loading_sub_"+_1.name;
_5.appendChild(document.createTextNode(Xinha._lc("Constructing main object")));
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
this.__htmlarea_id_num=__xinhas.length;
__xinhas[this.__htmlarea_id_num]=this;
this._notifyListeners={};
var _6={right:{on:true,container:document.createElement("td"),panels:[]},left:{on:true,container:document.createElement("td"),panels:[]},top:{on:true,container:document.createElement("td"),panels:[]},bottom:{on:true,container:document.createElement("td"),panels:[]}};
for(var i in _6){
if(!_6[i].container){
continue;
}
_6[i].div=_6[i].container;
_6[i].container.className="panels "+i;
Xinha.freeLater(_6[i],"container");
Xinha.freeLater(_6[i],"div");
}
this._panels=_6;
Xinha.freeLater(this,"_textArea");
}
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
Xinha.RE_email=/[_a-zA-Z\d\-\.]{3,}@[_a-zA-Z\d\-]{2,}(\.[_a-zA-Z\d\-]{2,})+/i;
Xinha.RE_url=/(https?:\/\/)?(([a-z0-9_]+:[a-z0-9_]+@)?[a-z0-9_-]{2,}(\.[a-z0-9_-]{2,}){2,}(:[0-9]+)?(\/\S+)*)/i;
Xinha.Config=function(){
var _8=this;
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
this.charSet=Xinha.is_gecko?document.characterSet:document.charset;
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
this.toolbar=[["popupeditor"],["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],["separator","forecolor","hilitecolor","textindicator"],["separator","subscript","superscript"],["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],["separator","insertorderedlist","insertunorderedlist","outdent","indent"],["separator","inserthorizontalrule","createlink","insertimage","inserttable"],["linebreak","separator","undo","redo","selectall","print"],(Xinha.is_gecko?[]:["cut","copy","paste","overwrite","saveas"]),["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright","righttoleft"],["separator","htmlmode","showhelp","about"]];
this.fontname={"&mdash; font &mdash;":"","Arial":"arial,helvetica,sans-serif","Courier New":"courier new,courier,monospace","Georgia":"georgia,times new roman,times,serif","Tahoma":"tahoma,arial,helvetica,sans-serif","Times New Roman":"times new roman,times,serif","Verdana":"verdana,arial,helvetica,sans-serif","impact":"impact","WingDings":"wingdings"};
this.fontsize={"&mdash; size &mdash;":"","1 (8 pt)":"1","2 (10 pt)":"2","3 (12 pt)":"3","4 (14 pt)":"4","5 (18 pt)":"5","6 (24 pt)":"6","7 (36 pt)":"7"};
this.formatblock={"&mdash; format &mdash;":"","Heading 1":"h1","Heading 2":"h2","Heading 3":"h3","Heading 4":"h4","Heading 5":"h5","Heading 6":"h6","Normal":"p","Address":"address","Formatted":"pre"};
this.customSelects={};
function cut_copy_paste(e,_a,_b){
e.execCommand(_a);
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
Xinha.Config.prototype.registerButton=function(id,_36,_37,_38,_39,_3a){
var _3b;
if(typeof id=="string"){
_3b=id;
}else{
if(typeof id=="object"){
_3b=id.id;
}else{
alert("ERROR [Xinha.Config::registerButton]:\ninvalid arguments");
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
Xinha.prototype.registerPanel=function(_3c,_3d){
if(!_3c){
_3c="right";
}
this.setLoadingMessage("Register panel "+_3c);
var _3e=this.addPanel(_3c);
if(_3d){
_3d.drawPanelIn(_3e);
}
};
Xinha.Config.prototype.registerDropdown=function(_3f){
this.customSelects[_3f.id]=_3f;
};
Xinha.Config.prototype.hideSomeButtons=function(_40){
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
Xinha.Config.prototype.addToolbarElement=function(id,_47,_48){
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
Xinha.Config.prototype.removeToolbarElement=Xinha.Config.prototype.hideSomeButtons;
Xinha.replaceAll=function(_52){
var tas=document.getElementsByTagName("textarea");
for(var i=tas.length;i>0;(new Xinha(tas[--i],_52)).generate()){
}
};
Xinha.replace=function(id,_56){
var ta=Xinha.getElementById("textarea",id);
return ta?(new Xinha(ta,_56)).generate():null;
};
Xinha.prototype._createToolbar=function(){
this.setLoadingMessage("Create Toolbar");
var _58=this;
var _59=document.createElement("div");
this._toolBar=this._toolbar=_59;
_59.className="toolbar";
_59.unselectable="1";
Xinha.freeLater(this,"_toolBar");
Xinha.freeLater(this,"_toolbar");
var _5a=null;
var _5b={};
this._toolbarObjects=_5b;
this._createToolbar1(_58,_59,_5b);
this._htmlArea.appendChild(_59);
return _59;
};
Xinha.prototype._setConfig=function(_5c){
this.config=_5c;
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
Xinha.prototype._createToolbar1=function(_5e,_5f,_60){
var _61;
if(_5e.config.flowToolbars){
_5f.appendChild(Xinha._createToolbarBreakingElement());
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
if(Xinha.is_ie){
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
Xinha._removeClass(el,"buttonDisabled");
el.disabled=false;
}else{
Xinha._addClass(el,"buttonDisabled");
el.disabled=true;
}
break;
case "active":
if(_65){
Xinha._addClass(el,"buttonPressed");
}else{
Xinha._removeClass(el,"buttonPressed");
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
Xinha.freeLater(obj);
_60[txt]=obj;
for(var i in _69){
if(typeof (_69[i])!="string"){
continue;
}
var op=document.createElement("option");
op.innerHTML=Xinha._lc(i);
op.value=_69[i];
el.appendChild(op);
}
Xinha._addEvent(el,"change",function(){
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
el.title=Xinha._lc("Current style");
obj={name:txt,element:el,enabled:true,active:false,text:false,cmd:"textindicator",state:setButtonStatus};
Xinha.freeLater(obj);
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
Xinha.freeLater(el);
Xinha.freeLater(obj);
_60[txt]=obj;
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
if(obj.enabled){
Xinha._removeClass(el,"buttonActive");
if(Xinha.is_gecko){
_5e.activateEditor();
}
obj.cmd(_5e,obj.name,obj);
Xinha._stopEvent(Xinha.is_ie?window.event:ev);
}
});
var _78=Xinha.makeBtnImg(btn[1]);
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
_82=Xinha._lc(_82);
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
_5f.appendChild(Xinha._createToolbarBreakingElement());
}
return _5f;
};
var use_clone_img=false;
Xinha.makeBtnImg=function(_84,doc){
if(!doc){
doc=document;
}
if(!doc._xinhaImgCache){
doc._xinhaImgCache={};
Xinha.freeLater(doc._xinhaImgCache);
}
var _86=null;
if(Xinha.is_ie&&((!doc.compatMode)||(doc.compatMode&&doc.compatMode=="BackCompat"))){
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
if(doc._xinhaImgCache[_84]){
img=doc._xinhaImgCache[_84].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84;
img.style.width="18px";
img.style.height="18px";
if(use_clone_img){
doc._xinhaImgCache[_84]=img.cloneNode();
}
}
}else{
if(doc._xinhaImgCache[_84[0]]){
img=doc._xinhaImgCache[_84[0]].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84[0];
img.style.position="relative";
if(use_clone_img){
doc._xinhaImgCache[_84[0]]=img.cloneNode();
}
}
img.style.top=_84[2]?("-"+(18*(_84[2]+1))+"px"):"-18px";
img.style.left=_84[1]?("-"+(18*(_84[1]+1))+"px"):"-18px";
}
_86.appendChild(img);
return _86;
};
Xinha.prototype._createStatusBar=function(){
this.setLoadingMessage("Create StatusBar");
var _88=document.createElement("div");
_88.className="statusBar";
this._statusBar=_88;
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
_88.style.display="none";
}
return _88;
};
Xinha.prototype.generate=function(){
var i;
var _8b=this;
if(Xinha.is_ie){
if(typeof InternetExplorer=="undefined"){
Xinha.loadPlugin("InternetExplorer",function(){
_8b.generate();
},_editor_url+"modules/InternetExplorer/InternetExplorer.js");
return false;
}
_8b._browserSpecificPlugin=_8b.registerPlugin("InternetExplorer");
}else{
if(typeof Gecko=="undefined"){
Xinha.loadPlugin("Gecko",function(){
_8b.generate();
},_editor_url+"modules/Gecko/Gecko.js");
return false;
}
_8b._browserSpecificPlugin=_8b.registerPlugin("Gecko");
}
this.setLoadingMessage("Generate Xinha object");
if(typeof Dialog=="undefined"){
Xinha._loadback(_editor_url+"modules/Dialogs/dialog.js",this.generate,this);
return false;
}
if(typeof Xinha.Dialog=="undefined"){
Xinha._loadback(_editor_url+"modules/Dialogs/inline-dialog.js",this.generate,this);
return false;
}
var _8c=_8b.config.toolbar;
for(i=_8c.length;--i>=0;){
for(var j=_8c[i].length;--j>=0;){
switch(_8c[i][j]){
case "popupeditor":
if(typeof FullScreen=="undefined"){
Xinha.loadPlugin("FullScreen",function(){
_8b.generate();
},_editor_url+"modules/FullScreen/full-screen.js");
return false;
}
_8b.registerPlugin("FullScreen");
break;
case "insertimage":
if(typeof InsertImage=="undefined"&&typeof Xinha.prototype._insertImage=="undefined"){
Xinha.loadPlugin("InsertImage",function(){
_8b.generate();
},_editor_url+"modules/InsertImage/insert_image.js");
return false;
}else{
if(typeof InsertImage!="undefined"){
_8b.registerPlugin("InsertImage");
}
}
break;
case "createlink":
if(typeof CreateLink=="undefined"&&typeof Xinha.prototype._createLink=="undefined"&&typeof Linker=="undefined"){
Xinha.loadPlugin("CreateLink",function(){
_8b.generate();
},_editor_url+"modules/CreateLink/link.js");
return false;
}else{
if(typeof CreateLink!="undefined"){
_8b.registerPlugin("CreateLink");
}
}
break;
case "inserttable":
if(typeof InsertTable=="undefined"&&typeof Xinha.prototype._insertTable=="undefined"){
Xinha.loadPlugin("InsertTable",function(){
_8b.generate();
},_editor_url+"modules/InsertTable/insert_table.js");
return false;
}else{
if(typeof InsertTable!="undefined"){
_8b.registerPlugin("InsertTable");
}
}
break;
case "hilitecolor":
case "forecolor":
if(typeof ColorPicker=="undefined"){
Xinha.loadPlugin("ColorPicker",function(){
_8b.generate();
},_editor_url+"modules/ColorPicker/ColorPicker.js");
return false;
}else{
if(typeof ColorPicker!="undefined"){
_8b.registerPlugin("ColorPicker");
}
}
break;
}
}
}
if(Xinha.is_gecko&&(_8b.config.mozParaHandler=="best"||_8b.config.mozParaHandler=="dirty")){
switch(this.config.mozParaHandler){
case "dirty":
var _8e=_editor_url+"modules/Gecko/paraHandlerDirty.js";
break;
default:
var _8e=_editor_url+"modules/Gecko/paraHandlerBest.js";
break;
}
if(typeof EnterParagraphs=="undefined"){
Xinha.loadPlugin("EnterParagraphs",function(){
_8b.generate();
},_8e);
return false;
}
_8b.registerPlugin("EnterParagraphs");
}
switch(this.config.getHtmlMethod){
case "TransformInnerHTML":
var _8f=_editor_url+"modules/GetHtml/TransformInnerHTML.js";
break;
default:
var _8f=_editor_url+"modules/GetHtml/DOMwalk.js";
break;
}
if(typeof GetHtmlImplementation=="undefined"){
Xinha.loadPlugin("GetHtmlImplementation",function(){
_8b.generate();
},_8f);
return false;
}else{
_8b.registerPlugin("GetHtmlImplementation");
}
if(_editor_skin!==""){
var _90=false;
var _91=document.getElementsByTagName("head")[0];
var _92=document.getElementsByTagName("link");
for(i=0;i<_92.length;i++){
if((_92[i].rel=="stylesheet")&&(_92[i].href==_editor_url+"skins/"+_editor_skin+"/skin.css")){
_90=true;
}
}
if(!_90){
var _93=document.createElement("link");
_93.type="text/css";
_93.href=_editor_url+"skins/"+_editor_skin+"/skin.css";
_93.rel="stylesheet";
_91.appendChild(_93);
}
}
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
var _95=this._framework.table;
this._htmlArea=_95;
Xinha.freeLater(this,"_htmlArea");
_95.className="htmlarea";
this._framework.tb_cell.appendChild(this._createToolbar());
var _96=document.createElement("iframe");
_96.src=_editor_url+_8b.config.URIs.blank;
this._framework.ed_cell.appendChild(_96);
this._iframe=_96;
this._iframe.className="xinha_iframe";
Xinha.freeLater(this,"_iframe");
var _97=this._createStatusBar();
this._framework.sb_cell.appendChild(_97);
var _98=this._textArea;
_98.parentNode.insertBefore(_95,_98);
_98.className="xinha_textarea";
Xinha.removeFromParent(_98);
this._framework.ed_cell.appendChild(_98);
if(_98.form){
Xinha.prependDom0Event(this._textArea.form,"submit",function(){
_8b._textArea.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
var _99=_98.value;
Xinha.prependDom0Event(this._textArea.form,"reset",function(){
_8b.setHTML(_8b.inwardHtml(_99));
_8b.updateToolbar();
return true;
});
}
Xinha.prependDom0Event(window,"unload",function(){
_98.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
_98.style.display="none";
_8b.initSize();
_8b._iframeLoadDone=false;
Xinha._addEvent(this._iframe,"load",function(e){
if(!_8b._iframeLoadDone){
_8b._iframeLoadDone=true;
_8b.initIframe();
}
return true;
});
};
Xinha.prototype.initSize=function(){
this.setLoadingMessage("Init editor size");
var _9b=this;
var _9c=null;
var _9d=null;
switch(this.config.width){
case "auto":
_9c=this._initial_ta_size.w;
break;
case "toolbar":
_9c=this._toolBar.offsetWidth+"px";
break;
default:
_9c=/[^0-9]/.test(this.config.width)?this.config.width:this.config.width+"px";
break;
}
switch(this.config.height){
case "auto":
_9d=this._initial_ta_size.h;
break;
default:
_9d=/[^0-9]/.test(this.config.height)?this.config.height:this.config.height+"px";
break;
}
this.sizeEditor(_9c,_9d,this.config.sizeIncludesBars,this.config.sizeIncludesPanels);
this.notifyOn("panel_change",function(){
_9b.sizeEditor();
});
};
Xinha.prototype.sizeEditor=function(_9e,_9f,_a0,_a1){
this._iframe.style.height="100%";
this._textArea.style.height="100%";
this._iframe.style.width="";
this._textArea.style.width="";
if(_a0!==null){
this._htmlArea.sizeIncludesToolbars=_a0;
}
if(_a1!==null){
this._htmlArea.sizeIncludesPanels=_a1;
}
if(_9e){
this._htmlArea.style.width=_9e;
if(!this._htmlArea.sizeIncludesPanels){
var _a2=this._panels.right;
if(_a2.on&&_a2.panels.length&&Xinha.hasDisplayedChildren(_a2.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.right,10))+"px";
}
var _a3=this._panels.left;
if(_a3.on&&_a3.panels.length&&Xinha.hasDisplayedChildren(_a3.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.left,10))+"px";
}
}
}
if(_9f){
this._htmlArea.style.height=_9f;
if(!this._htmlArea.sizeIncludesToolbars){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+this._toolbar.offsetHeight+this._statusBar.offsetHeight)+"px";
}
if(!this._htmlArea.sizeIncludesPanels){
var _a4=this._panels.top;
if(_a4.on&&_a4.panels.length&&Xinha.hasDisplayedChildren(_a4.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.top,10))+"px";
}
var _a5=this._panels.bottom;
if(_a5.on&&_a5.panels.length&&Xinha.hasDisplayedChildren(_a5.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.bottom,10))+"px";
}
}
}
_9e=this._htmlArea.offsetWidth;
_9f=this._htmlArea.offsetHeight;
var _a6=this._panels;
var _a7=this;
var _a8=1;
function panel_is_alive(pan){
if(_a6[pan].on&&_a6[pan].panels.length&&Xinha.hasDisplayedChildren(_a6[pan].container)){
_a6[pan].container.style.display="";
return true;
}else{
_a6[pan].container.style.display="none";
return false;
}
}
if(panel_is_alive("left")){
_a8+=1;
}
if(panel_is_alive("right")){
_a8+=1;
}
this._framework.tb_cell.colSpan=_a8;
this._framework.tp_cell.colSpan=_a8;
this._framework.bp_cell.colSpan=_a8;
this._framework.sb_cell.colSpan=_a8;
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
var _aa=_9f-this._toolBar.offsetHeight-this._statusBar.offsetHeight;
if(panel_is_alive("top")){
_aa-=parseInt(this.config.panel_dimensions.top,10);
}
if(panel_is_alive("bottom")){
_aa-=parseInt(this.config.panel_dimensions.bottom,10);
}
this._iframe.style.height=_aa+"px";
var _ab=_9e;
if(panel_is_alive("left")){
_ab-=parseInt(this.config.panel_dimensions.left,10);
}
if(panel_is_alive("right")){
_ab-=parseInt(this.config.panel_dimensions.right,10);
}
this._iframe.style.width=_ab+"px";
this._textArea.style.height=this._iframe.style.height;
this._textArea.style.width=this._iframe.style.width;
this.notifyOf("resize",{width:this._htmlArea.offsetWidth,height:this._htmlArea.offsetHeight});
};
Xinha.prototype.addPanel=function(_ac){
var div=document.createElement("div");
div.side=_ac;
if(_ac=="left"||_ac=="right"){
div.style.width=this.config.panel_dimensions[_ac];
if(this._iframe){
div.style.height=this._iframe.style.height;
}
}
Xinha.addClasses(div,"panel");
this._panels[_ac].panels.push(div);
this._panels[_ac].div.appendChild(div);
this.notifyOf("panel_change",{"action":"add","panel":div});
return div;
};
Xinha.prototype.removePanel=function(_ae){
this._panels[_ae.side].div.removeChild(_ae);
var _af=[];
for(var i=0;i<this._panels[_ae.side].panels.length;i++){
if(this._panels[_ae.side].panels[i]!=_ae){
_af.push(this._panels[_ae.side].panels[i]);
}
}
this._panels[_ae.side].panels=_af;
this.notifyOf("panel_change",{"action":"remove","panel":_ae});
};
Xinha.prototype.hidePanel=function(_b1){
if(_b1&&_b1.style.display!="none"){
try{
var pos=this.scrollPos(this._iframe.contentWindow);
}
catch(e){
}
_b1.style.display="none";
this.notifyOf("panel_change",{"action":"hide","panel":_b1});
try{
this._iframe.contentWindow.scrollTo(pos.x,pos.y);
}
catch(e){
}
}
};
Xinha.prototype.showPanel=function(_b3){
if(_b3&&_b3.style.display=="none"){
try{
var pos=this.scrollPos(this._iframe.contentWindow);
}
catch(e){
}
_b3.style.display="";
this.notifyOf("panel_change",{"action":"show","panel":_b3});
try{
this._iframe.contentWindow.scrollTo(pos.x,pos.y);
}
catch(e){
}
}
};
Xinha.prototype.hidePanels=function(_b5){
if(typeof _b5=="undefined"){
_b5=["left","right","top","bottom"];
}
var _b6=[];
for(var i=0;i<_b5.length;i++){
if(this._panels[_b5[i]].on){
_b6.push(_b5[i]);
this._panels[_b5[i]].on=false;
}
}
this.notifyOf("panel_change",{"action":"multi_hide","sides":_b5});
};
Xinha.prototype.showPanels=function(_b8){
if(typeof _b8=="undefined"){
_b8=["left","right","top","bottom"];
}
var _b9=[];
for(var i=0;i<_b8.length;i++){
if(!this._panels[_b8[i]].on){
_b9.push(_b8[i]);
this._panels[_b8[i]].on=true;
}
}
this.notifyOf("panel_change",{"action":"multi_show","sides":_b8});
};
Xinha.objectProperties=function(obj){
var _bc=[];
for(var x in obj){
_bc[_bc.length]=x;
}
return _bc;
};
Xinha.prototype.editorIsActivated=function(){
try{
return Xinha.is_gecko?this._doc.designMode=="on":this._doc.body.contentEditable;
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
if(Xinha.is_gecko&&this._doc.designMode!="on"){
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
var _be=this;
this.enableToolbar();
};
Xinha.prototype.deactivateEditor=function(){
this.disableToolbar();
if(Xinha.is_gecko&&this._doc.designMode!="off"){
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
this.setLoadingMessage("Init IFrame");
this.disableToolbar();
var doc=null;
var _c0=this;
try{
if(_c0._iframe.contentDocument){
this._doc=_c0._iframe.contentDocument;
}else{
this._doc=_c0._iframe.contentWindow.document;
}
doc=this._doc;
if(!doc){
if(Xinha.is_gecko){
setTimeout(function(){
_c0.initIframe();
},50);
return false;
}else{
alert("ERROR: IFRAME can't be initialized.");
}
}
}
catch(ex){
setTimeout(function(){
_c0.initIframe();
},50);
}
Xinha.freeLater(this,"_doc");
doc.open("text/html","replace");
var _c1="";
if(!_c0.config.fullPage){
_c1="<html>\n";
_c1+="<head>\n";
_c1+="<meta http-equiv=\"Content-Type\" content=\"text/html; charset="+_c0.config.charSet+"\">\n";
if(typeof _c0.config.baseHref!="undefined"&&_c0.config.baseHref!==null){
_c1+="<base href=\""+_c0.config.baseHref+"\"/>\n";
}
_c1+=Xinha.addCoreCSS();
if(_c0.config.pageStyle){
_c1+="<style type=\"text/css\">\n"+_c0.config.pageStyle+"\n</style>";
}
if(typeof _c0.config.pageStyleSheets!=="undefined"){
for(var i=0;i<_c0.config.pageStyleSheets.length;i++){
if(_c0.config.pageStyleSheets[i].length>0){
_c1+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_c0.config.pageStyleSheets[i]+"\">";
}
}
}
_c1+="</head>\n";
_c1+="<body>\n";
_c1+=_c0.inwardHtml(_c0._textArea.value);
_c1+="</body>\n";
_c1+="</html>";
}else{
_c1=_c0.inwardHtml(_c0._textArea.value);
if(_c1.match(Xinha.RE_doctype)){
_c0.setDoctype(RegExp.$1);
_c1=_c1.replace(Xinha.RE_doctype,"");
}
var _c3=_c1.match(/<link\s+[\s\S]*?["']\s*\/?>/gi);
_c1=_c1.replace(/<link\s+[\s\S]*?["']\s*\/?>\s*/gi,"");
_c3?_c1=_c1.replace(/<\/head>/i,_c3.join("\n")+"\n</head>"):null;
}
doc.write(_c1);
doc.close();
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
Xinha.prototype.setMode=function(_c6){
var _c7;
if(typeof _c6=="undefined"){
_c6=this._editMode=="textmode"?"wysiwyg":"textmode";
}
switch(_c6){
case "textmode":
this.setCC("iframe");
_c7=this.outwardHtml(this.getHTML());
this.setHTML(_c7);
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
_c7=this.inwardHtml(this.getHTML());
this.deactivateEditor();
this.setHTML(_c7);
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
alert("Mode <"+_c6+"> not defined!");
return false;
}
this._editMode=_c6;
for(var i in this.plugins){
var _c9=this.plugins[i].instance;
if(_c9&&typeof _c9.onMode=="function"){
_c9.onMode(_c6);
}
}
};
Xinha.prototype.setFullHTML=function(_ca){
var _cb=RegExp.multiline;
RegExp.multiline=true;
if(_ca.match(Xinha.RE_doctype)){
this.setDoctype(RegExp.$1);
_ca=_ca.replace(Xinha.RE_doctype,"");
}
RegExp.multiline=_cb;
if(!Xinha.is_ie){
if(_ca.match(Xinha.RE_head)){
this._doc.getElementsByTagName("head")[0].innerHTML=RegExp.$1;
}
if(_ca.match(Xinha.RE_body)){
this._doc.getElementsByTagName("body")[0].innerHTML=RegExp.$1;
}
}else{
var _cc=this.editorIsActivated();
if(_cc){
this.deactivateEditor();
}
var _cd=/<html>((.|\n)*?)<\/html>/i;
_ca=_ca.replace(_cd,"$1");
this._doc.open("text/html","replace");
this._doc.write(_ca);
this._doc.close();
if(_cc){
this.activateEditor();
}
this.setEditorEvents();
return true;
}
};
Xinha.prototype.setEditorEvents=function(){
var _ce=this;
var doc=this._doc;
_ce.whenDocReady(function(){
Xinha._addEvents(doc,["mousedown"],function(){
_ce.activateEditor();
return true;
});
Xinha._addEvents(doc,["keydown","keypress","mousedown","mouseup","drag"],function(_d0){
return _ce._editorEvent(Xinha.is_ie?_ce._iframe.contentWindow.event:_d0);
});
for(var i in _ce.plugins){
var _d2=_ce.plugins[i].instance;
Xinha.refreshPlugin(_d2);
}
if(typeof _ce._onGenerate=="function"){
_ce._onGenerate();
}
Xinha.addDom0Event(window,"resize",function(e){
_ce.sizeEditor();
});
_ce.removeLoadingMessage();
});
};
Xinha.prototype.registerPlugin=function(){
var _d4=arguments[0];
if(_d4===null||typeof _d4=="undefined"||(typeof _d4=="string"&&eval("typeof "+_d4)=="undefined")){
return false;
}
var _d5=[];
for(var i=1;i<arguments.length;++i){
_d5.push(arguments[i]);
}
return this.registerPlugin2(_d4,_d5);
};
Xinha.prototype.registerPlugin2=function(_d7,_d8){
if(typeof _d7=="string"){
_d7=eval(_d7);
}
if(typeof _d7=="undefined"){
return false;
}
var obj=new _d7(this,_d8);
if(obj){
var _da={};
var _db=_d7._pluginInfo;
for(var i in _db){
_da[i]=_db[i];
}
_da.instance=obj;
_da.args=_d8;
this.plugins[_d7._pluginInfo.name]=_da;
return obj;
}else{
alert("Can't register plugin "+_d7.toString()+".");
}
};
Xinha.getPluginDir=function(_dd){
return _editor_url+"plugins/"+_dd;
};
Xinha.loadPlugin=function(_de,_df,_e0){
if(eval("typeof "+_de)!="undefined"){
if(_df){
_df(_de);
}
return true;
}
if(!_e0){
var dir=this.getPluginDir(_de);
var _e2=_de.replace(/([a-z])([A-Z])([a-z])/g,function(str,l1,l2,l3){
return l1+"-"+l2.toLowerCase()+l3;
}).toLowerCase()+".js";
_e0=dir+"/"+_e2;
}
Xinha._loadback(_e0,_df?function(){
_df(_de);
}:null);
return false;
};
Xinha._pluginLoadStatus={};
Xinha.loadPlugins=function(_e7,_e8){
var _e9=true;
var _ea=Xinha.cloneObject(_e7);
while(_ea.length){
var p=_ea.pop();
if(typeof Xinha._pluginLoadStatus[p]=="undefined"){
Xinha._pluginLoadStatus[p]="loading";
Xinha.loadPlugin(p,function(_ec){
if(eval("typeof "+_ec)!="undefined"){
Xinha._pluginLoadStatus[_ec]="ready";
}else{
Xinha._pluginLoadStatus[_ec]="failed";
}
});
_e9=false;
}else{
switch(Xinha._pluginLoadStatus[p]){
case "failed":
case "ready":
break;
default:
_e9=false;
break;
}
}
}
if(_e9){
return true;
}
if(_e8){
setTimeout(function(){
if(Xinha.loadPlugins(_e7,_e8)){
_e8();
}
},150);
}
return _e9;
};
Xinha.refreshPlugin=function(_ed){
if(_ed&&typeof _ed.onGenerate=="function"){
_ed.onGenerate();
}
if(_ed&&typeof _ed.onGenerateOnce=="function"){
_ed.onGenerateOnce();
_ed.onGenerateOnce=null;
}
};
Xinha.prototype.firePluginEvent=function(_ee){
var _ef=[];
for(var i=1;i<arguments.length;i++){
_ef[i-1]=arguments[i];
}
for(var i in this.plugins){
var _f1=this.plugins[i].instance;
if(_f1==this._browserSpecificPlugin){
continue;
}
if(_f1&&typeof _f1[_ee]=="function"){
if(_f1[_ee].apply(_f1,_ef)){
return true;
}
}
}
var _f1=this._browserSpecificPlugin;
if(_f1&&typeof _f1[_ee]=="function"){
if(_f1[_ee].apply(_f1,_ef)){
return true;
}
}
return false;
};
Xinha.loadStyle=function(_f2,_f3){
var url=_editor_url||"";
if(typeof _f3!="undefined"){
url+="plugins/"+_f3+"/";
}
url+=_f2;
if(/^\//.test(_f2)){
url=_f2;
}
var _f5=document.getElementsByTagName("head")[0];
var _f6=document.createElement("link");
_f6.rel="stylesheet";
_f6.href=url;
_f5.appendChild(_f6);
};
Xinha.loadStyle(typeof _editor_css=="string"?_editor_css:"Xinha.css");
Xinha.prototype.debugTree=function(){
var ta=document.createElement("textarea");
ta.style.width="100%";
ta.style.height="20em";
ta.value="";
function debug(_f8,str){
for(;--_f8>=0;){
ta.value+=" ";
}
ta.value+=str+"\n";
}
function _dt(_fa,_fb){
var tag=_fa.tagName.toLowerCase(),i;
var ns=Xinha.is_ie?_fa.scopeName:_fa.prefix;
debug(_fb,"- "+tag+" ["+ns+"]");
for(i=_fa.firstChild;i;i=i.nextSibling){
if(i.nodeType==1){
_dt(i,_fb+2);
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
var _100=this;
var _101={empty_tags:0,mso_class:0,mso_style:0,mso_xmlel:0,orig_len:this._doc.body.innerHTML.length,T:(new Date()).getTime()};
var _102={empty_tags:"Empty tags removed: ",mso_class:"MSO class names removed: ",mso_style:"MSO inline style removed: ",mso_xmlel:"MSO XML elements stripped: "};
function showStats(){
var txt="Xinha word cleaner stats: \n\n";
for(var i in _101){
if(_102[i]){
txt+=_102[i]+_101[i]+"\n";
}
}
txt+="\nInitial document length: "+_101.orig_len+"\n";
txt+="Final document length: "+_100._doc.body.innerHTML.length+"\n";
txt+="Clean-up took "+(((new Date()).getTime()-_101.T)/1000)+" seconds";
alert(txt);
}
function clearClass(node){
var newc=node.className.replace(/(^|\s)mso.*?(\s|$)/ig," ");
if(newc!=node.className){
node.className=newc;
if(!(/\S/.test(node.className))){
node.removeAttribute("className");
++_101.mso_class;
}
}
}
function clearStyle(node){
var _108=node.style.cssText.split(/\s*;\s*/);
for(var i=_108.length;--i>=0;){
if((/^mso|^tab-stops/i.test(_108[i]))||(/^margin\s*:\s*0..\s+0..\s+0../i.test(_108[i]))){
++_101.mso_style;
_108.splice(i,1);
}
}
node.style.cssText=_108.join("; ");
}
var _10a=null;
if(Xinha.is_ie){
_10a=function(el){
el.outerHTML=Xinha.htmlEncode(el.innerText);
++_101.mso_xmlel;
};
}else{
_10a=function(el){
var txt=document.createTextNode(Xinha.getInnerText(el));
el.parentNode.insertBefore(txt,el);
Xinha.removeFromParent(el);
++_101.mso_xmlel;
};
}
function checkEmpty(el){
if(/^(span|b|strong|i|em|font|div|p)$/i.test(el.tagName)&&!el.firstChild){
Xinha.removeFromParent(el);
++_101.empty_tags;
}
}
function parseTree(root){
var tag=root.tagName.toLowerCase(),i,next;
if((Xinha.is_ie&&root.scopeName!="HTML")||(!Xinha.is_ie&&(/:/.test(tag)))){
_10a(root);
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
this._doc.body.style.visibility="visible";
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
Xinha.prototype.disableToolbar=function(_116){
if(this._timerToolbar){
clearTimeout(this._timerToolbar);
}
if(typeof _116=="undefined"){
_116=[];
}else{
if(typeof _116!="object"){
_116=[_116];
}
}
for(var i in this._toolbarObjects){
var btn=this._toolbarObjects[i];
if(_116.contains(i)){
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
Array.prototype.contains=function(_119){
var _11a=this;
for(var i=0;i<_11a.length;i++){
if(_119==_11a[i]){
return true;
}
}
return false;
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_11c){
var _11d=this;
for(var i=0;i<_11d.length;i++){
if(_11c==_11d[i]){
return i;
}
}
return null;
};
}
Xinha.prototype.updateToolbar=function(_11f){
var doc=this._doc;
var text=(this._editMode=="textmode");
var _122=null;
if(!text){
_122=this.getAllAncestors();
if(this.config.statusBar&&!_11f){
this._statusBarTree.innerHTML=Xinha._lc("Path")+": ";
for(var i=_122.length;--i>=0;){
var el=_122[i];
if(!el){
continue;
}
var a=document.createElement("a");
a.href="javascript:void(0)";
a.el=el;
a.editor=this;
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
}
}
}
for(var cmd in this._toolbarObjects){
var btn=this._toolbarObjects[cmd];
var _12a=true;
if(typeof (btn.state)!="function"){
continue;
}
if(btn.context&&!text){
_12a=false;
var _12b=btn.context;
var _12c=[];
if(/(.*)\[(.*?)\]/.test(_12b)){
_12b=RegExp.$1;
_12c=RegExp.$2.split(",");
}
_12b=_12b.toLowerCase();
var _12d=(_12b=="*");
for(var k=0;k<_122.length;++k){
if(!_122[k]){
continue;
}
if(_12d||(_122[k].tagName.toLowerCase()==_12b)){
_12a=true;
var _12f=null;
var att=null;
var comp=null;
var _132=null;
for(var ka=0;ka<_12c.length;++ka){
_12f=_12c[ka].match(/(.*)(==|!=|===|!==|>|>=|<|<=)(.*)/);
att=_12f[1];
comp=_12f[2];
_132=_12f[3];
if(!eval(_122[k][att]+comp+_132)){
_12a=false;
break;
}
}
if(_12a){
break;
}
}
}
}
btn.state("enabled",(!text||btn.text)&&_12a);
if(typeof cmd=="function"){
continue;
}
var _134=this.config.customSelects[cmd];
if((!text||btn.text)&&(typeof _134!="undefined")){
_134.refresh(this);
continue;
}
switch(cmd){
case "fontname":
case "fontsize":
if(!text){
try{
var _135=(""+doc.queryCommandValue(cmd)).toLowerCase();
if(!_135){
btn.element.selectedIndex=0;
break;
}
var _136=this.config[cmd];
var _137=0;
for(var j in _136){
if((j.toLowerCase()==_135)||(_136[j].substr(0,_135.length).toLowerCase()==_135)){
btn.element.selectedIndex=_137;
throw "ok";
}
++_137;
}
btn.element.selectedIndex=0;
}
catch(ex){
}
}
break;
case "formatblock":
var _139=[];
for(var _13a in this.config.formatblock){
if(typeof this.config.formatblock[_13a]=="string"){
_139[_139.length]=this.config.formatblock[_13a];
}
}
var _13b=this._getFirstAncestor(this.getSelection(),_139);
if(_13b){
for(var x=0;x<_139.length;x++){
if(_139[x].toLowerCase()==_13b.tagName.toLowerCase()){
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
var _13d=btn.element.style;
_13d.backgroundColor=Xinha._makeColor(doc.queryCommandValue(Xinha.is_ie?"backcolor":"hilitecolor"));
if(/transparent/i.test(_13d.backgroundColor)){
_13d.backgroundColor=Xinha._makeColor(doc.queryCommandValue("backcolor"));
}
_13d.color=Xinha._makeColor(doc.queryCommandValue("forecolor"));
_13d.fontFamily=doc.queryCommandValue("fontname");
_13d.fontWeight=doc.queryCommandState("bold")?"bold":"normal";
_13d.fontStyle=doc.queryCommandState("italic")?"italic":"normal";
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
var _13e=this.getParentElement();
while(_13e&&!Xinha.isBlockElement(_13e)){
_13e=_13e.parentNode;
}
if(_13e){
btn.state("active",(_13e.style.direction==((cmd=="righttoleft")?"rtl":"ltr")));
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
var _13f=this;
this._timerUndo=setTimeout(function(){
_13f._timerUndo=null;
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
for(var _141 in this.plugins){
var _142=this.plugins[_141].instance;
if(_142&&typeof _142.onUpdateToolbar=="function"){
_142.onUpdateToolbar();
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
Xinha.prototype._getFirstAncestor=function(sel,_146){
var prnt=this.activeElement(sel);
if(prnt===null){
try{
prnt=(Xinha.is_ie?this.createRange(sel).parentElement():this.createRange(sel).commonAncestorContainer);
}
catch(ex){
return null;
}
}
if(typeof _146=="string"){
_146=[_146];
}
while(prnt){
if(prnt.nodeType==1){
if(_146===null){
return prnt;
}
if(_146.contains(prnt.tagName.toLowerCase())){
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
Xinha.prototype.surroundHTML=function(_14d,_14e){
var html=this.getSelectedHTML();
this.insertHTML(_14d+html+_14e);
};
Xinha.prototype.hasSelectedText=function(){
return this.getSelectedHTML()!=="";
};
Xinha.prototype._comboSelected=function(el,txt){
this.focusEditor();
var _152=el.options[el.selectedIndex].value;
switch(txt){
case "fontname":
case "fontsize":
this.execCommand(txt,false,_152);
break;
case "formatblock":
if(!_152){
this.updateToolbar();
break;
}
if(!Xinha.is_gecko||_152!=="blockquote"){
_152="<"+_152+">";
}
this.execCommand(txt,false,_152);
break;
default:
var _153=this.config.customSelects[txt];
if(typeof _153!="undefined"){
_153.action(this);
}else{
alert("FIXME: combo box "+txt+" not implemented");
}
break;
}
};
Xinha.prototype._colorSelector=function(_154){
var _155=this;
if(Xinha.is_gecko){
try{
_155._doc.execCommand("useCSS",false,false);
_155._doc.execCommand("styleWithCSS",false,true);
}
catch(ex){
}
}
var btn=_155._toolbarObjects[_154].element;
var _157;
if(_154=="hilitecolor"){
if(Xinha.is_ie){
_154="backcolor";
_157=Xinha._colorToRgb(_155._doc.queryCommandValue("backcolor"));
}else{
_157=Xinha._colorToRgb(_155._doc.queryCommandValue("hilitecolor"));
}
}else{
_157=Xinha._colorToRgb(_155._doc.queryCommandValue("forecolor"));
}
var _158=function(_159){
_155._doc.execCommand(_154,false,_159);
};
if(Xinha.is_ie){
var _15a=_155.createRange(_155.getSelection());
_158=function(_15b){
_15a.select();
_155._doc.execCommand(_154,false,_15b);
};
}
var _15c=new Xinha.colorPicker({cellsize:_155.config.colorPickerCellSize,callback:_158,granularity:_155.config.colorPickerGranularity,websafe:_155.config.colorPickerWebSafe,savecolors:_155.config.colorPickerSaveColors});
_15c.open(_155.config.colorPickerPosition,btn,_157);
};
Xinha.prototype.execCommand=function(_15d,UI,_15f){
var _160=this;
this.focusEditor();
_15d=_15d.toLowerCase();
if(this.firePluginEvent("onExecCommand",_15d,UI,_15f)){
this.updateToolbar();
return false;
}
switch(_15d){
case "htmlmode":
this.setMode();
break;
case "hilitecolor":
case "forecolor":
this._colorSelector(_15d);
break;
case "createlink":
this._createLink();
break;
case "undo":
case "redo":
if(this._customUndo){
this[_15d]();
}else{
this._doc.execCommand(_15d,UI,_15f);
}
break;
case "inserttable":
this._insertTable();
break;
case "insertimage":
this._insertImage();
break;
case "about":
this._popupDialog(_160.config.URIs.about,null,this);
break;
case "showhelp":
this._popupDialog(_160.config.URIs.help,null,this);
break;
case "killword":
this._wordClean();
break;
case "cut":
case "copy":
case "paste":
this._doc.execCommand(_15d,UI,_15f);
if(this.config.killWordOnPaste){
this._wordClean();
}
break;
case "lefttoright":
case "righttoleft":
if(this.config.changeJustifyWithDirection){
this._doc.execCommand((_15d=="righttoleft")?"justifyright":"justifyleft",UI,_15f);
}
var dir=(_15d=="righttoleft")?"rtl":"ltr";
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
_15d.match(/^justify(.*)$/);
var ae=this.activeElement(this.getSelection());
if(ae&&ae.tagName.toLowerCase()=="img"){
ae.align=ae.align==RegExp.$1?"":RegExp.$1;
}else{
this._doc.execCommand(_15d,UI,_15f);
}
break;
default:
try{
this._doc.execCommand(_15d,UI,_15f);
}
catch(ex){
if(this.config.debug){
alert(e+"\n\nby execCommand("+_15d+");");
}
}
break;
}
this.updateToolbar();
return false;
};
Xinha.prototype._editorEvent=function(ev){
var _165=this;
if(typeof _165._textArea["on"+ev.type]=="function"){
_165._textArea["on"+ev.type]();
}
if(this.isKeyEvent(ev)){
if(_165.firePluginEvent("onKeyPress",ev)){
return false;
}
if(this.isShortCut(ev)){
this._shortCuts(ev);
}
}
if(_165._timerToolbar){
clearTimeout(_165._timerToolbar);
}
_165._timerToolbar=setTimeout(function(){
_165.updateToolbar();
_165._timerToolbar=null;
},250);
};
Xinha.prototype._shortCuts=function(ev){
var key=this.getKey(ev).toLowerCase();
var cmd=null;
var _169=null;
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
_169="p";
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
_169="h"+key;
break;
}
if(cmd){
this.execCommand(cmd,false,_169);
Xinha._stopEvent(ev);
}
};
Xinha.prototype.convertNode=function(el,_16b){
var _16c=this._doc.createElement(_16b);
while(el.firstChild){
_16c.appendChild(el.firstChild);
}
return _16c;
};
Xinha.prototype.scrollToElement=function(e){
if(!e){
e=this.getParentElement();
if(!e){
return;
}
}
var _16e=Xinha.getElementTopLeft(e);
this._iframe.contentWindow.scrollTo(_16e.left,_16e.top);
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
var _172=this.plugins[i].instance;
if(_172&&typeof _172.outwardHtml=="function"){
html=_172.outwardHtml(html);
}
}
html=html.replace(/<(\/?)b(\s|>|\/)/ig,"<$1strong$2");
html=html.replace(/<(\/?)i(\s|>|\/)/ig,"<$1em$2");
html=html.replace(/<(\/?)strike(\s|>|\/)/ig,"<$1del$2");
html=html.replace("onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(","onclick=\"window.open(");
var _173=location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/";
html=html.replace(/https?:\/\/null\//g,_173);
html=html.replace(/((href|src|background)=[\'\"])\/+/ig,"$1"+_173);
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
var _177=this.plugins[i].instance;
if(_177&&typeof _177.inwardHtml=="function"){
html=_177.inwardHtml(html);
}
}
html=html.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");
html=html.replace("onclick=\"window.open(","onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(");
html=this.inwardSpecialReplacements(html);
html=html.replace(/(<script[^>]*)(javascript)/gi,"$1freezescript");
var _178=new RegExp("((href|src|background)=['\"])/+","gi");
html=html.replace(_178,"$1"+location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/");
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
var _188=new RegExp(document.location.href.replace(/&/g,"&amp;").replace(Xinha.RE_Specials,"\\$1")+"(#[^'\" ]*)","g");
html=html.replace(_188,"$1");
}
if(typeof this.config.stripBaseHref!="undefined"&&this.config.stripBaseHref){
var _189=null;
if(typeof this.config.baseHref!="undefined"&&this.config.baseHref!==null){
_189=new RegExp("((href|src|background)=\")("+this.config.baseHref.replace(Xinha.RE_Specials,"\\$1")+")","g");
}else{
_189=new RegExp("((href|src|background)=\")("+document.location.href.replace(/^(https?:\/\/[^\/]*)(.*)/,"$1").replace(Xinha.RE_Specials,"\\$1")+")","g");
}
html=html.replace(_189,"$1");
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
Xinha.prototype.setDoctype=function(_18c){
this.doctype=_18c;
};
Xinha._object=null;
Xinha.cloneObject=function(obj){
if(!obj){
return null;
}
var _18e={};
if(obj.constructor.toString().match(/\s*function Array\(/)){
_18e=obj.constructor();
}
if(obj.constructor.toString().match(/\s*function Function\(/)){
_18e=obj;
}else{
for(var n in obj){
var node=obj[n];
if(typeof node=="object"){
_18e[n]=Xinha.cloneObject(node);
}else{
_18e[n]=node;
}
}
}
return _18e;
};
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
return Xinha.is_gecko||Xinha.is_ie;
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
Xinha._addEvent=function(el,_194,func){
el.addEventListener(_194,func,true);
Xinha._eventFlushers.push([el,_194,func]);
};
Xinha._removeEvent=function(el,_197,func){
el.removeEventListener(_197,func,true);
};
Xinha._stopEvent=function(ev){
ev.preventDefault();
ev.stopPropagation();
};
}else{
if(document.attachEvent){
Xinha._addEvent=function(el,_19b,func){
el.attachEvent("on"+_19b,func);
Xinha._eventFlushers.push([el,_19b,func]);
};
Xinha._removeEvent=function(el,_19e,func){
el.detachEvent("on"+_19e,func);
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
Xinha._addEvent=function(el,_1a2,func){
alert("_addEvent is not supported");
};
Xinha._removeEvent=function(el,_1a5,func){
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
el["on"+ev]=function(_1b8){
var a=el._xinha_dom0Events[ev];
var _1ba=true;
for(var i=a.length;--i>=0;){
el._xinha_tempEventHandler=a[i];
if(el._xinha_tempEventHandler(_1b8)===false){
el._xinha_tempEventHandler=null;
_1ba=false;
break;
}
el._xinha_tempEventHandler=null;
}
return _1ba;
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
Xinha._removeClass=function(el,_1c2){
if(!(el&&el.className)){
return;
}
var cls=el.className.split(" ");
var ar=[];
for(var i=cls.length;i>0;){
if(cls[--i]!=_1c2){
ar[ar.length]=cls[i];
}
}
el.className=ar.join(" ");
};
Xinha._addClass=function(el,_1c7){
Xinha._removeClass(el,_1c7);
el.className+=" "+_1c7;
};
Xinha._hasClass=function(el,_1c9){
if(!(el&&el.className)){
return false;
}
var cls=el.className.split(" ");
for(var i=cls.length;i>0;){
if(cls[--i]==_1c9){
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
Xinha.prototype.stripBaseURL=function(_1d0){
if(this.config.baseHref===null||!this.config.stripBaseHref){
return _1d0;
}
var _1d1=this.config.baseHref.replace(/^(https?:\/\/[^\/]+)(.*)$/,"$1");
var _1d2=new RegExp(_1d1);
return _1d0.replace(_1d2,"");
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
Xinha.prototype._popupDialog=function(url,_1dc,init){
Dialog(this.popupURL(url),_1dc,init);
};
Xinha.prototype.imgURL=function(file,_1df){
if(typeof _1df=="undefined"){
return _editor_url+file;
}else{
return _editor_url+"plugins/"+_1df+"/img/"+file;
}
};
Xinha.prototype.popupURL=function(file){
var url="";
if(file.match(/^plugin:\/\/(.*?)\/(.*)/)){
var _1e2=RegExp.$1;
var _1e3=RegExp.$2;
if(!(/\.html$/.test(_1e3))){
_1e3+=".html";
}
url=_editor_url+"plugins/"+_1e2+"/popups/"+_1e3;
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
var _1e7=this._doc.getElementsByTagName("TABLE");
if(_1e7.length!==0){
if(!this.borders){
this.borders=true;
}else{
this.borders=false;
}
for(var i=0;i<_1e7.length;i++){
if(this.borders){
Xinha._addClass(_1e7[i],"htmtableborders");
}else{
Xinha._removeClass(_1e7[i],"htmtableborders");
}
}
}
return true;
};
Xinha.addCoreCSS=function(html){
var _1ea="<style title=\"Xinha Internal CSS\" type=\"text/css\">"+".htmtableborders, .htmtableborders td, .htmtableborders th {border : 1px dashed lightgrey ! important;}\n"+"html, body { border: 0px; } \n"+"body { background-color: #ffffff; } \n"+"</style>\n";
if(html&&/<head>/i.test(html)){
return html.replace(/<head>/i,"<head>"+_1ea);
}else{
if(html){
return _1ea+html;
}else{
return _1ea;
}
}
};
Xinha.stripCoreCSS=function(html){
return html.replace(/<style[^>]+title="Xinha Internal CSS"(.|\n)*?<\/style>/i,"");
};
Xinha.addClasses=function(el,_1ed){
if(el!==null){
var _1ee=el.className.trim().split(" ");
var ours=_1ed.split(" ");
for(var x=0;x<ours.length;x++){
var _1f1=false;
for(var i=0;_1f1===false&&i<_1ee.length;i++){
if(_1ee[i]==ours[x]){
_1f1=true;
}
}
if(_1f1===false){
_1ee[_1ee.length]=ours[x];
}
}
el.className=_1ee.join(" ").trim();
}
};
Xinha.removeClasses=function(el,_1f4){
var _1f5=el.className.trim().split();
var _1f6=[];
var _1f7=_1f4.trim().split();
for(var i=0;i<_1f5.length;i++){
var _1f9=false;
for(var x=0;x<_1f7.length&&!_1f9;x++){
if(_1f5[i]==_1f7[x]){
_1f9=true;
}
}
if(!_1f9){
_1f6[_1f6.length]=_1f5[i];
}
}
return _1f6.join(" ");
};
Xinha.addClass=Xinha._addClass;
Xinha.removeClass=Xinha._removeClass;
Xinha._addClasses=Xinha.addClasses;
Xinha._removeClasses=Xinha.removeClasses;
Xinha._postback=function(url,data,_1fd){
var req=null;
req=Xinha.getXMLHTTPRequestObject();
var _1ff="";
if(typeof data=="string"){
_1ff=data;
}else{
if(typeof data=="object"){
for(var i in data){
_1ff+=(_1ff.length?"&":"")+i+"="+encodeURIComponent(data[i]);
}
}
}
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
if(typeof _1fd=="function"){
_1fd(req.responseText,req);
}
}else{
alert("An error has occurred: "+req.statusText);
}
}
}
req.onreadystatechange=callBack;
req.open("POST",url,true);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
req.send(_1ff);
};
Xinha._getback=function(url,_202){
var req=null;
req=Xinha.getXMLHTTPRequestObject();
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
_202(req.responseText,req);
}else{
alert("An error has occurred: "+req.statusText);
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
var _20c=true;
for(var x=0;x<a2.length;x++){
var _20e=false;
for(var i=0;i<a1.length;i++){
if(a1[i]==a2[x]){
_20e=true;
break;
}
}
if(!_20e){
_20c=false;
break;
}
}
return _20c;
};
Xinha.arrayFilter=function(a1,_211){
var _212=[];
for(var x=0;x<a1.length;x++){
if(_211(a1[x])){
_212[_212.length]=a1[x];
}
}
return _212;
};
Xinha.uniq_count=0;
Xinha.uniq=function(_214){
return _214+Xinha.uniq_count++;
};
Xinha._loadlang=function(_215,url){
var lang;
if(typeof _editor_lcbackend=="string"){
url=_editor_lcbackend;
url=url.replace(/%lang%/,_editor_lang);
url=url.replace(/%context%/,_215);
}else{
if(!url){
if(_215!="Xinha"){
url=_editor_url+"plugins/"+_215+"/lang/"+_editor_lang+".js";
}else{
url=_editor_url+"lang/"+_editor_lang+".js";
}
}
}
var _218=Xinha._geturlcontent(url);
if(_218!==""){
try{
eval("lang = "+_218);
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
Xinha._lc=function(_219,_21a,_21b){
var url,ret;
if(typeof _21a=="object"&&_21a.url&&_21a.context){
url=_21a.url+_editor_lang+".js";
_21a=_21a.context;
}
var m=null;
if(typeof _219=="string"){
m=_219.match(/\$(.*?)=(.*?)\$/g);
}
if(m){
if(!_21b){
_21b={};
}
for(var i=0;i<m.length;i++){
var n=m[i].match(/\$(.*?)=(.*?)\$/);
_21b[n[1]]=n[2];
_219=_219.replace(n[0],"$"+n[1]);
}
}
if(_editor_lang=="en"){
if(typeof _219=="object"&&_219.string){
ret=_219.string;
}else{
ret=_219;
}
}else{
if(typeof Xinha._lc_catalog=="undefined"){
Xinha._lc_catalog=[];
}
if(typeof _21a=="undefined"){
_21a="Xinha";
}
if(typeof Xinha._lc_catalog[_21a]=="undefined"){
Xinha._lc_catalog[_21a]=Xinha._loadlang(_21a,url);
}
var key;
if(typeof _219=="object"&&_219.key){
key=_219.key;
}else{
if(typeof _219=="object"&&_219.string){
key=_219.string;
}else{
key=_219;
}
}
if(typeof Xinha._lc_catalog[_21a][key]=="undefined"){
if(_21a=="Xinha"){
if(typeof _219=="object"&&_219.string){
ret=_219.string;
}else{
ret=_219;
}
}else{
return Xinha._lc(_219,"Xinha",_21b);
}
}else{
ret=Xinha._lc_catalog[_21a][key];
}
}
if(typeof _219=="object"&&_219.replace){
_21b=_219.replace;
}
if(typeof _21b!="undefined"){
for(var i in _21b){
ret=ret.replace("$"+i,_21b[i]);
}
}
return ret;
};
Xinha.hasDisplayedChildren=function(el){
var _222=el.childNodes;
for(var i=0;i<_222.length;i++){
if(_222[i].tagName){
if(_222[i].style.display!="none"){
return true;
}
}
}
return false;
};
Xinha._loadback=function(Url,_225,_226,_227){
var T=!Xinha.is_ie?"onload":"onreadystatechange";
var S=document.createElement("script");
S.type="text/javascript";
S.src=Url;
if(_225){
S[T]=function(){
if(Xinha.is_ie&&(!(/loaded|complete/.test(window.event.srcElement.readyState)))){
return;
}
_225.call(_226?_226:this,_227);
S[T]=null;
};
}
document.getElementsByTagName("head")[0].appendChild(S);
};
Xinha.collectionToArray=function(_22a){
var _22b=[];
for(var i=0;i<_22a.length;i++){
_22b.push(_22a.item(i));
}
return _22b;
};
if(!Array.prototype.append){
Array.prototype.append=function(a){
for(var i=0;i<a.length;i++){
this.push(a[i]);
}
return this;
};
}
Xinha.makeEditors=function(_22f,_230,_231){
if(typeof _230=="function"){
_230=_230();
}
var _232={};
for(var x=0;x<_22f.length;x++){
var _234=new Xinha(_22f[x],Xinha.cloneObject(_230));
_234.registerPlugins(_231);
_232[_22f[x]]=_234;
}
return _232;
};
Xinha.startEditors=function(_235){
for(var i in _235){
if(_235[i].generate){
_235[i].generate();
}
}
};
Xinha.prototype.registerPlugins=function(_237){
if(_237){
for(var i=0;i<_237.length;i++){
this.setLoadingMessage("Register plugin $plugin","Xinha",{"plugin":_237[i]});
this.registerPlugin(eval(_237[i]));
}
}
};
Xinha.base64_encode=function(_239){
var _23a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _23b="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
do{
chr1=_239.charCodeAt(i++);
chr2=_239.charCodeAt(i++);
chr3=_239.charCodeAt(i++);
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
_23b=_23b+_23a.charAt(enc1)+_23a.charAt(enc2)+_23a.charAt(enc3)+_23a.charAt(enc4);
}while(i<_239.length);
return _23b;
};
Xinha.base64_decode=function(_23f){
var _240="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _241="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
_23f=_23f.replace(/[^A-Za-z0-9\+\/\=]/g,"");
do{
enc1=_240.indexOf(_23f.charAt(i++));
enc2=_240.indexOf(_23f.charAt(i++));
enc3=_240.indexOf(_23f.charAt(i++));
enc4=_240.indexOf(_23f.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
_241=_241+String.fromCharCode(chr1);
if(enc3!=64){
_241=_241+String.fromCharCode(chr2);
}
if(enc4!=64){
_241=_241+String.fromCharCode(chr3);
}
}while(i<_23f.length);
return _241;
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
Xinha.viewportSize=function(_248){
_248=(_248)?_248:window;
var x,y;
if(_248.innerHeight){
x=_248.innerWidth;
y=_248.innerHeight;
}else{
if(_248.document.documentElement&&_248.document.documentElement.clientHeight){
x=_248.document.documentElement.clientWidth;
y=_248.document.documentElement.clientHeight;
}else{
if(_248.document.body){
x=_248.document.body.clientWidth;
y=_248.document.body.clientHeight;
}
}
}
return {"x":x,"y":y};
};
Xinha.prototype.scrollPos=function(_24a){
_24a=(_24a)?_24a:window;
var x,y;
if(_24a.pageYOffset){
x=_24a.pageXOffset;
y=_24a.pageYOffset;
}else{
if(_24a.document.documentElement&&document.documentElement.scrollTop){
x=_24a.document.documentElement.scrollLeft;
y=_24a.document.documentElement.scrollTop;
}else{
if(_24a.document.body){
x=_24a.document.body.scrollLeft;
y=_24a.document.body.scrollTop;
}
}
}
return {"x":x,"y":y};
};
Xinha.getElementTopLeft=function(_24c){
var _24d={top:0,left:0};
while(_24c){
_24d.top+=_24c.offsetTop;
_24d.left+=_24c.offsetLeft;
if(_24c.offsetParent&&_24c.offsetParent.tagName.toLowerCase()!="body"){
_24c=_24c.offsetParent;
}else{
_24c=null;
}
}
return _24d;
};
Xinha.findPosX=function(obj){
var _24f=0;
if(obj.offsetParent){
return Xinha.getElementTopLeft(obj).left;
}else{
if(obj.x){
_24f+=obj.x;
}
}
return _24f;
};
Xinha.findPosY=function(obj){
var _251=0;
if(obj.offsetParent){
return Xinha.getElementTopLeft(obj).top;
}else{
if(obj.y){
_251+=obj.y;
}
}
return _251;
};
Xinha.prototype.setLoadingMessage=function(_252,_253,_254){
if(!this.config.showLoading||!document.getElementById("loading_sub_"+this._textArea.name)){
return;
}
var elt=document.getElementById("loading_sub_"+this._textArea.name);
elt.innerHTML=Xinha._lc(_252,_253,_254);
};
Xinha.prototype.removeLoadingMessage=function(){
if(!this.config.showLoading||!document.getElementById("loading_"+this._textArea.name)){
return;
}
document.body.removeChild(document.getElementById("loading_"+this._textArea.name));
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
Xinha.prototype.insertNodeAtSelection=function(_25c){
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
Xinha.prototype.isKeyEvent=function(_264){
Xinha.notImplemented("isKeyEvent");
};
Xinha.prototype.isShortCut=function(_265){
if(_265.ctrlKey&&!_265.altKey){
return true;
}
return false;
};
Xinha.prototype.getKey=function(_266){
Xinha.notImplemented("getKey");
};
Xinha.getOuterHTML=function(_267){
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
Xinha.addDom0Event(window,"unload",Xinha.collectGarbageForIE);
Xinha.notImplemented=function(_26b){
throw new Error("Method Not Implemented","Part of Xinha has tried to call the "+_26b+" method which has not been implemented.");
};

