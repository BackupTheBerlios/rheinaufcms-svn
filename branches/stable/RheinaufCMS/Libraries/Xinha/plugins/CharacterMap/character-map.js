Xinha.loadStyle("CharacterMap.css","CharacterMap");
function CharacterMap(_1){
this.editor=_1;
var _2=_1.config;
var _3=this;
_2.registerButton({id:"insertcharacter",tooltip:Xinha._lc("Insert special character","CharacterMap"),image:_1.imgURL("ed_charmap.gif","CharacterMap"),textMode:false,action:function(){
_3.show();
}});
_2.addToolbarElement("insertcharacter","createlink",-1);
}
Xinha.Config.prototype.CharacterMap={"mode":"popup"};
CharacterMap._pluginInfo={name:"CharacterMap",version:"2.0",developer:"Laurent Vilday",developer_url:"http://www.mokhet.com/",c_owner:"Xinha community",sponsor:"",sponsor_url:"",license:"Creative Commons Attribution-ShareAlike License"};
CharacterMap._isActive=false;
CharacterMap.prototype.addEntity=function(_4,_5){
var _6=this.editor;
var _7=this;
var a=document.createElement("a");
Xinha._addClass(a,"entity");
a.innerHTML=_4;
a.href="javascript:void(0)";
Xinha._addClass(a,(_5%2)?"light":"dark");
a.onclick=function(){
if(Xinha.is_ie){
_6.focusEditor();
}
_6.insertHTML(_4);
return false;
};
this.dialog.main.appendChild(a);
a=null;
};
CharacterMap.prototype.onGenerateOnce=function(){
this._prepareDialog();
};
CharacterMap.prototype._prepareDialog=function(){
var _9=this;
var _a=this.editor;
var _b="<h1><l10n>Insert special character</l10n></h1>";
this.dialog=new Xinha.Dialog(_a,_b,"CharacterMap",{width:300},{modal:false});
Xinha._addClass(this.dialog.rootElem,"CharacterMap");
if(_a.config.CharacterMap.mode=="panel"){
this.dialog.attachToPanel("right");
}
var _c=["&Yuml;","&scaron;","&#064;","&quot;","&iexcl;","&cent;","&pound;","&curren;","&yen;","&brvbar;","&sect;","&uml;","&copy;","&ordf;","&laquo;","&not;","&macr;","&deg;","&plusmn;","&sup2;","&sup3;","&acute;","&micro;","&para;","&middot;","&cedil;","&sup1;","&ordm;","&raquo;","&frac14;","&frac12;","&frac34;","&iquest;","&times;","&Oslash;","&divide;","&oslash;","&fnof;","&circ;","&tilde;","&ndash;","&mdash;","&lsquo;","&rsquo;","&sbquo;","&ldquo;","&rdquo;","&bdquo;","&dagger;","&Dagger;","&bull;","&hellip;","&permil;","&lsaquo;","&rsaquo;","&euro;","&trade;","&Agrave;","&Aacute;","&Acirc;","&Atilde;","&Auml;","&Aring;","&AElig;","&Ccedil;","&Egrave;","&Eacute;","&Ecirc;","&Euml;","&Igrave;","&Iacute;","&Icirc;","&Iuml;","&ETH;","&Ntilde;","&Ograve;","&Oacute;","&Ocirc;","&Otilde;","&Ouml;","&reg;","&times;","&Ugrave;","&Uacute;","&Ucirc;","&Uuml;","&Yacute;","&THORN;","&szlig;","&agrave;","&aacute;","&acirc;","&atilde;","&auml;","&aring;","&aelig;","&ccedil;","&egrave;","&eacute;","&ecirc;","&euml;","&igrave;","&iacute;","&icirc;","&iuml;","&eth;","&ntilde;","&ograve;","&oacute;","&ocirc;","&otilde;","&ouml;","&divide;","&oslash;","&ugrave;","&uacute;","&ucirc;","&uuml;","&yacute;","&thorn;","&yuml;","&OElig;","&oelig;","&Scaron;"];
for(var i=0;i<_c.length;i++){
this.addEntity(_c[i],i);
}
this.ready=true;
};
CharacterMap.prototype.show=function(){
if(!this.ready){
var _e=this;
window.setTimeout(function(){
_e.show();
},100);
return;
}
this.dialog.toggle();
};
CharacterMap.prototype.hide=function(){
this.dialog.hide();
};

