<?php
/*--------------------------------
--  RheinaufCMS Login Page
--
--  $HeadURL: https://raimund@svn.berlios.de/svnroot/repos/rheinaufcms/trunk/RheinaufCMS/Classes/Admin.php $
--  $LastChangedDate: 2006-11-30 18:14:18 +0100 (Do, 30 Nov 2006) $
--  $LastChangedRevision: 40 $
--  $LastChangedBy: raimund $
---------------------------------*/

class Login extends RheinaufCMS
{

	function Login(&$system)
	{
		if (!isset($_SESSION)) session_start();
		$this->system =& $system;
	}
	function show($meldung='')
	{
		if (defined('HTTPS') && HTTPS && !isset($_SERVER['HTTPS']))
		{
			header("Location: ".'https://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
		}
		$vars['uuid'] = $_SESSION['uuid'] = General::uuid(); 
		$template = $this->system->login_template ? $this->system->login_template : INSTALL_PATH.'/Templates/Login.template.html';
		$login_form = new Template($template);

		$meldungen = Template::get_all_parts($login_form->template);

		$vars['meldung'] = ($meldungen[$meldung]) ? $meldungen[$meldung] : $meldung;
		$vars['action'] = SELF_URL;

		if (isset($_GET['logout']))
		{
			$vars['user'] = $_GET['logout'];
			$vars['meldung'] = $login_form->parse_template('LOGOUT-MELDUNG',$vars);
		}

		if (!isset ($_POST['user']) || !isset ($_POST['pass']) )
		{
			$vars['meldung'] .= Html::br().$meldungen['KENNWORT_EINGEBEN'];
			return Html::div($login_form->parse_template('FORM',$vars));
		}
		else
		{
			/*if ($this->check_login($system))
			{
				//if (HTTPS) header("Location: ".'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
				header("Location: ".'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
			}
			else
			{*/
				$vars['meldung'] .= Html::br().$meldungen['FAIL'];
				return Html::div($login_form->parse_template('FORM',$vars));
		//	}
		}
	}

	function check_login(&$system)
	{
		if (!isset($_SESSION)) session_start();

		if ($_SESSION['RheinaufCMS_User']['Login'])
		{
			$system->user = $_SESSION['RheinaufCMS_User'];
			$system->valid_user = true;
			return true;
		}
		$user = General::input_clean($_POST['user']);
		$pass = General::input_clean($_POST['pass']);
		$a = array();

		foreach ($system->user_tables as $t)
		{
			$sql = "SELECT * FROM `$t` WHERE `Login`='$user' AND `Password`='$pass'";
			$result = $system->connection->db_single_row($sql);
			if ($result) break;
		}

		if ($user && $pass && $result['Login'] == $user && $result['Password'] == $pass && $_SESSION['uuid'] == $_POST['uuid'])
		{
			$_SESSION['RheinaufCMS_User'] = $system->user = General::multi_unserialize($result);
			$_SESSION['RheinaufCMS_User']['user_found_in'] = $t;
			setcookie('RheinaufCMS_user',$user,0,'/');
		
			$system->connection->db_update($t,array('last_login'=>Date::now()),"id = '".$result['id']."'");
			
			if (isset($_SESSION['RheinaufCMS_User']))
			{
				$system->rechte = array();
				if ($_SESSION['RheinaufCMS_User']['Group'] == 'dev')
				{
					$rechte = $system->connection->db_assoc("SELECT * FROM `RheinaufCMS>Rechte`");
					for ($i=0;$i<count($rechte);$i++)
					{
						$system->rechte[] = $rechte[$i]['id'];
					}
					$_SESSION['RheinaufCMS_User']['allowed_actions'] = $system->rechte;
				}
				else
				{
					$rechte = General::multi_unserialize($system->connection->db_single_row("SELECT * FROM `RheinaufCMS>Groups` WHERE `Name` ='".$_SESSION['RheinaufCMS_User']['Group']."'"));
					$_SESSION['RheinaufCMS_User']['allowed_actions'] = $system->rechte  = $rechte['Rechte'];
				}
			}
			unset($_SESSION['uuid']);
			$system->valid_user = true;
			return true;
		}
		else
		{
			
		}
		return false;
	}

	function http_login(&$system,$realm='')
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

				return Login::check_login($system);
			}
		}
	}
}

