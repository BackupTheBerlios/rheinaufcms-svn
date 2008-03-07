<?php
/*--------------------------------
--  RheinaufCMS Admin UI
--
--  $HeadURL:https://raimund@svn.berlios.de/svnroot/repos/rheinaufcms/branches/stable/RheinaufCMS/System/Admin.php $
--  $LastChangedDate:2008-02-14 15:48:56 +0100 (Do, 14 Feb 2008) $
--  $LastChangedRevision:73 $
--  $LastChangedBy:raimund $
---------------------------------*/
if (isset($_GET['ping']))
{
	die('pong');
}
class Admin extends RheinaufCMS
{
	var $installed_modules = array();
	var $admin_menu = array ();
	var $noframe;

	var $login_tpl = '<!--HEADER-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
<head>
     <title>{If:projekt_name|RheinaufCMS} - Verwaltungsbereich</title>
     <link rel="stylesheet" href="/CSS/Admin.css" type="text/css" />
</head>

<body>
<div id="content">
<!--/HEADER-->
<!--FOOTER-->
</div>
</body>
</html>

<!--/FOOTER-->';

	function Admin(&$system)
	{
		session_start();
		//$this->add_db_prefix();
		$this->system =& $system;
		$this->system->backend =& $this;
		
		$this->connection = $system->connection;
		
	}
	function show()
	{
		if (!Login::check_login($this->system))
		{
			$page = new Seite($this->system,$this->login_tpl);
			$login = new Login($this->system);
			return $page->header().$login->show().$page->footer();
		}
		 
		preg_match("/Admin\/([^\/|?|#]*)/",$_SERVER['REQUEST_URI'],$m);
		$this->modul = $m[1];
		
		$installed_modules = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Module` WHERE `Backend` != '' ORDER BY `id` ASC");

		for ($i=0;$i<count($installed_modules);$i++)
		{
			$this->installed_modules[$installed_modules[$i]['sysID']] = $installed_modules[$i];
		}
			
		if (!$_SESSION['RheinaufCMS_User']['allowed_actions'])
		{
			unset($_SESSION['RheinaufCMS_User']);
			$page = new Seite($this->system,$this->login_tpl);
			$login = new Login($this->system);
			return $page->header().$login->show('Entschuldigung, Sie haben nicht die Erforderlichen Rechte.').$page->footer();
		}
		
		if ($_SESSION['RheinaufCMS_User']['Group'] == 'dev')
		{
			for ($i=0;$i<count($installed_modules);$i++)
			{
				$allowed_modules[] = $installed_modules[$i]['sysID'];
			}
			$_SESSION['RheinaufCMS_User']['allowed_modules'] = $this->allowed_modules = $allowed_modules;
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
			if (count($this->allowed_modules) == 0) $this->login('',$this->login_tpl);
			$_SESSION['RheinaufCMS_User']['allowed_modules'] = $this->allowed_modules;

		}

		if ($this->modul != '')
		{
			$return ='';
 			//print_r($this->installed_modules);
			$class = $this->modul;
			include(INSTALL_PATH.'/'.$this->installed_modules[$class]['Backend']);
 			if (!class_exists($class))
			{
				$return = 'Modul nicht installiert';
			}
			else
			{
				$instance = new $class ($this->system);
				$return .= $instance->show();
			}
			$this->scripts = (isset($instance->scripts)) ? $instance->scripts : '';
			
		}
		if ($this->system->backend->tabs) $return = Html::div(Html::span($this->system->backend->tabs),array('id'=>'admin_tabs')).$return; 
		if ($this->system->noframe ||isset($_GET['noframe']))
		{
			return $return;
		}
		
		$this->system->noframe = true;

		$page = new Html(PROJECT_NAME.' - Verwaltungsbereich');
		$page->stylesheet('/CSS/Admin.css');
		$page->custom('
		<!-- compliance patch for microsoft browsers -->
<!--[if lt IE 7]>
<script src="/Libraries/IE7/ie7-standard-p.js" type="text/javascript">
</script>
<![endif]-->
		');
		if ($GLOBALS['other_css'])
		{
			$page->header_string .= $GLOBALS['other_css']; 
		}
		if ($GLOBALS['scripts'])
		{
			$page->header_string .= $GLOBALS['scripts']; 
		}
		if (!$GLOBALS['http_request_scripts'])
		{
			$page->header_string .= Html::script('',array('src'=>'/Scripts/XMLHttpRequest.js'));

			$GLOBALS['http_request_scripts'] = true;
		}
					
		$page->header_string .= Html::script('     	function pinghome ()
	     	{
	     		var url = location.protocol + "/"+"/"+ location.host +"/Admin?ping";
	     		httpRequestGET (url,function(){
	     		setTimeout(pinghome,120000);
	     		}, false)
	     	}
	     	setTimeout(pinghome,120000);');
		
		if (isset($_GET['nomenu']))
		{
			$page->div($return,array('id'=>'content'));
			return $page->flush_page(); 
		}
		else 
		{
			$user = $this->system->user['Name'];
			$logout = Html::span("Guten Tag, ".$user.' '.Html::a('?logout='.rawurlencode($user),' logout'),array('id'=>'logout'));
			$page->div(Html::span($this->system->backend->top).$logout,array('id'=>'admin_top'));
			$page->div('',array('id'=>'lo_logo'));
			
			$page->div('',array('id'=>'menu_appendix'));
			$page->custom($this->admin_menu());
			
			$page->div(Html::div($this->installed_modules[$class]['Name'],array('id'=>'module_name')).$return.'<br style="clear:both />',array('id'=>'content', 'class'=>'admin content'));
			
			return $page->flush_page();	
		}
	}

	function admin_menu()
	{
		$allowed_modules = 0;

		$menu = new Menu();

		if (is_array($this->allowed_modules))
		{
			foreach ($this->installed_modules as $modul)
			{
				if (in_array($modul['sysID'],$this->allowed_modules))
				{
					$menu->add($modul['sysID'],$modul['Name'],$modul['Icon'],($modul['sysID'] == $this->modul));
					$allowed_modules++;
				}
			}
		}
		if ($allowed_modules == 0) $return_string .= 'Ihre Zugangsberechtigung gilt nicht für diesen Bereich.';
		
		return  $menu->menu_print();
	}

}

class Menu extends RheinaufCMS
{
	var $return;

	function Menu()
	{
	}

	function title ()
	{
		$this->return .=  Html::h(2,$title);
	}
	function add ($name,$longname,$icon = '',$active=false)
	{

		$icon_tag = Html::img($icon,$longname);
		$link_class = 'block';
		if ($active)
		{
			$link_class .= ' active';
		}
		
		$this->return .= Html::div(Html::a('/Admin/'.$name,$icon_tag.$longname,array('class'=>$link_class)),array('class'=>'menu_item'));

	}

	function menu_print ()
	{
		$return = $this->return;
		$this->return = '';
		return Html::div($return,array('class'=>'menu_row'));
	}
}

