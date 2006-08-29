function comboSelectValue(c,_2){
var _3=c.getElementsByTagName("option");
for(var i=_3.length;--i>=0;){
var op=_3[i];
op.selected=(op.value==_2);
}
c.value=_2;
}
function i18n(_6){
return HTMLArea._lc(_6,"ExtendedFileManager");
}
function setAlign(_7){
var _8=document.getElementById("f_align");
for(var i=0;i<_8.length;i++){
if(_8.options[i].value==_7){
_8.selectedIndex=i;
break;
}
}
}
function onTargetChanged(){
var f=document.getElementById("f_other_target");
if(this.value=="_other"){
f.style.visibility="visible";
f.select();
f.focus();
}else{
f.style.visibility="hidden";
}
}
init=function(){
if(manager_mode=="link"){
__dlg_init(null,{width:650,height:500});
}else{
__dlg_init(null,{width:650,height:550});
}
__dlg_translate("ExtendedFileManager");
var _b=document.getElementById("uploadForm");
if(_b){
_b.target="imgManager";
}
if(manager_mode=="image"&&typeof colorPicker!="undefined"){
var _c=document.getElementById("bgCol_pick");
var _d=document.getElementById("f_backgroundColor");
var _e=new colorPicker({cellsize:"5px",callback:function(_f){
_d.value=_f;
}});
_c.onclick=function(){
_e.open("top,right",_d);
};
var _10=document.getElementById("bdCol_pick");
var _11=document.getElementById("f_borderColor");
var _12=new colorPicker({cellsize:"5px",callback:function(_13){
_11.value=_13;
}});
_10.onclick=function(){
_12.open("top,right",_11);
};
}
var _14=window.dialogArguments;
if(manager_mode=="image"&&_14){
var _15=new RegExp("^https?://");
if(_14.f_url.length>0&&!_15.test(_14.f_url)&&typeof _14.baseHref=="string"){
_14.f_url=_14.baseHref+_14.f_url;
}
var _16=new RegExp("(https?://[^/]*)?"+base_url.replace(/\/$/,""));
_14.f_url=_14.f_url.replace(_16,"");
var rd=_resized_dir.replace(HTMLArea.RE_Specials,"\\$1");
var rp=_resized_prefix.replace(HTMLArea.RE_Specials,"\\$1");
var _19=new RegExp("^(.*/)"+rd+"/"+rp+"_([0-9]+)x([0-9]+)_([^/]+)$");
if(_19.test(_14.f_url)){
_14.f_url=RegExp.$1+RegExp.$4;
_14.f_width=RegExp.$2;
_14.f_height=RegExp.$3;
}
document.getElementById("f_url").value=_14["f_url"];
document.getElementById("f_alt").value=_14["f_alt"];
document.getElementById("f_border").value=_14["f_border"];
document.getElementById("f_width").value=_14["f_width"];
document.getElementById("f_height").value=_14["f_height"];
document.getElementById("f_margin").value=_14["f_margin"];
document.getElementById("f_padding").value=_14["f_padding"];
document.getElementById("f_borderColor").value=_14["f_borderColor"];
document.getElementById("f_backgroundColor").value=_14["f_backgroundColor"];
setAlign(_14["f_align"]);
document.getElementById("f_url").focus();
document.getElementById("orginal_width").value=_14["f_width"];
document.getElementById("orginal_height").value=_14["f_height"];
var _19=new RegExp("^(.*/)([^/]+)$");
if(_19.test(_14["f_url"])){
changeDir(RegExp.$1);
var _1a=document.getElementById("dirPath");
for(var i=0;i<_1a.options.length;i++){
if(_1a.options[i].value==encodeURIComponent(RegExp.$1)){
_1a.options[i].selected=true;
break;
}
}
}
document.getElementById("f_preview").src=_backend_url+"__function=thumbs&img="+_14.f_url;
}else{
if(manager_mode=="link"&&_14){
var _1c=document.getElementById("f_target");
var _1d=true;
var _15=new RegExp("^https?://");
if(_14.f_href.length>0&&!_15.test(_14.f_href)&&typeof _14.baseHref=="string"){
_14.f_href=_14.baseHref+_14.f_href;
}
var _1e=new RegExp("(https?://[^/]*)?"+base_url.replace(/\/$/,""));
_14.f_href=_14.f_href.replace(_1e,"");
var _19=new RegExp("^(.*/)([^/]+)$");
if(_19.test(_14["f_href"])){
changeDir(RegExp.$1);
var _1a=document.getElementById("dirPath");
for(var i=0;i<_1a.options.length;i++){
if(_1a.options[i].value==encodeURIComponent(RegExp.$1)){
_1a.options[i].selected=true;
break;
}
}
}
if(_14){
if(typeof _14["f_usetarget"]!="undefined"){
_1d=_14["f_usetarget"];
}
if(typeof _14["f_href"]!="undefined"){
document.getElementById("f_href").value=_14["f_href"];
document.getElementById("f_title").value=_14["f_title"];
comboSelectValue(_1c,_14["f_target"]);
if(_1c.value!=_14.f_target){
var opt=document.createElement("option");
opt.value=_14.f_target;
opt.innerHTML=opt.value;
_1c.appendChild(opt);
opt.selected=true;
}
}
}
if(!_1d){
document.getElementById("f_target_label").style.visibility="hidden";
document.getElementById("f_target").style.visibility="hidden";
document.getElementById("f_target_other").style.visibility="hidden";
}
var opt=document.createElement("option");
opt.value="_other";
opt.innerHTML="Other";
_1c.appendChild(opt);
_1c.onchange=onTargetChanged;
document.getElementById("f_href").focus();
}
}
};
function onCancel(){
__dlg_close(null);
return false;
}
function onOK(){
if(manager_mode=="image"){
var _20=["f_url","f_alt","f_align","f_border","f_margin","f_padding","f_height","f_width","f_borderColor","f_backgroundColor"];
var _21=new Object();
for(var i in _20){
var id=_20[i];
var el=document.getElementById(id);
if(id=="f_url"&&el.value.indexOf("://")<0){
_21[id]=makeURL(base_url,el.value);
}else{
_21[id]=el.value;
}
}
var _25={w:document.getElementById("orginal_width").value,h:document.getElementById("orginal_height").value};
if((_25.w!=_21.f_width)||(_25.h!=_21.f_height)){
var _26=HTMLArea._geturlcontent(window.opener._editor_url+"plugins/ExtendedFileManager/"+_backend_url+"&__function=resizer&img="+encodeURIComponent(document.getElementById("f_url").value)+"&width="+_21.f_width+"&height="+_21.f_height);
_26=eval(_26);
if(_26){
_21.f_url=makeURL(base_url,_26);
}
}
__dlg_close(_21);
return false;
}else{
if(manager_mode=="link"){
var _27={};
for(var i in _27){
var el=document.getElementById(i);
if(!el.value){
alert(_27[i]);
el.focus();
return false;
}
}
var _20=["f_href","f_title","f_target"];
var _21=new Object();
for(var i in _20){
var id=_20[i];
var el=document.getElementById(id);
if(id=="f_href"&&el.value.indexOf("://")<0){
_21[id]=makeURL(base_url,el.value);
}else{
_21[id]=el.value;
}
}
if(_21.f_target=="_other"){
_21.f_target=document.getElementById("f_other_target").value;
}
__dlg_close(_21);
return false;
}
}
}
function makeURL(_28,_29){
if(_28.substring(_28.length-1)!="/"){
_28+="/";
}
if(_29.charAt(0)=="/"){
}
_29=_29.substring(1);
return _28+_29;
}
function updateDir(_2a){
var _2b=_2a.options[_2a.selectedIndex].value;
changeDir(_2b);
}
function goUpDir(){
var _2c=document.getElementById("dirPath");
var _2d=_2c.options[_2c.selectedIndex].text;
if(_2d.length<2){
return false;
}
var _2e=_2d.split("/");
var _2f="";
for(var i=0;i<_2e.length-2;i++){
_2f+=_2e[i]+"/";
}
for(var i=0;i<_2c.length;i++){
var _31=_2c.options[i].text;
if(_31==_2f){
_2c.selectedIndex=i;
var _32=_2c.options[i].value;
changeDir(_32);
break;
}
}
}
function changeDir(_33){
if(typeof imgManager!="undefined"){
imgManager.changeDir(_33);
}
}
function updateView(){
refresh();
}
function toggleConstrains(_34){
var _35=document.getElementById("imgLock");
var _34=document.getElementById("constrain_prop");
if(_34.checked){
_35.src="img/locked.gif";
checkConstrains("width");
}else{
_35.src="img/unlocked.gif";
}
}
function checkConstrains(_36){
var _37=document.getElementById("constrain_prop");
if(_37.checked){
var obj=document.getElementById("orginal_width");
var _39=parseInt(obj.value);
var obj=document.getElementById("orginal_height");
var _3a=parseInt(obj.value);
var _3b=document.getElementById("f_width");
var _3c=document.getElementById("f_height");
var _3d=parseInt(_3b.value);
var _3e=parseInt(_3c.value);
if(_39>0&&_3a>0){
if(_36=="width"&&_3d>0){
_3c.value=parseInt((_3d/_39)*_3a);
}
if(_36=="height"&&_3e>0){
_3b.value=parseInt((_3e/_3a)*_39);
}
}
}
}
function showMessage(_3f){
var _40=document.getElementById("message");
var _41=document.getElementById("messages");
if(_40.firstChild){
_40.removeChild(_40.firstChild);
}
_40.appendChild(document.createTextNode(i18n(_3f)));
_41.style.display="block";
}
function addEvent(obj,_43,fn){
if(obj.addEventListener){
obj.addEventListener(_43,fn,true);
return true;
}else{
if(obj.attachEvent){
var r=obj.attachEvent("on"+_43,fn);
return r;
}else{
return false;
}
}
}
function doUpload(){
var _46=document.getElementById("uploadForm");
if(_46){
showMessage("Uploading");
}
}
function refresh(){
var _47=document.getElementById("dirPath");
updateDir(_47);
}
function newFolder(){
var _48=prompt(i18n("Please enter name for new folder..."),i18n("Untitled"));
var _49=document.getElementById("dirPath");
var dir=_49.options[_49.selectedIndex].value;
if(_48==thumbdir){
alert(i18n("Invalid folder name, please choose another folder name."));
return false;
}
if(_48&&_48!=""&&typeof imgManager!="undefined"){
imgManager.newFolder(dir,encodeURI(_48));
}
}
addEvent(window,"load",init);

