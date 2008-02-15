function InsertSnippet(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_2.registerButton({id:"insertsnippet",tooltip:this._lc("Insert Snippet"),image:_1.imgURL("ed_snippet.gif","InsertSnippet"),textMode:false,action:function(_4){
_3.buttonPress(_4);
}});
_2.addToolbarElement("insertsnippet","insertimage",-1);
this.snippets=null;
this.categories=null;
this.html=null;
Xinha._getback(_2.InsertSnippet.snippets,function(_5,_6){
var _7=_6.responseXML;
var c=_7.getElementsByTagName("c");
_3.categories=[];
for(var i=0;i<c.length;i++){
_3.categories.push(c[i].getAttribute("n"));
}
var s=_7.getElementsByTagName("s");
_3.snippets=[];
var _b,item;
for(var i=0;i<s.length;i++){
item={};
for(var j=0;j<s[i].attributes.length;j++){
item[s[i].attributes[j].nodeName]=s[i].attributes[j].nodeValue;
}
item.html=s[i].text||s[i].textContent;
_3.snippets.push(item);
}
});
Xinha.loadStyle("InsertSnippet.css","InsertSnippet","IScss");
}
InsertSnippet.prototype.onUpdateToolbar=function(){
if(!this.snippets){
this.editor._toolbarObjects.insertsnippet.state("enabled",false);
}else{
InsertSnippet.prototype.onUpdateToolbar=null;
}
};
InsertSnippet._pluginInfo={name:"InsertSnippet",version:"1.2",developer:"Raimund Meyer",developer_url:"http://rheinauf.de",c_owner:"Raimund Meyer",sponsor:"",sponsor_url:"",license:"htmlArea"};
Xinha.Config.prototype.InsertSnippet={"snippets":_editor_url+"plugins/InsertSnippet/snippets.xml","showInsertVariable":true,"varOpeningDelimiter":"{","varClosingDelimiter":"}"};
InsertSnippet.prototype._lc=function(_d){
return Xinha._lc(_d,"InsertSnippet");
};
InsertSnippet.prototype.onGenerateOnce=function(){
this._prepareDialog();
};
InsertSnippet.prototype._prepareDialog=function(){
var _e=this;
if(!this.html){
Xinha._getback(_editor_url+"plugins/InsertSnippet/dialog.html",function(_f){
_e.html=_f;
_e._prepareDialog();
});
return;
}
if(!this.snippets){
setTimeout(function(){
_e._prepareDialog();
},50);
return;
}
var _10=this.editor;
var _11=this;
this.dialog=new Xinha.Dialog(_10,this.html,"InsertSnippet",{width:800,height:400},{modal:true});
Xinha._addClass(this.dialog.rootElem,"InsertSnippet");
var _12=this.dialog;
var _13=this.dialog.main;
var _14=this.dialog.captionBar;
this.snippetTable=_12.getElementById("snippettable");
this.drawCatTabs();
this.drawSnippetTable();
this.preparePreview();
_12.onresize=function(){
_e.resize();
};
this.dialog.getElementById("search").onkeyup=function(){
_e.search();
};
this.dialog.getElementById("wordbegin").onclick=function(){
_e.search();
};
this.dialog.getElementById("cancel").onclick=function(){
_e.dialog.hide();
};
};
InsertSnippet.prototype.drawSnippetTable=function(){
if(!this.snippets.length){
return;
}
var _15=this;
var _16=this.snippetTable;
var _17=this.snippets;
while(_16.hasChildNodes()){
_16.removeChild(_16.lastChild);
}
var id,snippet_name,snippet_html,snippet_cat,trow,newCell,cellNo,btn;
for(var i=0,trowNo=0;i<_17.length;i++){
id=i;
snippet_name=_17[i]["n"];
snippet_cat=_17[i]["c"];
snippet_html=_17[i]["html"];
if(this.categoryFilter&&snippet_cat!=this.categoryFilter&&this.categoryFilter!="all"){
continue;
}
trow=_16.insertRow(trowNo);
trowNo++;
cellNo=0;
newCell=trow.insertCell(cellNo);
newCell.onmouseover=function(_1a){
return _15.preview(_1a||window.event);
};
newCell.onmouseout=function(){
return _15.preview();
};
newCell.appendChild(document.createTextNode(snippet_name));
newCell.snID=id;
newCell.id="cell"+id;
cellNo++;
newCell=trow.insertCell(cellNo);
newCell.style.whiteSpace="nowrap";
btn=document.createElement("button");
btn.snID=id;
btn._insAs="html";
btn.onclick=function(_1b){
_15.doInsert(_1b||window.event);
return false;
};
btn.appendChild(document.createTextNode(this._lc("HTML")));
btn.title=this._lc("Insert as HTML");
newCell.appendChild(btn);
if(this.editor.config.InsertSnippet.showInsertVariable){
newCell.appendChild(document.createTextNode(" "));
var btn=document.createElement("button");
btn.snID=id;
btn._insAs="variable";
btn.onclick=function(_1d){
_15.doInsert(_1d||window.event);
return false;
};
btn.appendChild(document.createTextNode(this._lc("Variable")));
btn.title=this._lc("Insert as template variable");
newCell.appendChild(btn);
}
cellNo++;
}
};
InsertSnippet.prototype.drawCatTabs=function(){
if(!this.categories.length){
return;
}
var _1e=this;
var _1f=this.dialog.getElementById("cattabs");
while(_1f.hasChildNodes()){
_1f.removeChild(_1f.lastChild);
}
var _20=1;
var tab=document.createElement("a");
tab.href="javascript:void(0);";
tab.appendChild(document.createTextNode(this._lc("All Categories")));
tab.cat="all";
tab.className="tab"+_20;
tab.onclick=function(){
_1e.categoryFilter=_1e.cat;
_1e.drawCatTabs();
_1e.drawSnippetTable();
_1e.search();
};
if(!this.categoryFilter||this.categoryFilter=="all"){
Xinha._addClass(tab,"active");
tab.onclick=null;
}
_1f.appendChild(tab);
_20++;
for(var i=0;i<this.categories.length;i++){
var _23=this.categories[i];
var tab=document.createElement("a");
tab.href="javascript:void(0);";
tab.appendChild(document.createTextNode(_23));
tab.cat=_23;
tab.className="tab"+_20;
tab.onclick=function(){
_1e.categoryFilter=this.cat;
_1e.drawCatTabs();
_1e.drawSnippetTable();
_1e.search();
};
if(_23==this.categoryFilter){
Xinha._addClass(tab,"active");
tab.onclick=null;
}
_1f.appendChild(tab);
if(Xinha.is_gecko){
_1f.appendChild(document.createTextNode(String.fromCharCode(8203)));
}
_20=(_20<16)?_20+1:1;
}
if(!this.catTabsH){
this.catTabsH=_1f.offsetHeight;
}
};
InsertSnippet.prototype.search=function(){
var _24=this.dialog.getElementById("snippettable");
var _25=this.dialog.getElementById("search");
if(_25.value){
var val=_25.value;
val=val.replace(/\.?([*?+])/g,".$1");
var _27=(this.dialog.getElementById("wordbegin").checked)?"^":"";
try{
var re=new RegExp(_27+val,"i");
}
catch(e){
var re=null;
}
}else{
var re=null;
}
for(var i=0;i<_24.childNodes.length;i++){
var tr=_24.childNodes[i];
var _2b=tr.firstChild.firstChild.data;
if(re&&!_2b.match(re)){
tr.style.display="none";
}else{
tr.style.display="";
}
}
};
InsertSnippet.prototype.preview=function(_2c){
if(!_2c){
this.previewBody.innerHTML="";
return;
}
var _2d=_2c.target||_2c.srcElement;
var _2e=_2d.snID;
if(!this.previewBody){
this.preparePreview();
return;
}
if(this.previewIframe.style.display=="none"){
this.previewIframe.style.display="block";
}
this.previewBody.innerHTML=this.snippets[_2e].html;
};
InsertSnippet.prototype.preparePreview=function(){
var _2f=this.editor;
var _30=this;
var _31=this.previewIframe=this.dialog.getElementById("preview_iframe");
var doc=null;
try{
if(_31.contentDocument){
doc=_31.contentDocument;
}else{
doc=_31.contentWindow.document;
}
if(!doc){
if(Xinha.is_gecko){
setTimeout(function(){
_30.preparePreview(snID);
},50);
return false;
}else{
alert("ERROR: IFRAME can't be initialized.");
}
}
}
catch(ex){
setTimeout(function(){
_30.preparePreview(snID);
},50);
}
doc.open("text/html","replace");
var _33="<html><head><title></title>";
_33+="<meta http-equiv=\"Content-Type\" content=\"text/html; charset="+_2f.config.charSet+"\">\n";
_33+="<style type=\"text/css\">body {background-color:#fff} </style>";
if(typeof _2f.config.baseHref!="undefined"&&_2f.config.baseHref!==null){
_33+="<base href=\""+_2f.config.baseHref+"\"/>\n";
}
if(_2f.config.pageStyle){
_33+="<style type=\"text/css\">\n"+_2f.config.pageStyle+"\n</style>";
}
if(typeof _2f.config.pageStyleSheets!=="undefined"){
for(var i=0;i<_2f.config.pageStyleSheets.length;i++){
if(_2f.config.pageStyleSheets[i].length>0){
_33+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_2f.config.pageStyleSheets[i]+"\">";
}
}
}
_33+="</head>\n";
_33+="<body>\n";
_33+="</body>\n";
_33+="</html>";
doc.write(_33);
doc.close();
setTimeout(function(){
_30.previewBody=doc.getElementsByTagName("body")[0];
},100);
};
InsertSnippet.prototype.buttonPress=function(_35){
this.dialog.toggle();
};
InsertSnippet.prototype.doInsert=function(_36){
var _37=_36.target||_36.srcElement;
var sn=this.snippets[_37.snID];
this.dialog.hide();
var cfg=this.editor.config.InsertSnippet;
if(_37._insAs=="variable"){
this.editor.insertHTML(sn.v||cfg.varOpeningDelimiter+sn.n+cfg.varClosingDelimiter);
}else{
this.editor.insertHTML(sn.html);
}
};
InsertSnippet.prototype.resize=function(){
var _3a=this.dialog.getElementById("insert_div");
var _3b=this.dialog.getElementById("preview_iframe");
var win={h:this.dialog.height,w:this.dialog.width};
var h=win.h-90;
if(this.categories.length){
h-=this.catTabsH;
}
_3a.style.height=_3b.style.height=h+"px";
return true;
};

