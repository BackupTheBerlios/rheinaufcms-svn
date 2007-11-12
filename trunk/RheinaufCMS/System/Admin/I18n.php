<?php
$long_name =  'Internationalisierung';
$icon = 'world.png';
class I18n extends Admin
{

	function  I18n($db_connection='',$path_information='')
	{

		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		$this->scaff = new FormScaffold('RheinaufCMS>Languages',$db_connection,$path_information);
		$this->scaff->edit_enabled = true;
		$this->scaff->cols_array['default']['type'] = 'check';
		$this->scaff->cols_array['default_foreign']['type'] = 'check';

		if ($_POST['submit']) $this->scaff->db_insert();
	}

	function show()
	{
		$new_button = Html::a(SELF.'?new','Sprache hinzufügen',array('class'=>'button'));

		if (isset($_GET['new'])) return $this->scaff->make_form();
		else if (isset($_GET['edit'])) return $this->scaff->make_form($_GET['edit']);
		else return $new_button.$this->scaff->make_table();
	}
}
?>