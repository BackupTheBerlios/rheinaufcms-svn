<?php
class SnippetEditor
{
	var $scaff;
	var $db_table = 'RheinaufCMS>Snippets';

	function SnippetEditor(&$system)
	{
		$this->system =& $system;
		$this->connection =& $system->connection;
		$this->connection->debug = false;
		if (!class_exists('Scaffold')) include_once('Scaffold.php');

		$this->scaff = new Scaffold($this->db_table,$this->connection);
		$this->scaff->connection->debug = $this->connection->debug;
		$this->scaff->edit_enabled = true;
		$this->scaff->show_export = false;
		$this->scaff->results_per_page = 50;
		$this->scaff->create_options_table();

		$this->scaff->cols_array['id']['type'] = 'hidden';
		$this->scaff->cols_array['category']['name'] = 'Kategorie';
		$this->scaff->cols_array['category']['type'] = 'select';
		$this->scaff->cols_array['category']['options'] = 'Categories';
		$this->scaff->cols_array['category']['options_hide_edit_button'] = true;
		$this->scaff->add_search_field('Name',"LIKE .%");
		$this->scaff->add_search_field('category',"=");
		
		$this->scaff->input_width = '600px';
		
		if (!class_exists('SeiteEdit'))
		{
			include (INSTALL_PATH .'/System/Admin/SeiteEdit.php');
		}
		$s = new SeiteEdit($system);
		$s->linker_navi();
	}

	function show()
	{
		if (preg_match("/Kategorien$/",SELF_URL))
		{
			$this->top_navi('categories');
			return $this->categories();
		}
		else 
		{
			if (isset($_GET['new']) || isset($_GET['edit']))
			{
				$this->top_navi('editor');
				return $this->editor();
			}
			$this->top_navi('overview');
			return $this->overview();
		}
	}
	function top_navi($active_page)
	{
		$btns = array();
		$new_snippet = '<a href="'.SELF_URL.'?new" class="button">Neues Snippet</a>';
		$back = '<a href="'.SELF_URL.'" class="button"><img src="/Module/Projektdokumentation/previous.png" alt="" />Zurück</a>';
		$back_to_overview = '<a href="/Admin/SnippetEditor/" class="button"><img src="/Module/Projektdokumentation/previous.png" alt="" />Zurück zu Übersicht</a>';
		$manage_categories = '<a href="'.SELF_URL.'/Kategorien" class="button">Kategorien</a>';
		
		switch ($active_page)
		{
			case 'overview' :
				$btns[] = $new_snippet;
				$btns[] = $manage_categories;
			break;
			case 'editor':
				$btns[] = $back;
			break;
			case 'popup':
				$btns[] = '<a href="javascript:window.close();" class="button"><img src="/RheinaufCMS/Libraries/Icons/16x16/cancel.png" alt="" />Fenster schließen</a>';
			break;
			case 'categories':
				$btns[] = $back_to_overview;
			break;
		}
		
		$this->system->backend->tabs = implode(' ',$btns);
	}
	
	function overview()
	{
		$this->scaff->cols_array['Content']['type'] = 'ignore';
		$cat_select ='';
		$cats = $this->connection->db_assoc("SELECT Text FROM `RheinaufCMS>Snippets>Options` WHERE `Context` = 'Categories' ORDER BY `Text` ASC");
		
		$count = count($cats);
		for ($i=0;$i<$count;$i++)
		{
			$cats[$i]['selected'] = ($_GET['category'] == $cats[$i]['Text']) ? ' selected="selected"':'';
			$cat_select .= '<option value="'.$cats[$i]['Text'].'"'.$cats[$i]['selected'].'>'.$cats[$i]['Text'].'</option>'."\n";
		}

		$this->scaff->template_vars['cat_select'] = $cat_select;
		
		$table = $this->scaff->make_table(null,INSTALL_PATH.'/Module/SnippetEditor/overview.template.html');

		return $table;
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
	
	function categories()
	{
		$this->cat_scaff = new Scaffold('RheinaufCMS>Snippets>Options',$this->connection);
		$this->cat_scaff->cols_array['Text']['name'] = 'Name';
		$this->cat_scaff->cols_array['Context']['value'] = 'Categories';
		$this->cat_scaff->cols_array['Context']['type'] = 'hidden';
		$this->cat_scaff->edit_enabled = true;
		$this->cat_scaff->show_buttons_above_form = false;
		return $this->cat_scaff->make_table();
	}
}

?>