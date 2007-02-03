<?php
$long_name = 'Seiten bearbeiten';
$icon = 'filenew.png';
class SeiteEdit extends Admin
{
	var $navi = array();
	var $images = array();
	var $noframe =false;
	var $tables = array('navi_table'=>'RheinaufCMS>Navi',
						);

	function SeiteEdit($db_connection,$path_information)
	{
		$this->add_db_prefix();
		$this->connection = $db_connection;
		$this->extract_to_this($path_information);
		$this->install_path = INSTALL_PATH;

		//Bilder
		$this->images['edit'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit.png','Eigenschaften bearbeiten',array('title'=>'Eigenschaften bearbeiten'));

		$this->navi_array_update();
		$this->event_listen();

		if (isset($_GET['edit']) && isset($_GET['edit_page']) && !isset($_GET['golive']))
		{
			$this->noframe = true;
		}

	}
	function navi_array_update ()
	{
		$this->navi = $this->navi_array();
		$this->linker_navi();
	}

	function show()
	{
		if (!$this->check_right('SeiteEdit')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));

		if (!isset($_GET['nohtml']))
		{
			if (isset($_GET['edit']) && isset($_GET['edit_page']) && !isset($_GET['golive']))
			{
				return  $this->editor();
			}
			else
			{
				return  $this->scripts().$this->navi_table();
			}
		}
	}

	function scripts()
	{

	}
	function event_listen()
	{
		if (!$this->check_right('SeiteEdit')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		if (isset($_GET['revert'])) $this->revert();
		if (isset($_POST['editor_text']) && isset($_GET['tmp'])) {$this->save_tmp();}
		else if (isset($_POST['editor_text'])) {$this->save();}
		if (isset($_GET['golive'])) $this->golive();
		if (isset($_GET['workingvmenu'])) print $this->revert_menu_js();
	}

	function navi_table()
	{
		$return_string = '';

		$navi_table = new Table(1,array('style'=>'float:left;margin-right:30px'));
		$navi_table->add_caption('Rubriken');
		$navi_table->add_th(array('','Name',''));
		for ($i = 0;$i<count($this->navi);$i++)
		{
			if ($this->navi[$i]['Modul']=='')
			{
				$name = $this->I18n_get_real($this->navi[$i]['Rubrik']);
				$edit_button = Html::a($_SERVER['REDIRECT_URL'].'?edit='.$i,$name);
				$navi_table->add_td(array( $edit_button));
			}
		}

		$return_string .= $navi_table->flush_table();


		if (isset($_GET['edit']))
		{
			 $return_string .= $this->pages_table($_GET['edit']);
		}
		return $return_string;
	}

	function pages_table($j)
	{
		$rubrik = $this->navi[$j]['Rubrik'];
		$rubrik = $this->I18n_get_real($rubrik);
		$return_string = '';
		$navi_table = new Table(3);
		$navi_table->add_caption('Seiten in '.$rubrik);

		$rubrik_folder = $this->path_encode($rubrik);
		$navi_table->add_th(array('Live-Version','Arbeits-Version'),array('style:padding-right:5px;'));
		for ($i = 0;$i < count ($this->navi[$j]['Subnavi']) ;$i++)
		{
			if (!empty ($this->navi[$j]['Subnavi'][$i]) && $this->navi[$j]['Subnavi'][$i]['Modul'] == '')
			{
				$name = $this->I18n_get_real($this->navi[$j]['Subnavi'][$i]['Seite']);
				$seite_folder = $this->path_encode($name);
				$edit_button = Html::a(SELF.'?edit_page='.$i.'&edit='.$j,$name.$this->images['edit'],array('onclick'=>"window.open('/Admin/SeiteEdit?edit_page=$i&edit=$j','Editor','resizable=yes,status=no');return false"));
				$working_version_button = Html::a(SELF.'?workingversion&edit_page='.$i.'&edit='.$j,$name.$this->images['edit'],array('onclick'=>"window.open('/Admin/SeiteEdit?workingversion&edit_page=$i&edit=$j','Editor','resizable=yes,status=no');return false"));
				$vorschau_button = ' '.Html::a('/'.rawurlencode($rubrik_folder).'/'.rawurlencode($seite_folder).'/Arbeitsversion/','Vorschau');
				$golive_button = ' | '.Html::a(SELF.SELF.'?golive&edit_page='.$i.'&edit='.$j,'Go Live!');
				$navi_table->add_td(array($edit_button,$working_version_button,$vorschau_button.$golive_button),array('style:padding-right:5px;'));
			}
		}


		$return_string .= $navi_table->flush_table();



		return $return_string;
	}

	function editor()
	{
		$rubrik = $this->I18n_get_real($this->navi[$_GET['edit']]['Rubrik']);
		$rubrik = $this->path_encode($rubrik);
		$seite = $this->I18n_get_real($this->navi[$_GET['edit']]['Subnavi'][$_GET['edit_page']]['Seite']);
		$seite = $this->path_encode($seite);
		$folder = INSTALL_PATH . "/Content/$rubrik/$seite";
		$wokingversion = (isset($_GET['workingversion'])) ? true : false;
		if ($wokingversion && is_file($folder."/Arbeitsversion/content.html"))
		{
			$contents = RheinaufFile::get_file($folder."/Arbeitsversion/content.html");
		}
		else $contents = RheinaufFile::get_file($folder."/content.html");

		$_SESSION['rubrik'] = $this->path_encode($rubrik);
		$_SESSION['seite'] = $this->path_encode($seite);
		$_SESSION['docroot'] = DOCUMENT_ROOT;

		$editor_page = new Html();
		//$editor_page->body_attributes=array('onunload'=>'catchClose(xinha_editors.editor)');
		$title = 'Editor für '.PROJECT_NAME.' -> '.$rubrik .' -> '.$seite;
		$title .= ($wokingversion) ? ' (Arbeitsversion)' :' (Liveversion)';
		$editor_page->title = $title;

		$editor_page->script(' _editor_url  = "/'.INSTALL_PATH.'/Libraries/Xinha/";_editor_lang = "de";_document_root = "'.DOCUMENT_ROOT.'"');
		$editor_page->script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Xinha/XinhaCore.js'));
		$editor_page->script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/XinhaConfig/editor.php'));
		$editor_page->script("var project_name = '".addslashes(PROJECT_NAME) ."';");



		$styles ='BODY 	{
						margin: 0;
						background-color:Menu;
						font-size:12px;
						padding:0;
						font-family: sans-serif;
					}

					#editor {
						width:100%;
						height:500px;
					}

					/*---DropDowns*/

					ul { /* all lists */
						padding: 0;
						margin: 0;
						list-style: none;
						position:absolute;
						top:2px;
						left:0px;
						z-index:999;
						cursor:default;


					}
					ul a {
						cursor:default;
						color:black;
						text-decoration:none;
						display:block;
					}

					li { /* all list items */
						float: left;
						position: relative;
						width: 10em;
						border:1px solid;
						border-color:Menu;
						padding-left:2px;
					}

					li:hover,li.over {
						border-color: ButtonShadow ButtonHighlight ButtonHighlight ButtonShadow;
					}
					li ul { /* second-level lists */
						display: none;
						position: absolute;
						top: 15px;
						left: 0;
						-moz-opacity:1;
						filter:alpha(opacity = 100);
						padding-bottom:5px;
					}

					li>ul { /* to override top and left in browsers other than IE, which will position to the top right of the containing li, rather than bottom left */
						top: auto;
						left: auto;
					}

					li:hover ul, li.over ul { /* lists nested under hovered list items */
						display: block;
						background-color: Menu;
						border:1px solid;
						border-color:Menu ButtonShadow ButtonShadow ButtonHighlight;
					}
					li:hover ul a:hover, li.over ul a:hover {
						color:white;
						background-color:darkblue;

					}

					#content {
						clear: left;
						padding:20px 0 0 0 ;
					}

					';

		$editor_page->style($styles);
		$editor_page->div($this->menu());
		$form = new Form();
		if ($wokingversion)
		{
			$get_working_version = 'workingversion&';
		}
		else $get_working_version = '';
		$form->form_tag(SELF.'?'.$get_working_version.'edit='.$_GET['edit'].'&edit_page='.$_GET['edit_page'],'post','application/x-www-urlencoded',array('id'=>'editor_form'));
		$form->add_input('hidden','rubrik',$rubrik);
		$form->add_input('hidden','seite',$seite);
		$form->add_input('hidden','tmp_file',(is_file($this->work_folder().'tmp.html'))?'true':'false' ,array('id'=>'tmp_file'));
		$form->add_textarea('editor_text',$contents,array('id'=>'editor'));
		$form->close_form();
		$editor_page->div($form->flush_form(),array('id'=>'content'));
		return $editor_page->flush_page();
	}

	function menu ()
	{
		$ul = new HtmlList('ul',array('id'=>'nav'));
		$ul->add_li('Speichern unter'.$this->save_as());
		$ul->add_li('Version zurück'.$this->revert_menu());
		$ul->add_li('Ansicht'.$this->view_menu());

		return $ul->flush_list();
	}

	function save_as()
	{
		$list = new HtmlList();
		if (isset($_GET['workingversion']))
		{
			$get_working_version = 'workingversion&';
		}

		$list->add_li(Html::a('javascript:;','Liveversion',array('onclick'=>"save(xinha_editors.editor,'".SELF.'?edit='.strval($_GET['edit']).'&edit_page='.strval($_GET['edit_page'])."')")));
		$list->add_li(Html::a('javascript:;','Arbeitsversion',array('onclick'=>"save(xinha_editors.editor,'".SELF.'?workingversion&edit='.strval($_GET['edit']).'&edit_page='.strval($_GET['edit_page'])."')")));
		return $list->flush_list();
	}

	function revert_menu ()
	{
		$folder =$this->work_folder();
		if (!is_dir($folder))
		{
			 RheinaufFile::mkdir($folder);
			 RheinaufFile::chmod($folder,'0777');
		}
		if (isset($_GET['workingversion']))
		{
			$get_working_version = 'workingversion&';
		}
		else $get_working_version = '';
		$files = RheinaufFile::dir_array($folder,false,'html');
		rsort($files,SORT_NUMERIC);

		$list = new HtmlList('ul',array('id'=>'workingvmenu'));

		foreach ($files as $file)
		{
			if ($file != 'content.html' && $file != 'tmp.html') $list->add_li(Html::a('javascript:revert(\''.$file.'\',xinha_editors.editor);',Date::timestamp2datum(preg_replace('#(.*?)\.html$#'. ' ',"$1",$file))));
		}
		return Html::div($list->flush_list(),array('id'=>'revert_menu'));
	}

	function revert_menu_js ()
	{
		$folder =$this->work_folder();
		if (!is_dir($folder))
		{
			 RheinaufFile::mkdir($folder);
			 RheinaufFile::chmod($folder,'0777');
		}
		if (isset($_GET['workingversion']))
		{
			$get_working_version = 'workingversion&';
		}
		else $get_working_version = '';
		$files = RheinaufFile::dir_array($folder,false,'html');
		rsort($files,SORT_NUMERIC);


		$js = '';

		$js .=" try {
		var revert_ul = document.getElementById('workingvmenu');
		var a,li;
		while (revert_ul.hasChildNodes())
		{
			revert_ul.removeChild(revert_ul.lastChild);
		};";

		foreach ($files as $file)
		{
			if ($file != 'content.html' && $file != 'tmp.html')
			{
				//$href = SELF.'?'.$get_working_version.'edit='.$_GET['edit'].'&edit_page='.$_GET['edit_page'].'&revert='.$file;
				$onclick = "revert(\"".$file."\",xinha_editors.editor)";
				$content = Date::timestamp2datum(preg_replace('#(.*?)\.html$#'. ' ',"$1",$file));

				$js.="
				a = document.createElement('a');
				a.href = 'javascript:".$onclick.";';

				a.appendChild(document.createTextNode('".$content."'));

				li =  document.createElement('li');
				li.appendChild(a);
				revert_ul.appendChild(li);
				";
			}
		}
		$js .= "} catch (e) {}";
		
		return $js;
	}
	function view_menu()
	{
		$list = new HtmlList();

		$list->add_li(Html::a('javascript:void(0);','&bull;&nbsp;Panels',array('onclick'=>"xinha_editors.editor.plugins.CustomUtils.instance.togglePanels(this)")));
		$list->add_li(Html::a('javascript:;','&nbsp;&nbsp;Elementumrahmung',array('onclick'=>"xinha_editors.editor.plugins.CustomUtils.instance.toggleOutlineElements(this)")));
		
		return $list->flush_list();
	}
	function save()
	{
		$folder = $this->work_folder();
		$contents = General::utf_8_decode($_POST['editor_text']);
		$contents = $this->strip_baseURL($contents);

		if (!is_dir($folder))
		{
			RheinaufFile::mkdir($folder);
			RheinaufFile::chmod($folder,'0777');
		}
		RheinaufFile::write_file($folder . Date::now() .".html",$contents);

		if (is_file($folder.'tmp.html')) unlink($folder.'tmp.html');
		$files = RheinaufFile::dir_array($folder,false,'html');
		rsort($files,SORT_NUMERIC);

		while (count($files)>10)
		{
			RheinaufFile::delete($folder.end($files));
			array_pop($files);
		}
		
		if (RheinaufFile::write_file($folder."content.html",$contents))
		{
			$saved = 'true';
			$as = (isset($_REQUEST['workingversion'])) ? ' als Arbeitsversion' : ' als Liveversion';
			$message = 'Gespeichert' .$as;
		}
		else 
		{
			$saved = 'false';
			$message = 'Beim Speichern ist ein Fehler aufgetreten.\nBitte versuchen Sie es noch einmal.\nSollte sich das Problem nicht beheben lassen, melden Sie es bitte dem Administrator.'; 
		}
		print $message = "{'saved':$saved,'message':'$message'};";
	}
	function save_tmp()
	{
		$folder = $this->work_folder();
		$contents = General::utf_8_decode($_POST['editor_text']);
		$contents = $this->strip_baseURL($contents);

		if (!is_dir($folder))
		{
			RheinaufFile::mkdir($folder);
			RheinaufFile::chmod($folder,'0777');
		}
		RheinaufFile::write_file($folder."tmp.html",$contents);
		print 'Gespeichert';
	}


	function revert ()
	{
		$file = $_GET['revert'];
		$folder = $this->work_folder();
		RheinaufFile::copy($folder.$file,$folder.'content.html');
		print RheinaufFile::get_file($folder.'content.html');
		if ($file == 'tmp.html') unlink ($folder.$file);
	}

	function golive ()
	{
		$rubrik = $this->path_encode($this->navi[$_GET['edit']]['Rubrik']);
		$seite = $this->path_encode($this->navi[$_GET['edit']]['Subnavi'][$_GET['edit_page']]['Seite']);
		$folder = INSTALL_PATH . "/Content/$rubrik/$seite/";
		if (is_file($folder.'Arbeitsversion/content.html')) RheinaufFile::copy($folder.'Arbeitsversion/content.html',$folder.'content.html');
	}

	function work_folder ()
	{
		if (isset($_REQUEST['workingversion']))
		{
			$working_version = 'Arbeitsversion/';
		}
		else $working_version ='';
		$rubrik = $this->I18n_get_real($this->navi[$_GET['edit']]['Rubrik']);
		$rubrik = $this->path_encode($rubrik);
		$seite = $this->I18n_get_real($this->navi[$_GET['edit']]['Subnavi'][$_GET['edit_page']]['Seite']);
		$seite = $this->path_encode($seite);
		$folder = DOCUMENT_ROOT.INSTALL_PATH . "/Content/$rubrik/$seite/$working_version";
		return $folder;
	}

	function linker_navi()
	{
		$array = array();
		for ($i= 0; $i<count($this->navi);$i++)
		{
			if($this->navi[$i]['Rubrik'] == 'Admin') continue;
			$array[$i]['url'] = '/'.$this->path_encode($this->I18n_get_real($this->navi[$i]['Rubrik']));
			$array[$i]['children'] = array();
			for ($j=0;$j<count($this->navi[$i]['Subnavi']);$j++)
			{
				if ($this->navi[$i]['Subnavi'][$j]['Seite'] != 'index')
				{
					$array[$i]['children'][$j]['url'] = $array[$i]['url'].'/'.$this->path_encode($this->I18n_get_real($this->navi[$i]['Subnavi'][$j]['Seite']));
					$array[$i]['children'][$j]['children'] = array();
				}
			}
		}
		$_SESSION['RheinaufCMSLinker'] = $array;
	}

	function strip_baseURL ($html)
	{
		$regex ='/(href="|src=")(http:\/\/'.$_SERVER['SERVER_NAME'].'|https:\/\/'.$_SERVER['SERVER_NAME'].')(.*?")/si';
		return preg_replace($regex,'$1$3',$html);
	}
}
?>