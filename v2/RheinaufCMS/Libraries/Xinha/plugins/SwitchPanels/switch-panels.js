/*------------------------------------------*\
 SwitchPanels for Xinha
 _______________________
 
     
\*------------------------------------------*/

function SwitchPanels(editor) {
	this.editor = editor;
	this.panels_hidden = false;

	var cfg = editor.config;
	var self = this;
	

	cfg.registerButton({
	id       : "switchpanels",
	tooltip  : this._lc("Insert Snippet"),
	image    : editor.imgURL("ed_snippet.gif", "SwitchPanels"),
	textMode : false,
	action   : function(editor) {
			self.buttonPress(editor);
		}
	});
	//cfg.addToolbarElement("switchpanels", "insertimage", -1);
}

SwitchPanels._pluginInfo = {
  name          : "SwitchPanels",
  version       : "1.1",
  developer     : "Raimund Meyer",
  developer_url : "http://rheinauf.de",
  c_owner       : "Raimund Meyer",
  sponsor       : "Raimund Meyer",
  sponsor_url   : "http://ray-of-light.org/",
  license       : "htmlArea"
};

SwitchPanels.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'SwitchPanels');
};


	
SwitchPanels.prototype.buttonPress = function(editor) {
	switch (this.panels_hidden) {
		case false:
			this.editor.hidePanels();
			this.panels_hidden = true;
		break;	
		case true:
			this.editor.showPanels();
			this.panels_hidden = false;
		break;
		
	}
	
  };
