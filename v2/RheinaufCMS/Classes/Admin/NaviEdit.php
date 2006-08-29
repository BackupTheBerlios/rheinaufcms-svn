<?php
$long_name = 'Navigations-Menü bearbeiten';
$icon = 'folder_new.png';
class NaviEdit extends Admin
{
	var $navi = array();
	var $images = array();
	var $tables = array('navi_table'=>'RheinaufCMS>Navi',
						'groups_table'=>'RheinaufCMS>Groups'
						);


	function NaviEdit($db_connection,$path_information)
	{
		$this->add_db_prefix();

		$this->connection = $db_connection;
		$this->extract_to_this($path_information);
		$this->install_path = INSTALL_PATH;

		//Bilder
		$this->images['add_rubrik'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/folder_new.png','Neue Rubrik',array('title'=>'Neue Rubrik'));
		$this->images['new_file'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/filenew.png','Neue Seite',array('title'=>'Neue Seite'));
		$this->images['visible'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/14_layer_novisible.png','Sichtbar im Hauptmenü',array('title'=>'Sichtbar im Hauptmenü'));
		$this->images['invisible'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/14_layer_visible.png','Nicht sichtbar im Hauptmenü',array('title'=>'Nicht sichtbar im Hauptmenü'));
		$this->images['img_apply_path'] = '/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png';
		$this->images['delete'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/cancel.png','Löschen',array('title'=>'Löschen'));
		$this->images['edit'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit.png','Eigenschaften bearbeiten',array('title'=>'Eigenschaften bearbeiten'));
		$this->images['delete'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/cancel.png','Löschen',array('title'=>'Löschen'));
		$this->images['cancel'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/cancel.png','Abbruch',array('title'=>'Abbruch'));
		$this->images['order'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/enumList.png','Reihenfolge',array('title'=>'Reihenfolge'));
		$this->images['modul'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/plug.png','Modul',array('title'=>'Modul'));
		$this->images['locked'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/locked.png','Zugang beschränkt',array('title'=>'Zugang beschränkt'));
		$this->images['browse'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/folderopen.gif','Interne Links',array('title'=>'Interne Links'));
		$this->images['intern'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/world.png','Internationalisiert',array('title'=>'Internationalisiert'));

		$this->buttons['cancel'] = Html::a(SELF,$this->images['cancel'],array('title'=>'Abbruch'));
		$this->buttons['cancel_page'] = Html::a(SELF.'?edit='.$_GET['edit'],$this->images['cancel'],array('title'=>'Abbruch'));

		/*if (USE_I18N)
		{
			$this->languages = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Languages`");
			print_r($this->languages);
		}*/
		$this->navi = $this->navi_array();

		$this->event_listen();
	}


	function show()
	{
		if (isset($_GET['reorder']))
		{
			return  $this->rubrik_reorder();
		}
		else
		{
			$this->scripts();
			return  $this->folder_table();
		}
	}


	function scripts()
	{
		$return_string ="\n";

		$return_string .= 'var rubriken = new Array()'."\n";
		for ($i=0;$i<count($this->navi);$i++)
		{
			$return_string .= "rubriken[$i] = '".$this->navi[$i]['Rubrik']."';\n";
		}

		if (isset($_GET['edit']))
		{
			$return_string .= 'var seiten = new Array()'."\n";

			for ($i=0;$i<count($this->navi[$_GET['edit']]['Subnavi']);$i++)
			{
				$return_string .= "seiten[$i] = '".$this->navi[$_GET['edit']]['Subnavi'][$i]['Seite']."';\n";
			}

		}
		$return_string .= "function delete_confirm (folder_name)
{
	var confirm_text = 'Wollen Sie \"' + folder_name + '\" wirklich löschen?';

	if (confirm(confirm_text))
	{
		return true;
	}
	else return false;
}

function dublette(name,typ)
{

	switch (typ)
	{
		case ('seiten'):
			for (var i=0;i<seiten.length;i++)
			{
				if (seiten[i] == name)
				{
					alert('Seite bereits vorhanden');
					return false;
				}
			}
		break;
		case ('rubriken'):
			for (var i=0;i<rubriken.length;i++)
			{
				if (rubriken[i] == name)
				{
					alert('Rubrik bereits vorhanden');
					return false;
				}
			}
		break;
	}
	return true;
}
";

		$this->scripts = Html::script($return_string);
	}
	function event_listen()
	{
		if (isset($_POST['submit_new_folder'])) $this->new_folder_create();
		if (isset($_POST['submit_edit_folder'])) $this->folder_edit();
		if (isset($_GET['delete'])) $this->delete_folder();
		if (isset($_GET['visible'])) $this->visibility();

		if (isset($_POST['submit_new_page'])) $this->new_page_create();
		if (isset($_GET['delete_page'])) $this->delete_page();
		if (isset($_POST['submit_edit_page'])) $this->page_edit();

		if (isset($_POST['rubrik_reorder'])) $this->rubrik_reorder_apply();
		if (isset($_POST['pages_reorder_apply'])) $this->page_reorder_apply ();

		if (isset($_GET['new_navi'])) $this->make_the_new_navi();
	}

	function new_folder_create()
	{
		$id = $_POST['count'];
		$new_name = General::input_clean($_POST['new_name'],true);
		$Show = (isset($_POST['Show'])) ? $_POST['Show'] :'0';
		$Show_to = $this->input_group_array();
		$ext_link =  $this->path_adjust($_POST['ext_link']);
		$new_subnavi = array();


		$new_subnavi[0]['Seite'] = 'index';
		$new_subnavi[0]['Show'] = '1';


		$this->navi[count($this->navi)] = array('Rubrik'=>$new_name,'Show'=>$Show,'Show_to'=>$Show_to,'Subnavi'=>$new_subnavi,'ext_link'=>$ext_link);

		$this->make_the_new_navi();


		$name_encoded = $this->path_encode($this->I18n_get_real($new_name));

		if (!is_dir(DOCUMENT_ROOT.$this->install_path.'/Content/'.$name_encoded))
		{
			RheinaufFile::mkdir(INSTALL_PATH."/Content/$name_encoded");
			RheinaufFile::chmod(INSTALL_PATH."/Content/$name_encoded",777);

			RheinaufFile::mkdir(INSTALL_PATH."/Content/$name_encoded/index");
			RheinaufFile::chmod(INSTALL_PATH."/Content/$name_encoded/index",777);
		}
		$new_content_file = DOCUMENT_ROOT.$this->install_path.'/Content/'.$name_encoded.'/index/content.html';
		if (!is_file($new_content_file))
		{
			RheinaufFile::write_file($new_content_file,' ');
		}

		$this->htaccess_update();

	}
	function new_page_create()
	{
		$navi_id =$_GET['edit'];
		$rubrik_id = $this->navi[$navi_id]['id'];
		$rubrik_name = $this->navi[$navi_id]['Rubrik'];
		$new_name = General::input_clean($_POST['new_name'],true);
		$Show = (isset($_POST['Show'])) ? $_POST['Show'] :'0';
		$new_id = count($this->navi[$navi_id]['Subnavi']);
		$new_subnavi = array();

		$new_subnavi['ext_link'] =  $this->path_adjust($_POST['ext_link']);;
		$new_subnavi['Seite'] = $new_name;
		$new_subnavi['Show'] = $Show;
		$new_subnavi['Show_to'] =  $this->input_group_array();


		$this->navi[$navi_id]['Subnavi'][] = $new_subnavi;

		$this->make_the_new_navi();

		$name_encoded = $this->path_encode($this->I18n_get_real($new_name));
		$rubrik_name = $this->path_encode($this->I18n_get_real($rubrik_name));

		if (!is_dir(DOCUMENT_ROOT.$install_path.'/Content/'.$rubrik_name.'/'.$name_encoded))
		{
			RheinaufFile::mkdir(INSTALL_PATH."/Content/$rubrik_name/$name_encoded");
			RheinaufFile::chmod(INSTALL_PATH."/Content/$rubrik_name/$name_encoded",777);
		}
		$new_content_file = DOCUMENT_ROOT.$this->install_path.'/Content/'.$rubrik_name.'/'.$name_encoded.'/content.html';
		if (!is_file($new_content_file))
		{
			RheinaufFile::write_file($new_content_file,' ');
		}
		$this->htaccess_update();
	}

	function visibility()
	{
		if (isset($_GET['edit']) && isset($_GET['edit_page']))
		{
			$navi_id =$_GET['edit'];
			$page_id = $_GET['edit_page'];

			$this->navi[$navi_id]['Subnavi'][$page_id]['Show'] = $_GET['visible'];
		}
		else if (isset($_GET['edit']) && !isset($_GET['edit_page']))
		{
			$this->navi[$_GET['edit']]['Show'] = $_GET['visible'];
		}
		$this->make_the_new_navi();
	}
	function delete_folder()
	{

		$id = $this->navi[$_GET['delete']]['id'];
		$name = $this->navi[$_GET['delete']]['Rubrik'];

		unset($this->navi[$_GET[delete]]);

		//RheinaufFile::xrmdir(DOCUMENT_ROOT.$this->install_path.'/Content/'.$name);

		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function delete_page()
	{
		$rubrik_id = $_GET['edit'];
		$page_id = $_GET['delete_page'];
		unset($this->navi[$rubrik_id ]['Subnavi'][$page_id]);
		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function folder_edit ()
	{
		$id = $_POST['id'];

		$new_name = General::input_clean($_POST['name'],true);


		$this->navi[$id]['Rubrik'] = $new_name;
		$this->navi[$id]['Show'] = (isset($_POST['Show'])) ? $_POST['Show'] :'0';
		$this->navi[$id]['Show_to'] = $this->input_group_array();
		$this->navi[$id]['ext_link'] = $this->path_adjust($_POST['ext_link']);

		$oldname = General::input_clean($_POST['oldname']);
		$oldname_encoded = $this->path_encode($this->I18n_get_real($oldname));
		$name_encoded = $this->path_encode($this->I18n_get_real($new_name));

		if ($this->navi[$id]['Modul'] =='')
		{
			$path = DOCUMENT_ROOT.INSTALL_PATH.'/Content/';
			RheinaufFile::rename($path.$oldname_encoded,$path.$name_encoded);
		}
		if ($this->I18n_get_real($oldname) == HOMEPAGE)
		{
			$new_name = $this->I18n_get_real($new_name);
			$config_file = RheinaufFile::get_file(DOCUMENT_ROOT.INSTALL_PATH.'/Config.inc.php');
			$config_file = preg_replace("/(define.*?\(.*?'HOMEPAGE'.*?,.*?')(.*?)('.*?\).*?;)/", "$1$new_name$3",$config_file);
			RheinaufFile::write_file(DOCUMENT_ROOT.INSTALL_PATH.'/Config.inc.php',$config_file);
		}
		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function page_edit ()
	{
		$navi_id =$_GET['edit'];
		$page_id = $_POST['page_id'];

		$new_name = General::input_clean($_POST['name'],true);

		$this->navi[$navi_id]['Subnavi'][$page_id]['Seite'] = $new_name;
		$this->navi[$navi_id]['Subnavi'][$page_id]['Show'] = (isset($_POST['Show'])) ? $_POST['Show'] :'0';
		$this->navi[$navi_id]['Subnavi'][$page_id]['Show_to'] =  $this->input_group_array();
		$this->navi[$navi_id]['Subnavi'][$page_id]['ext_link'] = $_POST['ext_link'];

		$oldname = $this->I18n_get_real(General::input_clean($_POST['oldname']));
		$oldname_encoded = $this->path_encode($oldname);
		$name_encoded = $this->path_encode($this->I18n_get_real($new_name));
		$rubrik_name = $this->path_encode($this->I18n_get_real($this->navi[$navi_id]['Rubrik']));

		$path = DOCUMENT_ROOT.INSTALL_PATH.'/Content/'.$rubrik_name.'/';

		RheinaufFile::rename($path.$oldname_encoded,$path.$name_encoded);

		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function folder_table()
	{

		$return_string .= Form::form_tag($_SERVER['REDIRECT_URL'],'post','application/x-www-form-urlencoded',array('onsubmit'=>'try {return dublette(document.getElementById(\'new_rubrik_name\').value,\'rubriken\')} catch (e) {}'));
		$navi_table = new Table(3,array('style'=>'float:left;margin-right:30px'));
		$navi_table->add_caption('Rubriken');
		$navi_table->add_th(array('','Name',''));
		for ($i = 0;$i<count($this->navi);$i++)
		{
			if (isset($_GET['edit']) && $_GET['edit'] == $i && !isset($_GET['visible']))
			{
				$name = $this->navi[$i]['Rubrik'];

				if ($_SESSION['RheinaufCMS_User']['Group'] == 'dev')
				{
					$I18n = $this->parse_I18n($name);
					$name_input ='';


					$name_input =  Form::add_input('text','name',$name);
				}
				else $name_input =  Html::bold($name).Form::add_input('hidden','name',$name);

				if ($this->navi[$i]['Show']==1) $visible_checked = array('checked'=>'checked','title'=>'Sichtbarkeit im Hauptmenü');
				else $visible_checked = array('title'=>'Sichtbarkeit im Hauptmenü');

				$visble_checkbox = Form::add_input('checkbox','Show',1,$visible_checked);
				$id = Form::add_input('hidden','id',strval($i));
				$old_name = Form::add_input('hidden','oldname',$this->navi[$i]['Rubrik']);
				$apply_button = Form::add_input('image','submit_edit_folder','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern'));


				$navi_table->add_td(array($id.$old_name.$visble_checkbox,$name_input,$apply_button.$this->buttons['cancel']));

				$ext_link_input =  Html::bold('URL ').'(optional) '.Html::br().Form::add_input('text','ext_link',rawurldecode($this->navi[$i]['ext_link']),array('id'=>'ext_link_rubrik'));
				$navi_table->add_td(array('',$ext_link_input,(isset($_GET['browse'])) ? '' : Html::br(). Html::a($_SERVER['REDIRECT_URL'].'?browse&amp;edit='.$i,$this->images['browse'])));
				if (isset($_GET['browse']))
				{
					$navi_table->add_td(array('',$this->make_tree('ext_link_rubrik')));
				}
				$navi_table->add_td(array('',$this->groups_select($_GET['edit'])));

			}
			elseif ( $this->navi[$i]['Rubrik'] != 'Admin')
			{

				if ($this->navi[$i]['Show']==0)
				{
					$visible_img = $this->images['invisible'];
					$visible_button = Html::a($_SERVER['REDIRECT_URL'].'?visible=1&amp;edit='.$i,$visible_img);
				}
				else
				{
					$visible_img = $this->images['visible'];
					$visible_button = Html::a($_SERVER['REDIRECT_URL'].'?visible=0&amp;edit='.$i,$visible_img);
				}

				$modul = ($this->navi[$i]['Modul'] != '') ? $this->images['modul'] : '';
				$international = (strstr($this->navi[$i]['Rubrik'],'{I18n')) ? $this->images['intern'] :'';
				$locked = ($this->navi[$i]['Show_to'] != '') ? $this->images['locked'] : '';

				$name = $this->I18n_get_real($this->navi[$i]['Rubrik']);
				$edit_button = Html::a($_SERVER['REDIRECT_URL'].'?edit='.$i,$this->images['edit']);
				$delete_button = Html::a($_SERVER['REDIRECT_URL'].'?delete='.$i,$this->images['delete'],array('onclick'=>"return delete_confirm('$name')"));
				$navi_table->add_td(array( $visible_button,$modul.$locked.$international.$name,$edit_button.$delete_button));
			}
		}


		$add_rubrik_button = Html::a($_SERVER['REDIRECT_URL'].'?newfolder',$this->images['add_rubrik'].'Neue Rubrik');
		$reihenfolge_button = Html::a($_SERVER['REDIRECT_URL'].'?reorder',$this->images['order'].'Reihenfolge ändern');
		if (isset($_GET['newfolder']))
		{
			$name_input = Form::add_input('text','new_name','',array('title'=>'Name','id'=>'new_rubrik_name'));
			$visble_check = Form::add_input('checkbox','Show',1,array('checked'=>'checked','title'=>'Sichtbarkeit im Hauptmenü'));
			$count = Form::add_input('hidden','count',count($this->navi));
			$apply_button = Form::add_input('image','submit_new_folder','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern'));


			$navi_table->add_td(array($visble_check,$name_input.$count,$apply_button.$this->buttons['cancel']));

			$ext_link_input =  Html::bold('URL ').'(optional) '.Html::br().Form::add_input('text','ext_link',$this->navi[$i]['ext_link'],array('id'=>'ext_link_rubrik'));
			$navi_table->add_td(array('',$ext_link_input,(isset($_GET['browse'])) ? '' : Html::br(). Html::a($_SERVER['REDIRECT_URL'].'?browse&amp;newfolder',$this->images['browse'])));
			if (isset($_GET['browse']))
			{
				$navi_table->add_td(array('',$this->make_tree('ext_link_rubrik')));
			}
			$navi_table->add_td(array('',$this->groups_select()));

		}
		else
		{
			$navi_table->add_td(array(array(2=>$add_rubrik_button)));
			$navi_table->add_td(array(array(2=>$reihenfolge_button)));

		}

		$return_string .= $navi_table->flush_table();
		$return_string .= Form::close_form();

		if (isset($_GET['edit']))
		{
			if (isset($_GET['reorder_pages'])) $return_string .= $this->pages_reorder($_GET['edit']);
			else $return_string .= $this->pages_table($_GET['edit']);
		}
		return $return_string;
	}

	function pages_table($j)
	{

		$return_string .= Form::form_tag($_SERVER['REDIRECT_URL'].'?edit='.$j,'post','application/x-www-form-urlencoded',array('onsubmit'=>'return dublette(document.getElementById(\'new_page_name\').value,\'seiten\')'));
		$navi_table = new Table(3);
		$navi_table->add_caption('Seiten in '.$this->I18n_get_real($this->navi[$j]['Rubrik']));
		$navi_table->add_th(array('','Name',''));


		for ($i = 0;$i < count ($this->navi[$j]['Subnavi']) ;$i++)
		{
			if (isset($_GET['edit_page']) && $_GET['edit_page'] == $i && !isset($_GET['visible']))
			{
				$name = $this->navi[$j]['Subnavi'][$i]['Seite'];
				$name_input = ($_SESSION['RheinaufCMS_User']['Group'] == 'dev') ? Form::add_input('text','name',$name) : Html::bold($name).Form::add_input('hidden','name',$name);


				if ($this->navi[$j]['Subnavi'][$i]['Show']==1) $visible_checked = array('checked'=>'checked','title'=>'Sichtbarkeit im Hauptmenü');
				else $visible_checked = array('title'=>'Sichtbarkeit im Hauptmenü');

				$visble_checkbox = Form::add_input('checkbox','Show',1,$visible_checked);
				$id = Form::add_input('hidden','page_id',$i);
				$old_name = Form::add_input('hidden','oldname',$this->navi[$j]['Subnavi'][$i]['Seite']);
				$apply_button = Form::add_input('image','submit_edit_page','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern'));

				$navi_table->add_td(array($id.$old_name.$visble_checkbox,$name_input,$apply_button.$this->buttons['cancel_page']));

				$ext_link_input =  Html::bold('URL ').'(optional) '.Html::br().Form::add_input('text','ext_link',rawurldecode($this->navi[$j]['Subnavi'][$i]['ext_link']),array('id'=>'ext_link_page'));
				$navi_table->add_td(array('',$ext_link_input,(isset($_GET['browse'])) ? '' : Html::br(). Html::a($_SERVER['REDIRECT_URL'].'?browse&amp;edit_page='.$i.'&amp;edit='.$j,$this->images['browse'])));
				if (isset($_GET['browse']))
				{
					$navi_table->add_td(array('',$this->make_tree('ext_link_page')));
				}
				$navi_table->add_td(array('',$this->groups_select($_GET['edit'],$i)));

			}
			else if (!empty ($this->navi[$j]['Subnavi'][$i])&& $this->navi[$j]['Subnavi'][$i]['Seite'] != 'index')
			{
				if ($this->navi[$j]['Subnavi'][$i]['Show']==0)
				{
					$visible_img = $this->images['invisible'];
					$visible_button = Html::a($_SERVER['REDIRECT_URL'].'?visible=1&amp;edit_page='.$i.'&amp;edit='.$j,$visible_img);
				}
				else
				{
					$visible_img = $this->images['visible'];
					$visible_button = Html::a($_SERVER['REDIRECT_URL'].'?visible=0&amp;edit_page='.$i.'&amp;edit='.$j,$visible_img);
				}

				$modul = ($this->navi[$j]['Subnavi'][$i]['Modul'] != '') ? $this->images['modul'] : '';
				$locked = ($this->navi[$j]['Subnavi'][$i]['Show_to'] != '') ? $this->images['locked'] : '';
				$international = (strstr($this->navi[$j]['Subnavi'][$i]['Seite'],'{I18n')) ? $this->images['intern'] :'';

				$name = $this->I18n_get_real($this->navi[$j]['Subnavi'][$i]['Seite']);

				$edit_button = Html::a($_SERVER['REDIRECT_URL'].'?edit_page='.$i.'&amp;edit='.$j,$this->images['edit']);
				$delete_button = Html::a($_SERVER['REDIRECT_URL'].'?delete_page='.$i.'&amp;edit='.$j,$this->images['delete'],array('onclick'=>"return delete_confirm('$name')"));
				$navi_table->add_td(array( $visible_button,$modul.$locked.$international.$name,$edit_button.$delete_button));
			}
		}


		$add_page_button = Html::a($_SERVER['REDIRECT_URL'].'?newpage&amp;edit='.$j,$this->images['new_file'].'Neue Seite');
		$reihenfolge_button = Html::a($_SERVER['REDIRECT_URL'].'?reorder_pages&amp;edit='.$j,$this->images['order'].'Reihenfolge ändern');
		if (isset($_GET['newpage']))
		{

			$name_input = Form::add_input('text','new_name','',array('title'=>'Name','id'=>'new_page_name'));
			$visble_check = Form::add_input('checkbox','Show',1,array('checked'=>'checked','title'=>'Sichtbarkeit im Hauptmenü'));
			$count = Form::add_input('hidden','count',count($this->navi));
			$apply_button = Form::add_input('image','submit_new_page','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern'));

			$navi_table->add_td(array($visble_check,$count.$name_input,$apply_button.$this->buttons['cancel_page']));
			$ext_link_input =  Html::bold('URL ').'(optional) '.Html::br().Form::add_input('text','ext_link',$this->navi[$i]['ext_link'],array('id'=>'ext_link_page'));
			$navi_table->add_td(array('',$ext_link_input,(isset($_GET['browse'])) ? '' : Html::br(). Html::a($_SERVER['REDIRECT_URL'].'?browse&amp;newpage&amp;edit='.$j,$this->images['browse'])));
			if (isset($_GET['browse']))
			{
				$navi_table->add_td(array('',$this->make_tree('ext_link_page')));
			}
			$navi_table->add_td(array('',$this->groups_select()));


		}
		else
		{
			$navi_table->add_td(array(array(2=>$add_page_button)));
			$navi_table->add_td(array(array(2=>$reihenfolge_button)));

		}

		$return_string .= $navi_table->flush_table();
		$return_string .= Form::close_form();


		return $return_string;
	}




	function new_page_form()
	{


		$name_input = Form::add_input('text','new_name','',array('title'=>'Name','id'=>'new_page_name'));
		$visble_check = Form::add_input('checkbox','Show',1,array('checked'=>'checked','title'=>'Sichtbarkeit im Hauptmenü'));
		$count = Form::add_input('hidden','count',count($this->navi));
		$apply_button = Form::add_input('image','submit_new_page','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern'));

		return array($visble_check,$count.$name_input,$apply_button);

	}

	function rubrik_reorder()
	{
		$form_tag = Form::form_tag($_SERVER['REDIRECT_URL'],'post','application/x-www-form-urlencoded',array('name'=>'draglist_form'));
		$draglist_scripts = Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/dom-drag.js'));
		$draglist_scripts .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/draglist.js'));
		$dragable_divs ='';
		for ($i=0;$i < count ($this->navi);$i++)
		{
			$draglist_item = Form::add_input('hidden',"draglist_items[$i]",$i);
			$name = $this->I18n_get_real($this->navi[$i]['Rubrik']);
			$dragable_divs .= Html::div($name.$draglist_item,array('style'=>'position: relative; left: 0px; top: 0px;cursor:move;'));
		}
		$draglist_container = Html::div($dragable_divs,array('id'=>'draglist_container'));
		$draglist_cmd = Form::add_input('hidden','rubrik_reorder','');
		$draglist_apply = Form::add_input('image','rubrik_reorder','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern','onclick'=>"draglist_manager.do_submit('draglist_form','draglist_container')"));
		$form_close = Form::close_form();
		$draglist_call = "var dragListIndex = new Array();
							draglist_manager = new fv_dragList( 'draglist_container' );
							draglist_manager.setup();
							addDragList( draglist_manager );";
		$draglist_call = Html::script($draglist_call);
		return 	'<h2>Rubriken</h2><p>Ordnen Sie die Einträge neu an, indem Sie sie mit der Maus ziehen.</p>'
				.$draglist_scripts
				.$form_tag
				.$draglist_container
				.$draglist_cmd
				.$draglist_apply
				.$this->buttons['cancel']
				.$form_close
				.$draglist_call;
	}

	function pages_reorder($j)
	{
		$form_tag = Form::form_tag($_SERVER['REDIRECT_URL'].'?edit='.$j,'post','application/x-www-form-urlencoded',array('name'=>'draglist_form'));
		$draglist_scripts = Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/dom-drag.js'));
		$draglist_scripts .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/draglist.js'));
		$dragable_divs ='';
		for ($i=0;$i < count ($this->navi[$j]['Subnavi']);$i++)
		{
			$draglist_item = Form::add_input('hidden',"draglist_items[$i]",$i);
			$name = $this->I18n_get_real($this->navi[$j]['Subnavi'][$i]['Seite']);
			$dragable_divs .= Html::div($name.$draglist_item,array('style'=>'position: relative; left: 0px; top: 0px;cursor:move;'));
		}
		$draglist_container = Html::div($dragable_divs,array('id'=>'draglist_container'));
		$draglist_cmd = Form::add_input('hidden','pages_reorder_apply','');
		$draglist_apply = Form::add_input('image','pages_reorder_apply','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern','onclick'=>"draglist_manager.do_submit('draglist_form','draglist_container')"));
		$form_close = Form::close_form();
		$draglist_call = "var dragListIndex = new Array();
							draglist_manager = new fv_dragList( 'draglist_container' );
							draglist_manager.setup();
							addDragList( draglist_manager );";
		$draglist_call = Html::script($draglist_call);
		return 	'<p>Ordnen Sie die Einträge neu an, indem Sie sie mit der Maus ziehen.</p>'
				.$draglist_scripts
				.$form_tag
				.$draglist_container
				.$draglist_cmd
				.$draglist_apply
				.$this->buttons['cancel_page']
				.$form_close
				.$draglist_call;
	}

	function rubrik_reorder_apply ()
	{
		$flipped_array = array_flip($_POST['draglist_items']);
		$new_navi = array();

		for ($i=0;$i<count($this->navi);$i++)
		{
			$old_id = $flipped_array[$i];
			$new_navi[$i]['Rubrik'] = $this->navi[$old_id]['Rubrik'];
			$new_navi[$i]['Subnavi']= $this->navi[$old_id]['Subnavi'];
			$new_navi[$i]['Show'] = $this->navi[$old_id]['Show'];
			$new_navi[$i]['Show_to'] = $this->navi[$old_id]['Show_to'];
			$new_navi[$i]['Modul'] = $this->navi[$old_id]['Modul'];
		}
		$this->navi = $new_navi;
		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function page_reorder_apply ()
	{
		$rubrik_id = $_GET['edit'];
		$flipped_array = array_flip($_POST['draglist_items']);
		$subnavi = array();

		for ($i=0;$i<count($this->navi[$rubrik_id]['Subnavi']);$i++)
		{

			$old_id = $flipped_array[$i];
			$subnavi[$i]['Seite'] = $this->navi[$rubrik_id]['Subnavi'][$old_id]['Seite'];
			$subnavi[$i]['ext_link'] = $this->navi[$rubrik_id]['Subnavi'][$old_id]['ext_link'];
			$subnavi[$i]['Show'] = $this->navi[$rubrik_id]['Subnavi'][$old_id]['Show'];
			$subnavi[$i]['Show_to'] = $this->navi[$rubrik_id]['Subnavi'][$old_id]['Show_to'];
			$subnavi[$i]['Modul'] = $this->navi[$rubrik_id]['Subnavi'][$old_id]['Modul'];
		}

		$this->navi[$rubrik_id]['Subnavi'] = $subnavi;
		$this->make_the_new_navi();
		$this->htaccess_update();
	}

	function groups_select ($r='',$s='')
	{
		$existent_groups = $this->existent_groups();
		$selected = array();

		$return_string ='';

		if ($r != '' && $s=='')
		{
			$show_to = $this->navi[$r]['Show_to'] ;
			$groups = (is_array($show_to)) ? $show_to : array();
		}
		else if ($r != '' && $s != '')
		{
			$show_to = $this->navi[$r]['Subnavi'][$s]['Show_to'];
			$groups = (is_array($show_to)) ? $show_to : array();
		}
		else $groups = array();

		for ($i=0;$i<count($existent_groups);$i++)
		{
			if (in_array($existent_groups[$i]['Name'],$groups))
			{
				$selected =  array('checked'=>'checked');
			}
			else $selected = array();

			$return_string .= Form::add_input('checkbox','Gruppen[]',$i,$selected).' '.$existent_groups[$i]['Name'].Html::br();
		}

		return Html::div(Html::bold('Zugang beschränken')). $return_string.Html::div('Nichts gewählt = keine Beschränkung',array('class'=>'klein'));
	}

	function existent_groups()
	{
		return General::multi_unserialize($this->connection->db_assoc("SELECT * FROM `$this->groups_table` ORDER BY `Name`"));
	}

	function input_group_array()
	{
		$existent_groups = $this->existent_groups();
		$group_ids = $_POST['Gruppen'];

		if (!is_array($group_ids)) return '';
		$groups = array();
		foreach ($group_ids as $group_id)
		{
			$groups[] = $existent_groups[intval($group_id)]['Name'];
		}
		return $groups;
	}

	function make_the_new_navi ()
	{
		$this->connection->db_query("TRUNCATE `$this->navi_table`");

		$navi = $this->navi;
		$id = 0;
		$rubrik_key = 0;

		foreach ($navi as $entry)
		{
			$Hierarchy = 0;
			$Rubrik = $entry['Rubrik'];
			$Show = $entry['Show'];
			$Show_to = (is_array($entry['Show_to'])) ? implode(',',$entry['Show_to']) : '';
			$Modul = $entry['Modul'];
			$ext_link = ($entry['ext_link']) ? $entry['ext_link'] : '';
			$this->connection->db_query("INSERT INTO `$this->navi_table` ( `id` , `Hierarchy`,`Rubrik_key`,`Rubrik` ,`Page_key`, `Seite`, `Show`, `Show_to`,`Modul`,`ext_link` )
							VALUES ('$id', '$Hierarchy','$rubrik_key','$Rubrik', '','','$Show','$Show_to','$Modul','$ext_link')");
			$id++;
			$page_key =0;
			foreach ($entry['Subnavi'] as $sub_entry)
			{

				$Hierarchy = 1;
				$Rubrik = $entry['Rubrik'];
				$Seite =  $sub_entry['Seite'];
				$Show = $sub_entry['Show'];
				$Show_to = (is_array($sub_entry['Show_to'])) ? implode(',',$sub_entry['Show_to']) : '';
				$Modul =  $sub_entry['Modul'];
				$ext_link = ($sub_entry['ext_link']) ? $sub_entry['ext_link'] : '';

				$this->connection->db_query("INSERT INTO `$this->navi_table` ( `id` , `Hierarchy` ,`Rubrik_key`,`Rubrik` ,`Page_key`, `Seite`, `Show`, `Show_to`,`Modul`,`ext_link` )
																		VALUES ('$id', '$Hierarchy','$rubrik_key','$Rubrik', '$page_key','$Seite','$Show','$Show_to','$Modul','$ext_link')");
				$id++;
				$page_key++;
			}
			$rubrik_key++;
		}

		$this->navi = $this->navi_array();
	}

	function htaccess_update()
	{
		$navi = $this->navi;
		$htaccess = RheinaufFile::get_file(DOCUMENT_ROOT.'.htaccess');
		preg_match('!(.*?#--REWRITE_RULES--#).*?(#--/REWRITE_RULES--#)!s',$htaccess,$matches);

		$new_htaccess = "\n";
		$regex_esc = '?*+()^$|[].';
		$rubrik_key = 0;
		foreach ($navi as $entry)
		{

			$rubrik = addcslashes($this->path_encode($this->I18n_get_real($entry['Rubrik'])),$regex_esc);
			$page_key =0;
			foreach ($entry['Subnavi'] as $sub_entry)
			{
					$seite = addcslashes($this->path_encode($this->I18n_get_real($sub_entry['Seite'])),$regex_esc);
					$new_htaccess .= 'RewriteRule ^'.$rubrik.'/'.$seite.' CMSinit.php?r='.$rubrik_key.'&s='.$page_key.'&%{QUERY_STRING} [L,NC]'."\n";

				$page_key++;
			}
			$new_htaccess .= 'RewriteRule ^'.$rubrik.' CMSinit.php?r='.$rubrik_key.'&s=0&%{QUERY_STRING} [L,NC]'."\n";

			$rubrik_key++;
		}
		$new_htaccess = $matches[1].$new_htaccess.$matches[2];
		RheinaufFile::write_file(DOCUMENT_ROOT.'.htaccess',$new_htaccess);
	}
	function make_tree($id)
	{
		$script = '
		function fill(string)
		{
			document.getElementById("'.$id.'").value=string;
		}';
		$script = Html::script($script);
		$ul_rubriken = new HtmlList();

		for ($i = 0;$i <count($this->navi);$i++ )
		{
			$rubrik = $this->I18n_get_real($this->navi[$i]['Rubrik']);
			if ($rubrik != 'Admin')
			{
				$rubrik_link = Html::a("javascript:;",$rubrik,array('onclick'=>"fill('/$rubrik')"));
				if (count($this->navi[$i]['Subnavi'])>1)
				{
					$ul_subnavi = new HtmlList();
					for ($j=0;$j<count($this->navi[$i]['Subnavi']);$j++)
					{
						if ($this->navi[$i]['Subnavi'][$j]['Seite'] !='index')
						{
							$seite = $this->I18n_get_real($this->navi[$i]['Subnavi'][$j]['Seite']);
							$ul_subnavi->add_li(Html::a("javascript:;",$seite,array('onclick'=>"fill('/$rubrik/$seite')")));
						}
					}
					$sub=$ul_subnavi->flush_list();
				}
				else $sub ='';
				$ul_rubriken->add_li($rubrik_link.$sub);
			}
		}
		return $script.$ul_rubriken->flush_list();
	}

	function path_adjust($path)
	{
		$path = explode('/',$path);
		foreach ($path as $key => $part)
		{
			$path[$key] = rawurlencode($this->path_encode($part));
		}
		return implode('/',$path);
	}
}
?>