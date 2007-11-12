<?
class Template
{
	var $template;
	var $parts= array();
	var $snippets = array();
	var $system;
	
	function Template($template)
	{
		if (@RheinaufFile::is_file($template)) $this->template = RheinaufFile::get_file($template);
		else $this->template = $template;
	}
	function init_snippets()
	{
		$snippets = $this->system->connection->db_assoc("SELECT * FROM `RheinaufCMS>Snippets`");
		foreach ($snippets as $s)
		{
			$this->snippets[$s['Name']] = $s['Content'];
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
		$var_array = array_merge($var_array,$this->snippets);
		if (is_array($GLOBALS['TemplateVars'])) $var_array = array_merge($var_array,$GLOBALS['TemplateVars']);
		@include(DOCUMENT_ROOT.INSTALL_PATH.'/Templates/TemplateVars.php');
		if ($name == '') $name = 'all';
		if (!isset($this->parts[$name])) $this->parts[$name]= $this->get_part($name);

		preg_match_all('/\{(.*?)\}|\[I18n:(..)\](.*?)\[\/I18n:..\]/s', $this->parts[$name],$matches);

		$vars_geklammert = $matches[0];
		$vars = $matches[1];
		$return = $this->parts[$name];

		
		for ($i=0;$i<count($vars);$i++)
		{
			include(INSTALL_PATH.'/Templates/TemplateRules.php');
			$return = (isset($var_array[$vars[$i]])) ? str_replace($vars_geklammert[$i],$var_array[$vars[$i]], $return) : $return;
		}

		return  $return;
	}
}
?>