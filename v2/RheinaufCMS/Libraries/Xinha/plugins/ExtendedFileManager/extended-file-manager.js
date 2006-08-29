function ExtendedFileManager(_1){
this.editor=_1;
var _2=_1.config;
var _3=_2.toolbar;
var _4=this;
_2.registerButton({id:"linkfile",tooltip:HTMLArea._lc("Insert File Link","ExtendedFileManager"),image:_editor_url+"plugins/ExtendedFileManager/img/ed_linkfile.gif",textMode:false,action:function(_5){
_5._linkFile();
}});
_1.config.addToolbarElement("linkfile","insertimage",1);
}
ExtendedFileManager._pluginInfo={name:"ExtendedFileManager",version:"1.1.1",developer:"Afru, Krzysztof Kotowicz",developer_url:"http://www.afrusoft.com/htmlarea/",license:"htmlArea"};
HTMLArea.Config.prototype.ExtendedFileManager={"backend":_editor_url+"plugins/ExtendedFileManager/backend.php?__plugin=ExtendedFileManager&","backend_config":null,"backend_config_hash":null,"backend_config_secret_key_location":"Xinha:ImageManager"};
HTMLArea.prototype._insertImage=function(_6){
var _7=this;
var _8=null;
if(typeof _6=="undefined"){
_6=this.getParentElement();
if(_6&&!/^img$/i.test(_6.tagName)){
_6=null;
}
}
if(_6){
_8={f_url:HTMLArea.is_ie?_6.src:_6.getAttribute("src"),f_alt:_6.alt,f_border:_6.style.borderWidth?_6.style.borderWidth:_6.border,f_align:_6.align,f_width:_6.width,f_height:_6.height,f_padding:_6.style.padding,f_margin:_6.style.margin,f_backgroundColor:_6.style.backgroundColor,f_borderColor:_6.style.borderColor,baseHref:_7.config.baseHref};
_8.f_border=shortSize(_8.f_border);
_8.f_padding=shortSize(_8.f_padding);
_8.f_margin=shortSize(_8.f_margin);
_8.f_backgroundColor=convertToHex(_8.f_backgroundColor);
_8.f_borderColor=convertToHex(_8.f_borderColor);
}
var _9=_7.config.ExtendedFileManager.backend+"__function=manager";
if(_7.config.ExtendedFileManager.backend_config!=null){
_9+="&backend_config="+encodeURIComponent(_7.config.ExtendedFileManager.backend_config);
_9+="&backend_config_hash="+encodeURIComponent(_7.config.ExtendedFileManager.backend_config_hash);
_9+="&backend_config_secret_key_location="+encodeURIComponent(_7.config.ExtendedFileManager.backend_config_secret_key_location);
}
Dialog(_9,function(_a){
if(!_a){
return false;
}
var _b=_6;
if(!_b){
if(HTMLArea.is_ie){
var _c=_7._getSelection();
var _d=_7._createRange(_c);
_7._doc.execCommand("insertimage",false,_a.f_url);
_b=_d.parentElement();
if(_b.tagName.toLowerCase()!="img"){
_b=_b.previousSibling;
}
}else{
_b=document.createElement("img");
_b.src=_a.f_url;
_7.insertNodeAtSelection(_b);
}
}else{
_b.src=_a.f_url;
}
for(field in _a){
var _e=_a[field];
switch(field){
case "f_alt":
_b.alt=_e;
break;
case "f_border":
_b.style.borderWidth=/[^0-9]/.test(_e)?_e:(parseInt(_e||"0")+"px");
if(_b.style.borderWidth&&!_b.style.borderStyle){
_b.style.borderStyle="solid";
}
break;
case "f_borderColor":
_b.style.borderColor=_e;
break;
case "f_backgroundColor":
_b.style.backgroundColor=_e;
break;
case "f_align":
_b.align=_e;
break;
case "f_width":
_b.width=parseInt(_e||"0");
break;
case "f_height":
_b.height=parseInt(_e||"0");
break;
case "f_padding":
_b.style.padding=/[^0-9]/.test(_e)?_e:(parseInt(_e||"0")+"px");
break;
case "f_margin":
_b.style.margin=/[^0-9]/.test(_e)?_e:(parseInt(_e||"0")+"px");
break;
}
}
},_8);
};
HTMLArea.prototype._linkFile=function(_f){
var _10=this;
var _11=null;
if(typeof _f=="undefined"){
_f=this.getParentElement();
if(_f){
if(/^img$/i.test(_f.tagName)){
_f=_f.parentNode;
}
if(!/^a$/i.test(_f.tagName)){
_f=null;
}
}
}
if(!_f){
var sel=_10._getSelection();
var _13=_10._createRange(sel);
var _14=0;
if(HTMLArea.is_ie){
if(sel.type=="Control"){
_14=_13.length;
}else{
_14=_13.compareEndPoints("StartToEnd",_13);
}
}else{
_14=_13.compareBoundaryPoints(_13.START_TO_END,_13);
}
if(_14==0){
alert(HTMLArea._lc("You must select some text before making a new link.","ExtendedFileManager"));
return;
}
_11={f_href:"",f_title:"",f_target:"",f_usetarget:_10.config.makeLinkShowsTarget,baseHref:_10.config.baseHref};
}else{
_11={f_href:HTMLArea.is_ie?_f.href:_f.getAttribute("href"),f_title:_f.title,f_target:_f.target,f_usetarget:_10.config.makeLinkShowsTarget,baseHref:_10.config.baseHref};
}
var _15=_editor_url+"plugins/ExtendedFileManager/manager.php?mode=link";
if(_10.config.ExtendedFileManager.backend_config!=null){
_15+="&backend_config="+encodeURIComponent(_10.config.ExtendedFileManager.backend_config);
_15+="&backend_config_hash="+encodeURIComponent(_10.config.ExtendedFileManager.backend_config_hash);
_15+="&backend_config_secret_key_location="+encodeURIComponent(_10.config.ExtendedFileManager.backend_config_secret_key_location);
}
Dialog(_15,function(_16){
if(!_16){
return false;
}
var a=_f;
if(!a){
try{
_10._doc.execCommand("createlink",false,_16.f_href);
a=_10.getParentElement();
var sel=_10._getSelection();
var _19=_10._createRange(sel);
if(!HTMLArea.is_ie){
a=_19.startContainer;
if(!/^a$/i.test(a.tagName)){
a=a.nextSibling;
if(a==null){
a=_19.startContainer.parentNode;
}
}
}
}
catch(e){
}
}else{
var _1a=_16.f_href.trim();
_10.selectNodeContents(a);
if(_1a==""){
_10._doc.execCommand("unlink",false,null);
_10.updateToolbar();
return false;
}else{
a.href=_1a;
}
}
if(!(a&&/^a$/i.test(a.tagName))){
return false;
}
a.target=_16.f_target.trim();
a.title=_16.f_title.trim();
_10.selectNodeContents(a);
_10.updateToolbar();
},_11);
};
function shortSize(_1b){
if(/ /.test(_1b)){
var _1c=_1b.split(" ");
var _1d=true;
for(var i=1;i<_1c.length;i++){
if(_1c[0]!=_1c[i]){
_1d=false;
break;
}
}
if(_1d){
_1b=_1c[0];
}
}
return _1b;
}
function convertToHex(_1f){
if(typeof _1f=="string"&&/, /.test.color){
_1f=_1f.replace(/, /,",");
}
if(typeof _1f=="string"&&/ /.test.color){
var _20=_1f.split(" ");
var _21="";
for(var i=0;i<_20.length;i++){
_21+=HTMLArea._colorToRgb(_20[i]);
if(i+1<_20.length){
_21+=" ";
}
}
return _21;
}
return HTMLArea._colorToRgb(_1f);
}

