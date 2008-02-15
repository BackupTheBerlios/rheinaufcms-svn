function InsertAnchor(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_2.registerButton({id:"insert-anchor",tooltip:this._lc("Insert Anchor"),image:_1.imgURL("insert-anchor.gif","InsertAnchor"),textMode:false,action:function(){
_3.show();
}});
_2.addToolbarElement("insert-anchor","createlink",1);
}
InsertAnchor._pluginInfo={name:"InsertAnchor",origin:"version: 1.0, by Andre Rabold, MR Printware GmbH, http://www.mr-printware.de",version:"2.0",developer:"Udo Schmal",developer_url:"http://www.schaffrath-neuemedien.de",c_owner:"Udo Schmal",sponsor:"L.N.Schaffrath NeueMedien",sponsor_url:"http://www.schaffrath-neuemedien.de",license:"htmlArea"};
InsertAnchor.prototype._lc=function(_4){
return Xinha._lc(_4,"InsertAnchor");
};
InsertAnchor.prototype.onGenerate=function(){
var _5="IA-style";
var _6=this.editor._doc.getElementById(_5);
if(_6==null){
_6=this.editor._doc.createElement("link");
_6.id=_5;
_6.rel="stylesheet";
_6.href=_editor_url+"plugins/InsertAnchor/insert-anchor.css";
this.editor._doc.getElementsByTagName("HEAD")[0].appendChild(_6);
}
};
InsertAnchor.prototype.onGenerateOnce=function(){
this._prepareDialog();
};
InsertAnchor.prototype._prepareDialog=function(){
var _7=this;
var _8=this.editor;
if(!this.html){
Xinha._getback(_editor_url+"plugins/InsertAnchor/dialog.html",function(_9){
_7.html=_9;
_7._prepareDialog();
});
return;
}
this.dialog=new Xinha.Dialog(_8,this.html,"InsertAnchor",{width:400});
this.dialog.getElementById("ok").onclick=function(){
_7.apply();
};
this.dialog.getElementById("cancel").onclick=function(){
_7.dialog.hide();
};
this.ready=true;
};
InsertAnchor.prototype.show=function(){
if(!this.ready){
var _a=this;
window.setTimeout(function(){
_a.show();
},100);
return;
}
var _b=this.editor;
this.selectedHTML=_b.getSelectedHTML();
var _c=_b.getSelection();
var _d=_b.createRange(_c);
this.a=_b.activeElement(_c);
if(!(this.a!=null&&this.a.tagName.toLowerCase()=="a")){
this.a=_b._getFirstAncestor(_c,"a");
}
if(this.a!=null&&this.a.tagName.toLowerCase()=="a"){
inputs={name:this.a.id};
}else{
inputs={name:""};
}
this.dialog.show(inputs);
this.dialog.getElementById("name").focus();
};
InsertAnchor.prototype.apply=function(){
var _e=this.editor;
var _f=this.dialog.hide();
var _10=_f["name"];
var a=this.a;
if(_10==""||_10==null){
if(a){
var _12=a.innerHTML;
a.parentNode.removeChild(a);
_e.insertHTML(_12);
}
return;
}
try{
var doc=_e._doc;
if(!a){
a=doc.createElement("a");
a.id=_10;
a.name=_10;
a.className="anchor";
a.innerHTML=this.selectedHTML;
_e.insertNodeAtSelection(a);
}else{
a.id=_10;
a.name=_10;
a.className="anchor";
}
}
catch(e){
}
};

