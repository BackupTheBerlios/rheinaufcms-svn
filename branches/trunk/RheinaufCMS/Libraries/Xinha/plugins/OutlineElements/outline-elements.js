/*------------------------------------------*\
 OutlineElements for Xinha
 _______________________
    
\*------------------------------------------*/

function OutlineElements(editor) {
	this.editor = editor;
	
	var cfg = editor.config;
	var self = this;
	
	
	cfg.registerButton({
	id       : "outlineelements",
	tooltip  : this._lc("Outline Elements"),
	image    : _editor_url+"plugins/OutlineElements/img/outline.gif",
	textMode : false,
	action   : function(editor) {
			self.toggleActivity(editor);
		}
	});
	cfg.addToolbarElement("outlineelements", "htmlmode", 1);
}

OutlineElements._pluginInfo = {
  name          : "OutlineElements",
  version       : "1.0",
  developer     : "Raimund Meyer",
  developer_url : "http://rheinauf.de",
  c_owner       : "Raimund Meyer",
  sponsor       : "Raimund Meyer",
  sponsor_url   : "http://ray-of-light.org/",
  license       : "htmlArea"
};

OutlineElements.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'OutlineElements');
};

OutlineElements.prototype.onGenerate = function() {
	var self =this;
	
	var style = this.editor._doc.createElement("link");
		style.type = 'text/css';
		style.rel = 'stylesheet';
		style.href = _editor_url + 'plugins/OutlineElements/outline-elements.css';
	
	this.styleSheet = style;
	this.headElement = this.editor._doc.getElementsByTagName("HEAD")[0];

	this.outlined = false;
	

/*	HTMLArea._addEvents(
        self.editor._doc,
        [ "mouseover","mouseout"],
        function (event)
        {
          return self.mouseEvent(HTMLArea.is_ie ? self.editor._iframe.contentWindow.event : event);
        });*/

};

OutlineElements.prototype.mouseEvent = function(ev) {
	if (!this.outlined) return true;
	switch(ev.type)
	{
		case 'mouseover':
		break;
		case 'mouseout':
		break;
	}
	return true;
 };


OutlineElements.prototype.toggleActivity = function() {
	
	if (this.outlined) {
		this.outlined = false;
		this.headElement.removeChild(this.styleSheet);
	} 
	else {
		this.outlined = true;
		this.headElement.appendChild(this.styleSheet);		
	} 
	this.editor._toolbarObjects.outlineelements.state("active", this.outlined);
 };
 
OutlineElements.prototype.onUpdateToolbar = function() {
	this.editor._toolbarObjects.outlineelements.state("active", this.outlined);
}
