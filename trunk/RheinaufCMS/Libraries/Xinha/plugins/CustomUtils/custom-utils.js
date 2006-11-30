/*------------------------------------------*\
 RheinaufCMS CustomUtils for Xinha
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
	xinha_editors.editor.activateEditor();
	xinha_editors.editor.focusEditor();
	//
};
CustomUtils.prototype.onUpdateToolbar = function() {
	 if (/<[^>]*class="?mso/i.test(this.editor._doc.body.innerHTML)) this.editor._wordClean();
 }
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


HTMLArea.prototype.customWordClean = function(html) {

	var attributes_to_strip = ['valign','cellpadding','cellspacing','border','width','style','bgcolor','background','text','link','vlink','leftmargin','topmargin','marginwidth','marginheight'];

	// Remove HTML comments
	html = html.replace(/<!--[\w\s\d@{}:.;,'"%!#_=&|?~()[*+\/\-\]]*-->/gi, "" );
	html = html.replace(/<!--[^\0]*-->/gi, '');
    // Remove all HTML tags
	html = html.replace(/<\/?\s*HTML[^>]*>/gi, "" );
    // Remove all BODY tags
    html = html.replace(/<\/?\s*BODY[^>]*>/gi, "" );
    // Remove all META tags
	html = html.replace(/<\/?\s*META[^>]*>/gi, "" );
    // Remove all SPAN tags
	//html = html.replace(/<\/?\s*SPAN[^>]*>/gi, "" );
	// Remove all FONT tags
    html = html.replace(/<\/?\s*FONT[^>]*>/gi, "");
    // Remove all IFRAME tags.
    html = html.replace(/<\/?\s*IFRAME[^>]*>/gi, "");
    // Remove all STYLE tags & content
	html = html.replace(/<\/?\s*STYLE[^>]*>(.|[\n\r\t])*<\/\s*STYLE\s*>/gi, "" );
    // Remove all TITLE tags & content
	html = html.replace(/<\s*TITLE[^>]*>(.|[\n\r\t])*<\/\s*TITLE\s*>/gi, "" );
	// Remove javascript
    //html = html.replace(/<\s*SCRIPT[^>]*>[^\0]*<\/\s*SCRIPT\s*>/gi, "");
    // Remove all HEAD tags & content
	html = html.replace(/<\s*HEAD[^>]*>(.|[\n\r\t])*<\/\s*HEAD\s*>/gi, "" );
	// Remove Class attributes
	//html = html.replace(/<\s*(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove Style attributes
	//html = html.replace(/<\s*(\w[^>]*)( style="[^"]*")([^>]*)/gi, "<$1$3") ;
	// Remove Lang attributes
	html = html.replace(/<\s*(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove XML elements and declarations
	html = html.replace(/<\\?\?xml[^>]*>/gi, "") ;
	// Remove Tags with XML namespace declarations: <o:p></o:p>
	html = html.replace(/<\/?\w+:[^>]*>/gi, "") ;
	// Replace the &nbsp;
	//html = html.replace(/&nbsp;/, " " );

	//remove attributes
	var re = new RegExp('\w?('+attributes_to_strip.join('|')+')=("[^"]*"\w?|[\s]*)','gim');
	html = html.replace(re,'');
	alert(html);
	// Transform <p><br /></p> to <br>
	//html = html.replace(/<\s*p[^>]*>\s*<\s*br\s*\/>\s*<\/\s*p[^>]*>/gi, "<br />");
	html = html.replace(/<\s*p[^>]*><\s*br\s*\/?>\s*<\/\s*p[^>]*>/gi, "<br />");


	// Remove any <br> at the end
	html = html.replace(/(\s*<br>|<br \/>\s*)*$/, "");
	
	//remove span without attributes
	html = html.replace(/<span ?>(.*?)<\/span>/gim, "$1");

	html = html.trim();
	return html;
}

HTMLArea.prototype._wordClean = function()
{
  var editor = this;
  var stats =
  {
    empty_tags : 0,
    mso_class  : 0,
    mso_style  : 0,
    mso_xmlel  : 0,
    orig_len   : this._doc.body.innerHTML.length,
    T          : (new Date()).getTime()
  };
  var stats_txt =
  {
    empty_tags : HTMLArea._lc("Leere Tags entfernt: "),
    mso_class  : HTMLArea._lc("MSO classes entfernt: "),
    mso_style  : HTMLArea._lc("MSO inline styles entfernt: "),
    mso_xmlel  : HTMLArea._lc("MSO XML Elemente entfernt: ")
  };

  function showStats()
  {
    var txt = "Xinha Word Cleaner Ergebnis: \n\n";
    txt += "Anfängliche Länge: " + stats.orig_len + "\n";
    txt += "Nach dem Aufräumen: " + editor._doc.body.innerHTML.length + "\n\n";
    for ( var i in stats )
    {
      if ( stats_txt[i] )
      {
        txt += stats_txt[i] + stats[i] + "\n";
      }
    }
   
    //txt += "Clean-up took " + (((new Date()).getTime() - stats.T) / 1000) + " seconds";
    alert(txt);
  }

  function clearClass(node)
  {
    var newc = node.className.replace(/(^|\s)mso.*?(\s|$)/ig, ' ');
    if ( newc != node.className )
    {
      node.className = newc;
      if ( ! ( /\S/.test(node.className) ) )
      {
        node.removeAttribute("className");
        ++stats.mso_class;
      }
    }
  }

  function clearStyle(node)
  {
    var declarations = node.style.cssText.split(/\s*;\s*/);
    for ( var i = declarations.length; --i >= 0; )
    {
      if ( ( /^mso|^tab-stops/i.test(declarations[i]) ) || ( /^margin\s*:\s*0..\s+0..\s+0../i.test(declarations[i]) ) )
      {
        ++stats.mso_style;
        declarations.splice(i, 1);
      }
    }
    node.style.cssText = declarations.join("; ");
  }

  var stripTag = null;
  if ( HTMLArea.is_ie )
  {
    stripTag = function(el)
    {
      el.outerHTML = HTMLArea.htmlEncode(el.innerText);
      ++stats.mso_xmlel;
    };
  }
  else
  {
    stripTag = function(el)
    {
      var txt = document.createTextNode(HTMLArea.getInnerText(el));
      el.parentNode.insertBefore(txt, el);
      HTMLArea.removeFromParent(el);
      ++stats.mso_xmlel;
    };
  }

  function checkEmpty(el)
  {
    // @todo : check if this is quicker
    //  if (!['A','SPAN','B','STRONG','I','EM','FONT'].contains(el.tagName) && !el.firstChild)
    if ( /^(a|span|b|strong|i|em|font)$/i.test(el.tagName) && !el.firstChild)
    {
      HTMLArea.removeFromParent(el);
      ++stats.empty_tags;
    }
  }

  function parseTree(root)
  {
    var tag = root.tagName.toLowerCase(), i, next;
    // @todo : probably better to use String.indexOf() instead of this ugly regex
    // if ((HTMLArea.is_ie && root.scopeName != 'HTML') || (!HTMLArea.is_ie && tag.indexOf(':') !== -1)) {
    
    if ( ( HTMLArea.is_ie && root.scopeName != 'HTML' ) || ( !HTMLArea.is_ie && ( /:/.test(tag) ) ) )
    {
      stripTag(root);
      return false;
    }
    else
    {
      clearClass(root);
      clearStyle(root);
      for ( i = root.firstChild; i; i = next )
      {
        next = i.nextSibling;
        if ( i.nodeType == 1 && parseTree(i) )
        {
          checkEmpty(i);
        }
      }
    }
    return true;
  }
  this._doc.body.innerHTML = this.customWordClean(this._doc.body.innerHTML);
  parseTree(this._doc.body);
  showStats();
  // this.debugTree();
  // this.setHTML(this.getHTML());
  // this.setHTML(this.getInnerHTML());
  // this.forceRedraw();
  this.updateToolbar();
};
