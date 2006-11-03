/*------------------------------------------*\
 OutlineElements for Xinha
 _______________________
    
\*------------------------------------------*/

function OutlineElements(editor) {
	this.editor = editor;
	this.panels_hidden = false;

	var cfg = editor.config;
	var self = this;
	
	this.elements = "form textarea fieldset ul ol dl li div " +
"p h1 h2 h3 h4 h5 h6 quote pre table thead " +
"tbody tfoot tr td th iframe address blockquote" + ' span img';
	this.el_array = this.elements.split(/ /);

	cfg.registerButton({
	id       : "outlineelements",
	tooltip  : this._lc("Outline Elements"),
	image    : editor.imgURL("ed_snippet.gif", "OutlineElements"),
	textMode : false,
	action   : function(editor) {
			self.buttonPress(editor);
		}
	});
	//cfg.addToolbarElement("outlineelements", "insertimage", -1);
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
  var style_id = "OE-style";
  var style = this.editor._doc.getElementById(style_id);
  if (style == null) {
    style = this.editor._doc.createElement("link");
    style.id = style_id;
    style.rel = 'stylesheet';
    style.href = _editor_url + 'plugins/OutlineElements/outline-elements.css';
    this.editor._doc.getElementsByTagName("HEAD")[0].appendChild(style);
  }
  
  this.editor.notifyOn( 'modechange',
      function(e,args)
      {
        if ( args.mode == 'text' && self.outlined) {
        	self.removeAll();
        	self.editor._textArea.value= self.editor.getHTML();
        }
        else if (args.mode == 'wysiwyg' && self.outlined) {
          	self.outlineAll();	
        }
      }
    );
};
	
OutlineElements.prototype.buttonPress = function() {
	this.toggleAll();
 };
 
OutlineElements.prototype.toggleAll = function() {
	
	if (this.outlined) {
		this.outlined = false;
		this.removeAll();
	} 
	else {
		this.outlined = true;
		this.outlineAll();
	} 
 };

OutlineElements.prototype.outlineAll = function() {
	for (var i = 0;i<this.el_array.length;i++) {
			this.outlineElement(this.el_array[i]);	
		}
};

OutlineElements.prototype.removeAll = function() {
	for (var i = 0;i<this.el_array.length;i++) {
			this.removeOutline(this.el_array[i]);	
		}
};

OutlineElements.prototype.outlineElement = function(el) {
	
	var doc = this.editor._doc;
	var els = doc.getElementsByTagName(el);
	for (var i=0; i <els.length;i++) {
		HTMLArea._addClass(els[i],"oe-outline");	
	}
 };
 
 OutlineElements.prototype.removeOutline = function(el) {
	
	var doc = this.editor._doc;
	var els = doc.getElementsByTagName(el);
	for (var i=0; i <els.length;i++) {
		HTMLArea._removeClass(els[i],"oe-outline");	
	}
 };
 
  OutlineElements.prototype.uniteParagraphs = function() {
	
	var editor = this.editor;
	var selection = editor.getSelectedHTML();
	editor.insertHTML(selection.replace(/<\/p>\s*<p[^>]*>/ig,'<br />'));
	return;
 };