<?php if (!isset($_SESSION)) session_start();
header('Content-type:text/javascript');
/*--------------------------------
--  Xinha Editor Configuration
--
--  $HeadURL: https://raimund@svn.berlios.de/svnroot/repos/rheinaufcms/trunk/RheinaufCMS/Libraries/XinhaConfig/editor.php $
--  $LastChangedDate: 2006-10-17 14:24:30 +0200 (Di, 17 Okt 2006) $
--  $LastChangedRevision: 32 $
--  $LastChangedBy: raimund $
---------------------------------*/

?>

	xinha_editors = null;
	xinha_init    = null;
	xinha_config  = null;
	xinha_plugins = null;

	// This contains the names of textareas we will make into Xinha editors
	xinha_init = xinha_init ? xinha_init : function()
	{

	xinha_plugins = xinha_plugins ? xinha_plugins :
	[
	'CharacterMap',
	'ExtendedFileManager',
	'SuperClean',
	'PasteText',
	'RheinaufCMSLinker',
	'DoubleClick',
	'Stylist',
	'SmartReplace',
	'Linker',
	'HtmlEntities'
	];

	xinha_editors = xinha_editors ? xinha_editors :
	[
	'input_1'
	];
	     // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
	     if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;
	     
	xinha_config = xinha_config ? xinha_config : new Xinha.Config();


	xinha_config.height = 400 + 'px';
	xinha_config.width = 600 + 'px';

	xinha_config.toolbar =
	 [
	    ["popupeditor","formatblock","bold","italic"],
	    ["separator","insertorderedlist","insertunorderedlist"],
	    ["separator","inserthorizontalrule","createlink","insertimage","inserttable"],
	    ["separator","undo","redo","selectall"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
	    ["separator","killword","removeformat","toggleborders","separator","htmlmode","about"]
 	 ];

	xinha_config.pageStyle = "body {padding:0 !IMPORTANT}";


	xinha_config.stripBaseHref = true;
	xinha_config.baseHref = "<?php print 'http://'. $_SERVER['SERVER_NAME'] ?>";

  xinha_config.Linker.backend =  '/Libraries/XinhaConfig/rheinauf_cms_db_scan.php',

	xinha_config.SuperClean.show_dialog = true;
    xinha_config.SuperClean.filters = {
               'tidy': Xinha._lc('General tidy up and correction of some problems.', 'SuperClean'),
               'word_edited': 'Word'
    }
  
    
	xinha_config.pageStyleSheets = ['/CSS/Design.css'];
  xinha_config.stylistLoadStylesheet('/CSS/Styles.css');
	
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

    
    xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);	
	Xinha.startEditors(xinha_editors);

}

	Xinha._addEvent(window,"load",xinha_init);