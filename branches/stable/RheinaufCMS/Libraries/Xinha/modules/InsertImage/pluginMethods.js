InsertImage.prototype.show=function(_1){
var _2=this.editor;
if(typeof _1=="undefined"){
_1=_2.getParentElement();
if(_1&&_1.tagName.toLowerCase()!="img"){
_1=null;
}
}
var _3;
if(typeof _2.config.baseHref!="undefined"&&_2.config.baseHref!==null){
_3=_2.config.baseHref;
}else{
var _4=window.location.toString().split("/");
_4.pop();
_3=_4.join("/");
}
if(_1){
outparam={f_base:_3,f_url:Xinha.is_ie?_2.stripBaseURL(_1.src):_1.getAttribute("src"),f_alt:_1.alt,f_border:_1.border,f_align:_1.align,f_vert:(_1.vspace!=-1?_1.vspace:""),f_horiz:(_1.hspace!=-1?_1.hspace:""),f_width:_1.width,f_height:_1.height};
}else{
outparam={f_base:_3,f_url:"",f_alt:"",f_border:"",f_align:"",f_vert:"",f_horiz:"",f_width:"",f_height:""};
}
this.image=_1;
this.dialog.show(outparam);
};
InsertImage.prototype.apply=function(){
var _5=this.dialog.hide();
if(!_5.f_url){
return;
}
var _6=this.editor;
var _7=this.image;
if(!_7){
if(Xinha.is_ie){
var _8=_6.getSelection();
var _9=_6.createRange(_8);
_6._doc.execCommand("insertimage",false,_5.f_url);
_7=_9.parentElement();
if(_7.tagName.toLowerCase()!="img"){
_7=_7.previousSibling;
}
}else{
_7=document.createElement("img");
_7.src=_5.f_url;
_6.insertNodeAtSelection(_7);
if(!_7.tagName){
_7=_9.startContainer.firstChild;
}
}
}else{
_7.src=_5.f_url;
}
for(var _a in _5){
var _b=_5[_a];
switch(_a){
case "f_alt":
if(_b){
_7.alt=_b;
}else{
_7.removeAttribute("alt");
}
break;
case "f_border":
if(_b){
_7.border=parseInt(_b||"0");
}else{
_7.removeAttribute("border");
}
break;
case "f_align":
if(_b.value){
_7.align=_b.value;
}else{
_7.removeAttribute("align");
}
break;
case "f_vert":
if(_b){
_7.vspace=parseInt(_b||"0");
}else{
_7.removeAttribute("vspace");
}
break;
case "f_horiz":
if(_b){
_7.hspace=parseInt(_b||"0");
}else{
_7.removeAttribute("hspace");
}
break;
case "f_width":
if(_b){
_7.width=parseInt(_b||"0");
}else{
_7.removeAttribute("width");
}
break;
case "f_height":
if(_b){
_7.height=parseInt(_b||"0");
}else{
_7.removeAttribute("height");
}
break;
}
}
};

