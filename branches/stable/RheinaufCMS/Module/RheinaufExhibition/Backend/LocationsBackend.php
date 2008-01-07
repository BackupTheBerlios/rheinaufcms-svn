<?php

class LocationsBackend extends Admin
{
	var $db_table = 'RheinaufCMS>Locations';

	function LocationsBackend ($db_connection,$path_information)
	{
		$this->connection = $db_connection;
		$this->extract_to_this($path_information);

		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');

		$this->scaff = new FormScaffold($this->db_table,$this->db_connection,$path_information);
		$this->scaff->edit_enabled =true;
		$this->scaff->upload_path = INSTALL_PATH.'/Images/Locations/';
		$this->scaff->upload_folder = 'Location_id';
		$this->scaff->cols_array['Bilder']['type'] = 'upload';
		$this->scaff->cols_array['Bilder']['name'] = 'Bild';

		$this->event_listen();
	}

	function show()
	{

		if (isset($_GET['addwork']))
		{
			return $this->work();
		}
		if (isset($_GET['new']))
		{
			return $this->add_location();
		}
		if (isset($_GET['editworks'])||$_POST['Location_edit'])
		{
			return $this->edit_works();
		}
		if (isset($_GET['edit']))
		{
			return $this->work();
		}
		if (isset($_GET['editloc']))
		{
			return $this->edit_loc();
		}
		if (isset($_GET['latlong']))
		{
			return $this->lat_long_nachtr();
		}




		return $this->overview();
	}

	function event_listen()
	{	if (isset($_GET['getlatlong']))
		{
			print $this->js_get_lat_long();;
			exit;
		}
		if ($_POST['action']=='insertwork')
		{
			$this->scaff->cols_array['Location_id']['value'] = ($_POST['Location_id']) ?  $_POST['Location_id'] : $_POST['PLZ'].General::alfanum($_POST['Location_name']);

			$this->scaff->db_insert();
		}
		if ($_GET['delloc'])
		{
			$loc_id = $_GET['delloc'];
			$this->connection->db_query("DELETE FROM `$this->db_table` WHERE `Location_id`='$loc_id'");
		}
		if ($_POST['Location_edit'])
		{
			$this->insert_loc_edit();
		}

	}

	function overview ()
	{
		$this->scaff->order_by = ($_GET['order']) ? $_GET['order'] : 'Stadt';
		$this->scaff->group_by = 'Location_id';
		$this->scaff->add_search_field('PLZ');
		$this->scaff->add_search_field('Stadt');

		$this->scaff->template_vars['stadt_value'] = ($_GET['Stadt']) ? $_GET['Stadt'] :'';

		$this->scaff->search_method = 'LIKE';

		if ($_GET['PLZ']||$_GET['PLZ']==='0')
		{
			$_GET['PLZ'] = $this->scaff->template_vars['plz_value'] = preg_replace('/[^0-9]/','',$_GET['PLZ']);
			for ($i=0;$i<5-strlen($_GET['PLZ']);$i++)
			{
				$this->scaff->template_vars['plz_value'] .='x';
			}
			$_GET['PLZ'] .= '%';
		}
		else $this->scaff->template_vars['plz_value'] ='';

		if ($stadt = $_GET['Stadt']) $_GET['Stadt'] = "%$stadt%";


		return $this->scaff->make_table($sql,INSTALL_PATH.'/Module/RheinaufExhibition/Backend/Templates/LocationsOverview.template.html');
	}


	function work()
	{
		$loc_id = $_GET['addwork'];
		//$edit_work = ($_GET[])
		$location = $this->connection->db_single_row("SELECT * FROM `$this->db_table` WHERE `Location_id`='$loc_id' ORDER BY `id` ASC");

		$edit = (!$location['Werk']) ? $location['id'] : '';
		if ($_GET['edit']) $edit = $_GET['edit'];
		$this->scaff->cols_array['Location_id']['type'] = 'hidden';
		$this->scaff->cols_array['Location_id']['value'] = $location['Location_id'];

		$this->scaff->cols_array['Location_name']['type'] = 'hidden';
		$this->scaff->cols_array['Location_name']['value'] = $location['Location_name'];

		$this->scaff->cols_array['Adresse']['type'] = 'hidden';
		$this->scaff->cols_array['Adresse']['value'] = $location['Adresse'];

		$this->scaff->cols_array['PLZ']['type'] = 'hidden';
		$this->scaff->cols_array['PLZ']['value'] = $location['PLZ'];

		$this->scaff->cols_array['Stadt']['type'] = 'hidden';
		$this->scaff->cols_array['Stadt']['value'] = $location['Stadt'];

		$this->scaff->cols_array['Ortszusatz']['type'] = 'hidden';
		$this->scaff->cols_array['Ortszusatz']['value'] = $location['Ortszusatz'];

		$this->scaff->cols_array['Land']['type'] = 'hidden';
		$this->scaff->cols_array['Land']['value'] = $location['Land'];

		$this->scaff->cols_array['Website']['type'] = 'hidden';
		$this->scaff->cols_array['Website']['value'] = $location['Website'];

		$this->scaff->cols_array['Breite']['type'] = 'hidden';
		$this->scaff->cols_array['Breite']['value'] = $location['Breite'];

		$this->scaff->cols_array['Länge']['type'] = 'hidden';
		$this->scaff->cols_array['Länge']['value'] = $location['Länge'];

		$this->scaff->cols_array['Technik']['type'] = 'select';
		$this->scaff->cols_array['Technik']['options'] = array(
												'Betonrelief'=>'Betonrelief',
												'Skulptur'=>'Skulptur',
												'Fenster (Bleiverglasung)'=>'Fenster (Bleiverglasung)',
												'Fenster (Betonverglasung)'=>'Fenster (Betonverglasung)',
												'Wandteppiche'=>'Wandteppiche',
												'Decken- und Wandgemälde'=>'Decken- und Wandgemälde',
												'Bilder'=>'Bilder');

		/*$this->scaff->cols_array['Jahr']['type'] = 'ignore';
		$this->scaff->cols_array['Werk']['type'] = 'ignore';
		$this->scaff->cols_array['Beschreibung']['type'] = 'ignore';

		$this->scaff->cols_array['Mitarbeit']['type'] = 'ignore';
		$this->scaff->cols_array['Ausführung']['type'] = 'ignore';
		$this->scaff->cols_array['Architekten']['type'] = 'ignore';
		$this->scaff->cols_array['Literatur']['type'] = 'ignore';*/

		$this->scaff->cols_array['action']['type'] = 'hidden';
		$this->scaff->cols_array['action']['value'] = 'insertwork';

		$return = Html::h(2,'Werk hinzufügen');

		$return .= Html::bold($location['Location_name']).'&nbsp;&nbsp;';
		$return .= $location['Adresse'].'&nbsp;&nbsp;';
		$return .= $location['PLZ'].' ' .$location['Stadt'].$location['Ortszusatz'].Html::br().Html::br();

		return $return.$this->scaff->make_form($edit);
	}

	function add_location()
	{
		$js = $this->get_lat_long_js();

		$this->scaff->cols_array['js']['type'] = 'custom';
		$this->scaff->cols_array['js']['custom_input'] = Html::script($js);
		$this->scaff->cols_array['Location_id']['type'] = 'hidden';
		$this->scaff->cols_array['Location_name']['name'] = 'Name';
		$this->scaff->cols_array['Jahr']['type'] = 'ignore';
		$this->scaff->cols_array['Werk']['type'] = 'ignore';
		$this->scaff->cols_array['Beschreibung']['type'] = 'ignore';
		$this->scaff->cols_array['Technik']['type'] = 'ignore';
		$this->scaff->cols_array['Mitarbeit']['type'] = 'ignore';
		$this->scaff->cols_array['Ausführung']['type'] = 'ignore';
		$this->scaff->cols_array['Architekten']['type'] = 'ignore';
		$this->scaff->cols_array['Literatur']['type'] = 'ignore';
		$this->scaff->cols_array['Bilder']['type'] = 'ignore';

		$this->scaff->cols_array['getcoords']['type'] = 'custom';
		$this->scaff->cols_array['getcoords']['custom_input'] = Html::a("javascript:getLatLong();",'Koordinaten abfragen');

		$this->scaff->cols_array['action']['type'] = 'hidden';
		$this->scaff->cols_array['action']['value'] = 'insertwork';

		return Html::h(2,'Neuer Ort').$this->scaff->make_form();
	}

	function edit_works()
	{
		$loc_id = ($_GET['editworks']) ? $_GET['editworks'] : $_POST['Location_id'];
		$sql = "SELECT * FROM `$this->db_table` WHERE `Location_id` = '$loc_id'";

		$this->scaff->result_array = $result = $this->connection->db_assoc($sql);
		$this->scaff->order_by = 'Jahr';
		$this->scaff->template_vars = $result[0];
		$return = $this->scaff->make_table($sql,INSTALL_PATH.'/Module/RheinaufExhibition/Backend/Templates/EditWorksOverview.template.html');

		return $return;
	}

	function edit_loc()
	{
		$loc_id = $_GET['editloc'];

		$js = $this->get_lat_long_js();

		$this->scaff->cols_array['js']['type'] = 'custom';
		$this->scaff->cols_array['js']['custom_input'] = Html::script($js);
		$this->scaff->cols_array['Location_id']['type'] = 'hidden';
		$this->scaff->cols_array['Location_name']['name'] = 'Name';
		$this->scaff->cols_array['Jahr']['type'] = 'ignore';
		$this->scaff->cols_array['Werk']['type'] = 'ignore';
		$this->scaff->cols_array['Beschreibung']['type'] = 'ignore';
		$this->scaff->cols_array['Technik']['type'] = 'ignore';
		$this->scaff->cols_array['Mitarbeit']['type'] = 'ignore';
		$this->scaff->cols_array['Ausführung']['type'] = 'ignore';
		$this->scaff->cols_array['Architekten']['type'] = 'ignore';
		$this->scaff->cols_array['Literatur']['type'] = 'ignore';
		$this->scaff->cols_array['Bilder']['type'] = 'ignore';

		$this->scaff->cols_array['getcoords']['type'] = 'custom';
		$this->scaff->cols_array['getcoords']['custom_input'] = Html::a("javascript:getLatLong();",'Koordinaten abfragen');

		$this->scaff->cols_array['Location_edit']['type'] = 'hidden';
		$this->scaff->cols_array['Location_edit']['value'] = 'edit';

		return Html::h(2,'Ort bearbeiten').$this->scaff->make_form($loc_id);

	}

	function insert_loc_edit()
	{
		$values = array();
		$values['Location_id'] = $locid = $_POST['Location_id'];
		$values['Location_name'] = $_POST['Location_name'];
		$values['Adresse'] = $_POST['Adresse'];
		$values['PLZ'] = $_POST['PLZ'];
		$values['Stadt'] = $_POST['Stadt'];
		$values['Ortszusatz'] = $_POST['Ortszusatz'];
		$values['Land'] = $_POST['Land'];
		$values['Website'] = $_POST['Website'];
		$values['Breite'] = $_POST['Breite'];
		$values['Länge'] = $_POST[rawurlencode('Länge')];

		foreach ($values as $key => $value)
		{
			$values[$key] = General::input_clean(rawurldecode($value),true);
		}
		$this->connection->db_update($this->db_table,$values,"`Location_id`='$locid'");
	}

	function lat_long_nachtr()
	{

		$locs = $this->connection->db_assoc("SELECT * FROM `$this->db_table` GROUP BY `Location_id`");
		include_once('gmaps.php');
		$gmaps = new gmaps();
		foreach ($locs as $loc)
		{
			$adresse = $loc['Adresse'];
			$plz = $loc['PLZ'];
			$stadt = $loc['Stadt'];
			$land = $loc['Land'];

			$loc_id =$loc['Location_id'];

			$req_parameter = "$adresse $plz $stadt $land";

			list($lat,$long) = explode(',',$gmaps->getLatLong($req_parameter));
			if (!strstr($lat,'Fehler'))
			{
				$sql = "UPDATE `RheinaufCMS>Locations` SET `Breite` = '$lat',`Länge` = '$long' WHERE `Location_id` = '$loc_id'";
				$this->connection->db_query($sql);
			}
			else $return .= $req_parameter;

		}
		return $return;
	}

	function js_get_lat_long()
	{
		include_once('gmaps.php');
		$gmaps = new gmaps();
		$place = $_GET['place'];
		list($lat,$long) = explode(',',$gmaps->getLatLong($place));
		//$long = ($long) ? $long :"''";
		return  '
		var ret = new Object();
		ret.latitude = "'.$lat.'";
		ret.longitude = "'.$long.'";
		' ;
	}

	function get_lat_long_js()
	{

		return "

function getback (url, handler)
{
  var req = null;
  if ( (navigator.userAgent.toLowerCase().indexOf('msie') != -1) && (navigator.userAgent.toLowerCase().indexOf('opera') == -1))
  {
   req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  else
  {
   req = new XMLHttpRequest();
  }

  function callBack()
  {
    if ( req.readyState == 4 )
    {
      if ( req.status == 200 )
      {
        handler(req.responseText, req);
      }
      else
      {
        alert('Fehler: ' + req.statusText);
      }
    }
  }

  req.onreadystatechange = callBack;
  req.open('GET', url, true);
  req.send(null);
};

var handler = function(getback)
{
 	try { eval(getback); }
	catch(e) {alert(e);}
	if (ret.latitude.indexOf('Fehler') != -1)
 	{
 		alert(ret.latitude);
 		return;
 	}
	document.getElementById('input_8').value = ret.latitude;
	document.getElementById('input_9').value = ret.longitude;

}
function getLatLong()
{
	var adr = document.getElementById('input_2').value;
	var plz = document.getElementById('input_3').value;
	var stadt = document.getElementById('input_4').value;
	var land = document.getElementById('input_6').value;

	getback('".SELF."?getlatlong&place=' + adr + ' ' +  plz + ' ' + stadt + ' ' + land,handler)
}
		";
	}
}
?>