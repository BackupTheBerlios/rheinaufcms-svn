<?php
#
# Template Ersetzungsregeln
#

#
# If/else
#
if (preg_match('#{If:(.*?)\|(.*?)}#s',$vars_geklammert[$i],$match))
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
if (preg_match('#{If:(.*?)}#s',$vars_geklammert[$i],$match))
{
	$return = str_replace($match[0],$var_array[$match[1]],$return);
}
#
#$vars['meldung'] = 'Hallo'; soll gezeigt werden, wenn nicht leer:
#	{IfNotEmpty:meldung(Das ist eine Meldung: [meldung])}
#ergibt:
#	Das ist eine Meldung: Hallo
#
/*if (preg_match('#{IfNotEmpty:(.*?)\((.*?(\[(.*?)\]).*?)\)}#s',$vars_geklammert[$i],$match))
{
	if ($var_array[$match[1]] !='')
	{
		$replace = str_replace($match[3],$var_array[$match[4]],$match[2]);
		$return = str_replace($match[0],$replace, $return);
	}
	else $return = str_replace($match[0],'',$return);
}
*/
if (preg_match('#{IfNotEmpty:(.*?)\((.*?)\)}#s',$vars_geklammert[$i],$match))
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

if (preg_match('#{IfEmpty:(.*?)\((.*?)\)}#s',$vars_geklammert[$i],$match))
{
	if ($var_array[$match[1]] =='')
	{
		$replace = str_replace($match[3],$var_array[$match[4]],$match[2]);
		$return = str_replace($match[0],$replace, $return);
	}
	else $return = str_replace($match[0],'',$return);
}

if (preg_match('#{IfEquals:(.*?)=(.*?)\((.*?(\[?(.*?)\]?).*?)\)}#s',$vars_geklammert[$i],$match))
{
	if ($var_array[$match[1]] == $var_array[$match[2]])
	{
		$replace = str_replace($match[4],$var_array[$match[5]],$match[3]);
		$return = str_replace($match[0],$replace, $return);
	}
	else $return = str_replace($match[0],'',$return);
}

if (preg_match('#{IfNotEquals:(.*?)=(.*?)\((.*?(\[?(.*?)\]?).*?)\)}#s',$vars_geklammert[$i],$match))
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
if (preg_match('#Modul:(.*)\((.*?)\)#',$vars[$i],$match))
{
	$modul = html_entity_decode($match[1]);
	$args = html_entity_decode($match[2]);
	if (!class_exists($modul)) include($modul.'.php');

	if (is_callable(array($modul,'class_init')))
	{
		eval('$instance = new $modul ('.$args.');');
		$instance->class_init($this->connection,$this->path_information);
	}
	else eval('$instance = new '.$modul.'('.$args.');');


	$return = str_replace($vars_geklammert[$i],$instance->show(), $return);
	$this->scripts .= $instance->scripts;
	$this->other_css .= $instance->other_css;
	if ($instance->noframe)  $this->noframe = true;

}

if (preg_match('#{PHP:(.*?)}#s',$vars_geklammert[$i],$match))
{
	eval('$replace ='.html_entity_decode($match[1]));
	$return = str_replace($match[0],$replace, $return);

}

if (preg_match('#{Ticker:(.*?)}#s',$vars_geklammert[$i],$match))
{
	$replace = '<marquee id="ticker" style="padding-top: 1em;">'.$match[1].'</marquee>';
	$return = str_replace($match[0],$replace, $return);
}
if (preg_match('#{I18n:(.*?)\((.*?)\)}#s',$vars_geklammert[$i],$match))
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

?>