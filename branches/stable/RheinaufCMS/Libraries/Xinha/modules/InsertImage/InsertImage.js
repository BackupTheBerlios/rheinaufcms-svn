InsertImage._pluginInfo={name:"InsertImage",origin:"Xinha Core",version:"$LastChangedRevision: 791 $".replace(/^[^:]*: (.*) \$$/,"$1"),developer:"The Xinha Core Developer Team",developer_url:"$HeadURL: http://svn.xinha.python-hosting.com/branches/ray/modules/InsertImage/InsertImage.js $".replace(/^[^:]*: (.*) \$$/,"$1"),sponsor:"",sponsor_url:"",license:"htmlArea"};
function InsertImage(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_1.config.btnList.insertimage[3]=function(){
_3.show();
};
}
InsertImage.prototype._lc=function(_4){
return Xinha._lc(_4,"Xinha");
};
InsertImage.prototype.onGenerateOnce=function(){
this.prepareDialog();
this.loadScripts();
};
InsertImage.prototype.loadScripts=function(){
var _5=this;
if(!this.methodsReady){
Xinha._getback(_editor_url+"modules/InsertImage/pluginMethods.js",function(_6){
eval(_6);
_5.methodsReady=true;
});
return;
}
};
InsertImage.prototype.onUpdateToolbar=function(){
if(!(this.dialogReady&&this.methodsReady)){
this.editor._toolbarObjects.insertimage.state("enabled",false);
}
};
InsertImage.prototype.prepareDialog=function(){
var _7=this;
var _8=this.editor;
if(!this.html){
Xinha._getback(_editor_url+"modules/InsertImage/dialog.html",function(_9){
_7.html=_9;
_7.prepareDialog();
});
return;
}
var _a=this.dialog=new Xinha.Dialog(_8,this.html,"Xinha",{width:410});
_a.getElementById("ok").onclick=function(){
_7.apply();
};
_a.getElementById("cancel").onclick=function(){
_7.dialog.hide();
};
_a.getElementById("preview").onclick=function(){
var _b=_a.getElementById("f_url");
var _c=_b.value;
var _d=_a.getElementById("f_base").value;
if(!_c){
alert(_a._lc("You must enter the URL"));
_b.focus();
return false;
}
_a.getElementById("ipreview").src=Xinha._resolveRelativeUrl(_d,_c);
return false;
};
this.dialog.onresize=function(){
var _e=parseInt(this.height,10)-this.getElementById("h1").offsetHeight-this.getElementById("buttons").offsetHeight-this.getElementById("inputs").offsetHeight-parseInt(this.rootElem.style.paddingBottom,10);
this.getElementById("ipreview").style.height=((_e>0)?_e:0)+"px";
this.getElementById("ipreview").style.width=this.width-2+"px";
};
this.dialogReady=true;
};

