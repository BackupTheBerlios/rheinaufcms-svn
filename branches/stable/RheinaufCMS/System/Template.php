<?
class Template
{
	var $template;
	var $parts= array();
	function Template($template)
	{
		if (@RheinaufFile::is_file($template)) $this->template = RheinaufFile::get_file($template);
		else $this->template = $template;
		if (@RheinaufFile::is_file($snippet_pfad = INSTALL_PATH.'/Templates/Snippets.html'))
		{
			$this->snippets = $this->get_all_parts(file_get_contents($snippet_pfad));
		}
	}

	function get_part ($name='')
	{

		if (preg_match('#<!--'.$name.'-->(.*?)<!--/'.$name.'-->#s',$this->template,$matches)) return $matches[1];
		else return $this->template;
	}

	function get_all_parts($template)
	{
		preg_match_all('#<!--(.*?)-->(.*?)<!--/.*?-->#s',$template,$matches);

		$array=array();
		for ($i=0;$i<count($matches[1]);$i++)
		{
			$array[$matches[1][$i]] = $matches[2][$i];
		}
		return $array;
	}

	function parse_template($name='',$var_array = array())
	{
		if (!is_array($var_array)) $var_array = array($var_array);
		
		$var_array = array_merge((array)$var_array,(array)$this->snippets);
		
		if (is_array($GLOBALS['TemplateVars'])) $var_array = array_merge($var_array,$GLOBALS['TemplateVars']);
		
		@include(DOCUMENT_ROOT.INSTALL_PATH.'/Templates/TemplateVars.php');
		
		if ($name == '') $name = 'all';
		
		if (!isset($this->parts[$name])) $this->parts[$name]= $this->get_part($name);

		preg_match_all('/\{(.*?)\}|\[I18n:(..)\](.*?)\[\/I18n:..\]/s', $this->parts[$name],$matches);

		$vars_geklammert = $matches[0];
		$vars = $matches[1];
		$return = $this->parts[$name];
		
	/*
	if (preg_match_all('/{pagebreak(.*?)}/',$return, $m))
		{
		//	print_r($m);
			$subpages = preg_split("/{pagebreak(.*?)}/", $return);
			$return = ($_GET['p']) ? $subpages[(int)$_GET['p']-1] : $subpages[0];
		}
		
*/
		for ($i=0;$i<count($vars);$i++)
		{
			$return = $this->apply_rules($return,  $var_array, $vars[$i], $vars_geklammert[$i]);
			$return = (isset($var_array[$vars[$i]])) ? str_replace($vars_geklammert[$i],$var_array[$vars[$i]], $return) : $return;
		}

		return  $return;
	}
	
	/** Template Ersetzungsregeln
	 * 
	 * @return 
	 * @param $input Object
	 * @param $i Object
	 * @param $var_array Object
	 * @param $vars Object
	 * @param $vars_geklammert Object
	 */
	function apply_rules($input, $var_array, $var, $var_geklammert)
	{
		$return = $input;

		#
		# If/else
		#
		if ($var_geklammert == '{debug}')
		{
			$return = str_replace($var_geklammert,print_r($var_array,true),$return);
		}
		if (preg_match('#{If:(.*?)\|(.*?)}#s',$var_geklammert,$match))
		{
			if ($var_array[$match[1]])
			{
				$return = str_replace($match[0],$var_array[$match[1]],$return);
			}
			else $return = str_replace($match[0],$match[2],$return);
		}
		#
		# Einfaches Konditional
		#
		if (preg_match('#{If:(.*?)}#s',$var_geklammert,$match))
		{
			$return = str_replace($match[0],$var_array[$match[1]],$return);
		}
		#
		#$vars['meldung'] = 'Hallo'; soll gezeigt werden, wenn nicht leer:
		#	{IfNotEmpty:meldung(Das ist eine Meldung: [meldung])}
		#ergibt:
		#	Das ist eine Meldung: Hallo
		#
		
		if (preg_match('#{IfNotEmpty:(.*?)\((.*?)\)}#s',$var_geklammert,$match))
		{
			if ($var_array[$match[1]] !='')
			{
				preg_match_all('/\[(.*?)\]/',$match[2],$subpatterns);
				$sub_vars = $subpatterns[1];
		
				$sub_replace =array();
				foreach ($sub_vars as $key =>$sub_var)
				{
					$sub_replace[$key] = $var_array[$sub_var];
					$sub_vars[$key] = "[$sub_var]";
				}
				$replace = str_replace($sub_vars,$sub_replace,$match[2]);
		
				$return = str_replace($match[0],$replace, $return);
			}
			else $return = str_replace($match[0],'',$return);
		}
		
		if (preg_match('#{IfEmpty:(.*?)\((.*?)\)}#s',$var_geklammert,$match))
		{
			if ($var_array[$match[1]] =='')
			{
				preg_match_all('/\[(.*?)\]/',$match[2],$subpatterns);
				$sub_vars = $subpatterns[1];
		
				$sub_replace =array();
				foreach ($sub_vars as $key =>$sub_var)
				{
					$sub_replace[$key] = $var_array[$sub_var];
					$sub_vars[$key] = "[$sub_var]";
				}
				$replace = str_replace($sub_vars,$sub_replace,$match[2]);
		
				$return = str_replace($match[0],$replace, $return);
			}
			else $return = str_replace($match[0],'',$return);
		}
		
		if (preg_match('#{IfEquals:(.*?)=(.*?)\((.*?)\)}#s',$var_geklammert,$match))
		{
			if ($var_array[$match[1]] == $match[2])
			{
				preg_match_all('/\[(.*?)\]/',$match[3],$subpatterns);
				$sub_vars = $subpatterns[1];
		
				$sub_replace =array();
				foreach ($sub_vars as $key =>$sub_var)
				{
					$sub_replace[$key] = $var_array[$sub_var];
					$sub_vars[$key] = "[$sub_var]";
				}
				$replace = str_replace($sub_vars,$sub_replace,$match[3]);
		
				$return = str_replace($match[0],$replace, $return);
			}
			else $return = str_replace($match[0],'',$return);
		}
		
		if (preg_match('#{IfNotEquals:(.*?)=(.*?)\((.*?(\[?(.*?)\]?).*?)\)}#s',$var_geklammert,$match))
		{
			if ($var_array[$match[1]] != $var_array[$match[2]])
			{
				$replace = str_replace($match[4],$var_array[$match[5]],$match[3]);
				$return = str_replace($match[0],$replace, $return);
			}
			else $return = str_replace($match[0],'',$return);
		}
		#
		# Modulaufruf: {Modul:Kontakt('adresse')};
		#
		if (preg_match('#Modul:(.*)\((.*?)\)#',$var,$match))
		{
			$modul = html_entity_decode($match[1]);
			$args = $this->clean_arguments($match[2]);
			if (!class_exists($modul)) include($modul.'.php');
		
			if (is_callable(array($modul,'class_init')))
			{
				eval('$instance = new $modul ('.$args.');');
				$instance->class_init($this->system);
			}
			else $instance = new $modul ($this->system);//eval('$instance = new '.$modul.'('.$this->system.');');
		
		
			$return = str_replace($var_geklammert,$instance->show(), $return);
			$this->scripts .= $instance->scripts;
			$this->other_css .= $instance->other_css;
			if ($instance->noframe)  $this->noframe = true;
		
		}
		
		if (preg_match('#{PHP:(.*?)}#s',$var_geklammert,$match))
		{
			eval('$replace ='.html_entity_decode($match[1]));
			$return = str_replace($match[0],$replace, $return);
		
		}
		
		if (preg_match('#{Ticker:(.*?)}#s',$var_geklammert,$match))
		{
			$replace = '<marquee id="ticker" style="padding-top: 1em;" scrollamount="3" scrolldelay="100">'.$match[1].'</marquee>';
			$return = str_replace($match[0],$replace, $return);
		}
		if (preg_match('#{I18n:(.*?)\((.*?)\)}#s',$var_geklammert,$match))
		{
			if($GLOBALS['LANG'] != LANG_DEFAULT)
			{
				preg_match_all('#\[(..|default)\]:\[(.*?)\]#s',$match[2],$lang_sub_matches);
		
				$lang_replaces = array();
		
				for ($j=0;$j<count($lang_sub_matches[0]);$j++)
				{
					$lang_replaces[$lang_sub_matches[1][$j]] = $lang_sub_matches[2][$j];
				}
		
				if (isset($lang_replaces[$GLOBALS['LANG']]))
				{
					$return = str_replace($match[0],$lang_replaces[$GLOBALS['LANG']], $return);
				}
				else $return = str_replace($match[0],$lang_replaces['default'], $return);
			}
			else 	$return = str_replace($match[0],$match[1], $return);
		}
		return $return;
	}
	function clean_arguments($string)
	{
		return html_entity_decode(str_replace(array('&bdquo;','&ldquo;','&sbquo;','&lsquo;'),array('"','"',"'","'"),$string));
	}
}
?>