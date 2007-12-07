<?php
/*--------------------------------
--  RheinaufCMS Main Class
--
--  Open Source (GPL)
--
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/

class RheinaufCMS
{
	public $page;
	
	public $content;
	public $connection;
	public $debug = false;
	public $pages;
	public $breadcrumbs = array();
	public $other_css;
	public $scripts;
	public $noframe = false;
	
	public $user;
	public $user_found_in; // Tabelle, in der der User steht
	
	public $tables = array('pages'=>'pages',
						'user_table'=>'RheinaufCMS>User',
						'rechte_table'=>'RheinaufCMS>Rechte',
						'groups_table'=>'RheinaufCMS>Groups');
	
	public $user_tables = array('RheinaufCMS>User');
	

	public function __construct()
	{
		$this->ini_sets();
		$this->includes();

		$this->connection = new RheinaufDB();
		//$this->connection->debug = true;
	}

	private function ini_sets()
	{
		define('DOCUMENT_ROOT',str_replace(INSTALL_PATH.'/System/RheinaufCMS.php','',__FILE__));
		define('TMPDIR',DOCUMENT_ROOT.'/'.INSTALL_PATH.'/tmp');
		set_include_path(get_include_path().PATH_SEPARATOR.INSTALL_PATH.'/System/'.PATH_SEPARATOR.INSTALL_PATH.'/Module/'.PATH_SEPARATOR .INSTALL_PATH.'/Libraries/'.PATH_SEPARATOR .INSTALL_PATH.'/Libraries/PEAR/');
		ini_set('display_errors',0);
		ini_set('arg_separator.output','&amp;');
		ini_set('session.use_only_cookies','1');
//		ini_set('session.save_path',TMPDIR);
	//	session_name ("rcms_session");
		
		header('Content-type: text/html;charset=UTF-8');
		header('Content-Script-Type: text/javascript');
		setlocale(LC_ALL, 'de_DE');
	}

	public function add_incl_path ($path)
	{
		set_include_path(get_include_path().PATH_SEPARATOR.$path);
	}


	private function includes()
	{
		include_once(INSTALL_PATH.'/System/Page.class.php');
		
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


	private function get_pages()
	{
		$table = $this->get_table('pages');
		$n = $this->connection->db_assoc("SELECT * FROM `$table` ORDER BY parentID, ordinalID ASC");

		$pages = array();
		for ($i=0;$i<count($n);$i++)
		{
			$pageID = $n[$i]['id'];
			$parentID = $n[$i]['parentID'];
			
			$pages['p'.$pageID] = new Page ($n[$i]);

			if ($parentID > -1) 
			{
				$p = $parentID;
				while ($p > -1)
				{
					$pages['p'.$pageID]->add_ancestor($pages['p'.$p]);
					$p = $pages['p'.$p]->get_parent_id();
				}
				$pages['p'.$parentID]->add_child($pages['p'.$pageID]);
			}
		}

		$this->pages = $pages;
	}
	
	function get_pages_by_url()
	{
		$table = $this->get_table('pages');
		return $this->connection->db_assoc("SELECT URL, id
			FROM `$table`
			ORDER BY CHAR_LENGTH( URL ) ASC");
	}
	
	function get_table ($table)
	{ 
		$db_prefix = (defined('DB_PREFIX')) ? DB_PREFIX :'';
		$table = ($this->tables[$table]) ? $this->tables[$table] : $table;
		return $db_prefix.$table;
	}
	
	function get_page()
	{
		if (!$this->pages)
		{
			$this->get_pages();
		}
		if ($_GET['page_id']) return $this->pages['p'.$_GET['page_id']];
		
		$request = $_SERVER['REQUEST_URI'];
		$request = preg_match("%/$%",$request) ? $request : $request .'/';
		$pages = $this->get_pages_by_url();

		foreach ($pages as $p)
		{
			if (preg_match("%^".$p['URL']."%i",$request)) $page = $p['id'];
		}
		
		return $this->pages['p'.$page];
	}

	public function content()
	{
		if (isset($_GET['logout']))
		{
			session_start();
			if ($_GET['logout'] == '') $_GET['logout'] = $_SESSION['RheinaufCMS_User']['Anrede'].' '.$_SESSION['RheinaufCMS_User']['Name'];
			unset($_SESSION['RheinaufCMS_User']);
			setcookie('RheinaufCMS_user',false,time() - 3600,'/');
		}
		// check login early to prevent execution of show() 
		Login::check_login($this);
		
		$vars = array();
		$return = '';

		
		$this->page = $this->get_page();
		print $this->page->get_breadcrumbs()->to_html();
		
		//print_r($this->page);
		/*
		if ($page['ext_link'])
		{
			header("Location: ".$page['ext_link']);
		}
		
		if ( $page['module'])
		{
			$return = $this->content_module($page,$module);
		}
		else
		{
			$return = $this->content_static($page);
		}
		$a = $page;
		$this->breadcrumbs[] = $a['URL'];
*/
		
		
 		return $return;
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
		/*$this->rubrik = $rubrik = $this->I18n_get_int($this->navi[$_GET['r']]['Rubrik']);
		$this->seite = $seite =  $this->I18n_get_int($this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Seite']);


		$vars['rubrik'] = rawurlencode($this->rubrik);
		$vars['seite'] =  rawurlencode($this->seite);*/

		$title = ($this->seite != 'index')  ? $rubrik.' | '.$seite : $rubrik;



		
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
			$file_last_changed = filemtime($content_file);
			$vars['last_changed'] = date("d.m.Y, H.i");
			$template = new Template ($content_file);
			$template->system =& $this;
			$template->init_snippets();

			$content = $template->parse_template('',$vars);
			
			$vars['scripts'] = $this->scripts;
			$vars['scripts'] .= $template->scripts;
			$vars['other_css'] .= $template->other_css;

			$vars['other_css'] = $this->other_css;
			if (isset($GLOBALS['other_css'])) $vars['other_css'] .= $GLOBALS['other_css'];
			if (isset($GLOBALS['scripts'])) $vars['scripts'] .= $GLOBALS['scripts'];

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

		$vars['other_css'] = $this->other_css;
		if (isset($instance->other_css))	$vars['other_css'] .= $instance->other_css;
		if (isset($GLOBALS['other_css'])) $vars['other_css'] .= $GLOBALS['other_css'];

		$vars['scripts'] = $this->scripts;
		if (isset($instance->scripts))	$vars['scripts'] .= $instance->scripts; //deprecated
		if (isset($GLOBALS['scripts'])) $vars['scripts'] .= $GLOBALS['scripts']; // half deprecated
		
		
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
			$content->system =& $this;
			$content->init_snippets();
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
		$redirect = $_SERVER['REDIRECT_URL'];
		$this->path_information['rubrik'] = (isset($_GET['r'])) ? $this->I18n_get_real($this->navi[$_GET['r']]['Rubrik']) : HOMEPAGE;
		$this->path_information['seite'] = ($_GET['s'] != 0) ?   $this->I18n_get_real($this->navi[$_GET['r']]['Subnavi'][$_GET['s']]['Seite']) : 'index';


		if (!$redirect)
		{
			define ('DOCUMENT_ROOT',General::docroot());
			$this->extract_to_this($this->path_information);
			define('SELF_URL',$_SERVER['PHP_SELF']);

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
		//define('SELF','/'.implode('/',$self)); 
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
}
?>
