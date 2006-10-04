<?php
class Navi extends RheinaufCMS
{
	var $accesskey_array = array ('1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
	var $tabindex = 1;
	var $accesskey = 0;
	var $navi;
	function Navi($path_information,$navi)
	{
		$this->extract_to_this($path_information);
		$this->navi = $navi;
		$this->template = new Template(INSTALL_PATH.'/Templates/Navigation.template.html');

	}
	function rubriken ()
	{
		$vars = array();
		$navi_string = $this->template->get_part('PRE')."\n";
		for ($i = 0;$i <count($this->navi);$i++ )
		{
			switch ($this->navi[$i]['Rubrik'])
			{
				case ('separator'):
					$navi_string .= $this->template->get_part('SEPARATOR')."\n";
				break;
				default:
					if ($this->navi[$i]['Show'] == '1' )
					{
						$vars['tabindex'] = $this->tabindex;
						$this->tabindex++;
						$vars['accesskey'] = $this->accesskey_array[$this->accesskey];
						$this->accesskey++;
						$vars['name'] = $this->navi[$i]['Rubrik'];
						$vars['span_class'] = Html::html_legal_id($vars['name']);
						$vars['span_class'] = Html::css_legal_classname($vars['name']);
						if ($this->navi[$i]['ext_link'] != '')
						{
							$vars['link'] = $this->navi[$i]['ext_link'];
						}
						else $vars['link'] = 'http://'.$_SERVER['SERVER_NAME'].'/'. rawurlencode($this->path_encode($this->navi[$i]['Rubrik'])).'/';
						$vars['navi_class'] =  ($this->navi[$i]['Rubrik'] == $this->rubrik) ? 'navi navi_active' : 'navi';


						$navi_string .= $this->template->parse_template('RUBRIK',$vars);
						if ($this->navi[$i]['Rubrik'] == $this->rubrik)
						{
							$navi_string .= $this->sub_navi($i);
						}
					}
				break;
			}
		}
		$navi_string .= $this->template->parse_template('POST',$vars)."\n";

		return $navi_string;
	}
	function sub_navi($i)
	{
		$subnavi_string = '';
		$vars =array();
		$subnavi = $this->navi[$i]['Subnavi'];

		for ($j = 0;$j<count($subnavi);$j++)
		{
			if ($subnavi[$j]['Show'] == '1' && $subnavi[$j]['Seite'] != 'index')
			{
				$vars['tabindex'] = $this->tabindex;
				$this->tabindex++;
				$vars['accesskey'] = $this->accesskey_array[$this->accesskey];
				$this->accesskey++;
				$vars['subnavi_name'] = $subnavi[$j]['Seite'];
				if ($subnavi[$j]['ext_link'] != '')
				{
					$vars['subnavi_link'] = $subnavi[$j]['ext_link'];
				}
				else
				$vars['subnavi_link'] = $this->homepath . '/'. rawurlencode($this->path_encode($this->navi[$i]['Rubrik'])).'/'.rawurlencode($this->path_encode($subnavi[$j]['Seite'])).'/';
				$vars['subnavi_class'] = ($subnavi[$j]['Seite'] == $this->seite) ? 'subnavi subnavi_active' : 'subnavi';
				$subnavi_string .= $this->template->parse_template('SUBNAVI',$vars);
			}
		}
		return $subnavi_string;
	}

}
?>