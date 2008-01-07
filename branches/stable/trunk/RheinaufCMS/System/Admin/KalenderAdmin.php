<?php
$long_name = 'Termine verwalten';
$icon = 'date.png';
class KalenderAdmin extends Admin
{
	var $return = '';

	function KalenderAdmin($db_connection,$path_information)
	{
		$this->connection = $db_connection;
		$this->path_information = $path_information;
		$this->extract_to_this($path_information);

		$this->make_scaffold();
		$this->event_listen();
	}
	function event_listen()
	{
		if (isset($_POST['submit'])) $this->scaff->db_insert();
	}
	function make_scaffold ()
	{
		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		$this->scaff = new FormScaffold('RheinaufCMS>Kalender>Termine',$this->connection,$this->path_information);

		//$this->scaff->re_entry = true;

		$this->scaff->cols_array['UID']['type'] = 'hidden';
		$this->scaff->cols_array['UID']['value'] = $uniqid = ($_POST['UID'])? $_POST['UID'] : 'online_'.md5(uniqid(rand(), true));

		$this->scaff->cols_array['SUMMARY']['type'] = 'textarea';
		$this->scaff->cols_array['SUMMARY']['name'] = 'Zusammenfassung';
		$this->scaff->cols_array['SUMMARY']['required'] = true;
		$this->scaff->cols_array['SUMMARY']['attributes'] = array('rows'=>'1','cols'=>'80');


		$this->scaff->cols_array['DESCRIPTION']['name'] = 'Beschreibung';
		$this->scaff->cols_array['DESCRIPTION']['attributes'] = array('rows'=>'10','cols'=>'80');
		$this->scaff->cols_array['DESCRIPTION']['html'] = true;

		$this->scaff->cols_array['LOCATION']['name'] = 'Ort';
		$this->scaff->cols_array['LOCATION']['value'] = ($_POST['LOCATION']) ? $_POST['LOCATION'] : 'Wachsfabrik';

		$this->scaff->cols_array['STATUS']['name'] = 'Status';
		$this->scaff->cols_array['STATUS']['type'] = 'select';
		$this->scaff->cols_array['STATUS']['value'] = ($_POST['STATUS']) ? $_POST['STATUS'] : 'CONFIRMED';
		$this->scaff->cols_array['STATUS']['options'] = array('CONFIRMED'=>'fest','TENTATIVE'=>'vorläufig','CANCELLED'=>'storniert');

		$this->scaff->cols_array['CLASS']['name'] = 'Klassifizierung';
		$this->scaff->cols_array['CLASS']['type'] = 'select';
		$this->scaff->cols_array['CLASS']['value'] = ($_POST['CLASS']) ? $_POST['CLASS'] : 'PUBLIC';
		$this->scaff->cols_array['CLASS']['options'] = array('PUBLIC'=>'öffentlich','PRIVATE'=>'nicht öffentlich');

		$this->scaff->cols_array['CATEGORIES']['name'] = 'Kategorie';
		$this->scaff->cols_array['CATEGORIES']['type'] = 'select';
		$this->scaff->cols_array['CATEGORIES']['options'] = array();
		foreach ($this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>Kategorien` ORDER BY `id`") as $category)
		{
			$this->scaff->cols_array['CATEGORIES']['options'][$category['Name']] = $category['Name'];
		}

		$this->scaff->cols_array['DTSTART']['name'] = 'Beginn';
		$this->scaff->cols_array['DTSTART']['type'] = 'timestamp';
		$this->scaff->cols_array['DTSTART']['required'] = true;
		$this->scaff->cols_array['DTSTART']['value'] = ($_GET['new'])?Date::unify_timestamp($_GET['new']):'';

		$this->scaff->cols_array['DTEND']['name'] = 'Ende';
		$this->scaff->cols_array['DTEND']['type'] = 'timestamp';

		$this->scaff->cols_array['DTSTAMP']['type'] = 'hidden';
		$this->scaff->cols_array['DTSTAMP']['value'] = Date::now();

		$this->scaff->cols_array['X-RHEINAUF-LOGO']['type'] = 'ignore';
		$this->scaff->cols_array['X-RHEINAUF-BILD']['type'] = 'ignore';
		$this->scaff->cols_array['X-RHEINAUF-PREIS']['type'] = 'ignore';
		$this->scaff->cols_array['X-RHEINAUF-EVENT']['type'] = 'ignore';

		$this->scaff->cols_array['CONTACT']['name'] = 'Kontakt';
		$this->scaff->cols_array['CONTACT']['type'] = 'email';
		$this->scaff->cols_array['CONTACT']['value'] = '';
		
		
		$this->scaff->cols_array['X-OTHER-VCAL']['type'] = 'hidden';


	}

	function show()
	{
		$this->obere_navi();

		$path_splitted = preg_split('#/#',$this->pfad);

		if ($path_splitted[2]=='NeuerEintrag' || isset($_GET['new']))
		{
			if ($this->check_right('KalenderAdminTerminNeu'))
			{
				if (isset($_POST['neu_submit'])) $this->neu_input();
				else $this->neu_form();
			}
		}
		else
		{
			if ($this->check_right('KalenderAdminTerminEdit'))	$this->edit();
		}

		return $this->return;
	}

	function obere_navi()
	{
		$img_termin_neu = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/appointment.png','Neuer Termin',array('title'=>'Neuer Termin'));
		$img_termin_bearbeiten = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/today.png','Termin bearbeiten',array('title'=>'Termin bearbeiten'));
		$termin_neu_button = Html::a('/Admin/KalenderAdmin/NeuerEintrag',$img_termin_neu.'Neuer Termin',array('class'=>'button'));
		$termin_bearbeiten_button = Html::a('/Admin/KalenderAdmin/Bearbeiten',$img_termin_bearbeiten.'Termine bearbeiten',array('class'=>'button'));

		if ($this->check_right('KalenderAdminTerminNeu')) $this->return .= $termin_neu_button;
		if ($this->check_right('KalenderAdminTerminEdit'))$this->return .= ' '.$termin_bearbeiten_button;
	}

	function edit()
	{
		$GLOBALS['scripts'] .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/ContextMenu/ContextMenu.js'));
		$GLOBALS['scripts'] .= Html::script('
			var head = document.getElementsByTagName("head")[0];
			var style = document.createElement("link");
			style.rel = "stylesheet";
			style.type="text/css";
			style.href = "/'.INSTALL_PATH.'/Libraries/ContextMenu/ContextMenu.css";
			head.appendChild(style);

			function ctx_new_entry (date) {
				window.location.href="'.SELF.'?new="+date;
			}
			function ctx_edit(id) {
				window.location.href="'.SELF.'?edit="+id;
			}
		');
		//$GLOBALS['other_css'] .= Html::stylesheet('/'.INSTALL_PATH.'/Libraries/ContextMenu/ContextMenu.css');
		$this->scaff->edit_enabled = true;
		$this->scaff->order_dir = 'DESC';
		if ($_POST['edit_id'])  $this->scaff->db_insert();
		if ($_GET['edit'])
		{
			$this->return .= Html::div( $this->scaff->make_form($_GET['edit']),array('style'=>'margin-top:10px'));

		}
		else
		{
		/*	$this->scaff->results_per_page = 30;
			$results_table = $this->scaff->make_table('',INSTALL_PATH.'/Classes/Admin/Templates/TermineListe.template.html');
			$nav =  $this->scaff->list_navigation();
			$this->return .= Html::div( $results_table.$nav,array('style'=>'margin-top:10px'));*/
			if (!class_exists('Kalender')) include_once('Kalender.php');
			$kalender = new Kalender();
			$kalender->class_init($this->connection,$this->path_information);
			$kalender->scaff->edit_enabled = true;

			$kalender->template = INSTALL_PATH.'/Classes/Admin/Templates/TermineListe.template.html';

			$this->return .= $kalender->show();
			$context_menu ="var ctx_menu = {}\n";
			foreach ($kalender->cal->cal_ids as $cal_id)
			{
				$new_entry_ctx = '["Neuer Eintrag",function () {ctx_new_entry("'.$cal_id.'")},null,"'.'/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/appointment.png'.'"]';
				$context_menu .= "ctx_menu['$cal_id'] = [$new_entry_ctx];\n";

			}
			foreach ($kalender->cal->cal_links as $key => $link)
			{
				$context_menu .= "ctx_menu['$key'] = [['Neuer Eintrag',function () {ctx_new_entry(\"".$link[0][2]."\")},null,'".'/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/appointment.png'."']];\n";
				foreach ($link as $entry)
				{
					$context_menu .= 'ctx_menu["'.$key.'"].push(["Bearbeiten '.$entry[1].'",function(){ctx_edit('.$entry[0].')},null,"'.'/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/today.png'.'"]);'."\n";
				}
			}
			$this->return .= Html::script($context_menu);
		}
	}
	function neu_form()
	{
		$this->return .= Html::div( $this->scaff->make_form(),array('style'=>'margin-top:10px'));
	}

	function install()
	{
		if (isset($_POST['cat_submit']))
		{
			$create_categorytable_sql = "CREATE TABLE `RheinaufCMS>Kalender>Kategorien` (
											`id` INT NOT NULL ,
											`Name` TEXT NOT NULL ,
											`Gruppen` TEXT NOT NULL ,
											`event` TINYINT DEFAULT '0' NOT NULL,
											PRIMARY KEY ( `id` )
											)";
			$this->connection->db_query($create_categorytable_sql);

			$cat_array = unserialize(urldecode($_POST['categories']));
			for ($i=0;$i<count($cat_array);$i++)
			{
				$id = $i;
				$name = $cat_array[$i]['Name'];
				$event = $cat_array[$i]['event'];
				$gruppen = '';

				$insert_cat_sql = "INSERT INTO `RheinaufCMS>Kalender>Kategorien`
												( `id` , `Name` , `Gruppen` , `event` )
										VALUES 	('$id', '$name', '$gruppen', '$event')";
				$this->connection->db_query($insert_cat_sql);
			}

			$create_datatable_sql = "CREATE TABLE `RheinaufCMS>Kalender>Termine` (
									  `id` int(10) NOT NULL auto_increment,
									  `wann` timestamp(14) NOT NULL,
									  `wer_ueber` varchar(100) NOT NULL default '',
									  `wer_text` longtext NOT NULL,
									  `presse` text,
									  `cafe_logo` varchar(100) NOT NULL default '',
									  `bild` varchar(100) NOT NULL default '',
									  `was` varchar(200) NOT NULL default '',
									  `kostet` varchar(10) NOT NULL default '',
									  `verantwortlich` text NOT NULL,
									  `pass` varchar(30) NOT NULL default '',
									  `event` tinyint(1) default '0',
									  PRIMARY KEY  (`id`),
									  UNIQUE KEY `pass` (`pass`),
									  KEY `wann` (`wann`),
									  KEY `event` (`event`),
									  KEY `was` (`was`)
									) TYPE=MyISAM ";
			$this->connection->db_query($create_datatable_sql);
			Module::install('KalenderAdmin',true);
		}
		else
		{
			$img_apply = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png','Speichern');
			$img_apply_path = '/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png';
			$img_add = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_add.png','Neu');
			$img_add_path = '/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_add.png';

			$return_string ='';
			$form = new Form();
			$return_string .= $form->form_tag('/Admin/Module?new=KalenderAdmin');
			$table = new Table(2);
			$table->add_caption('Kalender einrichten');
			if  (isset($_POST['categories']))
			{
				$cat_array = unserialize(urldecode($_POST['categories']));
			}

			if  (isset($_POST['new_category']))
			{
				$new = array('Name'=>$_POST['new_category']['Name'],'event'=>($_POST['new_category']['event']) ? 1 : 0);
				$cat_array[] = $new;
			}

			for ($i=0;$i<count($cat_array);$i++)
			{
				$table->add_td(array($cat_array[$i]['Name'],$cat_array[$i]['event']));

			}
			if (isset($_POST['newcategory']))
			{
				$new_cat_name = Form::add_input('text',"new_category[Name]");
				$new_cat_event = Form::add_input('checkbox',"new_category[event]",1);
				$newcategory_submit = Form::add_input('image','newcategory_submit','Speichern',array('src'=>$img_apply_path));
				$table->add_td(array($new_cat_name,$new_cat_event.$newcategory_submit));
			}
			$cat_input = Form::add_input('hidden','categories',urlencode(serialize($cat_array)));
			$add_button = Form::add_input('image','newcategory','Kategorie hinzufügen',array('src'=>$img_add_path));
			$table->add_td(array(array(2=>$add_button.'Neue Kategorie'.$cat_input)));
			$all_submit = Form::add_input('image','cat_submit','Speichern',array('src'=>$img_apply_path));
			$table->add_td(array(array(2=>$all_submit.'Speichern')));
			$return_string .= $table->flush_table().$form->close_form();
			print $return_string;
		}
	}
}
?>