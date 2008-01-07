<?php
$long_name = 'Ausstellung Bearbeiten';
$icon = 'lphoto.png';
class RheinaufExhibitionAdmin extends Admin
{

	var $filepath = 'Images/Galerie/';
	var $db_table = 'RheinaufCMS>Exhibition>Bilder';
	var $max_scale = array('x'=>1024,'y'=>768);

	var $portrait_thumb_height = 170;
	var $portrait_thumb_dir = 'thumb_portrait/';

	var $landscape_thumb_width = 170;
	var $landscape_thumb_dir = 'thumb_landscape/';

 	function RheinaufExhibitionAdmin($db_connection='',$path_information='')
	{
		if (!$this->check_right('ExhibitionAdmin')) return;
		$this->return='';
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();
		$this->path_information = $path_information;
		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		$this->scaff = new FormScaffold($this->db_table,$db_connection,$path_information);

		$this->scaff->cols_array['Dateiname']['type'] = 'upload';
		//$this->scaff->cols_array['Beschreibung']['html'] = true;
		//$this->scaff->cols_array['Dateiname']['type'] = 'text';

		$this->scaff->cols_array['Name']['type'] = 'textarea';
		$this->scaff->cols_array['Name']['attributes'] = array('rows'=>2);


		$this->scaff->cols_array['BildDesMonats']['type'] = 'hidden';


		if (!class_exists('Bilder')) include_once('Bilder.php');

		$this->event_listen();
	}

	function event_listen()
	{
		if (!$this->check_right('ExhibitionAdmin')) return;
		if ($_GET['delete_file']) $this->del_file();
		if (preg_match('/InputPreview$/',SELF)) $this->InputPreview();
	}

	function show()
	{
		if (!$this->check_right('ExhibitionAdmin')) return Html::h(2,'Dazu haben Sie kein Recht!');
		$this->return .=  $this->obere_navi();
		if (preg_match('/Scan$/',SELF)) $this->return .= $this->scan();
		if (preg_match('/Upload$/',SELF))$this->return .=$this->upload();
		if (preg_match('/Rooms$/',SELF))
		{
			include_once(INSTALL_PATH.'/Module/RheinaufExhibition/Backend/rooms.php');
			$rooms = new rooms($this->scaff,$this->connection,$this->path_information);
			$this->return .= $GLOBALS['backchannel'];
			$this->return .= $rooms->show();
		}
		if (preg_match('/Exhibitions$/',SELF))
		{
			include_once(INSTALL_PATH.'/Module/RheinaufExhibition/Backend/exhibitions.php');
			$instance = new exhibitions($this->scaff,$this->connection,$this->path_information);
			$this->return .= $GLOBALS['backchannel'];
			$this->return .= $instance->show();
		}
		if (preg_match('/Pictures$/',SELF))
		{
			include_once(INSTALL_PATH.'/Module/RheinaufExhibition/Backend/pictures.php');
			$instance = new pictures($this->scaff,$this->connection,$this->path_information);
			return  $this->return .= $instance->show();
		}
		if (preg_match('/Locations$/',SELF))
		{
			include_once(INSTALL_PATH.'/Module/RheinaufExhibition/Backend/LocationsBackend.php');
			$instance = new LocationsBackend($this->connection,$this->path_information);
			return  $this->return .= $instance->show();
		}
		if (preg_match('/BildDesMonats$/',SELF))
		{
			include_once(INSTALL_PATH.'/Module/RheinaufExhibition/Backend/bdm.php');
			$instance = new bdm($this->scaff,$this->connection,$this->path_information);
			return  $this->return .= $instance->show();
		}


		return $this->return;
	}

	function obere_navi()
	{

		$rooms_button = Html::a('/Admin/RheinaufExhibitionAdmin/Rooms','Räume zusammenstellen',array('class'=>'button'));
		$pictures_button = Html::a('/Admin/RheinaufExhibitionAdmin/Pictures','Bilder verwalten',array('class'=>'button'));
		$exhibitions_button = Html::a('/Admin/RheinaufExhibitionAdmin/Exhibitions','Ausstellungen zusammenstellen',array('class'=>'button'));
		$locations_button = Html::a('/Admin/RheinaufExhibitionAdmin/Locations','Orte',array('class'=>'button'));

		return $pictures_button.$rooms_button.$exhibitions_button.$locations_button;
	}
	function scan()
	{
		if ($_POST['Dateiname'])
		{
			$this->scaff->db_insert();
			$meldung = 'Datei '.$_POST['Dateiname'].' gespeichert.';
		}
		$db_files = $this->connection->db_assoc("SELECT `Dateiname` FROM `$this->db_table`");
		$scanned_files = RheinaufFile::dir_array(INSTALL_PATH.'/'.$this->filepath,false,'jpg');
		$existent_files =array();
		foreach ($db_files as $entry)
		{
			$existent_files[] = $entry['Dateiname'];
		}
		$new_files = array();
		foreach ($existent_files as $file)
		{
			if (!in_array($file,$scanned_files)) $this->connection->db_query("DELETE FROM `$this->db_table` WHERE `Dateiname`='$file'");
		}

		foreach ($scanned_files as $file)
		{
			if (!in_array($file,$existent_files))
			{
				$new_files[] = $file;
			}
		}

		if (count($new_files)==0) return 'Keine neuen Bilder';

		$this->scaff->cols_array['Dateiname']['type'] = 'info';
		$this->scaff->cols_array['Dateiname']['value'] = $new_files[0];

		$this->scaff->cols_array['delete']['type'] = 'custom';
		$this->scaff->cols_array['delete']['custom_input'] = Html::a(SELF."?delete_file=".$new_files[0],'Datei löschen',array('class'=>'button','onclick'=>"return confirm('Datei löschen?');"));

		$this->maxscale(INSTALL_PATH.'/'.$this->filepath.$new_files[0]);
		$this->make_thumbs($new_files[0]);
		return $meldung.Html::div($this->scaff->make_form(),array('style'=>'float:left')).Html::div(Html::img(SELF.'/InputPreview?img='.$new_files[0]));

	}

	function del_file()
	{
		$file = INSTALL_PATH.'/'.$this->filepath.$_GET['delete_file'];
		RheinaufFile::delete($file);

	}
	function upload()
	{
		$this->scaff->upload_path = INSTALL_PATH.'/'.$this->filepath;
		//$this->scaff->cols_array['Dateiname']['type'] = 'upload';

		if (isset($_FILES['Dateiname_upload']))
		{
			if ($error = $_FILES['Dateiname_upload']['error']>0) return General::upload_error($error);

			$file = INSTALL_PATH.'/'.$this->filepath.$_FILES['Dateiname_upload']['name'];

			move_uploaded_file($_FILES['Dateiname_upload']['tmp_name'], $file);
			RheinaufFile::chmod($file,'777');
		}

		if (isset($_FILES['Dateiname_upload']) && !$_POST['Name'])
		{
			return 'Datei gespeichert, bitte Daten hinzufügen.'.$this->scan();
		}
		else if (isset($_FILES['Dateiname_upload']) && $_POST['Name'])
		{
			$_POST['Dateiname'] = $_FILES['Dateiname_upload']['name'];

			$this->maxscale($file);
			$this->make_thumbs($_FILES['Dateiname_upload']['name']);

			$this->scaff->db_insert();
			$meldung = 'Datei '.$_POST['Dateiname'].' gespeichert.';
		}


		return $meldung.$this->scaff->make_form();
	}

	function InputPreview()
	{
		$file = rawurldecode($_GET['img']);
		$x = ($_GET['x']) ? $_GET['x'] : 300;

		$img = new Bilder(INSTALL_PATH.'/'.$this->filepath.$file);
		$img->scaleMaxX($x);
		$img->output();
		exit;
	}

	function make_thumbs($filename)
	{
		if (!is_dir(INSTALL_PATH.'/'.$this->filepath.$this->portrait_thumb_dir))
		{
			RheinaufFile::mkdir(INSTALL_PATH.'/'.$this->filepath.$this->portrait_thumb_dir);
			RheinaufFile::chmod(INSTALL_PATH.'/'.$this->filepath.$this->portrait_thumb_dir,'777');
		}
		if (!is_dir(INSTALL_PATH.'/'.$this->filepath.$this->landscape_thumb_dir))
		{
			RheinaufFile::mkdir(INSTALL_PATH.'/'.$this->filepath.$this->landscape_thumb_dir);
			RheinaufFile::chmod(INSTALL_PATH.'/'.$this->filepath.$this->landscape_thumb_dir,'777');
		}
		$this->make_portrait_thumb(INSTALL_PATH.'/'.$this->filepath.$filename,INSTALL_PATH.'/'.$this->filepath.$this->portrait_thumb_dir.$filename,$this->portrait_thumb_height);
		$this->make_landscape_thumb(INSTALL_PATH.'/'.$this->filepath.$filename,INSTALL_PATH.'/'.$this->filepath.$this->landscape_thumb_dir.$filename,$this->landscape_thumb_width);

	}

	function make_landscape_thumb($input,$output,$max_x)
	{
		$img = new Bilder($input,$output);
		$img->scaleMaxX($max_x);
		$img->output();
	}

	function make_portrait_thumb($input,$output,$max_y)
	{
		$img = new Bilder($input,$output);
		$img->scaleMaxY($max_y);
		$img->output();
	}

	function maxscale($file)
	{
		$size = getimagesize($file);
		if ($size[0] > $this->max_scale['x'] || $size[1] > $this->max_scale['y'])
		{
			if (!class_exists('Bilder')) include_once('Bilder.php');
			if (!is_writeable($file)) RheinaufFile::chmod($file,'777');

			$img = new Bilder($file,$file);
			if ($size[0] > $this->max_scale['x'])
			{
				$img->scaleMaxX($this->max_scale['x']);
			}
			else
			{
				$img->scaleMaxY($this->max_scale['y']);
			}
			$img->output();
		}
	}

}



?>