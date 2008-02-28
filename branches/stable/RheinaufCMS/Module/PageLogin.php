<?php
class PageLogin extends RheinaufCMS
{
	var $host;
	var $path;
	var $redirect;


	function  PageLogin()
	{
		
	}

	function class_init(&$system)
	{
		$this->system = $system;
		$this->connection = $system->connection;
	}

	function show()
	{
		$this->login = new Login($this->system);
		$this->system->login_template = INSTALL_PATH.'/Module/PageLogin/Login.template.html';
		
		if (Login::check_login())
		{
			return $this->logged_in_message();
		}
		else
		{
			return $this->login->show();
		}
	}

	function logged_in_message()
	{
		$template = new Template(INSTALL_PATH.'/Module/PageLogin/Login.template.html');
		$vars['user'] = $_SESSION['RheinaufCMS_User']['Name'];
		return $template->parse_template('LOGGED_IN',$vars);
	}
}

?>