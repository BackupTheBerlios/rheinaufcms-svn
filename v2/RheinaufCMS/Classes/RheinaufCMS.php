<?php
/*--------------------------------
--  Rheinauf CMS Main Class
--  v2
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/

class RheinaufCMS
{
	var $connection;
	var $debug = false;
	var $structure;
	var $page_props;
	var $other_css;
	var $scripts;
	var $noframe = false;

	var $tables = array('user_table'=>'RheinaufCMS>User',
						'rechte_table'=>'RheinaufCMS>Rechte',
						'groups_table'=>'RheinaufCMS>Groups',
						'structure_table'=>'RheinaufCMS>Structure'
	);

	function RheinaufCMS()
	{

		$this->ini_sets();
		$this->includes();
		$this->add_db_prefix();

		$this->connection = new RheinaufDB();
		$this->structure = $this->structure_array();
		define('SELF_URL',$_SERVER['REQUEST_URI']);
		$this->page_props = new page_props(SELF_URL,$this);

		$this->debug($this->page_props);

		$this->debug($this->structure);

		if (isset($_POST['user']) && isset($_POST['pass'])) $this->check_login();

		$mtime = microtime();
		$mtime = explode(" ",$mtime);
		$mtime = $mtime[1] + $mtime[0];
		$endtime = $mtime;

		$sql_time = $endtime - START_TIME;
		print '<br>'.$sql_time;
		return ;
		print $this->content();
	}

	function ini_sets()
	{
		set_include_path(get_include_path().PATH_SEPARATOR.INSTALL_PATH.'/Classes/'.PATH_SEPARATOR.INSTALL_PATH.'/Module/'.PATH_SEPARATOR .INSTALL_PATH.'/Libraries/'.PATH_SEPARATOR .INSTALL_PATH.'/Admin/');
		ini_set('arg_separator.output','&amp;');
		ini_set('display_errors',1);
		header('Content-Script-Type: text/javascript');
		setlocale(LC_ALL, 'de_DE');
	}

	function add_db_prefix()
	{
		$db_prefix = (defined(DB_PREFIX)) ? DB_PREFIX :'';

		foreach ($this->tables as $key =>$value)
		{
			$this->tables[$key] = $db_prefix.$value;
		}
		$this->extract_to_this($this->tables);
	}

	function add_incl_path ($path)
	{
		set_include_path(get_include_path().PATH_SEPARATOR.$path);
	}


	function includes()
	{
		include_once(INSTALL_PATH.'/Classes/Seite.php');
		include_once(INSTALL_PATH.'/Module/Navi.php');
		include_once(INSTALL_PATH.'/Classes/Date.php');
		include_once(INSTALL_PATH.'/Classes/HTML.php');
		include_once(INSTALL_PATH.'/Classes/Template.php');
		include_once(INSTALL_PATH.'/Classes/RheinaufFile.php');
		include_once(INSTALL_PATH.'/Classes/RheinaufDB.php');
		include_once(INSTALL_PATH.'/Classes/General.php');
		include_once(INSTALL_PATH.'/Classes/Admin.php');
		//include_once('Bilder.php');

	}

	function debug($array)
	{
		print '<pre>';
		print_r($array);
		print '</pre>';
	}

	function structure_array()
	{

		$structurefromdb = $this->connection->db_assoc("SELECT * FROM `$this->structure_table` ORDER BY `Depth` ASC,`id` ASC");
		$structure = array();

		foreach ($structurefromdb as $entry)
		{
			$hierarchy = explode('::',$entry['URI']);
			eval('$this_entry = $structure[\''.implode("']['Children']['",$hierarchy).'\'][\'Page\']= $entry;');
		}
		return $structure;
	}


	function content()
	{
		if (isset($_GET['logout']))
		{
			session_start();
			unset($_SESSION['RheinaufCMS_User']);
			setcookie('RheinaufCMS_user',false,0,'/');
		}

		if (preg_match('/^\/admin/i',SELF_URL))
		{
			$this->rubrik = 'Admin';
			return $this->content_module('Admin');
		}
		$vars = array();

		$title = ($this->seite != 'index')  ? $rubrik.' | '.$seite : $rubrik;

		if (is_array($this->navi[$_GET['r']]['Show_to']))
		{
			$page_restricted = true;
			session_start();
			if (!isset($_SESSION['RheinaufCMS_User'])) $this->login('INTERN');
			if (!in_array($_SESSION['RheinaufCMS_User']['Group'],$this->navi[$_GET['r']]['Show_to']) &&$_SESSION['RheinaufCMS_User']['Group'] != 'dev' )
			{
				if ($_SESSION['RheinaufCMS_User']['Name'] == $_POST['user']) unset ($_POST['user']);
				$this->login('GILT_NICHT',true);
			}
		}



		if ($this->navi[$_GET['r']]['Modul'] =='' && $this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Modul']=='')
		{
			return $this->content_static($title,$page_restricted);
		}

		else
		{
			return $this->content_module($title,$page_restricted);
		}

	}

	function navi_menu()
	{
		$navi = new Navi($this->path_information,$this->navi);
		return $navi->rubriken();
	}

	function content_static($title,$page_restricted=false)
	{
		$page = new Seite($this->path_information);
		$vars['title'] = $title;
		$vars['navi'] = $this->navi_menu();
		if ($this->uri_components[2] == 'Arbeitsversion')
		{
			$working_version = ($this->check_right('SeiteEdit')) ? '/Arbeitsversion' :'';

		}
		$content_file = DOCUMENT_ROOT.INSTALL_PATH.'/Content/'.$this->path_encode($this->rubrik).'/'.$this->path_encode($this->seite).$working_version.'/content.html';

		if (isset($_GET['httperror']) || !is_file($content_file))
		{
			$search1 = General::error_regex($this->uri_components[0]);
			($this->uri_components[1] != 'index') ? $search2 = General::error_regex($this->uri_components[1]) :'';
			$search = "SELECT * FROM `$this->navi_table` WHERE `Rubrik` REGEXP '$search1'  OR `Seite` REGEXP '$search1'";
			if (isset($search2)) $search .= " OR `Rubrik` REGEXP '$search2' OR `Seite` REGEXP '$search2'";

			$result  = $this->connection->db_assoc($search);

			$list = new HtmlList('ul');
			foreach ($result as $ergebnis)
			{
				if ($ergebnis['Seite'] != 'index')
				$list->add_li(Html::a($ergebnis['Rubrik'].'/'.$ergebnis['Seite'],$ergebnis['Rubrik'].'/'.$ergebnis['Seite']));
			}
			$vars['errorsearch'] = $list->flush_list();
			$template = new Template (DOCUMENT_ROOT.INSTALL_PATH.'/Templates/HTTPErrors.template.html');

			$content = $template->parse_template(($_GET['httperror'])?$_GET['httperror']:'404',$vars);
		}
		else
		{
			$template = new Template ($content_file);
			$content = $template->parse_template('',$vars);
			$vars['scripts'] .= $template->scripts;
			$vars['other_css'] .= $template->other_css;
			if ($template->noframe ||  isset($_GET['noframe']))
			{
				return $content;
			}
		}
		$header = $page->header($vars);
		$footer = $page->footer($vars);

		return $header.$content.$footer;
	}

	function content_module($title,$page_restricted=false)
	{
		$vars['title'] = $title;
		$vars['navi'] = $this->navi_menu();

		if ($this->navi[$_GET['r']]['Modul']!='') $module = $this->navi[$_GET['r']]['Modul'];
		elseif (preg_match('/^\/admin/i',SELF_URL)) $module = 'Admin';
		else $module = $this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Modul'];

		if (preg_match('/(.*?)\((.*?)\)/',$module,$match))
		{
			$module = $match[1];
			$args = $match[2];
		}
		if (!class_exists($module))
		{
			include_once($module.'.php');
		}
		if (is_callable(array($module,'class_init')))
		{
			eval('$instance = new $module ('.$args.');');
			$instance->class_init($this->connection,$this->path_information);
		}
		else $instance = new $module ($this->connection,$this->path_information);

		$instance_show = $instance->show();

		if (isset($instance->other_css))	$vars['other_css'] = $instance->other_css;
		if (isset($GLOBALS['other_css'])) $vars['other_css'] .= $GLOBALS['other_css'];

		if (isset($instance->scripts))	$vars['scripts'] = $instance->scripts;
		if (isset($GLOBALS['scripts'])) $vars['scripts'] .= $GLOBALS['scripts'];

		if ($instance->noframe || isset($_GET['noframe']))
		{
			if (isset($instance->extern))
			{
				$GLOBALS['INCLUDE_EXTERN'] = $instance->extern;
				return;
			}
			return $instance_show;
		}

		if (is_file(DOCUMENT_ROOT.INSTALL_PATH.'/Templates/'.$module.'/template.html'))
		{
			$page= new Seite($this->path_information,DOCUMENT_ROOT.INSTALL_PATH.'/Templates/'.$module.'/template.html');
		}
		else $page = new Seite($this->path_information);

		if (isset($instance->extern))
		{
			$GLOBALS['HEADER'] = $page->header($vars);
			$GLOBALS['FOOTER'] = $page->footer($vars);
			$GLOBALS['INCLUDE_EXTERN'] = $instance->extern;
			return;
		}

		$header = $page->header($vars);
		if ($module!='Admin')
		{
			$content = new Template ($instance_show);
			$content = $content->parse_template('',$vars);
		}
		else $content = $instance_show;
		$footer = $page->footer($vars);

		return $header.$content.$footer;
	}

	function pfad()
	{

		$uri = array();
		$homepath = array();
		$pfad = array();
		$self =array();
		if (!$this->navi) $this->navi = $this->navi_array();
		$redirect = $_SERVER['REDIRECT_URL'];
		$this->path_information['rubrik'] = (isset($_GET['r'])) ? $this->I18n_get_real($this->navi[$_GET['r']]['Rubrik']) : HOMEPAGE;
		$this->path_information['seite'] = ($_GET['s'] != 0) ?   $this->I18n_get_real($this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Seite']) : 'index';


		if (!$redirect)
		{
			define ('DOCUMENT_ROOT',General::docroot());
			$this->extract_to_this($this->path_information);
			return;
		}

		$split = preg_split("#/#",$redirect);

		for ($i=0;$i<count($split);$i++)
		{
			//if (!empty($split[$i]) && !strpos($split[$i],'.'))
			if (!empty($split[$i]))
			{
				$uri[] = $split[$i];
				$homepath[] = '..';
				$pfad[] = $this->path_encode(rawurldecode($split[$i]));
				$self[] = rawurlencode($split[$i]);
			}

		}

		if (!isset($uri[1]))
		{
			$uri[1] = 'index';
			$homepath[] = '..';
			$pfad[1] = 'index';
			//$self[1] = 'index';
		}

		$this->path_information['homepath'] = implode('/',$homepath);


		$this->path_information['pfad'] = implode('/',$pfad);
		$this->path_information['uri_components'] = $uri;
		define ('DOCUMENT_ROOT',General::docroot());
		define('SELF','/'.implode('/',$self));
		define('SELF_URL','/'.implode('/',$self));
		$this->extract_to_this($this->path_information);
	}
	function extract_to_this($array)
	{
		foreach ($array as $key => $value)
		{
			$this->$key = $value;
		}
	}
	function path_encode($string)
	{
		//$verboten = array('ä','Ä','ö','Ö','ü','Ü','é','è','É','È','á','à','Á','À','ß');
		//$erlaubt = array('ae','Ae','oe','Oe','ue','Ue','e','e','E','E','a','a','A','A','ss');
		$verboten = array(' ','#','?','/','\\');
		$erlaubt = array('_');
		$string = str_replace($verboten,$erlaubt,$string);
		//preg_replace('/[^\w\._]/', '_', $string);
		return $string ;
	}

	function path_decode($string)
	{
		return rawurldecode(str_replace('_',' ',$string));
	}


	function login($meldung='',$navi=true)
	{

		$page = new Seite($this->path_information);

		$login_form = new Template(INSTALL_PATH.'/Templates/Login.template.html');

		$meldungen = Template::get_all_parts($login_form->template);

		$vars['meldung'] = ($meldungen[$meldung]) ? $meldungen[$meldung] : $meldung;
		$vars['action'] = SELF;

		if (isset($_GET['logout']))
		{
			$vars['user'] = $_GET['logout'];
			$vars['meldung'] = $login_form->parse_template('LOGOUT-MELDUNG',$vars);
		}

		$vars['title'] = ($this->seite != 'index')  ? $this->rubrik.' | '.$this->seite : $this->rubrik;

		if ($navi)
		{
			$navi = new Navi($this->path_information,$this->navi);
			$vars['navi'] = $navi->rubriken();
		}
		if (!isset ($_POST['user']) || !isset ($_POST['pass']) )
		{
			$vars['meldung'] .= Html::br().$meldungen['KENNWORT_EINGEBEN'];
			die($page->header($vars).Html::div($login_form->parse_template('FORM',$vars)).$page->footer($vars));
		}
		else
		{
			if ($this->check_login())
			{
				header("Location: ".'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
			}
			else
			{
				die($page->header($vars).Html::div($login_form->parse_template('FORM',$vars)).$page->footer($vars));
			}

		}
	}

	function check_login()
	{
		if (!isset($_SESSION)) session_start();
		$user = General::input_clean($_POST['user']);
		$pass = General::input_clean($_POST['pass']);
		$result = $this->connection->db_assoc("SELECT * FROM `$this->user_table` WHERE `Name`='$user' AND `Password`='$pass'");
		if ($result[0]['Name'] ==$user && $result[0]['Password'] == $pass)
		{
			$_SESSION['RheinaufCMS_User'] = General::multi_unserialize($result[0]);
			setcookie('RheinaufCMS_user',$user,0,'/');
			if (isset($_SESSION['RheinaufCMS_User']))
			{
				$this->rechte = array();
				if ($_SESSION['RheinaufCMS_User']['Group'] == 'dev')
				{
					$rechte = $this->connection->db_assoc("SELECT * FROM `$this->rechte_table`");
					for ($i=0;$i<count($rechte);$i++)
					{
						$this->rechte[] = $rechte[$i]['id'];
					}
					$_SESSION['RheinaufCMS_User']['allowed_actions'] = $this->rechte;
				}
				else
				{
					$this->rechte = General::multi_unserialize($this->connection->db_assoc("SELECT * FROM `$this->groups_table` WHERE `Name` ='".$_SESSION['RheinaufCMS_User']['Group']."'"));
					$_SESSION['RheinaufCMS_User']['allowed_actions'] = $this->rechte[0]['Rechte'];
				}
			}
			return true;
		}
		else
		{
			return false;
		}
	}

	function http_login($realm='')
	{
		if (!isset($_SESSION)) session_start();
		if (!$realm) $realm = PROJECT_NAME;
		if (!isset($_SESSION['RheinaufCMS_User'] ))
		{
			if (!isset($_SERVER['PHP_AUTH_USER']))
			{
				Header("WWW-Authenticate: Basic realm=\"$realm\"");
				Header("HTTP/1.0 401 Unauthorized");
     			return false;
       			exit;
  			}
  			else
			{
				$_POST['user'] = $_SERVER['PHP_AUTH_USER'];
				$_POST['pass'] = $_SERVER['PHP_AUTH_PW'];

				return $this->check_login();
			}
		}
	}


	function check_right($id)
	{
		if(!isset($_SESSION)) session_start();
		if (isset($_SESSION['RheinaufCMS_User']))
		{
			if ($_SESSION['RheinaufCMS_User']['group'] == 'dev') return true;
			if (!@in_array($id,$_SESSION['RheinaufCMS_User']['allowed_modules']) && !@in_array($id,$_SESSION['RheinaufCMS_User']['allowed_actions'])) return false;
			else return true;
		}
		else return false;
	}
	function noframe ()
	{
		$this->noframe = true;
	}
	function add_css ($string)
	{
		$this->other_css .= $string;
	}
	function add_js ($string)
	{
		$this->scripts[] = $string;
	}

	function relocate($relative_loc)
	{
		header("Location: http://".$_SERVER['SERVER_NAME']."/$relative_loc");
		exit;
	}
	function parse_I18n($string)
	{
		if (preg_match('#{I18n:(.*?)\((.*?)\)}#s',$string,$match))
		{
			$langs = array(LANG_DEFAULT=>$match[1]);

			preg_match_all('#\[(..|default)\]:\[(.*?)\]#s',$match[2],$lang_sub_matches);

			for ($i=0;$i<count($lang_sub_matches[0]);$i++)
			{
				$langs[$lang_sub_matches[1][$i]] = $lang_sub_matches[2][$i];
			}
			return $langs;
		}
		else return array(LANG_DEFAULT=>$string);
	}
	function I18n_get_real($string)
	{
		$langs = $this->parse_I18n($string);
		return $langs[LANG_DEFAULT];
	}
	function I18n_get_int ($string)
	{
		$langs = $this->parse_I18n($string);

		if($lang=$GLOBALS['LANG'] == LANG_DEFAULT || !isset($langs['default']))
		{
			return $langs[LANG_DEFAULT];
		}
		elseif (isset($langs[$lang])) return $langs[$lang];
		else return $langs['default'];
	}
}
class page_props
{
	var $page_props;

	function page_props($uri,$pObj)
	{
		$uri = strtolower(rawurldecode($uri));
		$uri_components = array();
		$uri_components = explode('/',$uri);
		array_shift($uri_components);
		$page = false;
		$i =0;
		while ($uri_components)
		{
			$structure_var = '$pObj->structure[\''.implode("']['Children']['",$uri_components).'\'][\'Page\']';
			if (!$page)
			{
				eval('$page = '.$structure_var.';');
				if ($page)
				{
					$this->page_props = $page;
					$this->page_props['structure_access_path'] = str_replace('$pObj->structure','',$structure_var);
				}
			}
			else
			{
				eval ('$this->page_props[\'Ancestors\'][] = '.$structure_var.';');
				$i++;
			}
			array_pop($uri_components);
		}
		$this->page_props['Ancestors'] = array_reverse($this->page_props['Ancestors'] );
		$this->page_props['Hierarchy'] = $hierarchy = explode('::',$this->page_props['Hierarchy']);
	}
}
?>