<?php
/*--------------------------------
--  Rheinauf CMS Admin UI
--  v2
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/
class Admin extends RheinaufCMS
{
	var $installed_modules = array();
	var $admin_menu = array ();
	var $noframe;

	function Admin($db_connection,$path_information)
	{
		session_start();
		$this->connection = $db_connection;
		$this->extract_to_this($path_information);
    	$this->path_information = $path_information;
    	$this->seite = $this->uri_components[1];

		if (!isset($_SESSION['RheinaufCMS_User'])) $this->login('',false);

		$this->installed_modules = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Admin>Module` ORDER BY `id` ASC");



		if ($_SESSION['RheinaufCMS_User']['Group'] == 'dev')
		{
			for ($i=0;$i<count($this->installed_modules);$i++)
			{
				$installed_modules[] = $this->installed_modules[$i]['Name'];
			}
			$_SESSION['RheinaufCMS_User']['allowed_modules'] = $this->allowed_modules = $installed_modules;
		}
		else
		{
			$allowed_modules_sql = "SELECT  * FROM `RheinaufCMS>Rechte` WHERE `id` = '". implode("' OR `id` ='",$_SESSION['RheinaufCMS_User']['allowed_actions']) ."' ";
			$allowed_modules = $this->connection->db_assoc($allowed_modules_sql);
			$this->allowed_modules = array();
			for ($i=0;$i<count($allowed_modules);$i++)
			{
				$this->allowed_modules[] = $allowed_modules[$i]['ModulName'];
			}

			$this->allowed_modules = array_unique($this->allowed_modules);
			if (count($this->allowed_modules) == 0) $this->login('',false);
			$_SESSION['RheinaufCMS_User']['allowed_modules'] = $this->allowed_modules;

		}


		foreach ($this->installed_modules as $module)
		{
			include_once(INSTALL_PATH.'/'.$module['Path']);
		}


	}
	function show()
	{
		if ($this->seite != 'index')
		{
			$return ='';
			$class = $this->seite;

			if (!class_exists($class))
			{
				$footer = new Seite($this->path_information );
				die ('Modul nicht installiert'.$footer->footer());
			}
			else
			{
				$instance = new $class ($this->connection,$this->path_information);
				if (!$instance->noframe)
				{
					$return .= $this->admin_menu();
				}
				else parent::noframe ();

				$return .= $instance->show();


			}
			$this->scripts = (isset($instance->scripts)) ? $instance->scripts : '';
			return $return;
		}
		else
		{
			return $this->admin_menu();
		}
	}

	function admin_menu()
	{
		$return_string = '';
		$allowed_modules = 0;

		$menu = new Menu($this->connection,$this->path_information);

		foreach ($this->installed_modules as $modul)
		{
			if (in_array($modul['Name'],$this->allowed_modules))
			{
				$return_string .= $menu->add($modul['Name'],$modul['LongName'],'/'.INSTALL_PATH.'/'.$modul['Icon']);
				$allowed_modules++;
			}
		}
		if ($allowed_modules == 0) $return_string .= 'Ihre Zugangsberechtigung gilt nicht für diesen Bereich.';
		$return_string .= $menu->menu_print();

		return Html::h('1',PROJECT_NAME.' Verwaltungs Bereich').'Guten Tag, '.$_SESSION['RheinaufCMS_User']['Name'].'. '.Html::a('/Admin?logout='.$_SESSION['RheinaufCMS_User']['Name'],'(Abmelden)',array('style'=>'font-size:9px')).Html::div($return_string,array('id'=>'admin'));
	}

}

class Menu extends RheinaufCMS
{
	var $return;

	function Menu($db_connection,$path_information)
	{
		$this->connection = $db_connection;
		$this->extract_to_this($path_information);
    	$this->path_information = $path_information;
	}

	function title ()
	{
		$this->return .=  Html::h(2,$title);
	}
	function add ($name,$longname,$icon = '')
	{
		if (is_file(DOCUMENT_ROOT.$icon))
		{
			$icon_tag = Html::img($icon,$longname);
		}

		if ($this->seite == $name)
		{
			$class_active = ' active';
		}
		else $class_active = '';
		$this->return .= Html::div(Html::a('/Admin/'.$name,$icon_tag.$longname,array('class'=>'block'.$class_active)),array('class'=>'menu_item'));

	}

	function menu_print ()
	{
		$return = $this->return;
		$this->return = '';
		return Html::div($return,array('class'=>'menu_row'));
	}

}