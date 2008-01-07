<?php
class LocationsFrontend extends RheinaufCMS
{

	var $db_table = 'RheinaufCMS>Locations';
	var $thumb_size=100;
	var $bigimg_size=800;

	function LocationsFrontend()
	{

	}
	function class_init($db_connection='',$path_information='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');

		$this->scaff = new FormScaffold($this->db_table,$this->db_connection,$path_information);
		//$this->scaff->order_by = 'Jahr';

		$this->path_information = $path_information;


	}

	function show()
	{
		if ($_GET['thumb']) $this->thumb();
		if ($_GET['bigimg']) $this->big_img();
		if ($_GET['showlarge']) return $this->showlarge();
		if ($_GET['id']) return $this->detail();

		else return $this->overview();
	}

	function overview ()
	{
		$this->scaff->order_by = ($_GET['order']) ? $_GET['order'] : 'Stadt';
		$this->scaff->group_by = 'Location_id';
		$this->scaff->add_search_field('PLZ');
		$this->scaff->add_search_field('Stadt');

		$this->scaff->template_vars['stadt_value'] = ($_GET['Stadt']) ? $_GET['Stadt'] :'';

		$this->scaff->search_method = 'LIKE';

		$this->scaff->template_vars['reset'] = '';

		if ($_GET['PLZ']||$_GET['PLZ']==='0')
		{
			$_GET['PLZ'] = $this->scaff->template_vars['plz_value'] = preg_replace('/[^0-9]/','',$_GET['PLZ']);
			for ($i=0;$i<5-strlen($_GET['PLZ']);$i++)
			{
				$this->scaff->template_vars['plz_value'] .='x';
			}
			$_GET['PLZ'] .= '%';

		}
		else
		{
			$this->scaff->template_vars['plz_value'] ='';
		}

		if ($stadt = $_GET['Stadt']) $_GET['Stadt'] = "%$stadt%";

		if ($_GET['Stadt'] || $_GET['PLZ']||$_GET['PLZ']==='0' ) $this->scaff->template_vars['reset'] = Html::br().Html::a(SELF,'Alle zeigen');

		return $this->scaff->make_table($sql,INSTALL_PATH.'/Module/LocationsFrontend/Templates/LocationsOverview.template.html');
	}

	function detail()
	{
		$sql = "SELECT * FROM `$this->db_table` WHERE `Location_id` = '".$_GET['id']."'";
		$this->scaff->result_array = $result = $this->connection->db_assoc($sql);
		$this->scaff->template_vars = $result = $result[0];

		//$this->scaff->template_vars['gmaps_link'] = Html::a('http://maps.google.de?hl=de&amp;q='.urlencode($result['Adresse'].' '.$result['PLZ'].' '.$result['Stadt'].', Deutschland'),'Google Maps');
		$this->scaff->template_vars['gmaps_link'] = 'http://maps.google.de?hl=de&amp;q='.urlencode($result['Adresse'].' '.$result['PLZ'].' '.$result['Stadt'].', Deutschland');
		return $this->scaff->make_table($sql,INSTALL_PATH.'/Module/LocationsFrontend/Templates/Detail.template.html');
	}

	function thumb()
	{
		$img = INSTALL_PATH.'/'.$_GET['thumb'];
		if (!class_exists('Bilder')) include_once('Bilder.php');

		$thumb = new Bilder($img);
		$thumb->scaleMaxX($this->thumb_size);
		$thumb->output();
		exit;
	}
	function showlarge()
	{
		$this->noframe=true;
		$sql = "SELECT * FROM `$this->db_table` WHERE `id` = '".$_GET['showlarge']."'";
		$result = $this->connection->db_assoc($sql);
		$vars = $result[0];

		$template = new Template (INSTALL_PATH.'/Module/LocationsFrontend/Templates/Bild.template.html');
		return $template->parse_template('BIG_IMG',$vars);


	}
	function big_img()
	{
		$img = INSTALL_PATH.'/'.$_GET['bigimg'];
		if (!class_exists('Bilder')) include_once('Bilder.php');

		$thumb = new Bilder($img);
		$thumb->scaleMaxX($this->bigimg_size);
		$thumb->output();
		exit;
	}
}

?>