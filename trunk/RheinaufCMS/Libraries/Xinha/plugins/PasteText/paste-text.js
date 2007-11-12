function PasteText(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_2.registerButton({id:"pastetext",tooltip:this._lc("Paste as Plain Text"),image:_1.imgURL("ed_paste_text.gif","PasteText"),textMode:false,action:function(){
_3.show();
}});
_2.addToolbarElement("pastetext",["paste","killword"],1);
}
PasteText._pluginInfo={name:"PasteText",version:"1.2",developer:"Michael Harris",developer_url:"http://www.jonesadvisorygroup.com",c_owner:"Jones Advisory Group",sponsor:"Jones International University",sponsor_url:"http://www.jonesinternational.edu",license:"htmlArea"};
PasteText.prototype._lc=function(_4){
return Xinha._lc(_4,"PasteText");
};
Xinha.Config.prototype.PasteText={showParagraphOption:true,newParagraphDefault:true};
PasteText.prototype.onGenerateOnce=function(){
this._prepareDialog();
};
PasteText.prototype._prepareDialog=function(){
var _5=this;
var _6=this.editor;
if(!this.html){
Xinha._getback(_editor_url+"plugins/PasteText/popups/paste_text.html",function(_7){
_5.html=_7;
_5._prepareDialog();
});
return;
}
this.dialog=new Xinha.Dialog(_6,this.html,"PasteText",{width:350});
this.dialog.getElementById("ok").onclick=function(){
_5.apply();
};
this.dialog.getElementById("cancel").onclick=function(){
_5.dialog.hide();
};
if(_6.config.PasteText.showParagraphOption){
this.dialog.getElementById("paragraphOption").style.display="";
}
if(_6.config.PasteText.newParagraphDefault){
this.dialog.getElementById("insertParagraphs").checked=true;
}
this.dialog.onresize=function(){
this.getElementById("inputArea").style.height=parseInt(this.height,10)-this.getElementById("h1").offsetHeight-this.getElementById("buttons").offsetHeight-parseInt(this.rootElem.style.paddingBottom,10)+"px";
this.getElementById("inputArea").style.width=(this.width-2)+"px";
};
this.ready=true;
};
PasteText.prototype.show=function(){
if(!this.ready){
var _8=this;
window.setTimeout(function(){
_8.show();
},100);
return;
}
var _9={inputArea:""};
this.dialog.show(_9);
this.dialog.onresize();
this.dialog.getElementById("inputArea").focus();
};
PasteText.prototype.apply=function(){
var _a=this.dialog.hide();
var _b=_a.inputArea;
var _c=_a.insertParagraphs;
_b=_b.replace(/</g,"&lt;");
_b=_b.replace(/>/g,"&gt;");
if(_a.insertParagraphs){
_b=_b.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
_b=_b.replace(/\n/g,"</p><p>");
_b="<p>"+_b+"</p>";
if(Xinha.is_ie){
this.editor.insertHTML(_b);
}else{
this.editor.execCommand("inserthtml",false,_b);
}
}else{
_b=_b.replace(/\n/g,"<br />");
this.editor.insertHTML(_b);
}
};

