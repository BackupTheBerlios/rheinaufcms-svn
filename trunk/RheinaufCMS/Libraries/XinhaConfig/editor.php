<?php if (!isset($_SESSION)) session_start();
header('Content-type:text/javascript');
/*--------------------------------
--  Xinha Editor Configuration
--
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/

?>

window.moveTo(0,0);
window.resizeTo(screen.width,screen.height);
window.focus();

	xinha_editors = null;
	xinha_init    = null;
	xinha_config  = null;
	xinha_plugins = null;

	// This contains the names of textareas we will make into Xinha editors
	xinha_init = xinha_init ? xinha_init : function()
	{

	xinha_plugins = xinha_plugins ? xinha_plugins :
	[
	//'Properties',
	'CharacterMap',
	//'ContextMenu',
	//'FindReplace',
	//'FullScreen',
	//'ListType',
	'Stylist',
	'SuperClean',
	//'FullPage',
	'TableOperations',
	//'ImageManager',
	'ExtendedFileManager',
	//'Forms',
	'InsertAnchor',
	//'GetHtml',
	//'Linker',
	'RheinaufCMSLinker',
	'DoubleClick',
	'HorizontalRule',
	'InsertSnippet',
	'SaveSubmit',
	'SwitchPanels',
	'OutlineElements',
	//'CustomPage'
	'SmartReplace',
	'CustomUtils'
	];
	
	     // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
	     if(!HTMLArea.loadPlugins(xinha_plugins, xinha_init)) return;


	xinha_editors = xinha_editors ? xinha_editors :
	[
	'editor'
	];

	xinha_config = xinha_config ? xinha_config : new HTMLArea.Config();

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

	xinha_config.height = y-30 + 'px';
	xinha_config.width = x + 'px';

	xinha_config.toolbar =
	 [
	    ["formatblock","bold","italic"],
	    ["separator","insertorderedlist","insertunorderedlist"],
	    ["separator","inserthorizontalrule","createlink","insertimage","inserttable"],
	    ["separator","undo","redo","selectall"], (HTMLArea.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
	    ["separator","killword","removeformat","toggleborders","separator","htmlmode","about"]
 	 ];

 	//xinha_config.flowToolbars = false;
	xinha_config.showLoading = true;
	//xinha_config.only7BitPrintablesInURLs = false;


	xinha_config.stripBaseHref = true;
	xinha_config.baseHref = "<?php print 'http://'. $_SERVER['SERVER_NAME'] ?>";

	//xinha_config.ListType.mode = 'panel';
	//xinha_config.CharacterMap.mode = 'panel';

	xinha_config.InsertSnippet.css = ['/CSS/Screen.css'];
	xinha_config.InsertSnippet.showInsertVariable =true;
    xinha_config.InsertSnippet.snippets = '/RheinaufCMS/Libraries/XinhaConfig/snippets.php';

   // xinha_config.Linker.backend =  _editor_url + 'plugins/Linker/rheinauf_cms_db_scan.php',

	xinha_config.SuperClean.show_dialog = true;
    xinha_config.SuperClean.filters = {
               'tidy': HTMLArea._lc('General tidy up and correction of some problems.', 'SuperClean'),
          //     'word_edited': 'Word'
    }

   
	if (xinha_config.ExtendedFileManager) 
	{
		with (xinha_config.ExtendedFileManager)
		{
		<?php
			$docroot = preg_replace('/\/$/','',$_SERVER['DOCUMENT_ROOT']);
			// define backend configuration for the plugin
			$IMConfig = array();
			$IMConfig['images_dir'] = $docroot.'/RheinaufCMS/Images/';
			$IMConfig['images_url'] = '/Images/';
			$IMConfig['files_dir'] = $docroot.'/RheinaufCMS/Download/';
			$IMConfig['files_url'] = '/Download/';
			$IMConfig['max_filesize_kb_image'] = "300";
			$IMConfig['max_filesize_kb_link'] = "max";
			
			$IMConfig['images_enable_styling'] = false;
			$IMConfig['link_enable_target'] = false;
			$IMConfig['images_enable_align'] = false;
			$IMConfig['max_foldersize_mb'] = 0;
			$IMConfig['allowed_link_extensions'] = array("doc","fla","gif","gz","html","jpg","js","mov","pdf","php","png","ppt","rar","txt","xls","zip","mp3");
			
			require_once $docroot.'/RheinaufCMS/Libraries/Xinha/contrib/php-xinha.php';
			xinha_pass_to_php_backend($IMConfig);
		?>
		}
	}

    
    xinha_editors   = HTMLArea.makeEditors(xinha_editors, xinha_config, xinha_plugins);

	xinha_editors.editor.config.stylistLoadStylesheet('/CSS/Screen.css');
	xinha_editors.editor.config.stylistLoadStylesheet('/Libraries/XinhaConfig/editor.css');
	
	<?php if(is_file('../../CSS/Styles.css'))
			{
				print "	xinha_editors.editor.config.stylistLoadStylesheet('/CSS/Styles.css');";
			}
	?>
	<?php if(is_file('../../CSS/'.$_SESSION['rubrik'].'.css'))
			{
				$rubrik = $_SESSION['rubrik'];
				print "	xinha_editors.editor.config.stylistLoadStylesheet('/CSS/$rubrik.css');";
			}
	?>
	HTMLArea.startEditors(xinha_editors);

	if (document.all&&document.getElementById) {
			navRoot = document.getElementById("nav");
			for (i=0; i<navRoot.childNodes.length; i++) {
				node = navRoot.childNodes[i];
				if (node.nodeName=="LI") {
					node.onmouseover=function() {
						this.className+=" over";
					}
					node.onmouseout=function() {
						this.className=this.className.replace(" over", "");
					}
				}
			}
		}
}

	window.onload = xinha_init;



	function save(xinha_object,action) {

		var newtitle = (action.indexOf('workingversion') > -1) ? document.title.replace(/Liveversion/,'Arbeitsversion'):  document.title.replace(/Arbeitsversion/,'Liveversion');
		document.title =newtitle;
		xinha_object._textArea.form.action = action.replace(/&amp;/,'&');
		var savesubmit = xinha_object.plugins.SaveSubmit.instance;
		savesubmit.save(xinha_object);
	}

	function revert (file,xinha_object) {

		HTMLArea._getback(window.location.href+'&nohtml&revert='+file,function(getback){if (getback) {

		xinha_object.setHTML(getback);
													}
		});
	}
