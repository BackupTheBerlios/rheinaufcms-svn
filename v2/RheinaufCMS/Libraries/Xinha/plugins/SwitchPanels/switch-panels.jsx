/*------------------------------------------*\
 SwitchPanels for Xinha
 _______________________
 
 Insert HTML fragments or template variables
 
 Usage:
 1. Choose the file that contains the snippets
    You can either use a JS array (standard config: ./snippets.js) or a combination of PHP/HTML 
    where the PHP file reads the HTML file and converts it to a JS format. More convenient to maintain.
    Example:  xinha_config.SwitchPanels.snippets = _editor_url+"plugins/SwitchPanels/snippets.php"
              or
              xinha_config.SwitchPanels.snippets = "/Path/to/my/snippets.php" (has to be absolute)
 2. Edit the selected file to contain your stuff
 3. You can then include your own css
    Example: xinha_config.SwitchPanels.css = ['../../../CSS/Screen.css']; (may be relative)
 4. You can use the plugin also to insert template variables (i.e. the id in curly brackets) instead of static HTML.
    Set xinha_config.SwitchPanels.showInsertVariable true to display a choice option in the dialog
    
\*------------------------------------------*/

function SwitchPanels(editor) {
	this.editor = editor;

	
	var cfg = editor.config;
	var self = this;
	this.panels = this.editor._panels;
	this.panel_dimensions_cache = cfg.panel_dimensions;
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

SwitchPanels.prototype.onGenerate = function () {
	var self = this;
	var editor = this.editor;
	this.panels = this.editor._panels;
	
	editor._switch_p_right = this.addPanel( 'right' );
    HTMLArea.freeLater( editor, '_switch_p_right' );
    
    var div_p_right = document.createElement('div');
    var p_right_button = document.createElement('a');
    	p_right_button.href = 'javascript:void(0)';
	    
	    HTMLArea._addEvent( p_right_button, "click", function () {
	    	   		self.hidePanel('right');
	    		} );
	    
	    p_right_button.appendChild(document.createTextNode('hide'));
    
	div_p_right.appendChild(p_right_button);
   editor._switch_p_right.appendChild(div_p_right);
   
    editor.notifyOn('modechange',
                  function(e,args)
                  {
                    switch(args.mode)
                    {
                      case 'text':
                      {
                        editor.hidePanel(editor._switch_p_right);
                        break;
                      }
                      case 'wysiwyg':
                      {
                        editor.showPanel(editor._switch_p_right);
                        break;
                      }
                    }
                  }
                  );
}

SwitchPanels.prototype.hidePanel = function(side) {
	
	this.hidePanels(['right']);
	this.editor.config.panel_dimensions.right = '5px';
    this.panels[side].container.style.width = '5px';
   this.panels[side].div.style.width = '5px';
   
    this.editor.sizeEditor();
   // this.debug(panels[side]);
}

SwitchPanels.prototype.hidePanels = function(side)
  {
  	panels = this.panels;
    
  	this.reShow = [];
    for(var i = 1; i < panels[side].panels.length;i++)
    {
      	this.reShow.push(this.panels[side].panels[i]);
        this.panels[side].panels[i].style.display = 'none';
    }
    
  };
SwitchPanels.prototype.debug = function (object)
{
	for (var i in object) {
		alert(i +'=>'+ object[i]);
	}

}

SwitchPanels.prototype.addPanel = function(side)
  {
    var div = document.createElement('div');
    div.side = side;
    if(side == 'left' || side == 'right')
    {
      div.style.width = this.editor.config.panel_dimensions[side];
    }
    HTMLArea.addClasses(div, 'panel');
    this.editor._panels[side].panels.unshift(div);
    this.editor._panels[side].div.insertBefore(div,this.editor._panels[side].div.firstChild);

    this.editor.notifyOf('panel_change', {'action':'add','panel':div});

    return div;
};

SwitchPanels.prototype.panel_is_alive = function (pan) {
	var panels = this.panels;
	if(panels[pan].on && panels[pan].panels.length && HTMLArea.hasDisplayedChildren(panels[pan].container)) {
		panels[pan].container.style.display = '';
		return true;
	}
	// Otherwise make sure it's been removed from the framework
	else {
	 panels[pan].container.style.display='none';
	return false;
	}
}

HTMLArea.Config.prototype.SwitchPanels =
{
  'snippets' : _editor_url+"plugins/SwitchPanels/snippets.js",
  'css' : ['../SwitchPanels.css'],
  'showInsertVariable': false
};
	
