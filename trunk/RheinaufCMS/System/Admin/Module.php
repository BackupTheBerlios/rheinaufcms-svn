<?php
class Module extends Admin 
{
	var $return;
	var $installableModules = array();
	var $inPageModules = array();
	var $available_modules = array();
	var $installed  = array();
	function Module(&$system)
	{
		$this->system =& $system;
		$this->system->backend->top = 'Module installieren';
		$this->add_db_prefix();
		$this->connection = $system->connection;
		
		$this->images['plus'] = Html::img('/'.INSTALL_PATH . '/Libraries/Icons/16x16/edit_add.png','Hinzufügen');
		
		$this->event_listen();		
	}
	
	function show()
	{
		$this->return = '';
		if (!$this->check_right('Module')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		
		if (isset($_GET['admin_reihenfolge'])) $this->admin_module_reorder();
		else 
		{
			$this->module_table();
		}
		
		return $this->return;
	}
	
	function event_listen()
	{
		if (!$this->check_right('Module')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		if (isset($_POST['reorder'])) $this->reorder_apply();
		if (isset($_POST['install']) && $_POST['installable']) $this->install(rawurldecode($_POST['installable']));
		if (isset($_POST['uninstall']) && $_POST['installed']) $this->uninstall(rawurldecode($_POST['installed']));
	}
	
	function module_table()
	{
		$this->installed = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Module` WHERE `SYSTEM` = 0 ORDER BY `id` ASC");
		$this->available_modules = RheinaufFile::dir_array(INSTALL_PATH.'/Module',false,'php');

		foreach ($this->available_modules as $module)
		{
			$class_name = preg_replace('/\.php/','',$module);
			if ($module != 'Navi.php') 
			{
				if  (RheinaufFile::is_file(INSTALL_PATH.'/Module/'.$class_name.'/Install.php'))
				{
					include_once(INSTALL_PATH.'/Module/'.$class_name.'/Install.php');
					$class_name .= 'Install';
				}
				else 
				{
					include_once($module);	
				}
				
			}
			
			if (is_callable(array($class_name,'about')) )
			{
				eval('$module_about = '.$class_name.'::about();');
				switch ($module_about['type'])
				{
					case 'inPage':
						$this->inPageModules[] = $module_about;
					break;
					case 'installable':
						$this->installableModules[] = $module_about;
					break;
				}
			}
		}
		
		$return_string ='';
		$this->return .= Html::h(3,'Installierbare Module');
		$table = new Table(2);
		$table->add_th(array('Installierbare Module','Installierte Module'));
		$form = new Form();
		$form->form_tag(SELF_URL);
		$installed_modules = array();
		foreach ($this->installed as $installed)
		{
			$installed_modules[] = $installed['Name'];
		}
	
		$installables_select = new Select('installable',array('size'=>'10','style'=>'width:150px'));
		
		foreach ($this->installableModules as $modul)
		{

			if (!in_array($modul['Name'],$installed_modules))
			{
				$installables_select->add_option(rawurlencode($modul['Name']),$modul['Name']);
			}
		}
		$installed_select = new Select('installed',array('size'=>'10','style'=>'width:150px'));
		foreach ($installed_modules as $modul)
		{
			$installed_select->add_option(rawurlencode($modul),$modul);
		}
		$table->add_td(array($installables_select->flush_select(),$installed_select->flush_select()));
		$install_submit =  Form::add_input('submit','install','Installieren');
		$uninstall_submit =  Form::add_input('submit','uninstall','Deinstallieren');
		$table->add_td(array($install_submit,$uninstall_submit),array('style'=>'text-align:center'));
		
		$form->add_custom($table->flush_table());
		
		$this->return .= $form->flush_form();
		
		$this->return .= Html::h(3,'Aufruf über Template');
		
		$table = new Table(2,array('style'=>'width:500px'));
		$table->add_th(array('Modul','Einbindung'));
		foreach ($this->inPageModules as $module)
		{
			$table->add_td(array(Html::bold($module['Name']),$module['Usage']));
		}
		$this->return .= $table->flush_table();
	}

	function install($module)
	{
		if  (RheinaufFile::is_file(INSTALL_PATH.'/Module/'.$module.'/Install.php'))
		{
			include_once(INSTALL_PATH.'/Module/'.$module.'/Install.php');
			$module .= 'Install';
		}
		else 
		{
			include_once($module.'.php');	
		}
		
		$class = new $module ();
		
		if (method_exists($class,'install'))
		{
			$this->return .= $class->install($this);
		}
	}
	function uninstall($module)
	{
		if  (RheinaufFile::is_file(INSTALL_PATH.'/Module/'.$module.'/Install.php'))
		{
			include_once(INSTALL_PATH.'/Module/'.$module.'/Install.php');
			$module .= 'Install';
		}
		else 
		{
			include_once($module.'.php');	
		}
		
		$class = new $module ();
		
		if (method_exists($class,'uninstall'))
		{
			$this->return .= $class->uninstall($this);
		}
	}
	function register_frontend($name)
	{
			
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Module` 	( `id` , `Name`)
															VALUES  ('', '$name')");
	}
	
	function unregister_frontend($name)
	{
			
		$this->connection->db_query("DELETE FROM `RheinaufCMS>Module` WHERE	`Name` = '$name'");
		$this->connection->db_query("DELETE FROM `RheinaufCMS>Rechte` WHERE	`ModulName` = '$name'");
	}
	
	function register_backend($module,$file='',$long_name='',$icon_path='')
	{
		if (!$long_name) $long_name = $module;
		if (!$icon_path) $icon_path = '/Icons/32x32/connect_no.png';
		
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Admin>Module` 	( `id` , `Name` ,`LongName`, `Icon`,`File` )
															VALUES  ('', '$module','$long_name', '$icon_path','$file')");
	}
	
	function unregister_backend($name)
	{
			
		$this->connection->db_query("DELETE FROM `RheinaufCMS>Admin>Module` WHERE	`Name` = '$name'");
		$this->connection->db_query("DELETE FROM `RheinaufCMS>Rechte` WHERE	`ModulName` = '$name'");
	}
	

	function register_rights($values)
	{
		$id = $values['id'];
		$ModulName = $values['ModulName'];
		$RechtName = $values['RechtName'];
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Rechte` ( `id` , `ModulName` ,`RechtName`)
										 VALUES ('$id',  '$ModulName', '$RechtName');");
	}

	function admin_module_reorder()
	{
		$array_to_reorder = $this->connection->db_assoc("SELECT `id`,`sysID`,`Name` FROM `RheinaufCMS>Module` WHERE `Backend` != '' ORDER BY `id` ASC");
		$array_name_to_reorder = 'admin_module';
		
		$form_tag = Form::form_tag($_SERVER['REDIRECT_URL'],'post','application/x-www-form-urlencoded',array('name'=>'draglist_form'));
		$draglist_scripts = Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/dom-drag.js'));
		$draglist_scripts .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Draglist/assets/draglist.js'));
		$dragable_divs ='';
		
		for ($i=0;$i < count ($array_to_reorder);$i++)
		{
			$draglist_item = Form::add_input('hidden',"draglist_items[$i]",$i);
			$name = $array_to_reorder[$i]['Name'];
			$dragable_divs .= Html::div($name.$draglist_item,array('style'=>'margin-left:150px;padding:0 5px;position: relative; left: 0px; top: 0px;cursor:move;border:thin solid white;background:#eeeeee;width:200px;height:20px;'));
		}
		$draglist_container = Html::div($dragable_divs,array('id'=>'draglist_container'));
		$draglist_cmd = Form::add_input('hidden','reorder','');
		$draglist_apply = Form::add_input('button','reorder','Speichern',array('title'=>'Speichern','onclick'=>"draglist_manager.do_submit('draglist_form','draglist_container')"));
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
	
	function reorder_apply ()
	{
		$table = 'RheinaufCMS>Module';
		$array_to_reorder = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Module` WHERE `Backend` != '' ORDER BY `id` ASC");
		$order = array_flip($_POST['draglist_items']);

		for ($i=0;$i<count($order);$i++)
		{
			$entry = $array_to_reorder[$order[$i]];
			$old_id = $entry['id'];
			unset($entry['id']);
			$this->connection->db_insert($table,$entry);
			$this->connection->db_query("DELETE FROM `$table` WHERE `id` = $old_id");
		}
	}
}
?>