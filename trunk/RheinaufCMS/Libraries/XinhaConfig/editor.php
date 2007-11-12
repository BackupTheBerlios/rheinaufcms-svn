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
_editor_skin = 'silva'; 
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
	'PasteText',
	'CharacterMap',
	//'ContextMenu',
	//'FindReplace',
	//'ListType',
	
	'InsertSnippet',
	'Stylist',
	'SuperClean',
	'TableOperations',
	//'ImageManager',
	'ExtendedFileManager',
	'InsertAnchor',
	'Linker',
	'DoubleClick',
	//'HorizontalRule',
	'SaveSubmit',
	'SmartReplace',
	'CustomUtils',
	'HtmlEntities'
	];

	xinha_editors = xinha_editors ? xinha_editors :
	[
	'editor'
	];
	     // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
	     if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;
	     
	xinha_config = xinha_config ? xinha_config : new Xinha.Config();
	xinha_config.stripScripts = false;

	
	xinha_config.toolbar =
	 [
	    ["formatblock","bold","italic"],
	    ["separator","insertorderedlist","insertunorderedlist"],
	    ["separator","inserthorizontalrule","createlink","insertimage","inserttable"],
	    ["separator","undo","redo","selectall"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
	    ["separator","killword","removeformat","toggleborders","separator","htmlmode","about"]
 	 ];

	xinha_config.showLoading = true;

  xinha_config.pageStyleSheets = ['/CSS/Design.css'];

  xinha_config.stylistLoadStylesheet('/CSS/Styles.css');
	
  xinha_config.stylistLoadStylesheet('/Libraries/XinhaConfig/editor.css');
	
  xinha_config.Linker.backend =  '/RheinaufCMS/Libraries/XinhaConfig/rheinauf_cms_db_scan.php';
	xinha_config.Linker.treeCaption =  project_name + ' Server';

	xinha_config.SuperClean.show_dialog = true;
    xinha_config.SuperClean.filters = {
               'tidy': Xinha._lc('General tidy up and correction of some problems.', 'SuperClean'),
               'word_edited': 'Word'
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
			$IMConfig['allowed_link_extensions'] = array("doc","fla","gif","gz","html","jpg","js","mov","wmv","avi","pdf","php","png","ppt","rar","txt","xls","zip","mp3");
			
			require_once $docroot.'/RheinaufCMS/Libraries/Xinha/contrib/php-xinha.php';
			xinha_pass_to_php_backend($IMConfig);
		?>
		}
	}

	xinha_config.InsertSnippet.showInsertVariable =true;
  xinha_config.InsertSnippet.snippets = '/Admin/SeiteEdit?getsnippets';

    
  xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

	
	<?php 
	if(is_file('../../CSS/Styles.css'))
	{
		print "	xinha_editors.editor.config.stylistLoadStylesheet('/CSS/Styles.css');";
	}
	if(is_file('../../CSS/'.$_SESSION['rubrik'].'.css'))
	{
		$rubrik = $_SESSION['rubrik'];
		print "	xinha_editors.editor.config.stylistLoadStylesheet('/CSS/$rubrik.css');";
	}
	?>
	Xinha.startEditors(xinha_editors);

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

	function setHTML(html)
	{
			xinha_editors.editor.setHTML(xinha_editors.editor.inwardHtml(html));
	}
	
	

	function save(xinha_object,action) 
	{
		var newtitle = (action.indexOf('workingversion') > -1) ? document.title.replace(/Liveversion/,'Arbeitsversion'):  document.title.replace(/Arbeitsversion/,'Liveversion');
		document.title = newtitle;
		xinha_editors.editor._textArea.form.action = action.replace(/&amp;/,'&');
		var savesubmit = xinha_editors.editor.plugins.SaveSubmit.instance;
		savesubmit.save(xinha_editors.editor);
	}

	function revert (file,xinha_object) {

		Xinha._getback(window.location.href+'&nohtml&revert='+file,function(getback){if (getback) {

		setHTML(getback);
													}
		});
	}
