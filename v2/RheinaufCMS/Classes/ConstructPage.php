<?php
/*--------------------------------
--  RheinaufCMS ConstructPage
--  v2
--	Builds a page from the templates
--
--  $HeadURL: https://ray_cologne@svn.berlios.de/svnroot/repos/rheinaufcms/v2/RheinaufCMS/Classes/RheinaufCMS.php $
--  $LastChangedDate: 2006-08-29 18:58:09 +0200 (Di, 29 Aug 2006) $
--  $LastChangedRevision: 8 $
--  $LastChangedBy: ray_cologne $
---------------------------------*/
class ConstructPage extends RheinaufCMS
{
	var $template;
	function ConstructPage($pObj)
	{
		$this->pObj = $pObj;
		$template = $pObj->page_props['Template'];
		$anc =array_reverse($pObj->page_props['Ancestors']);

		while(!$template && $anc)
		{
			$template = $anc[0]['Template'];
			array_shift($anc);
		}
		$this->template = ($template) ? $template :INSTALL_PATH.'/Templates/Default.template.html';
		//$this->template = new Template($template);
		$this->header();
		return ;
	}

	function header($vars=array())
	{
		$anc = $this->pObj->page_props['Ancestors'];

		while($anc)
		{
			if ($anc[0]['CSS']) $vars['other_css'] .= '<link rel="stylesheet" href="'.$anc[0]['CSS'].'" media="screen" type="text/css" />'."\n";
			array_shift($anc);
		}
		if ($this->pObj->page_props['CSS']) $vars['other_css'] .= '<link rel="stylesheet" href="'.$this->pObj->page_props['CSS'].'" media="screen" type="text/css" />'."\n";
print $vars['other_css'];
		//return $this->template->parse_template('HEADER',$vars);
	}

	function footer($vars=array())
	{
		return $this->template->parse_template('FOOTER',$vars);
	}
}

?>