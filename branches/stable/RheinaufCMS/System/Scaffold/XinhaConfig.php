<?php session_start();
header('Content-type: text/javascript');
?>	
				xinha_editors = [];
				xinha_init    = null;
				xinha_config  = null;
				xinha_plugins = null;

				// This contains the names of textareas we will make into Xinha editors
				xinha_init = xinha_init ? xinha_init : function()
				{

					xinha_plugins = xinha_plugins ? xinha_plugins :
					[
					"SuperClean",

					"ExtendedFileManager",
					//"GetHtml",
					"Linker",
					"DoubleClick"
					];
				   
					if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;
					
					xinha_config = xinha_config ? xinha_config : new Xinha.Config();


					xinha_config.statusBar = false;
					xinha_config.toolbar =
					 [
					    ["bold","italic"],
					    ["separator","createlink","insertimage"],
					    ["separator","undo","redo","selectall"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
					    ["separator","killword","separator","htmlmode","about","showhelp"]
				 	 ];

					xinha_config.Linker.backend =  "/RheinaufCMS/Libraries/XinhaConfig/rheinauf_cms_db_scan.php";
					xinha_config.Linker.treeCaption =  project_name + " Server";
	
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

					xinha_config.SuperClean.show_dialog = true;
				    xinha_config.SuperClean.filters = {
				               "tidy": Xinha._lc("General tidy up and correction of some problems.", "SuperClean"),
				               "word": "Word"
				    }

				    xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

					Xinha.startEditors(xinha_editors);

				}
			window.onload = xinha_init;