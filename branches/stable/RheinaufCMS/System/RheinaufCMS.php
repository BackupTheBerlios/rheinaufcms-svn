<?php
/*--------------------------------
--  RheinaufCMS Main Class
--
--  Open Source (GPL)
--
--  $HeadURL:https://raimund@svn.berlios.de/svnroot/repos/rheinaufcms/branches/stable/RheinaufCMS/System/RheinaufCMS.php $
--  $LastChangedDate:2008-02-14 15:48:56 +0100 (Do, 14 Feb 2008) $
--  $LastChangedRevision:73 $
--  $LastChangedBy:raimund $
---------------------------------*/

class RheinaufCMS
{
	var $connection;
	var $debug = false;
	var $homepath;
	var	$pfad;
	var $path_information;
	var $uri_components;
	var	$rubrik;
	var	$seite;
	var $navi;
	var $other_css;
	var $scripts;
	var $noframe = false;
	var $user;
	var $user_found_in; // Tabelle, in der der User steht
	
	var $tables = array('navi_table'=>'RheinaufCMS>Navi',
						'user_table'=>'RheinaufCMS>User',
						'rechte_table'=>'RheinaufCMS>Rechte',
						'groups_table'=>'RheinaufCMS>Groups');
	
	var $user_tables = array('RheinaufCMS>User');
	

	function RheinaufCMS()
	{

		$this->ini_sets();
		$this->includes();
		$this->add_db_prefix();

		$this->connection = new RheinaufDB();
		$this->navi = $this->navi_array();
		$this->pfad();
		$this->title = $this->rubrik;

		print $this->content();
	}

	function ini_sets()
	{
		set_include_path(get_include_path().PATH_SEPARATOR.INSTALL_PATH.'/System/'.PATH_SEPARATOR.INSTALL_PATH.'/Module/'.PATH_SEPARATOR .INSTALL_PATH.'/Libraries/'.PATH_SEPARATOR .INSTALL_PATH.'/Libraries/PEAR/');
		ini_set('arg_separator.output','&amp;');
		ini_set('display_errors',1);
		header('Content-type: text/html;charset=ISO-8859-1');
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
		include_once(INSTALL_PATH.'/System/Seite.php');
		include_once(INSTALL_PATH.'/Module/Navi.php');
		include_once(INSTALL_PATH.'/System/Date.php');
		include_once(INSTALL_PATH.'/System/HTML.php');
		include_once(INSTALL_PATH.'/System/Template.php');
		include_once(INSTALL_PATH.'/System/RheinaufFile.php');
		include_once(INSTALL_PATH.'/System/RheinaufDB.php');
		include_once(INSTALL_PATH.'/System/General.php');
		include_once(INSTALL_PATH.'/System/Login.php');
		//include_once('Bilder.php');

	}


	function navi_array()
	{
		//if (!$this->connection) $this->connection = new RheinaufDB();
		$navifromdb = $this->connection->db_assoc("SELECT * FROM `$this->navi_table` ORDER BY `id` ASC");

		$navi = array();
		for ($i=0;$i<count($navifromdb);$i++)
		{
			$rubrik_key = $navifromdb[$i]['Rubrik_key'];
			if ($navifromdb[$i]['Hierarchy']==0)
			{
				$navi[$rubrik_key]['Rubrik'] = $navifromdb[$i]['Rubrik'];
				$navi[$rubrik_key]['Show'] = $navifromdb[$i]['Show'];
				$navi[$rubrik_key]['Show_to'] = ($navifromdb[$i]['Show_to'] != '') ? explode(',',$navifromdb[$i]['Show_to']):'';
				$navi[$rubrik_key]['Modul'] = $navifromdb[$i]['Modul'];
				$navi[$rubrik_key]['ext_link'] = $navifromdb[$i]['ext_link'];


				$navi[$rubrik_key]['Subnavi'] = array();
			}
			else if ($navifromdb[$i]['Hierarchy']==1)
			{
				$page_key = $navifromdb[$i]['Page_key'];
				$navi[$rubrik_key]['Subnavi'][$page_key]['Seite'] = $navifromdb[$i]['Seite'];
				$navi[$rubrik_key]['Subnavi'][$page_key]['Show'] = $navifromdb[$i]['Show'];
				$navi[$rubrik_key]['Subnavi'][$page_key]['Show_to'] = ($navifromdb[$i]['Show_to'] != '') ? explode(',',$navifromdb[$i]['Show_to']):'';
				$navi[$rubrik_key]['Subnavi'][$page_key]['Modul'] = $navifromdb[$i]['Modul'];
				$navi[$rubrik_key]['Subnavi'][$page_key]['ext_link'] = $navifromdb[$i]['ext_link'];

			}

		}
		return $navi;
	}

	function content()
	{
		if (isset($_GET['logout']))
		{
			session_start();
			if ($_GET['logout'] == '') $_GET['logout'] = $_SESSION['RheinaufCMS_User']['Anrede'].' '.$_SESSION['RheinaufCMS_User']['Name'];
			unset($_SESSION['RheinaufCMS_User']);
			setcookie('RheinaufCMS_user',false,time() - 3600,'/');
		}
		// hier checken, um die Ausf�hrung der show() Methode zu verhindern
		Login::check_login($this);
		
		$vars = array();

		$this->rubrik = $rubrik = $this->I18n_get_int($this->navi[$_GET['r']]['Rubrik']);
		$this->seite = $seite =  $this->I18n_get_int($this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Seite']);


		$vars['rubrik'] = rawurlencode($this->rubrik);
		$vars['seite'] =  rawurlencode($this->seite);

		$title = ($this->seite != 'index')  ? $rubrik.' | '.$seite : $rubrik;

		if ($this->navi[$_GET['r']]['ext_link'])
		{
			header("Location: ".$this->navi[$_GET['r']]['ext_link']);
		}
		if ($this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['ext_link'])
		{
			header("Location: ".$this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['ext_link']);
		}
		if ($this->navi[$_GET['r']]['Modul'] =='' && $this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Modul']=='')
		{ 
			$return = $this->content_static($title);
		}
		else
		{
			if ($this->navi[$_GET['r']]['Modul']!='') $module = $this->navi[$_GET['r']]['Modul'];
			else $module = $this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Modul'];
			
			$return = $this->content_module($title,$module);
		}

		if (is_array($this->navi[$_GET['r']]['Show_to']) || $this->require_valid_user)
		{
			if (!$this->valid_user)
			{
				$return = $this->content_module($title,'Login');
			}
			else if (is_array($this->navi[$_GET['r']]['Show_to']) && !in_array($_SESSION['RheinaufCMS_User']['Group'],$this->navi[$_GET['r']]['Show_to']) && $_SESSION['RheinaufCMS_User']['Group'] != 'dev' )
			{
				$return = $this->content_module($title,'Login');
			}
		}
		return $return;
	}

	function navi_menu()
	{
		$navi = new Navi($this);
		return $navi->rubriken();
	}

	function content_static($title)
	{
		$page = new Seite($this);
		$vars['title'] = $title;
		$vars['navi'] = $this->navi_menu();
		if ($this->uri_components[2] == 'Arbeitsversion')
		{
			$working_version = ($this->check_right('SeiteEdit')) ? '/Arbeitsversion' :'';

		}
		$content_file = DOCUMENT_ROOT.INSTALL_PATH.'/Content/'.$this->path_encode($this->rubrik).'/'.$this->path_encode($this->seite).$working_version.'/content.html';

		if (isset($_GET['httperror']) || !RheinaufFile::is_file($content_file))
		{
/*			$search1 = General::error_regex($this->uri_components[0]);
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
			$vars['errorsearch'] = $list->flush_list();*/
			$template = new Template (DOCUMENT_ROOT.INSTALL_PATH.'/Templates/HTTPErrors.template.html');

			$content = $template->parse_template(($_GET['httperror'])?$_GET['httperror']:'404',$vars);
		}
		else
		{
			$template = new Template ($content_file);
			$template->system = $this;
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

	function content_module($title,$module)
	{
		$vars['title'] = $title;
		$vars['navi'] = $this->navi_menu();

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
			$instance->class_init($this);
		}
		else $instance = new $module ($this);
		
		if ($module != 'Login' && $this->require_valid_user)
		{
			// hier nochmal checken, falls Modul eine eigene User-Tabelle mitbringt
			if ($this->custom_user_table) Login::check_login($this);
			if(!$this->valid_user) return;
		}
		
		$instance_show = $instance->show();

		if (isset($instance->other_css))	$vars['other_css'] = $instance->other_css;
		if (isset($GLOBALS['other_css'])) $vars['other_css'] .= $GLOBALS['other_css'];

		if (isset($instance->scripts))	$vars['scripts'] = $instance->scripts;
		if ($this->scripts)  $vars['scripts'] .= implode("\n", $this->scripts); //that's the way to do it now: $this->system->add_js($string)
		if (isset($GLOBALS['scripts'])) $vars['scripts'] .= $GLOBALS['scripts'];
		

		if ( isset($_GET['noframe']) || $this->noframe)
		{
			if (isset($instance->extern))
			{
				$GLOBALS['INCLUDE_EXTERN'] = $instance->extern;
				return;
			}
			return $instance_show;
		}

		if (RheinaufFile::is_file(DOCUMENT_ROOT.INSTALL_PATH.'/Templates/'.$modul.'/template.html'))
		{
			$page= new Seite($this,DOCUMENT_ROOT.INSTALL_PATH.'/Templates/'.$modul.'/template.html');
		}
		else $page = new Seite($this,($this->template) ? $this->template : 'default');

		if (isset($instance->extern))
		{
			$GLOBALS['HEADER'] = $page->header($vars);
			$GLOBALS['FOOTER'] = $page->footer($vars);
			$GLOBALS['INCLUDE_EXTERN'] = $instance->extern;
			return;
		}

		$header = $page->header($vars);
	//	if ($modul!='Admin')
	//	{
			$content = new Template ($instance_show);
			$content = $content->parse_template('',$vars);
	//	}
	//	else $content = $instance_show;
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
		$redirect = $_SERVER['SCRIPT_URL'];
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
		//$verboten = array('�','�','�','�','�','�','�','�','�','�','�','�','�','�','�');
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

	function require_valid_user($table='',$template = 'default')
	{
		$this->require_valid_user = true;
		$this->login_template = $template;
		if ($table)
		{
			array_push($this->user_tables,$table);
			$this->custom_user_table = true;
		}
	}
	function login($meldung='',$template='')
	{ die('DEPRECATED LOGIN METHOD: '.__FILE__.' '.__LINE__);
		if (!isset($_SESSION)) session_start();

		if (isset($_POST['user']) && isset($_POST['pass']) && $this->check_login()) return true;
		$vars['uuid'] = $_SESSION['uuid'] = General::uuid(); 
		if (defined('HTTPS') && HTTPS && !isset($_SERVER['HTTPS']))
		{
			header("Location: ".'https://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
		}
		$page = new Seite($this,$template);

		$login_form = new Template(INSTALL_PATH.'/Templates/Login.template.html');

		$meldungen = Template::get_all_parts($login_form->template);

		$vars['meldung'] = ($meldungen[$meldung]) ? $meldungen[$meldung] : $meldung;
		$vars['action'] = SELF_URL;

		$vars['title'] = ($this->seite != 'index')  ? $this->rubrik.' | '.$this->seite : $this->rubrik;

		if ($navi)
		{
			$navi = new Navi($this);
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
				//if (HTTPS) header("Location: ".'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
				header("Location: ".'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
			}
			else
			{
				die($page->header($vars).Html::div($login_form->parse_template('FORM',$vars)).$page->footer($vars));
			}
		}
	}
	

	function debug()
	{
		$this->debug =true;
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
	
	function linker_navi()
	{
		$array = array();
		for ($i= 0; $i<count($this->navi);$i++)
		{
			if($this->navi[$i]['Rubrik'] == 'Admin') continue;
			$array[$i]['url'] = '/'.utf8_encode($this->path_encode($this->I18n_get_real($this->navi[$i]['Rubrik'])));
			$array[$i]['children'] = array();
			for ($j=0;$j<count($this->navi[$i]['Subnavi']);$j++)
			{
				if ($this->navi[$i]['Subnavi'][$j]['Seite'] != 'index')
				{
					$array[$i]['children'][$j]['url'] = $array[$i]['url'].'/'.utf8_encode($this->path_encode($this->I18n_get_real($this->navi[$i]['Subnavi'][$j]['Seite'])));
					$array[$i]['children'][$j]['children'] = array();
				}
			}
		}
		$_SESSION['RheinaufCMSLinker'] = $array;
	}
}
?>
