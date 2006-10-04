<?php
class Seite extends RheinaufCMS
{
	var $template;
	function Seite($path_information,$template='default')
	{
		$this->extract_to_this($path_information);

		if ($template != 'default')
		{
			$this->template = new Template($template);
		}
		else if (file_exists(INSTALL_PATH.'/Templates/'.$this->path_encode($this->rubrik).'/'.$this->path_encode($this->seite).'/template.html'))
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/'.$this->path_encode($this->rubrik).'/'.$this->path_encode($this->seite).'/template.html');
		}
		else if (file_exists(INSTALL_PATH.'/Templates/'.$this->path_encode($this->rubrik).'/template.html'))
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/'.$this->path_encode($this->rubrik).'/template.html');
		}
		else
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/Seite.template.html');
		}

	}

	function header($vars=array())
	{

		$rubr_enc = $this->path_encode($this->rubrik);
		if (is_file(DOCUMENT_ROOT.INSTALL_PATH . '/CSS/'.$rubr_enc.'.css'))
		{
				$vars['other_css'] .= '<link rel="stylesheet" href="/'.INSTALL_PATH.'/CSS/'.$rubr_enc.'.css" media="screen" type="text/css" />';
		}

		return $this->template->parse_template('HEADER',$vars);
	}

	function footer($vars=array())
	{
		return $this->template->parse_template('FOOTER',$vars);
	}
}

?>