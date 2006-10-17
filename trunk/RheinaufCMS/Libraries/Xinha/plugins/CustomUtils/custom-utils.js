/*------------------------------------------*\
 OutlineElements for Xinha
 _______________________
    
\*------------------------------------------*/

function CustomUtils(editor) {
	this.editor = editor;
	
	var cfg = editor.config;
	var self = this;

}

CustomUtils._pluginInfo = {
  name          : "CustomUtils",
  version       : "1.0",
  developer     : "Raimund Meyer",
  developer_url : "http://rheinauf.de",
  c_owner       : "Raimund Meyer",
  sponsor       : "Raimund Meyer",
  sponsor_url   : "http://ray-of-light.org/",
  license       : "htmlArea"
};

CustomUtils.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'OutlineElements');
};

CustomUtils.prototype.onGenerate = function() {
	var self =this;
	
	this.editor._doc.getElementsByTagName("html")[0].id = 'editorhtml';
	this.editor._doc.getElementsByTagName("body")[0].id = 'editorbody';

	var catchClose = function () {
		var editor = self.editor;
		var savesubmit = editor.plugins.SaveSubmit.instance;
		if (!savesubmit.changed) return true;
		if (confirm('Sie haben noch ungespeicherte Änderungen.\nWollen Sie die Seite jetzt speichern?')) {
			savesubmit.save(editor);
			alert('Bitte warten Sie einige Sekunden bis das Speichern abgeschlossen ist und klicken dann OK.');
		}
		return true;
	}
	this.resize();
	HTMLArea.addDom0Event(window, 'resize', function(e) { self.resize() });
	HTMLArea.prependDom0Event(window,'unload',catchClose);
};

function wSize ()
{
	var x,y;
    if (window.innerHeight) // all except Explorer
    {
      x = window.innerWidth;
      y = window.innerHeight;
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
	return {'x':x,'y':y};
}

CustomUtils.prototype.resize = function()
{
	var win = wSize();
	
	var x = win.x - 5 + 'px';
	var y = win.y - 30 + 'px';
	this.editor.sizeEditor(x,y,true,true);
	this.editor.config.height = y;
	this.editor.config.width = x;
	
	return true;
}


function debug (object) {
	for (var i in object) {
		if (!confirm(i + '=>' + object[i])) break;
	}
}