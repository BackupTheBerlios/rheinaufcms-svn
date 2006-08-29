<?php
$long_name = 'Module';
class Module extends Admin 
{
	var $return;
	function Module($db_connection,$path_information)
	{
		$this->images['plus'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_add.png','Hinzufügen');
		$this->connection = $db_connection;
		$this->extract_to_this($path_information);
		$this->path_information = $path_information;

		
		$this->admin_installed = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Admin>Module` ORDER BY `id` ASC");
		$this->frontend_installed = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Module` ORDER BY `id` ASC");
		
		$this->event_listen();		
	}
	
	function show()
	{
		if (!$this->check_right('Module')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		
		return $this->return;
	}
	
	function event_listen()
	{
		if (!$this->check_right('Module')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		
		if (isset($_GET['newadmin'])) $this->admin_install(rawurldecode($_GET['newadmin']));
		else if (isset($_GET['newfrontend'])) $this->frontend_install(rawurldecode($_GET['newfrontend']));
		
		else if (isset($_GET['admin_reihenfolge'])) $this->admin_module_reorder();
		else if (isset($_POST['admin_module_reorder'])) $this->reorder_apply('RheinaufCMS>Admin>Module');
		else 
		{
			$this->admin_module_table();
			$this->frontend_module_table();
		}
	}
	
	function admin_module_table()
	{
				
		$this->admin_not_installed = RheinaufFile::dir_array(INSTALL_PATH.'/Classes/Admin',false,'php');
		$return_string ='';
		$table = new Table(1);
		$table->add_caption('Backend-Module');
		
		$installed_modules = array();
		foreach ($this->admin_installed as $installed)
		{
			$installed_modules[] = $installed['Name'];
		}
	
		foreach ($this->admin_not_installed as $not_installed)
		{
			
			$not_installed = preg_replace('#(.*?).php$#',"$1",$not_installed);
			if (!in_array($not_installed,$installed_modules))
			{
				$table->add_td(array('<em>'.$not_installed.'</em>'.Html::a('/Admin/Module?newadmin='.rawurlencode($not_installed),'&gt;&gt;',array('title'=>'Installieren'))));
			}
		
		}
		
		foreach ($this->admin_installed as $installed)
		{
			$table->add_td(array($installed['Name']));
		}
		$this->return = $table->flush_table();
	}	
	
	function frontend_module_table()
	{
				
		$this->frontend_not_installed = RheinaufFile::dir_array(INSTALL_PATH.'/Module',false,'php');
		$return_string ='';
		$table = new Table(1);
		$table->add_caption('Frontend-Module');
		
		$installed_modules = array();
		foreach ($this->frontend_installed as $installed)
		{
			$installed_modules[] = $installed['Name'];
		}
	
		foreach ($this->frontend_not_installed as $not_installed)
		{
			
			$not_installed = preg_replace('#(.*?).php$#',"$1",$not_installed);
			if (!in_array($not_installed,$installed_modules))
			{
				$table->add_td(array('<em>'.$not_installed.'</em>'.Html::a('/Admin/Module?newfrontend='.rawurlencode($not_installed),'&gt;&gt;',array('title'=>'Installieren'))));
			}
		
		}
		
		foreach ($this->frontend_installed as $installed)
		{
			$table->add_td(array($installed['Name']));
		}
		$this->return .= $table->flush_table();
	}
	
	function admin_install($module,$extern = false)
	{
		include_once(INSTALL_PATH.'/Classes/Admin/'.$module.'.php');
		$icon_path = 'Classes/Admin/Icons/32x32/'.$icon;
		$long_name = $long_name;
		$id = count($this->admin_installed);
		$class = new $module ();
		
		if (method_exists($class,'install') && !$extern)
		{
			$class->install();
		}
		else 
		{
			$this->connection->db_query("INSERT INTO `RheinaufCMS>Admin>Module` 	( `id` , `Name` ,`LongName`, `Icon` )
															VALUES  ('$id', '$module','$long_name', '$icon_path')");
		}
	}
	
	function frontend_install($module)
	{
		$this->navi = General::multi_unserialize($this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Navi`"));
		$name = rawurldecode($module);
		if (!isset($_GET['newrubrik']))
		{
			$return = Html::p('Bitte wählen Sie unter welcher Rubrik diese Modul eingeordnet werden soll.');
			
			for ($i=0;$i<count($this->navi);$i++)
			{
				$return .= Html::div(Html::a('/Admin/Module?newrubrik='.$i.'&amp;newfrontend='.$module,$this->navi[$i]['Rubrik']));
			}
			$return .= Html::div(Html::a('/Admin/Module?newrubrik='.$i.'&amp;newfrontend='.$module,$this->images['plus'].' Neue Rubrik'));
			$this->return = $return;
			return;
		}
		else 
		{
			if ($_GET['newrubrik'] == count($this->navi))
			{
				$this->new_rubrik_create($name,count($this->navi));
			}
			else
			{
				$this->new_page_create($name,$_GET['newrubrik']);
			}
		}
		
		include_once(INSTALL_PATH.'/Module/'.$module.'.php');

		
		$id = count($this->frontend_installed);
		$class = new $module ($this->connection,$this->path_information);
		if (method_exists($class,'install') && !$extern)
		{
			$class->install();
		}
		
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Module` 	( `id` , `Name`)
															VALUES  ('$id', '$module')");
				
	}
	
	function new_rubrik_create($name,$id)
	{
		$new_name = $name;
		$show = '1';
		$new_subnavi = array();
		$new_subnavi['id'] = '0';
		$new_subnavi['ext_link'] = '';
		$new_subnavi['Seite'] = 'index';
		$new_subnavi['Show'] = '1';
		
		
		$subnavi = serialize(array($new_subnavi));
		
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Navi` ( `id` , `Rubrik` , `Subnavi`, `Show`,`ext_link`, `Modul` )
							VALUES ('$id', '$new_name', '$subnavi','$Show','','$new_name')");
		
			
			
		$navi_edit = new NaviEdit($this->connection,$this->path_information);
		$navi_edit->htaccess_update();
	}
	
	function new_page_create($name,$id)
	{
		$navi_id =$id;
		$rubrik_id = $this->navi[$navi_id]['id'];
		$rubrik_name = $this->navi[$navi_id]['Rubrik'];		
		$new_name = $name;
		$Show = '1';
		$new_id = count($this->navi[$navi_id]['Subnavi']);
		$new_subnavi = array();
		$new_subnavi['id'] = $new_id;
		$new_subnavi['ext_link'] = '';
		$new_subnavi['Seite'] = $new_name;
		$new_subnavi['Show'] = $Show;
		$new_subnavi['Modul'] = $name;
		
		$this->navi[$navi_id]['Subnavi'][] = $new_subnavi;
		$subnavi = serialize($this->navi[$navi_id]['Subnavi']);
		
		$this->connection->db_query("UPDATE `RheinaufCMS>Navi` SET `Subnavi` = '$subnavi' WHERE `id` = '$rubrik_id' ");
		
		$navi_edit = new NaviEdit($this->connection,$this->path_information);
		$navi_edit->htaccess_update();
	}
	
	function admin_module_reorder()
	{
		$array_to_reorder = $this->admin_installed;
		$array_name_to_reorder = 'admin_module';
		
		$form_tag = Form::form_tag($_SERVER['REDIRECT_URL'],'post','application/x-www-form-urlencoded',array('name'=>'draglist_form'));
		$draglist_scripts = Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/dom-drag.js'));
		$draglist_scripts .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/draglist.js'));
		$dragable_divs ='';
		
		for ($i=0;$i < count ($array_to_reorder);$i++)
		{
			$draglist_item = Form::add_input('hidden',"draglist_items[$i]",$i);
			$name = $array_to_reorder[$i]['Name'];
			$dragable_divs .= Html::div($name.$draglist_item,array('style'=>'position: relative; left: 0px; top: 0px;cursor:move;'));
		}
		$draglist_container = Html::div($dragable_divs,array('id'=>'draglist_container'));
		$draglist_cmd = Form::add_input('hidden','rubrik_reorder','');
		$draglist_apply = Form::add_input('image',$array_name_to_reorder.'_reorder','Speichern',array('src'=>$this->images['img_apply_path'],'alt'=>'Speichern','title'=>'Speichern','onclick'=>"draglist_manager.do_submit('draglist_form','draglist_container')"));
		$form_close = Form::close_form();
		$draglist_call = "var dragListIndex = new Array();
							draglist_manager = new fv_dragList( 'draglist_container' );
							draglist_manager.setup();
							addDragList( draglist_manager );";
		$draglist_call = Html::script($draglist_call);
		$this->return= 	'<p>Ordnen Sie die Einträge neu an, indem Sie sie mit der Maus ziehen.</p>'
							.$draglist_scripts
							.$form_tag
							.$draglist_container
							.$draglist_cmd
							.$draglist_apply
							.$form_close
							.$draglist_call;
	}
	
	function reorder_apply ($table_name)
	{
		
		$array_to_reorder = $this->connection->db_assoc("SELECT * FROM `$table_name` ORDER BY `id` ASC");
		$fields = array();
		foreach ($array_to_reorder[0] as $key => $value)
		{
			$fields[] = $key;
		}
		$fields_quoted = array();
		foreach ($fields as $field)
		{
			$fields_quoted[] = "`$field`"; 
		}
		
		$flipped_array = array_flip($_POST['draglist_items']);
		
		$this->connection->db_query("TRUNCATE `$table_name`");
		
		for ($i=0;$i<count($array_to_reorder);$i++)
		{
			$new_id = $i;
			$old_id = $flipped_array[$i];
			
						
			$values =array("'$new_id'");
			for ($j = 1;$j<count($array_to_reorder);$j++)
			{
				$values[$j] = "'".$array_to_reorder[$old_id][$fields[$j]]."'";
			}
			
			$reorder_sql ="INSERT INTO `$table_name` 
							( ". implode(', ',$fields_quoted) ." )	
							VALUES ( ".implode(', ',$values) .')';
			
			
			$this->connection->db_query($reorder_sql);
			
		}
		//$this->navi_array_update();
	}
}
?>