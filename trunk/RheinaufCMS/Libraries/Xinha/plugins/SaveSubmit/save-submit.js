function SaveSubmit(_1){
this.editor=_1;
this.initial_html=null;
this.changed=false;
var _2=this;
var _3=_1.config;
this.textarea=this.editor._textArea;
this.imgage_changed=_editor_url+"plugins/SaveSubmit/img/ed_save_red.gif";
this.imgage_unchanged=_editor_url+"plugins/SaveSubmit/img/ed_save_green.gif";
_3.registerButton({id:"savesubmit",tooltip:_2._lc("Save"),image:this.imgage_unchanged,textMode:true,action:function(_4){
_2.save(_4);
}});
_3.addToolbarElement("savesubmit","popupeditor",-1);
}
SaveSubmit.prototype._lc=function(_5){
return Xinha._lc(_5,"SaveSubmit");
};
SaveSubmit._pluginInfo={name:"SaveSubmit",version:"0.91",developer:"Raimund Meyer",developer_url:"http://rheinauf.de",c_owner:"Raimund Meyer",sponsor:"",sponsor_url:"",license:"htmlArea"};
SaveSubmit.prototype.onGenerate=function(){
var _6=this;
var _7=this.editordoc=this.editor._doc;
Xinha._addEvents(_7,["mouseup","keyup","keypress","keydown"],function(_8){
return _6.onEvent(Xinha.is_ie?_6.editor._iframe.contentWindow.event:_8);
});
this.tmp_file_present();
};
SaveSubmit.prototype.onEvent=function(ev){
var _a=(Xinha.is_ie&&ev.type=="keydown")||(!Xinha.is_ie&&ev.type=="keypress");
if(_a&&ev.ctrlKey&&String.fromCharCode(Xinha.is_ie?ev.keyCode:ev.charCode).toLowerCase()=="s"){
this.save(this.editor);
Xinha._stopEvent(ev);
return false;
}else{
if(!this.changed){
if(this.getChanged()){
this.setChanged();
}
}
}
};
SaveSubmit.prototype.getChanged=function(){
if(this.initial_html==null){
this.initial_html=this.editor.getHTML();
}
if(this.initial_html!=this.editor.getHTML()&&this.changed==false){
this.changed=true;
return true;
}else{
return false;
}
};
SaveSubmit.prototype.setChanged=function(){
var _b=this;
var _c=this.editor._toolbarObjects;
for(var i in _c){
var _e=_c[i];
if(_e.name=="savesubmit"){
_e.swapImage(this.imgage_changed);
}
}
this.editor.updateToolbar();
};
SaveSubmit.prototype.changedReset=function(){
this.changed=false;
this.initial_html=null;
var _f=this.editor._toolbarObjects;
for(var i in _f){
var btn=_f[i];
if(btn.name=="savesubmit"){
btn.swapImage(this.imgage_unchanged);
}
}
};
SaveSubmit.prototype.save=function(_12){
this.buildMessage();
var _13=this;
var _14=_12._textArea.name;
var _15={};
_15[_14]=_12.outwardHtml(_12.getHTML());
Xinha._postback(_12._textArea.form.action+"&nohtml",_15,function(_16){
if(_16){
var s;
s={"saved":false,"message":""};
eval("s = "+_16);
if(s.saved==true){
_13.setMessage(s.message);
_13.changedReset();
}else{
alert(s.message);
}
removeMessage=function(){
_13.removeMessage();
};
window.setTimeout("removeMessage()",1000);
}
});
Xinha._getback(_12._textArea.form.action+"&nohtml&workingvmenu",function(_18){
if(_18){
eval(_18);
}
});
};
SaveSubmit.prototype.save_tmp=function(){
var _19=this;
var _1a=this.editor._textArea.name;
var _1b=new Object();
_1b[_1a]=this.editor.outwardHtml(this.editor.getHTML());
Xinha._postback(this.editor._textArea.form.action+"&nohtml&tmp",_1b,function(_1c){
});
};
SaveSubmit.prototype.tmp_file_present=function(){
if(document.getElementById("tmp_file").value=="true"){
if(confirm("Nach dem letzten Speichern sind noch \xc4nderungen vorgenommen worden.\nWollen Sie die Datei wiederherstellen?")){
revert("tmp.html",this.editor);
}
}
};
SaveSubmit.prototype.setMessage=function(_1d){
var _1e=this.textarea;
if(!document.getElementById("message_sub_"+_1e.name)){
return;
}
var elt=document.getElementById("message_sub_"+_1e.name);
elt.innerHTML=Xinha._lc(_1d,"SaveSubmit");
};
SaveSubmit.prototype.removeMessage=function(){
var _20=this.textarea;
if(!document.getElementById("message_"+_20.name)){
return;
}
document.body.removeChild(document.getElementById("message_"+_20.name));
};
SaveSubmit.prototype.buildMessage=function(){
var _21=this.textarea;
var _22=document.createElement("div");
_22.id="message_"+_21.name;
_22.className="loading";
try{
_22.style.width=(_21.offsetWidth!=0)?_21.offsetWidth+"px":this.editor._initial_ta_size.w;
}
catch(e){
_22.style.width=this.editor._initial_ta_size.w;
}
_22.style.left=Xinha.findPosX(_21)+"px";
_22.style.top=(Xinha.findPosY(_21)+parseInt(this.editor._initial_ta_size.h)/2)+"px";
var _23=document.createElement("div");
_23.className="loading_main";
_23.id="loading_main_"+_21.name;
_23.appendChild(document.createTextNode(this._lc("Saving...")));
var _24=document.createElement("div");
_24.className="loading_sub";
_24.id="message_sub_"+_21.name;
_24.appendChild(document.createTextNode(this._lc("in progress")));
_22.appendChild(_23);
_22.appendChild(_24);
document.body.appendChild(_22);
};

