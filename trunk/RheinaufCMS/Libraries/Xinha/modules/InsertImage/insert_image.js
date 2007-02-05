InsertImage._pluginInfo={name:"InsertImage",origin:"Xinha Core",version:"$LastChangedRevision: 694 $".replace(/^[^:]*: (.*) \$$/,"$1"),developer:"The Xinha Core Developer Team",developer_url:"$HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/InsertImage/insert_image.js $".replace(/^[^:]*: (.*) \$$/,"$1"),sponsor:"",sponsor_url:"",license:"htmlArea"};
function InsertImage(_1){
}
Xinha.prototype._insertImage=function(_2){
var _3=this;
var _4=null;
if(typeof _2=="undefined"){
_2=this.getParentElement();
if(_2&&_2.tagName.toLowerCase()!="img"){
_2=null;
}
}
if(_2){
_4={f_base:_3.config.baseHref,f_url:Xinha.is_ie?_3.stripBaseURL(_2.src):_2.getAttribute("src"),f_alt:_2.alt,f_border:_2.border,f_align:_2.align,f_vert:_2.vspace,f_horiz:_2.hspace,f_width:_2.width,f_height:_2.height};
}
Dialog(_3.config.URIs.insert_image,function(_5){
if(!_5){
return false;
}
var _6=_2;
if(!_6){
if(Xinha.is_ie){
var _7=_3.getSelection();
var _8=_3.createRange(_7);
_3._doc.execCommand("insertimage",false,_5.f_url);
_6=_8.parentElement();
if(_6.tagName.toLowerCase()!="img"){
_6=_6.previousSibling;
}
}else{
_6=document.createElement("img");
_6.src=_5.f_url;
_3.insertNodeAtSelection(_6);
if(!_6.tagName){
_6=_8.startContainer.firstChild;
}
}
}else{
_6.src=_5.f_url;
}
for(var _9 in _5){
var _a=_5[_9];
switch(_9){
case "f_alt":
if(_a){
_6.alt=_a;
}else{
_6.removeAttribute("alt");
}
break;
case "f_border":
if(_a){
_6.border=parseInt(_a||"0");
}else{
_6.removeAttribute("border");
}
break;
case "f_align":
if(_a){
_6.align=_a;
}else{
_6.removeAttribute("align");
}
break;
case "f_vert":
if(_a){
_6.vspace=parseInt(_a||"0");
}else{
_6.removeAttribute("vspace");
}
break;
case "f_horiz":
if(_a){
_6.hspace=parseInt(_a||"0");
}else{
_6.removeAttribute("hspace");
}
break;
case "f_width":
if(_a){
_6.width=parseInt(_a||"0");
}else{
_6.removeAttribute("width");
}
break;
case "f_height":
if(_a){
_6.height=parseInt(_a||"0");
}else{
_6.removeAttribute("height");
}
break;
}
}
},_4);
};

