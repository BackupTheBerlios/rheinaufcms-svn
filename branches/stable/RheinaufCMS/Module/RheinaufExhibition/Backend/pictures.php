<?php
class pictures extends RheinaufExhibitionAdmin
{
	function pictures(&$scaff,&$system)
	{
		$this->system &= $system;
		$this->connection = $system->connection;

		$this->pics_db_table = 'RheinaufCMS>Exhibition>Bilder';
		$this->pics_scaff = $scaff;

		if ($_POST['edit_id']) $this->pics_scaff->db_insert();
	}
	function show()
	{
		$img_scan = Html::img('/'.INSTALL_PATH . '/Module/RheinaufExhibition/Backend/Icons/16x16/search.png','');
		$scan_button = Html::a('/Admin/RheinaufExhibitionAdmin/Scan',$img_scan.'Ordner scannen',array('class'=>'button'));

		$img_up = Html::img('/'.INSTALL_PATH . '/Module/RheinaufExhibition/Backend/Icons/16x16/up.png','');
		$up_button = Html::a('/Admin/RheinaufExhibitionAdmin/Upload',$img_up.'Bilder hochladen',array('class'=>'button'));

		$return = Html::div($scan_button.$up_button);

		if ($_GET['edit'])
		{
			$entry = $this->pics_scaff->get_entry($_GET['edit']);


			return $return.Html::div($this->pics_scaff->make_form($_GET['edit']),array('style'=>'float:left')).Html::div(Html::img(SELF.'/InputPreview?img='.$entry['Dateiname']));
		}
		return $return.$this->overview();
	}
	function overview()
	{
		$this->pics_scaff->add_search_field('Name');
		$this->pics_scaff->add_search_field('Jahr');

		$this->pics_scaff->template_vars['Name_value'] = ($_GET['Name']) ? $_GET['Name'] :'';
		if ($name = $_GET['Name']) $_GET['Name'] = "%$name%";

		$this->pics_scaff->template_vars['Jahr_value'] = ($_GET['Jahr']) ? $_GET['Jahr'] :'';
		if ($jahr = $_GET['Jahr']) $_GET['Jahr'] = "%$jahr%";

		$where = array();
		foreach ($this->pics_scaff->enable_search_for as $spalte)
		{
			if ($_GET[$spalte])
			{
				$value = General::input_clean($_GET[$spalte],true);
				$where[] = "`$spalte` LIKE '$value'";

			}
		}
		$where = ($where) ? "WHERE ".implode($this->pics_scaff->search_combinate,$where) :'';

		$images_sql = $all_images_sql = "SELECT * FROM `$this->pics_db_table` $where";

		$order = ($_GET['order']) ? "&amp;order=".$_GET['order']:'';

		if ($_GET['dir'] == 'desc')
		{
			$auf = 'Aufsteigend';
			$ab =  Html::bold(Html::italic('Absteigend'));
			$dir = 'DESC';
			$desc = '&amp;dir=asc';
		}
		else if ($_GET['dir'] == 'asc')
		{
			$auf =  Html::bold(Html::italic('Aufsteigend'));
			$ab = 'Absteigend';
			$dir = 'ASC';
			$desc ='&amp;dir=desc';
		}
		else
		{
			$dir = 'ASC';
			$desc ='&amp;dir=desc';
		}


		$return .= '&nbsp;';

		$this->pics_scaff->edit_enabled = true;

		foreach ($this->pics_scaff->cols_array as $col)
		{
			$name = ($_GET['order'] == $col['name']) ? Html::bold(Html::italic($col['name'])) : $col['name'];
			$desc = ($_GET['order'] == $col['name']) ? (($_GET['dir'] == 'desc' )?  '&amp;dir=asc' : '&amp;dir=desc') : 	'&amp;dir=desc';

			$this->pics_scaff->template_vars[$col['name'].'_button'] = Html::a('/Admin/RheinaufExhibitionAdmin/Pictures?order='.rawurlencode($col['name']).$desc,$name);
		}

		$this->pics_scaff->results_per_page = 30;

		$pages = $this->pics_scaff->get_pages($all_images_sql);
		$pagination = $this->pics_scaff->num_rows." Bilder auf $pages Seiten  ";
		$prev_link = ($prev =  $this->pics_scaff->prev_link())? Html::a(SELF.'?order='.$_GET['order'].'&amp;dir='.$_GET['dir'].'&amp;'.$prev,'<<<',array('class'=>'button')):'';
		$next_link = ($next =  $this->pics_scaff->next_link())? Html::a(SELF.'?order='.$_GET['order'].'&amp;dir='.$_GET['dir'].'&amp;'.$next,'>>>',array('class'=>'button')):'';


		$this->pics_scaff->template_vars['pagination'] = $pagination.$prev_link."Seite ".$this->pics_scaff->get_page().' von '.$pages.' '.$next_link;

		$order = ($_GET['order']) ? rawurldecode($_GET['order']) : 'Name';
		return Html::h(2,'Alle Bilder' ).$this->pics_scaff->make_table("$images_sql ORDER BY $order $dir",INSTALL_PATH.'/Module/RheinaufExhibition/Backend/Templates/ExhibitionPicturesOverview.template.html');
	}
}

?>