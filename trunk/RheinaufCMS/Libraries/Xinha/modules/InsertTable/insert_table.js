InsertTable._pluginInfo={name:"InsertTable",origin:"Xinha Core",version:"$LastChangedRevision: 733 $".replace(/^[^:]*: (.*) \$$/,"$1"),developer:"The Xinha Core Developer Team",developer_url:"$HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/InsertTable/insert_image.js $".replace(/^[^:]*: (.*) \$$/,"$1"),sponsor:"",sponsor_url:"",license:"htmlArea"};
function InsertTable(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_1.config.btnList.inserttable[3]=function(){
_3.show();
};
}
InsertTable.prototype._lc=function(_4){
return Xinha._lc(_4,"Xinha");
};
InsertTable.prototype.onGenerateOnce=function(){
this.prepareDialog();
this.loadScripts();
};
InsertTable.prototype.loadScripts=function(){
var _5=this;
if(!this.methodsReady){
Xinha._getback(_editor_url+"modules/InsertTable/pluginMethods.js",function(_6){
eval(_6);
_5.methodsReady=true;
});
return;
}
};
InsertTable.prototype.onUpdateToolbar=function(){
if(!(this.dialogReady&&this.methodsReady)){
this.editor._toolbarObjects.inserttable.state("enabled",false);
}
};
InsertTable.prototype.prepareDialog=function(){
var _7=this;
var _8=this.editor;
if(!this.html){
Xinha._getback(_editor_url+"modules/InsertTable/dialog.html",function(_9){
_7.html=_9;
_7.prepareDialog();
});
return;
}
var _a=this.dialog=new Xinha.Dialog(_8,this.html,"Xinha",{width:400});
_a.getElementById("ok").onclick=function(){
_7.apply();
};
_a.getElementById("cancel").onclick=function(){
_7.dialog.hide();
};
this.borderColorPicker=new Xinha.colorPicker.InputBinding(_a.getElementById("border_color"));
this.dialog.onresize=function(){
this.getElementById("layout_fieldset").style.width=(this.width/2)+50+"px";
this.getElementById("spacing_fieldset").style.width=(this.width/2)-120+"px";
};
this.dialogReady=true;
};

