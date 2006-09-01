<?php
/*--------------------------------
--  RheinaufCMS ConstructPage
--  v2
--	Builds a page from the templates
--
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
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
		$template = ($template) ? $template :INSTALL_PATH.'/Templates/Default.template.html';
//$pObj->page_props['Module'] = 'Admin()';
		$content = ($mod = $pObj->page_props['Module']) ? "{Modul:$mod}" : INSTALL_PATH.'/Content/'.$pObj->page_props['File'].'/content.html';
		$content = new Template($content,$this->pObj);
		$parsed_content = $content->parse_template('',$this->pObj->page_props);
		$this->pObj->page_props = $content->pObj->page_props;
		$this->pObj->page_props['MAIN_CONTENT'] = $parsed_content;

		$template = new Template($template,$this->pObj);
		$parsed_template = $template->parse_template('BODY',$this->pObj->page_props);
		$this->pObj->page_props = $template->pObj->page_props;
		$this->pObj->page_props['BODY'] = $parsed_template;
print_r($this->pObj->page_props);
		//$head = $this->head();

		return ;
	}

	function head()
	{
		$template = new Template(INSTALL_PATH.'/Templates/HTML_Frame.template.html',$this->pObj);
		$anc = $this->pObj->page_props['Ancestors'];
		while($anc)
		{
			if ($anc[0]['CSS']) $vars['other_css'] .= '<link rel="stylesheet" href="'.$anc[0]['CSS'].'" media="screen" type="text/css" />'."\n";
			array_shift($anc);
		}
		if ($this->pObj->page_props['CSS']) $vars['other_css'] .= '<link rel="stylesheet" href="'.$this->pObj->page_props['CSS'].'" media="screen" type="text/css" />'."\n";
		if ($this->pObj->page_props['inline_CSS']) $vars['other_css'] .= Html::style($this->pObj->page_props['inline_CSS']);
		return $this->template->parse_template('HTML_FRAME',$this->pObj['page_props']);
	}

	function footer($vars=array())
	{
		return $this->template->parse_template('FOOTER',$vars);
	}
}

?>