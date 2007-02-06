function mouseCoord(e) 
{
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY)
	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	// posx and posy contain the mouse position relative to the document
	return {x : posx, y : posy}
}
function winDim()
{
	var x,y;
	if (self.innerHeight) // all except Explorer
	{
		x = self.innerWidth;
		y = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
		// Explorer 6 Strict Mode
	{
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	}
	else if (document.body) // other Explorers
	{
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return {x : x, y : y}
}
function scrollOffset ()
{
	var x=0,y=0;
	if (typeof self.pageYOffset != "undefined") // all except Explorer
	{
		x = self.pageXOffset;
		y = self.pageYOffset;
	}
	else if (document.documentElement && typeof document.documentElement.scrollTop != "undefined")
		// Explorer 6 Strict
	{
		x = document.documentElement.scrollLeft;
		y = document.documentElement.scrollTop;
	}
	else if (document.body) // all other Explorers
	{
		x = document.body.scrollLeft;
		y = document.body.scrollTop;
	}
	return {x : x, y : y}
}
var toolTips = [];
function ToolTip ()
{
	this.init();
}
ToolTip.prototype.init = function ()
{
	for (var i = 0;i<toolTips.length;i++)
	{	
		var trigger = (typeof toolTips[i].trigger == "string") ? document.getElementById(toolTips[i].trigger) : toolTips[i].trigger;
		var source = document.getElementById(toolTips[i].source);
		if (source)
		{
			text = source.innerHTML;
		}
		else text = trigger.title;
		trigger.title = '';
		this.attachEvents(trigger,text,toolTips[i].className);
	}
	
	var els = document.getElementsByName("tooltip");
	for (var i = 0;i<els.length;i++)
	{	
		var trigger = els[i];
		this.attachEvents(trigger,trigger.getAttribute("title"),trigger.className);
		//trigger.title = '';
	}
}
ToolTip.prototype.attachEvents = function (trigger,text,className)
{
	var self = this;
	trigger.onmouseover = function (ev) {self.show(ev,text,className)};
	trigger.onmouseout = function (ev) {self.hide()};
}
ToolTip.prototype.show = function (ev,text,className)
{
	if (!this.tip)
	{
		this.tip = document.createElement("div");
		this.tip.style.position = "absolute";
		this.tip.style.display = "none";
		document.getElementsByTagName("body")[0].appendChild(this.tip);
	}
	if (this.tip.style.display != "none") return;
	this.tip.className = (className) ? className : "tooltip";
	this.tip.style.display = "";
	this.tip.innerHTML = text;

	var coords = mouseCoord(ev);
	var innerW = winDim();
	var scrollO = scrollOffset();
	
	var top = coords.y + 10;
	var left = coords.x + 10;
	var h = this.tip.offsetHeight;
	var w = this.tip.offsetWidth;
	
	var oLeft = innerW.x + scrollO.x - (left + w); 
	var oTop = innerW.y + scrollO.y - (top + h);
	//alert(innerW.x + ' ' + scrollO.x  + ' ' +  left  + ' ' +  w);
	if ( oLeft < 0 ) left -= w + 10 ; 
	if ( oTop < 0 )  top -= h + 10; 
	if ( left < 5 ) left = 5;
	if ( top < 5 ) top = 5;
	
	this.tip.style.top = top + "px";
	this.tip.style.left = left + "px";
}
ToolTip.prototype.hide= function ()
{
	if (this.tip) this.tip.style.display = "none";
}
var tooltip = null;
var toolTipOnLoad = function()
{
	tooltip = new ToolTip();
}
//window.onload = onLoad;