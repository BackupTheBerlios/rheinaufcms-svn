var agt=navigator.userAgent.toLowerCase();
var is_ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));


function _addEvent(el, evname, func) {
  if (is_ie) {
    el.attachEvent("on" + evname, func);
  } else {
    el.addEventListener(evname, func, true);
  }

};

function _addEvents(el, evs, func) {
  for (var i = evs.length; --i >= 0;) {
    _addEvent(el, evs[i], func);
  }
};

function _removeEvent(el, evname, func) {
  if (is_ie) {
    el.detachEvent("on" + evname, func);
  } else {
    el.removeEventListener(evname, func, true);
  }
};

function _removeEvents(el, evs, func) {
  for (var i = evs.length; --i >= 0;) {
    _removeEvent(el, evs[i], func);
  }
};

function _stopEvent(ev) {
  if (is_ie) {
    try{
      ev.cancelBubble = true;
      ev.returnValue = false;
    } catch(e){}
  } else {
    ev.preventDefault();
    ev.stopPropagation();
  }
};

function ContextMenu  () {
	var self = this;

	var doc = document;
	_addEvents(doc, ["contextmenu"],
			    function (event) {
				    return self.popupMenu(is_ie ? window.event : event);
			    });
	this.currentMenu = null;

}


ContextMenu.prototype.getContextMenu = function(target) {
	var self = this;
	/*item: item,
				label: label,
				action: option[1],
				tooltip: option[2] || null,
				icon: option[3] || null,
				activate: function() {
					self.closeMenu();
					this.action();
				}*/
	var menu = [];
	var id = target.id;
	if (typeof ctx_menu[id] == 'undefined') return false;
	for (var i=0;i<ctx_menu[id].length;i++)
	{
		menu.push(ctx_menu[id][i]);
	}


	return menu;
};

ContextMenu.prototype.popupMenu = function(ev) {
	var self = this;
	var el = is_ie ? ev.srcElement : ev.target;

	if (this.currentMenu && this.currentMenu.parentNode)
		this.currentMenu.parentNode.removeChild(this.currentMenu);
	function getPos(el) {
		var r = { x: el.offsetLeft, y: el.offsetTop };
		if (el.offsetParent) {
			var tmp = getPos(el.offsetParent);
			r.x += tmp.x;
			r.y += tmp.y;
		}
		return r;
	}
	function documentClick(ev) {
		ev || (ev = window.event);
		if (!self.currentMenu) {
			return false;
		}
		var el = is_ie ? ev.srcElement : ev.target;
		for (; el != null && el != self.currentMenu; el = el.parentNode);
		if (el == null)
			self.closeMenu();
		//HTMLArea._stopEvent(ev);
		//return false;
	}
	var keys = [];
	function keyPress(ev) {
		ev || (ev = window.event);
		_stopEvent(ev);
		if (ev.keyCode == 27) {
			self.closeMenu();
			return false;
		}
		var key = String.fromCharCode(is_ie ? ev.keyCode : ev.charCode).toLowerCase();
		for (var i = keys.length; --i >= 0;) {
			var k = keys[i];
			if (k[0].toLowerCase() == key)
				k[1].__msh.activate();
		}
	}
	self.closeMenu = function() {
		if (!self.currentMenu && !self.currentMenu.parentNode) return;
		self.currentMenu.parentNode.removeChild(self.currentMenu);
		self.currentMenu = null;
		_removeEvent(document, "mousedown", documentClick);


		if (is_ie)
			self.iePopup.hide();
	}
	var target = is_ie ? ev.srcElement : ev.target;
    var ifpos = getPos(target);//_iframe);
	var x =  ifpos.x;//;ev.clientX+ ifpos.x;
	var y =  ifpos.y;//ev.clientY+ ifpos.y;

	var div;
	var doc;
	if (!is_ie) {
		doc = document;
	} else {
		// IE stinks
		var popup = this.iePopup = window.createPopup();
		doc = popup.document;
		doc.open();
		doc.write("<html><head><style type='text/css'>@import url(/RheinaufCMS/Libraries/ContextMenu/ContextMenu.css); html, body { padding: 0px; margin: 0px; overflow: hidden; border: 0px; }</style></head><body unselectable='yes'></body></html>");
		doc.close();
	}
	div = doc.createElement("div");
	if (is_ie)
		div.unselectable = "on";
	div.oncontextmenu = function() { return false; };
	div.className = "htmlarea-context-menu";
	if (!is_ie)
		div.style.left = div.style.top = "0px";
	doc.body.appendChild(div);

	var table = doc.createElement("table");
	div.appendChild(table);
	table.cellSpacing = 0;
	table.cellPadding = 0;
	var parent = doc.createElement("tbody");
	table.appendChild(parent);

	var options = this.getContextMenu(target);
	if (!options) return true;
	for (var i = 0; i < options.length; ++i) {
		var option = options[i];
		var item = doc.createElement("tr");
		parent.appendChild(item);
		if (is_ie)
			item.unselectable = "on";
		else item.onmousedown = function(ev) {
			_stopEvent(ev);
			return false;
		};
		if (!option) {
			item.className = "separator";
			var td = doc.createElement("td");
			td.className = "icon";
			var IE_IS_A_FUCKING_SHIT = '>';
			if (is_ie) {
				td.unselectable = "on";
				IE_IS_A_FUCKING_SHIT = " unselectable='on' style='height=1px'>&nbsp;";
			}
			td.innerHTML = "<div" + IE_IS_A_FUCKING_SHIT + "</div>";
			var td1 = td.cloneNode(true);
			td1.className = "label";
			item.appendChild(td);
			item.appendChild(td1);
		} else {
			var label = option[0];
			item.className = "item";
			item.__msh = {
				item: item,
				label: label,
				action: option[1],
				tooltip: option[2] || null,
				icon: option[3] || null,
				activate: function() {
					self.closeMenu();
					this.action();
				}
			};
			//label = label.replace(/_([a-zA-Z0-9])/, "<u>$1</u>");
			if (label != option[0])
				keys.push([ RegExp.$1, item ]);
			//label = label.replace(/__/, "_");
			var td1 = doc.createElement("td");
			if (is_ie)
				td1.unselectable = "on";
			td1.innerHTML = "<img align='middle' src='" + item.__msh.icon + "' />";
			td1.className = "icon";
			item.appendChild(td1);


      var td2 = doc.createElement("td");
			if (is_ie)
				td2.unselectable = "on";
			item.appendChild(td2);
			td2.className = "label";
			td2.innerHTML = label;
			item.onmouseover = function() {
				this.className += " hover";

			};
			item.onmouseout = function() { this.className = "item"; };
			item.oncontextmenu = function(ev) {
				this.__msh.activate();
				if (!is_ie)
					_stopEvent(ev);
				return false;
			};
			item.onmouseup = function(ev) {
				var timeStamp = (new Date()).getTime();
				if (timeStamp - self.timeStamp > 500)
					this.__msh.activate();
				if (!is_ie)
					_stopEvent(ev);
				return false;
			};
			//if (typeof option[2] == "string")
			//item.title = option[2];
		}
	}

	if (!is_ie) {
   //  FIXME: I think this is to stop the popup from running off the bottom of the screen?
		var dx = x + div.offsetWidth - window.innerWidth + 4;
		var dy = y + div.offsetHeight - window.innerHeight + 4;
    // alert('dy= (' + y + '+' + div.offsetHeight + '-' + window.innerHeight + ' + 4 ) = ' + dy);
	//	if (dx > 0) x -= dx;
		//if (dy > 0) y -= dy;

		div.style.left = x + "px";
		div.style.top = y + "px";
	} else {
    // To get the size we need to display the popup with some width/height
    // then we can get the actual size of the div and redisplay the popup at the
    // correct dimensions.
    this.iePopup.show(ev.screenX, ev.screenY, 300,50);
		var w = div.offsetWidth;
		var h = div.offsetHeight;
		this.iePopup.show(ev.screenX, ev.screenY, w, h);
	}

	this.currentMenu = div;
	this.timeStamp = (new Date()).getTime();

	_addEvent(document, "mousedown", documentClick);

	if (keys.length > 0)
		_addEvent(this.editordoc, "keypress", keyPress);

	_stopEvent(ev);
	return false;
};
_addEvent(window, "load", function () {new ContextMenu()});