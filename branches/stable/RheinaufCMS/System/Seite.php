<?php
class Seite
{
	var $template;
	
	function Seite(&$system,$template='default')
	{
		$this->system = $system;
		if ($template && $template != 'default')
		{
			$this->template = new Template($template);
		}
		else if (file_exists(INSTALL_PATH.'/Templates/'.$this->system->path_encode($system->rubrik).'/'.$this->system->path_encode($system->seite).'/template.html'))
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/'.$this->system->path_encode($system->rubrik).'/'.$this->system->path_encode($system->seite).'/template.html');
		}
		else if (file_exists(INSTALL_PATH.'/Templates/'.$this->system->path_encode($system->rubrik).'/template.html'))
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/'.$this->system->path_encode($system->rubrik).'/template.html');
		}
		else
		{
			$this->template = new Template(INSTALL_PATH.'/Templates/Seite.template.html');
		}
	}

	function header($vars=array())
	{
		$rubr_enc = $this->system->path_encode($this->system->rubrik);
		$seite_enc = $this->system->path_encode($this->system->seite);
		if (RheinaufFile::is_file(DOCUMENT_ROOT.INSTALL_PATH . "/CSS/{$rubr_enc}/{$seite_enc}.css"))
		{
				$vars['other_css'] .= '<link rel="stylesheet" href="'."/CSS/{$rubr_enc}/{$seite_enc}.css".'" media="screen" type="text/css" />';
		}
		else if (RheinaufFile::is_file(DOCUMENT_ROOT.INSTALL_PATH . "/CSS/{$rubr_enc}.css"))
		{
				$vars['other_css'] .= '<link rel="stylesheet" href="'."/CSS/{$rubr_enc}.css".'" media="screen" type="text/css" />';
		}

		return $this->template->parse_template('HEADER',$vars);
	}

	function footer($vars=array())
	{
		return $this->template->parse_template('FOOTER',$vars);
	}
}

?>