<?php
class BuddyListe extends RheinaufCMS
{
	var $noframe = false;
	var $bundeslaender = array(
								'Baden-Württemberg',
								'Bayern',
								'Berlin',
								'Brandenburg',
								'Bremen',
								'Hamburg',
								'Hessen',
								'Mecklenburg-Vorpommern',
								'Niedersachsen',
								'Nordrhein-Westfalen',
								'Rheinland-Pfalz',
								'Saarland',
								'Sachsen',
								'Sachsen-Anhalt',
								'Schleswig-Holstein',
								'Thüringen' );
	var $fields = array();
	var $schulformen = array('Grundschule', 'Sekundarschule', 'Hauptschule', 'Realschule', 'Gymnasium','Gesamtschule','Volksschule', 'Mittelschule', 'Regionale Schule', 'Berufsschule');
	var $projekt_arten = array('Schüler helfen Schülern (Peer-Helping)','Schüler helfen Schülern beim Lernen (Peer-Learning)','Schüler coachen andere Schüler (Peer-Coaching)','Schüler beraten andere Schüler (Peer-Counseling)','Konflikte selber lösen (Peer-Mediation)','Sonstiges');
	var $projekt_formen = array('Klassenunterricht','AG','Wahlpflichtunterricht','Sonstiges');


	function BuddyListe($db_connection='',$path_information='')
	{
		$i = 0;
		$this->fields[$i]['name'] = 'Schulname';
		$this->fields[$i]['input_type'] = 'text';
		$this->fields[$i]['required'] = true;

		$i++;
		$this->fields[$i]['name'] = 'emailSchule';
		$this->fields[$i]['show_name'] = 'E-Mail der Schule';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'Schulform';
		$this->fields[$i]['input_type'] = 'select';
		$this->fields[$i]['options'] = $this->schulformen;
		$this->fields[$i]['required'] = true;
		$this->fields[$i]['sonstiges'] = true;


		$i++;
		$this->fields[$i]['name'] = 'Adresse';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'PLZ';
		$this->fields[$i]['input_type'] = 'text';
		$this->fields[$i]['length'] = 5;
		$this->fields[$i]['required'] = true;

		$i++;
		$this->fields[$i]['name'] = 'Stadt';
		$this->fields[$i]['input_type'] = 'text';


		$i++;
		$this->fields[$i]['name'] = 'Bundesland';
		$this->fields[$i]['input_type'] = 'select';
		$this->fields[$i]['options'] = $this->bundeslaender;
		$this->fields[$i]['required'] = true;

		$i++;
		$this->fields[$i]['name'] = 'Ansprechpartner';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'E-Mail';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'Telefon';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'Projektname';
		$this->fields[$i]['input_type'] = 'text';

		$i++;
		$this->fields[$i]['name'] = 'Projektstart';
		$this->fields[$i]['input_type'] = 'select';
		$this->fields[$i]['options'] = array();
		for ($j = 1999;$j <= date('Y');$j++)
		{
			$this->fields[$i]['options'][] = strval($j);
		}

		$i++;
		$this->fields[$i]['name'] = 'Projektart';
		$this->fields[$i]['show_name'] = 'In welcher Anwendungsebene<br /> haben Sie das Buddy-Projekt implementiert?';
		$this->fields[$i]['input_type'] = 'check';
		$this->fields[$i]['options']= $this->projekt_arten;
		$this->fields[$i]['required'] = true;

		$i++;
		$this->fields[$i]['name'] = 'Projektform';
		$this->fields[$i]['show_name'] = 'In welcher Form?';
		$this->fields[$i]['input_type'] = 'check';
		$this->fields[$i]['options']= $this->projekt_formen;

		$i++;
		$this->fields[$i]['name'] = 'Beschreibung';
		$this->fields[$i]['show_name'] = 'Beschreibung des Projekts';
		$this->fields[$i]['input_type'] = 'textarea';
		$this->fields[$i]['required'] = true;

		$i++;
		$this->fields[$i]['name'] = 'Pädagogen';
		$this->fields[$i]['show_name'] = 'Anzahl beteiligter Pädagogen';
		$this->fields[$i]['input_type'] = 'select';
		$this->fields[$i]['options'] = array('Bis 3 Pädagogen','3-5 Pädagogen','5-10 Pädagogen','10-15 Pädagogen','Mehr als 15 Pädagogen');

		$i++;
		$this->fields[$i]['name'] = 'EngagementLehrer';
		$this->fields[$i]['show_name'] = 'Unterstützendes Engagement der Lehrer';
		$this->fields[$i]['input_type'] = 'textarea';

		$i++;
		$this->fields[$i]['name'] = 'Schüler';
		$this->fields[$i]['show_name'] = 'Anzahl beteiligter Schüler';
		$this->fields[$i]['input_type'] = 'select';
		$this->fields[$i]['options'] = array('Bis 10 Schüler','10-25 Schüler','25-40 Schüler','40-55 Schüler','Mehr als 55 Schüler');

		$i++;
		$this->fields[$i]['name'] = 'EinsatzSchüler';
		$this->fields[$i]['show_name'] = 'Sozialer Einsatz der Schüler';
		$this->fields[$i]['input_type'] = 'textarea';

		$i++;
		$this->fields[$i]['name'] = 'Schulprogramm';
		$this->fields[$i]['show_name'] = 'Soziales Schulprogramm';
		$this->fields[$i]['input_type'] = 'textarea';


		$i++;
		$this->fields[$i]['name'] = 'Link';
		$this->fields[$i]['input_type'] = 'text';

		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		if (!class_exists('Bilder')) include_once('Bilder.php');
		$this->event_listen();

		if ($this->uri_components[2] == 'Detail') $this->noframe = true;
	}

	function show()
	{
		if ($this->uri_components[2] == 'Eintragen')
		{
			$return = $this->neu_form();
		}
		else if ($this->uri_components[2] == 'Detail')
		{
			$return = $this->detail();
		}
		else if (!in_array(rawurldecode($this->uri_components[2]),$this->bundeslaender) && $this->uri_components[2] != 'Bundesweit')
		{
			$return =  $this->bundesland_select();
		}
		else
		{
			$this->bl_selected = rawurldecode($this->uri_components[2]);
			$return = $this->overview_table();
		}

		return $return;
	}

	function event_listen()
	{
		if (isset($_POST['submit_new_buddyentry'])) $this->new_db_insert();

	}


	function overview_table()
	{
		$return_string='';
		$gotten_array = $this->get_array();

		$page = new Template(INSTALL_PATH.'/Module/BuddyListe/Templates/Ergebnisse.template.html');

		$vars['Bundesland'] = ($_GET['PLZ']) ? 'Suche nach Postleitzahlen' : $this->bl_selected;

		$select = new Select('Schulform');
		$select->add_option('Alle','Alle');
		foreach ($this->schulformen as $schulform)
		{
			if (rawurldecode($_GET['Schulform']) == $schulform ) $selected = array('selected'=>'selected');
			else $selected = array();
			$select->add_option(rawurlencode($schulform),$schulform,$selected);
		}
		$vars['schulform_auswahl'] = $select->flush_select();

		if ($_GET['PLZ'])
		{
			$vars['plz_value'] = intval($_GET['PLZ']);
			for ($i=0;$i<5-strlen(intval($_GET['PLZ']));$i++)
			{
				$vars['plz_value'] .='x';
			}
		}
		else $vars['plz_value'] ='';


		$return_string .= $page->parse_template('PRE',$vars);

		if (count($gotten_array)>0)
		{
			$return_string .= $page->parse_template('TABLE OPEN',$vars);
			foreach ($gotten_array as $eintrag)
			{
				$return_string .= $page->parse_template('TR',$eintrag);
			}
			$return_string .= $page->parse_template('TABLE CLOSE',$vars);
		}
		else $vars['meldung']= $page->parse_template('KEIN ERGEBNIS',$vars);

		$return_string .= $page->parse_template('POST',$vars);

		return $return_string;
	}

	function get_array()
	{
		$parameters = array();

		if ($_GET['PLZ']) $parameters['PLZ'] = intval($_GET['PLZ']).'%';
		else if ($this->bl_selected != 'Bundesweit') $parameters['Bundesland'] = $this->bl_selected;

		if (isset ($_GET['Schulform']) && $_GET['Schulform'] != 'Alle')
		{
			if (is_array($_GET['Schulform']))
			{
				$parameters['Schulform'] = implode("' OR `Schulform` LIKE '",rawurldecode($_GET['Schulform']));
			}
			else $parameters['Schulform'] = rawurldecode($_GET['Schulform']);
		}


		$where = '';
		if (count($parameters) > 0)
		{
			$where_array = array();
			foreach ($parameters as $key => $value)
			{
				$where_array[] = "`$key` LIKE '$value' ";
			}
			$where = ' WHERE '.implode(" AND ",$where_array);
		}

	 	$sql = "SELECT * FROM `RheinaufCMS>BuddyListe` $where ORDER BY `PLZ`";

	 	return $this->connection->db_assoc($sql);
	}



	function neu_form()
	{
		$this->form_scripts();
		$required = array();
		for ($i=0;$i<count($this->fields);$i++)
		{
			if ($this->fields[$i]['required']) $required[] = preg_replace('#[^\w\.]#', '_', $this->fields[$i]['name']);
		}

		$required = General::array2js('required',$required);

		$form_tag = Form::form_tag(SELF.'?input', 'post','multipart/form-data',array('onsubmit'=>'return checkform()'));
		$form_close = Form::close_form();
		$this->scripts .= Html::script($required);
		//$this->scripts .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Module/BuddyListe/BuddyListe.js'));

		$spalten = 2;
		$table = new Table($spalten,array('id'=>'formtable'));
		$table->id_tbody('form_tbody');
		foreach($this->fields as $field)
		{
			$show_name = ($field['show_name'] != '') ? $field['show_name'] : $field['name'];
			$show_name = ($field['required']) ? $show_name.Html::span('*',array('style'=>'color:red;cursor:help','title'=>'Dieses Feld muss ausgefüllt werden.')) : $show_name;
			$encoded_name = rawurlencode($field['name']);
			$id = Html::html_legal_id($field['name']);
			switch ($field['input_type'])
			{
				case('text'):
					$parameters = array();
					$parameters['id'] = $id;
					if (isset($field['length']))
					{
						$parameters['size'] = $field['length'];
						$parameters['maxlength'] = $field['length'];
					}
					else $parameters['size'] = 40;

					$input = Form::add_input('text',$encoded_name,'',$parameters);
				break;
				case('select'):
					$select = new Select($encoded_name,array('id'=>$id));
					$select->add_option('--Bitte auswählen--');
					foreach ($field['options'] as $option)
					{
						$select->add_option(rawurlencode($option),$option);
					}
					if ($field['sonstiges']) $select->add_option('','Sonstige:',array('onclick'=>'sonstig_input(this,\''.rawurlencode($encoded_name).'\')'));
					$input = $select->flush_select();
				break;
				case ('check'):
					$input ='';
					foreach ($field['options'] as $option)
					{
						$input .= Form::add_input('checkbox',$encoded_name.'[]',rawurlencode($option)).' '.$option.'<br />';
					}

				break;
				case ('textarea'):
					$input = Form::add_textarea($encoded_name,'',array('id'=>$id,'cols'=>'35','rows'=>'2','onfocus'=>'textarea_grow(\''.$id.'\')','onblur'=>'textarea_shrink(\''.$id.'\')'));
				break;
			}

			$table->add_td(array($show_name,$input));
		}
		$fileinput = Form::add_input('file','bild[0]');
		$table->add_td(array('Bild 1',$fileinput.Html::a('javascript:;',Html::img('/RheinaufCMS/Module/BuddyListe/edit_add.png','Plus',array('title'=>'Noch ein Bild','onclick'=>'add_file_upload()')))));
		$table->add_td(array(Form::add_input('submit','submit_new_buddyentry','Eintragen')),array('style'=>'border-top:1px solid #33466B'));

		$page = new Template(INSTALL_PATH.'/Module/BuddyListe/Templates/Form.template.html');
		$vars['form'] = $form_tag.$table->flush_table().$form_close;

		return $page->parse_template('TEMPLATE',$vars);

	}

	function new_db_insert()
	{
		$uniqid = md5(uniqid(rand(), true));
		$schulname = General::input_clean($_POST['Schulname']);
		$plz = General::input_clean($_POST['PLZ']);
		$bilder_pfade = array();
		if ($_FILES['bild']['name'][0]!='')
		{
			$output_path = DOCUMENT_ROOT.INSTALL_PATH.'/Images/BuddyListe/'.$plz.'_'.$schulname.'/';
			if (!is_dir($output_path))
			{
				RheinaufFile::mkdir($output_path);
				RheinaufFile::chmod($output_path,777);
			}
			for ($i=0;$i<count($_FILES['bild']);$i++)
			{
				if ($_FILES['bild']['error'][$i] == '0')
				{
					$bild = new Bilder($_FILES['bild']['tmp_name'][$i],$output_path.$_FILES['bild']['name'][$i]);
					$bild->scaleMaxX(200);
					$bild->output();
					$bilder_pfade[] ='Images/BuddyListe/'.$plz.'_'.$schulname.'/'.$_FILES['bild']['name'][$i];
				}
			}

		}

		$insert_sql = 'INSERT INTO `RheinaufCMS>BuddyListe` ( `id` ,';

		$field_names = array();

		for ($i=0;$i<count($this->fields);$i++)
		{
			$field_name = $this->fields[$i]['name'];

			$field_names[] = '`'.$field_name.'`';
		}
		$insert_sql .= implode(', ',$field_names);

		$insert_sql .= ",`Bilder`,`angenommen`,`uniqid`) VALUES ('',";

		$field_values = array();

		for ($i=0;$i<count($this->fields);$i++)
		{
			$field_value = $_POST[rawurlencode($this->fields[$i]['name'])];

			$field_value = (!strstr($field_value,'--')) ? $field_value : '';
			$field_value = (is_array($field_value)) ? implode(', ',$field_value) : $field_value;

			$field_values[] = "'".General::input_clean(rawurldecode($field_value),true)."'";
		}
		$insert_sql .= implode(', ',$field_values).",'".implode(';',$bilder_pfade)."','0','$uniqid')";


		$this->connection->db_query ($insert_sql);
	}

	function bundesland_select()
	{
		$this->rollover_scripts();
		$return_string ='';
		$koordinaten =  array();
		$koordinaten['Baden-Württemberg'] = '72,237,79,239,83,243,90,238,96,233,101,230,108,233,110,240,114,238,117,241,118,249,119,257,123,263,124,269,127,273,120,277,114,281,114,291,114,303,116,310,113,315,105,318,98,313,88,314,81,313,78,309,72,309,70,312,72,317,51,318,48,312,50,302,48,296,53,288,56,274,66,265,69,258,73,248,72,238';
		$koordinaten['Bayern'] = '95,235,92,233,89,229,89,223,88,216,92,215,98,214,102,215,105,209,108,205,113,202,119,198,124,201,130,205,132,210,137,210,138,207,135,205,142,203,146,206,149,208,151,205,148,199,156,202,163,203,170,205,176,208,177,212,179,218,181,222,181,226,179,229,179,232,183,234,186,243,194,248,202,256,209,262,216,267,219,274,215,278,207,276,206,286,194,292,188,296,194,307,193,311,196,313,197,319,191,319,189,313,184,313,173,312,173,316,158,319,151,323,143,325,140,320,132,319,125,319,121,327,115,320,110,318,116,316,118,313,116,291,116,283,124,278,130,275,128,269,127,262,122,256,120,248,119,240,115,236,112,239,109,230,103,228,97,227,94,233';
		$koordinaten['Berlin'] = '192,95,219,95,219,104,209,104,211,108,212,112,214,114,211,116,206,115,201,114,197,116,197,109,197,104,192,104,192,95';
		$koordinaten['Brandenburg'] = '152,84,162,76,170,73,179,75,186,78,195,79,204,77,210,74,215,67,216,64,219,68,224,68,226,70,224,73,225,76,229,77,232,76,231,81,228,85,225,88,224,90,224,95,191,95,191,104,198,104,197,109,195,114,200,115,207,115,213,116,215,112,212,108,210,104,220,104,219,96,226,97,231,100,235,105,237,109,235,114,235,118,239,121,240,135,237,139,238,142,240,148,240,151,232,151,227,153,221,157,214,158,206,157,201,157,199,151,198,148,201,142,198,137,193,134,185,131,178,131,176,125,178,121,179,116,177,111,172,106,174,102,176,99,175,96,174,92,168,92,162,91,159,87,153,84';
		$koordinaten['Bremen'] = '44,79,71,79,77,77,85,80,86,86,78,86,74,88,44,88,44,78';
		$koordinaten['Hamburg'] = '107,59,113,58,117,58,120,66,123,70,130,71,127,79,92,79,92,70,109,71,108,66,105,60';
		$koordinaten['Hessen'] = '99,149,97,154,92,157,87,156,82,160,76,163,81,166,81,171,75,172,74,178,69,182,65,186,64,193,64,197,59,198,62,202,63,206,60,209,57,214,55,218,61,218,66,217,68,221,71,226,73,229,71,231,74,235,78,235,82,237,85,239,87,233,87,226,86,220,84,213,91,211,97,211,99,214,102,208,104,206,107,201,112,199,114,195,111,191,110,185,116,181,119,175,117,170,117,166,110,161,105,161,102,160,99,151';
		$koordinaten['Mecklenburg-Vorpommern'] = '203,13,197,21,189,23,181,23,175,32,166,35,157,39,154,46,145,44,138,47,136,53,139,57,139,62,132,69,138,73,144,76,150,81,168,71,177,72,188,77,196,77,204,74,212,67,216,63,221,68,227,68,228,72,226,76,233,74,229,62,228,55,218,52,226,47,214,35,207,37,203,31,207,26,213,28,209,22,212,17,202,14';
		$koordinaten['Niedersachsen'] = '68,64,72,76,78,77,85,79,87,82,87,87,79,87,74,88,44,88,44,79,70,79,65,63,60,57,50,57,39,61,35,66,34,71,39,72,40,76,38,87,35,96,35,102,33,105,26,105,26,111,32,113,34,116,35,121,43,119,47,114,57,116,58,120,58,125,62,127,69,127,72,121,68,115,74,109,80,113,89,111,92,114,89,117,89,123,91,130,97,135,100,139,98,144,100,147,104,149,104,153,103,159,110,158,116,156,121,152,128,150,131,147,128,141,130,135,137,129,142,117,139,107,134,96,138,92,146,91,152,90,150,83,144,77,137,75,131,73,128,80,92,80,91,70,108,70,105,64,101,59,95,52,89,48,77,48,73,54,69,62';
		$koordinaten['Nordrhein-Westfalen'] = '35,123,42,121,47,118,51,115,56,118,56,124,59,129,66,130,72,128,73,122,70,116,74,112,78,115,85,115,88,114,87,121,89,128,93,136,96,142,96,151,92,156,86,153,83,157,77,160,74,164,78,166,78,171,73,171,72,177,67,181,63,184,62,187,57,181,53,181,49,184,42,188,35,192,29,196,29,199,24,198,25,202,21,202,17,202,15,197,12,196,12,190,6,187,8,178,3,175,10,165,13,154,8,148,6,141,16,139,27,138,27,133,25,129,32,126';
		$koordinaten['Rheinland-Pfalz'] = '54,183,51,187,43,190,35,195,31,199,27,200,27,205,21,205,15,204,12,208,10,216,13,223,19,226,21,229,18,232,16,237,23,237,31,235,37,233,40,235,42,238,40,242,44,244,45,246,42,248,43,252,48,255,58,257,65,259,71,243,69,237,67,232,69,229,63,219,55,219,54,215,56,211,61,205,57,199,57,196,63,193,62,189,54,183';
		$koordinaten['Saarland'] = '14,238,20,239,28,237,35,235,39,237,40,241,41,245,43,245,40,249,42,252,41,255,36,254,32,251,28,251,26,253,22,246,19,242,16,240';
		$koordinaten['Sachsen'] = '192,150,183,150,176,151,174,158,173,164,174,170,179,173,185,176,185,180,180,183,177,186,175,191,175,195,169,194,164,196,166,201,169,203,174,205,175,208,178,203,183,201,189,199,195,197,201,193,206,191,210,188,219,185,225,183,229,179,228,175,231,173,237,175,239,179,243,181,246,176,246,155,237,152,226,155,214,160,205,157,198,155,197,151';
		$koordinaten['Sachsen-Anhalt'] = '135,97,139,94,146,94,153,93,153,86,159,88,164,93,171,93,174,96,173,101,172,106,174,112,177,116,176,121,174,125,178,130,184,133,189,135,195,138,199,141,198,147,193,148,182,148,174,151,171,156,171,162,172,169,174,174,171,177,165,174,157,172,153,169,152,164,151,158,147,157,141,156,139,151,137,148,133,146,129,142,132,133,141,127,142,121,144,117,141,109,138,103,135,99';
		$koordinaten['Schleswig-Holstein'] = '99,4,90,5,77,1,85,14,85,23,76,27,83,29,84,41,88,46,96,47,101,53,105,57,110,57,116,54,123,69,132,67,136,60,132,52,135,44,134,39,139,35,142,29,139,26,133,28,115,20,113,12,108,6';
		$koordinaten['Thüringen'] = '112,159,120,156,126,152,134,150,138,153,143,158,150,160,151,163,150,167,150,171,171,178,175,177,176,172,180,175,183,178,178,181,174,183,173,189,172,193,166,193,163,196,162,202,155,202,151,198,145,196,145,199,147,203,147,205,142,202,137,201,132,202,132,206,134,207,131,208,129,204,126,202,122,199,118,194,115,193,113,188,116,184,120,181,122,175,120,172,120,168,115,163,111,161';

		$hover_bild = array();
		$hover_bild['Baden-Württemberg'] ='d-karte_bw.gif';
		$hover_bild['Bayern'] ='d-karte_ba.gif';
		$hover_bild['Berlin'] ='d-karte_b.gif';
		$hover_bild['Brandenburg'] ='d-karte_bb.gif';
		$hover_bild['Bremen'] ='d-karte_hb.gif';
		$hover_bild['Hamburg'] ='d-karte_hh.gif';
		$hover_bild['Hessen'] ='d-karte_h.gif';
		$hover_bild['Mecklenburg-Vorpommern'] ='d-karte_mv.gif';
		$hover_bild['Niedersachsen'] ='d-karte_ns.gif';
		$hover_bild['Nordrhein-Westfalen'] ='d-karte_nrw.gif';
		$hover_bild['Rheinland-Pfalz'] ='d-karte_rp.gif';
		$hover_bild['Saarland'] ='d-karte_sl.gif';
		$hover_bild['Sachsen'] ='d-karte_s.gif';
		$hover_bild['Sachsen-Anhalt'] ='d-karte_sa.gif';
		$hover_bild['Schleswig-Holstein'] ='d-karte_sh.gif';
		$hover_bild['Thüringen'] ='d-karte_t.gif';

		$path = '/RheinaufCMS/Module/BuddyListe/';

		$return_string .=  '<img src="'.$path.'images/d-karte/d-karte.gif" name="Image1" width="252" height="332" border="0" usemap="#Map" id="Image1" />'."\n";
		$return_string .= '<map name="Map">';
		foreach ($this->bundeslaender as $bl)
		{
			$return_string .= '  <area shape="poly" coords="'.$koordinaten[$bl].'" href="'.rawurlencode($bl).'/" onFocus="this.blur(this.blur)" onMouseOver="MM_swapImage(\'Image1\',\'\',\''.$path.'images/d-karte/'.$hover_bild[$bl].'\',1)" onMouseOut="MM_swapImgRestore()">'."\n";
		}
		$return_string .= '</map>';

		$page = new Template(INSTALL_PATH.'/Module/BuddyListe/Templates/Karte.template.html');
		$vars['karte'] = $return_string;

		return $page->parse_template('TEMPLATE',$vars);
	}

	function detail()
	{
		$id = $_GET['id'];
		$result_array = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>BuddyListe` WHERE `id`=$id");
		$page = new Template(INSTALL_PATH.'/Module/BuddyListe/Templates/Detail.template.html');
		$vars =$result_array[0];

		if ($vars['Bilder'])
		{
			$bilder_array = array();
			$bilder_array = explode(';',$vars['Bilder']);
			$bilder_string = '';
			foreach ($bilder_array as $bild)
			{
				$bilder_string .= '<img src="'.$bild.'" alt="Projektbild" />';
				$vars['Bilder'] = $bilder_string;
			}
		}

		return $page->parse_template('TEMPLATE',$vars);
	}


	function rollover_scripts()
	{
				$this->scripts .= Html::script('function MM_preloadImages() { //v3.0
		  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
		    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
		}

		function MM_swapImgRestore() { //v3.0
		  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
		}

		function MM_findObj(n, d) { //v4.01
		  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
		  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
		  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
		  if(!x && d.getElementById) x=d.getElementById(n); return x;
		}

		function MM_swapImage() { //v3.0
		  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
		   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
		}');
	}

	function form_scripts()
	{
		$this->scripts .= Html::script("function checkform()
{
	var i,e,bgcolor,check = true;
	for (i=0;i<required.length;i++)
	{
		e = document.getElementById(required[i]);

		if (e.value == '' || e.value.indexOf('--') != -1)
		{
			check = false;
			e.style.backgroundColor = 'red';
		}
		else e.style.backgroundColor = 'white';
	}
	return check;
}

function sonstig_input(object,inputname) {
	var input = document.createElement('input');
	input.name = inputname;
	object.parentNode.parentNode.appendChild(input);
}
function debug(object)
{
	for (var i in object) {
	alert (i +'=>' + object[i]);
	}
}
var uploads = 1;

function add_file_upload()
{

	var tbody = document.getElementById('form_tbody');

	var tbody_lastchild = tbody.lastChild;

	if (tbody_lastchild.nodeType != 1) tbody_lastchild = tbody.lastChild.previousSibling; //Mozilla nimmt zwischen jedem tr einen Text-Knoten an

	var input = document.createElement('input');
	var type = document.createAttribute('type');
	type.value= 'file';
	input.setAttributeNode(type);

	var name = document.createAttribute('name');
	name.value= 'bild['+uploads+']';
	input.setAttributeNode(name);

	var tr = document.createElement('tr');
	var td1= document.createElement('td');
	var td2= document.createElement('td');
	var nr = uploads+1;
	var bild_i = document.createTextNode('Bild '+ nr);

	td1.appendChild(bild_i);
	td2.appendChild(input);
	tr.appendChild(td1);
	tr.appendChild(td2);

	tbody.insertBefore(tr,tbody_lastchild);
	uploads++;
}
function textarea_grow (id)
{
	var textarea = document.getElementById(id);
	textarea.rows = 20;
}
function textarea_shrink (id)
{
	var textarea = document.getElementById(id);
	//var text = textarea.value.length;
	//var rows = text / textarea.cols;
	//textarea.rows = rows;
	textarea.rows = 2;
}");
	}
}

?>