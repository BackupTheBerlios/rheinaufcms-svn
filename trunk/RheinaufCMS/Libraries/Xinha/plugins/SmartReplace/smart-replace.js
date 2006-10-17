/*------------------------------------------*\
 OutlineElements for Xinha
 _______________________
    
\*------------------------------------------*/

function SmartReplace(editor) {
	this.editor = editor;
	
	var cfg = editor.config;
	var self = this;
	
	cfg.registerButton({
	id       : "smartreplace",
	tooltip  : this._lc("Smart Replace"),
	image    : _editor_url+"plugins/SmartReplace/img/smartquotes.gif",
	textMode : false,
	action   : function(editor) {
			self.toggleActivity(editor);
		}
	});
	cfg.addToolbarElement("smartreplace", "htmlmode", 1);
}

SmartReplace._pluginInfo = {
  name          : "SmartReplace",
  version       : "1.0",
  developer     : "Raimund Meyer",
  developer_url : "http://rheinauf.de",
  c_owner       : "Raimund Meyer",
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};

SmartReplace.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'SmartReplace');
};

HTMLArea.Config.prototype.SmartReplace =
{
	'defaultActive' : true,
	'quotes' : null//[String.fromCharCode(187),String.fromCharCode(171),String.fromCharCode(8250),String.fromCharCode(8249)]
}
SmartReplace.prototype.toggleActivity = function() {
	this.active = this.active ? false : true;
	this.editor._toolbarObjects.smartreplace.state("active", this.active);
}

SmartReplace.prototype.onUpdateToolbar = function() {
	this.editor._toolbarObjects.smartreplace.state("active", this.active);
}

SmartReplace.prototype.onGenerate = function() {
	this.active = this.editor.config.SmartReplace.defaultActive;
	this.editor._toolbarObjects.smartreplace.state("active", this.active);
	
	var self = this;
	HTMLArea._addEvents(
        self.editor._doc,
        [ "keypress"],
        function (event)
        {
          return self.keyEvent(HTMLArea.is_ie ? self.editor._iframe.contentWindow.event : event);
        });
    
    var quotes = this.editor.config.SmartReplace.quotes;
   
    if (quotes && typeof quotes == 'object')
    {
	    this.openingQuotes = quotes[0];
		this.closingQuotes = quotes[1];
		this.openingQuote  = quotes[2];
		this.closingQuote  = quotes[3];
    }
    else
    {
    	this.openingQuotes = this._lc("OpeningDoubleQuotes");
		this.closingQuotes = this._lc("ClosingDoubleQuotes");
		this.openingQuote  = this._lc("OpeningSingleQuote");
		this.closingQuote  = this._lc("ClosingSingleQuote");
    }
 	
	if (this.openingQuotes == 'OpeningDoubleQuotes') //English style as default
	{
		this.openingQuotes = String.fromCharCode(8220);
		this.closingQuotes = String.fromCharCode(8221);
		this.openingQuote = String.fromCharCode(8216);
		this.closingQuote = String.fromCharCode(8217);
	}
};

SmartReplace.prototype.keyEvent = function(ev)
{
	if ( !this.active) return true;
	var editor = this.editor;
	var charCode =  HTMLArea.is_ie ? ev.keyCode : ev.charCode;
	
	var key = String.fromCharCode(charCode);

	if (charCode == 32) //space bar
	{
		return this.smartDash(ev)
	}
	if ( key == '"' || key == "'")
	{
		return this.smartQuotes(ev,key);
	}
	return true;
}

SmartReplace.prototype.smartQuotes = function(ev,kind)
{
	if (kind == "'")
	{
		var opening = this.openingQuote;
		var closing = this.closingQuote;
	}
	else
	{
		var opening = this.openingQuotes;
		var closing = this.closingQuotes;
	}
	
	var editor = this.editor;
	HTMLArea._stopEvent(ev);
		
	var sel = this.editor._getSelection();
	
	if (HTMLArea.is_ie)
	{
		var r = this.editor._createRange(sel);
		if (r.text !== '')
		{
			r.text = '';
		}
		r.moveStart('character', -1);
		
		if(r.text.match(/\S/))
		{
			r.moveStart('character', +1);
			r.text = closing;
		}
		else
		{
			r.moveStart('character', +1);
			r.text = opening;
		}
	}
	else
	{
		if (!sel.isCollapsed)
		{
			this.editor.insertNodeAtSelection(document.createTextNode(''));
		}
		if (sel.anchorOffset > 0) sel.extend(sel.anchorNode,sel.anchorOffset-1);
		
		if(sel.toString().match(/\S/))
		{
			sel.collapse(sel.anchorNode,sel.anchorOffset);
			this.editor.insertNodeAtSelection(document.createTextNode(closing));
		}
		else
		{
			sel.collapse(sel.anchorNode,sel.anchorOffset);
			this.editor.insertNodeAtSelection(document.createTextNode(opening));
		}
	}
}

SmartReplace.prototype.smartDash = function(ev)
{
	var editor = this.editor;
	var sel = this.editor._getSelection();
	if (HTMLArea.is_ie)
	{
		var r = this.editor._createRange(sel);
		r.moveStart('character', -2);
		
		if(r.text.match(/\s-/))
		{
			r.text = ' '+ String.fromCharCode(8211);
		}
	}
	else
	{
		sel.extend(sel.anchorNode,sel.anchorOffset-2);
		if(sel.toString().match(/^-/))
		{
			this.editor.insertNodeAtSelection(document.createTextNode(' '+String.fromCharCode(8211)));
		}
		sel.collapse(sel.anchorNode,sel.anchorOffset);
	}
}