<?php
class SnippetEditor
{
	var $scaff;
	var $db_table = 'RheinaufCMS>Snippets';

	function SnippetEditor($db_connection='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		$this->connection->debug = false;
		if (!class_exists('Scaffold')) include_once('Scaffold.php');

		$this->scaff = new Scaffold($this->db_table,$db_connection);
		$this->scaff->connection->debug = $this->connection->debug;
		$this->scaff->edit_enabled = true;
		$this->scaff->show_export = false;
		$this->scaff->results_per_page = 50;
		
		$this->scaff->cols_array['id']['type'] = 'hidden';
		$this->scaff->add_search_field('Name',"LIKE .%");
		
		$this->scaff->input_width = '600px';
	}

	function show()
	{
		if (isset($_GET['new']) || isset($_GET['edit']))
		{
			return $this->editor();
		}
		return $this->overview();
	}

	function overview()
	{
		$this->scaff->cols_array['Content']['type'] = 'ignore';
		$table = $this->scaff->make_table();
		if (isset($_POST['edit_id']) || isset($_GET['delete'])) $this->write_file();
		return $table;
	}

	function write_file()
	{
		$snippets = $this->connection->db_assoc("SELECT * FROM `$this->db_table`");
		$string = '';
		foreach ($snippets as $snippet)
		{
			$name = $snippet['Name'];
			$data = trim($snippet['Content']);
			$string .= "<!--$name-->\n$data\n<!--/$name-->\n";
		}
		RheinaufFile::write_file(INSTALL_PATH.'/Templates/Snippets.html',$string);
	}
	
	function editor()
	{
		$this->scaff->cols_array['Name']['required'] = true;
		
		$GLOBALS['scripts'] .= Html::script(' _editor_url  = "/'.INSTALL_PATH.'/Libraries/Xinha/";_editor_lang = "de";_editor_skin="silva";_document_root = "'.DOCUMENT_ROOT.'"');
		$GLOBALS['scripts'] .= Html::script("var project_name = '".addslashes(PROJECT_NAME) ."';");
		
		$GLOBALS['scripts'] .= Html::script('',array('src'=>'/Libraries/Xinha/XinhaLoader.js'));
		$GLOBALS['scripts'] .= Html::script('',array('src'=>'/Module/SnippetEditor/XinhaConfig.php'));
		return $this->scaff->make_form($_GET['edit']);
	}
}

?>