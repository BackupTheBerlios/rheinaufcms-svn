var Xinha={};
Xinha.agt=navigator.userAgent.toLowerCase();
Xinha.is_ie=((Xinha.agt.indexOf("msie")!=-1)&&(Xinha.agt.indexOf("opera")==-1));
Xinha.ie_version=parseFloat(Xinha.agt.substring(Xinha.agt.indexOf("msie")+5));
Xinha.is_opera=(Xinha.agt.indexOf("opera")!=-1);
Xinha.is_khtml=(Xinha.agt.indexOf("khtml")!=-1);
Xinha.is_safari=(Xinha.agt.indexOf("safari")!=-1);
Xinha.opera_version=navigator.appVersion.substring(0,navigator.appVersion.indexOf(" "))*1;
Xinha.is_mac=(Xinha.agt.indexOf("mac")!=-1);
Xinha.is_mac_ie=(Xinha.is_ie&&Xinha.is_mac);
Xinha.is_win_ie=(Xinha.is_ie&&!Xinha.is_mac);
Xinha.is_gecko=(navigator.product=="Gecko"&&!Xinha.is_safari);
Xinha.isRunLocally=document.URL.toLowerCase().search(/^file:/)!=-1;
Xinha.is_designMode=(typeof document.designMode!="undefined"&&!Xinha.is_ie);
Xinha.isSupportedBrowser=Xinha.is_gecko||(Xinha.is_opera&&Xinha.opera_version>=9.1)||Xinha.ie_version>=5.5;
Xinha.loadPlugins=function(_1,_2){
if(!Xinha.isSupportedBrowser){
return;
}
Xinha.loadStyle(typeof _editor_css=="string"?_editor_css:"Xinha.css","XinhaCoreDesign");
Xinha.createLoadingMessages(xinha_editors);
var _3=Xinha.loadingMessages;
Xinha._loadback(_editor_url+"XinhaCore.js",function(){
Xinha.removeLoadingMessages(xinha_editors);
Xinha.createLoadingMessages(xinha_editors);
_2();
});
return false;
};
Xinha._loadback=function(_4,_5,_6,_7){
var T=!Xinha.is_ie?"onload":"onreadystatechange";
var S=document.createElement("script");
S.type="text/javascript";
S.src=_4;
if(_5){
S[T]=function(){
if(Xinha.is_ie&&(!(/loaded|complete/.test(window.event.srcElement.readyState)))){
return;
}
_5.call(_6?_6:this,_7);
S[T]=null;
};
}
document.getElementsByTagName("head")[0].appendChild(S);
};
Xinha.getElementTopLeft=function(_a){
var _b=curtop=0;
if(_a.offsetParent){
_b=_a.offsetLeft;
curtop=_a.offsetTop;
while(_a=_a.offsetParent){
_b+=_a.offsetLeft;
curtop+=_a.offsetTop;
}
}
return {top:curtop,left:_b};
};
Xinha.findPosX=function(_c){
var _d=0;
if(_c.offsetParent){
return Xinha.getElementTopLeft(_c).left;
}else{
if(_c.x){
_d+=_c.x;
}
}
return _d;
};
Xinha.findPosY=function(_e){
var _f=0;
if(_e.offsetParent){
return Xinha.getElementTopLeft(_e).top;
}else{
if(_e.y){
_f+=_e.y;
}
}
return _f;
};
Xinha.createLoadingMessages=function(_10){
if(Xinha.loadingMessages||!Xinha.isSupportedBrowser){
return;
}
Xinha.loadingMessages=[];
for(var i=0;i<_10.length;i++){
Xinha.loadingMessages.push(Xinha.createLoadingMessage(document.getElementById(_10[i])));
}
};
Xinha.createLoadingMessage=function(_12,_13){
if(document.getElementById("loading_"+_12.id)||!Xinha.isSupportedBrowser){
return;
}
var _14=document.createElement("div");
_14.id="loading_"+_12.id;
_14.className="loading";
_14.style.left=(Xinha.findPosX(_12)+_12.offsetWidth/2)-106+"px";
_14.style.top=(Xinha.findPosY(_12)+_12.offsetHeight/2)-50+"px";
var _15=document.createElement("div");
_15.className="loading_main";
_15.id="loading_main_"+_12.id;
_15.appendChild(document.createTextNode(Xinha._lc("Loading in progress. Please wait!")));
var _16=document.createElement("div");
_16.className="loading_sub";
_16.id="loading_sub_"+_12.id;
_13=_13?_13:Xinha._lc("Loading Core");
_16.appendChild(document.createTextNode(_13));
_14.appendChild(_15);
_14.appendChild(_16);
document.body.appendChild(_14);
return _16;
};
Xinha.loadStyle=function(_17,id){
var url=_editor_url||"";
url+=_17;
var _1a=document.getElementsByTagName("head")[0];
var _1b=document.createElement("link");
_1b.rel="stylesheet";
_1b.href=url;
if(id){
_1b.id=id;
}
_1a.appendChild(_1b);
};
Xinha._lc=function(_1c){
return _1c;
};
if(document.addEventListener){
Xinha._addEvent=function(el,_1e,_1f){
el.addEventListener(_1e,_1f,true);
};
Xinha._removeEvent=function(el,_21,_22){
el.removeEventListener(_21,_22,true);
};
Xinha._stopEvent=function(ev){
ev.preventDefault();
ev.stopPropagation();
};
}else{
if(document.attachEvent){
Xinha._addEvent=function(el,_25,_26){
el.attachEvent("on"+_25,_26);
};
Xinha._removeEvent=function(el,_28,_29){
el.detachEvent("on"+_28,_29);
};
Xinha._stopEvent=function(ev){
try{
ev.cancelBubble=true;
ev.returnValue=false;
}
catch(ex){
}
};
}
}

