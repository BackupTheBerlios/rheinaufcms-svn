<?php
class rooms extends RheinaufExhibitionAdmin
{
	var $rooms_db_table;
	var $rooms_scaff;
	var $indices_db_table;
	var $indices_scaff;
	var $pics_db_table;
	var $pics_scaff;

	function rooms($scaff,$db_connection='',$path_information='')
	{

		$this->connection = $db_connection;
		$this->path_information = $path_information;

		$this->rooms_db_table = 'RheinaufCMS>Exhibition>Rooms';
		$this->indices_db_table =  'RheinaufCMS>Exhibition>Indices';
		$this->pics_db_table = 'RheinaufCMS>Exhibition>Bilder';

		$this->pics_scaff = $scaff;

		$this->indices_scaff = new FormScaffold($this->indices_db_table,$this->connection,$this->path_information);
		$this->rooms_scaff = new FormScaffold($this->rooms_db_table,$this->connection,$this->path_information);

		$this->rooms_sql = "SELECT * FROM `$this->rooms_db_table` ORDER BY `RoomIndex`";
		$this->rooms = $this->connection->db_assoc($this->rooms_sql);

		$this->get_rooms();
		$this->event_listen();
	}

	function get_rooms()
	{
		$this->rooms_sql = "SELECT * FROM `$this->rooms_db_table` ORDER BY `RoomIndex`";
		$this->rooms = $this->connection->db_assoc($this->rooms_sql);
	}
	function show()
	{

		if (isset($_GET['new'])) $this->return .= $this->new_room_form();
		else if ($_GET['add'] && !isset($_POST['bild']))$this->return .= $this->add_pictures_table();
		else if ($_GET['order'] && !isset($_POST['new_world_order'])) $this->return .= $this->order_images();
		else if ($_GET['rename_room']) $this->return .= $this->rename_form();
		else if (isset($_GET['orderrooms']) && !isset($_POST['new_world_order'])) $this->return .= $this->order_rooms();
		else $this->return .= $this->select_room();

		return Html::div($this->return);
	}

	function event_listen()
	{
		if (isset($_GET['deleteroom'])) $this->delete_room();
		if (isset($_GET['inputnew'])) $this->input_new_room();
		if (isset($_POST['new_world_order']) && $_GET['order']) $this->order_images_apply();
		if (isset($_POST['new_world_order']) && isset($_GET['orderrooms'])) $this->order_rooms_apply();
		if (isset($_POST['bild'])&&isset($_GET['add'])) $this->add_pictures();
		if ($_POST['edit_id']) $this->input_new_room();
	}

	function delete_room()
	{
		$this->connection->db_query("DELETE FROM `$this->rooms_db_table` WHERE `RoomId` =".$_GET['deleteroom'] );
		$this->connection->db_query("DELETE FROM `$this->indices_db_table` WHERE `Raum_id` =".$_GET['deleteroom'] );

		$this->rooms = $this->connection->db_assoc($this->rooms_sql);
	}


	function input_new_room()
	{
		$this->rooms_scaff->db_insert();
		$this->rooms = $this->connection->db_assoc($this->rooms_sql);
	}

	function add_pictures()
	{

		$this->indices_scaff->cols_array['Raum_id']['value'] = $raum_id = $_GET['add'];

		foreach ($_POST['bild'] as  $value)
		{
			$this->indices_scaff->cols_array['Bild_id']['value'] = $value;
			$this->indices_scaff->db_insert();

		}
		$GLOBALS['backchannel'] = 'Die Bilder wurden hinzugefügt';
	}
	function order_images_apply()
	{
		$this->indices_scaff->cols_array['Raum_id']['value'] = $id = $_GET['order'];
		$this->connection->db_query("DELETE FROM `$this->indices_db_table` WHERE `Raum_id` =".$_GET['order'] );
		$index = 1;
		foreach ($_POST['new_world_order'] as $Bild_id)
		{
			$this->indices_scaff->cols_array['Bild_id']['value'] = $Bild_id;
			$this->indices_scaff->cols_array['index']['value'] = $index;

			$this->indices_scaff->db_insert();
			$index++;
		}
		if ($_POST['coverpic'])
		{
			$this->connection->db_update($this->rooms_db_table,array('Titelbild'=>$_POST['coverpic']),"`RoomId` = $id");
		}
		$GLOBALS['backchannel'] = "Die Änderungen wurden gespeichert";

	}
	function order_rooms_apply()
	{

		$index = 1;

		foreach ($_POST['new_world_order'] as $id)
		{
			$this->connection->db_update($this->rooms_db_table,array('RoomIndex'=>$index),"`RoomId` = $id");

			$index++;
		}
		$this->get_rooms();
		$GLOBALS['backchannel'] = "Die Änderungen wurden gespeichert";
	}


	function new_room_form()
	{
		$this->rooms_scaff->cols_array['RoomId']['type'] = 'ignore';
		$this->rooms_scaff->cols_array['RoomIndex']['type'] = 'ignore';
		$this->rooms_scaff->cols_array['Titelbild']['type'] = 'ignore';
		$this->rooms_scaff->cols_array['Roomname']['name'] = 'Name';

		$this->rooms_scaff->action = SELF.'?inputnew';
		$this->rooms_scaff->submit_button = Form::add_input('submit','submit','Anlegen',array('class'=>'button')).Html::a(SELF,'Zurück',array('class'=>'button'));
		return  Html::h(2,'Neuer Raum').$this->rooms_scaff->make_form();
	}

	function rename_form()
	{
		$id = $_GET['rename_room'];
		$this->rooms_scaff->cols_array['RoomId']['type'] = 'hidden';
		$this->rooms_scaff->cols_array['RoomIndex']['type'] = 'hidden';
		$this->rooms_scaff->cols_array['Roomname']['name'] = 'Name';

		$this->rooms_scaff->action = SELF;
		$this->rooms_scaff->submit_button = Form::add_input('submit','submit','Eintragen',array('class'=>'button')).Html::a(SELF,'Zurück',array('class'=>'button'));

		return  Html::h(2,'Raum umbenennen').$this->rooms_scaff->make_form(array('RoomId'=>$id));
	}
	function add_pictures_table()
	{

		$images_sql = $all_images_sql= "SELECT * FROM `$this->pics_db_table`";

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

		$this->pics_scaff->template_vars['action'] = SELF.'?add='.$_GET['add'];
		$this->pics_scaff->template_vars['Raum'] = $_GET['add'];
		foreach ($this->pics_scaff->cols_array as $col)
		{
			if ($col['name'] != 'Beschreibung')
			$name = ($_GET['order'] == $col['name']) ? Html::bold(Html::italic($col['name'])) : $col['name'];
			$desc = ($_GET['order'] == $col['name']) ? ($_GET['dir'] == 'desc' )?  '&amp;dir=asc' : '&amp;dir=desc' : 	'&amp;dir=desc';

			$this->pics_scaff->template_vars[$col['name'].'_button'] = Html::a('/Admin/RheinaufExhibitionAdmin/Rooms?add='.$_GET['add'].'&amp;order='.rawurlencode($col['name']).$desc,$name);
		}

		$order = ($_GET['order']) ? rawurldecode($_GET['order']) : 'Name';

		$this->pics_scaff->results_per_page = 30;

		$pages = $this->pics_scaff->get_pages($all_images_sql);
		$pagination = $this->pics_scaff->num_rows." Bilder auf $pages Seiten  ";
		$prev_link = ($prev =  $this->pics_scaff->prev_link())? Html::a(SELF.'?add='.$_GET['add'].'&amp;order='.$_GET['order'].'&amp;dir='.$_GET['dir'].'&amp;'.$prev,'<<<',array('class'=>'button')):'';
		$next_link = ($next =  $this->pics_scaff->next_link())? Html::a(SELF.'?add='.$_GET['add'].'&amp;order='.$_GET['order'].'&amp;dir='.$_GET['dir'].'&amp;'.$next,'>>>',array('class'=>'button')):'';

		$this->pics_scaff->template_vars['pagination'] = $pagination.$prev_link."Seite ".$this->pics_scaff->get_page().' von '.$pages.' '.$next_link;

		$return =  Html::h(2,'Bilder auswählen',array('style'=>'display:inline') );

		$return .= $this->pics_scaff->make_table("$images_sql ORDER BY $order $dir",INSTALL_PATH.'/Module/RheinaufExhibition/Backend/Templates/ExhibitionAddPictures.template.html');

		return $return;
	}

	function order_rooms()
	{
		$script = $this->order_script();
		$return = Html::h(2,'Räume: Reihenfolge bearbeiten');
		$return .= Form::form_tag(SELF.'?orderrooms','','',array('onsubmit'=>'updateOrder()','id'=>'orderform'));

		$GLOBALS['scripts'] .=Html::script($script);

		$select = new Select('select[]',array('size'=>24,'id'=>'select'));

		foreach ($this->rooms as $room)
		{
			$select->add_option($room['RoomId'],$room['Roomname']);
		}
		$return .= $select->flush_select().Html::br();

		$return .= Html::a('javascript:up();','Hoch',array('class'=>'button'));
		$return .= Html::a('javascript:down();','Runter',array('class'=>'button'));

		$return .= Form::add_input('submit','submit','Speichern',array('class'=>'button'));
		$return .= Html::a(SELF,'Zurück',array('class'=>'button','onclick'=>'return getChanged()'));
		$return .= Form::close_form();

		return $return;
	}
	function select_room()
	{
		$table = new Table(5);
		$new_room_button =  Html::a('/Admin/RheinaufExhibitionAdmin/Rooms?new','Neuer Raum',array('class'=>'button'));
		$order_rooms_button = Html::a('/Admin/RheinaufExhibitionAdmin/Rooms?orderrooms','Räume anordnen',array('class'=>'button'));

		foreach ($this->rooms as $room)
		{
			$name = $room['Roomname'];
			$add_button = Html::a(SELF.'?add='.$room['RoomId'],'Bilder hinzufügen',array('class'=>'button'));
			$order_button = Html::a(SELF.'?order='.$room['RoomId'],'Bilder anordnen/löschen',array('class'=>'button'));
			$edit_button = Html::a(SELF.'?edit='.$room['RoomId'],'Bearbeiten',array('class'=>'button'));
			$rename_button = Html::a(SELF.'?rename_room='.$room['RoomId'],'Umbenennen',array('class'=>'button'));
			$loeschen_button = Html::a(SELF.'?deleteroom='.$room['RoomId'],'Löschen',array('class'=>'button','onclick'=>"return confirm('Wirklich löschen?')"));

			$table->add_td(array($name,$add_button,$order_button,$rename_button,$loeschen_button));
		}
		return Html::h(2,'Bitte auswählen:').$table->flush_table().$new_room_button.$order_rooms_button;
	}

	function order_images()
	{
		$images_sql ="SELECT bilder.*, indices.Bild_id,indices.Raum_id,indices.index
		FROM `$this->pics_db_table` `bilder`
		LEFT JOIN `$this->indices_db_table` `indices`
		     ON bilder.id = indices.Bild_id
		WHERE indices.Raum_id = ".$_GET['order']."
		ORDER BY indices.index,bilder.Name ASC";

		$images = $this->connection->db_assoc($images_sql);

		$script = $this->order_script();
		$room_info = $this->get_room_info($_GET['order']);

		$return = Html::h(2,$room_info['Roomname'].': Reihenfolge bearbeiten');
		$return .= Form::form_tag(SELF.'?order='.$_GET['order'],'','',array('onsubmit'=>'updateOrder()','id'=>'orderform','style'=>'float:left;margin-right:20px;'));

		$GLOBALS['scripts'] .=Html::script($script);

		$select = new Select('select[]',array('size'=>24,'id'=>'select'));

		foreach ($images as $img)
		{
			$select->add_option($img['id'],$img['Dateiname']);
		}
		$return .= $select->flush_select().Html::br();

		$return .= Html::a('javascript:up();','Hoch',array('class'=>'button'));
		$return .= Html::a('javascript:down();','Runter',array('class'=>'button'));
		$return .= Html::a('javascript:del();','Löschen',array('class'=>'button'));
		$return .= Html::a('javascript:coverpic();','Titelbild',array('class'=>'button'));

		if (!$room_info['Titelbild']) $room_info['Titelbild'] = $images[0]['Dateiname'];
		$return .= Form::add_input('hidden','coverpic',$room_info['Titelbild'],array('id'=>'coverpic'));
		$return .= Form::add_input('submit','submit','Speichern',array('class'=>'button'));
		$return .= Html::a(SELF,'Zurück',array('class'=>'button','onclick'=>'return getChanged()'));
		$return .= Form::close_form();
		$return .= 'Titelbild'.Html::br();
		$return .= Html::img('/Images/Galerie/180/'.$room_info['Titelbild'],'Noch nicht festgelegt',array('id'=>'coverpic_preview'));
		return $return;
	}

	function order_script()
	{
		return '
		var changed = false;

		function updateOrder() {
			var form = document.getElementById("orderform");
			var new_order = "";
			var new_input;
			for (var i=0;i<form.select.options.length;i++) {
				new_input = document.createElement("input");
				new_input.name = "new_world_order[]";
				new_input.value = form.select.options[i].value;
				new_input.type = "hidden";
				form.appendChild(new_input);
			}
		}
		function up() {

			var form = document.getElementById("orderform");

			if (form.select.selectedIndex <= 0) return;

			changed = true;

			var selected = form.select.options[form.select.selectedIndex];
			var selected_minus = form.select.options[form.select.selectedIndex-1];

			var value_1 = {id:selected.value,text:selected.text};
			var value_2 = {id:selected_minus.value,text:selected_minus.text};

			selected_minus.value = value_1.id;
			selected_minus.text = value_1.text;
			selected.value = value_2.id;
			selected.text = value_2.text;

			form.select.selectedIndex = form.select.selectedIndex-1;
		}

		function down() {

			var form = document.getElementById("orderform");

			if (form.select.selectedIndex == -1 || form.select.selectedIndex == form.select.options.length-1) return;

			changed = true;

			var selected = form.select.options[form.select.selectedIndex];
			var selected_plus = form.select.options[form.select.selectedIndex+1];

			var value_1 = {id:selected.value,text:selected.text};
			var value_2 = {id:selected_plus.value,text:selected_plus.text};

			selected_plus.value = value_1.id;
			selected_plus.text = value_1.text;
			selected.value = value_2.id;
			selected.text = value_2.text;

			form.select.selectedIndex = form.select.selectedIndex+1;
		}

		function del() {

			var form = document.getElementById("orderform");

			if (form.select.selectedIndex == -1) return;

			changed = true;

			var selected = form.select.options[form.select.selectedIndex];
			form.select.remove(form.select.selectedIndex);


		}

		function coverpic()
		{
			var form = document.getElementById("orderform");
			var input = document.getElementById("coverpic");
			var preview = document.getElementById("coverpic_preview");
			var old_val = input.value;

			if (form.select.selectedIndex == -1) return;

			changed = true;

			var selected = form.select.options[form.select.selectedIndex];
			var new_val =  selected.text;
			input.value = new_val;

			preview.src = "/Images/Galerie/180/" + new_val;
		}

		function getChanged() {
			if (changed) {
				return confirm("Wenn Sie jetzt zurückgehen, verlieren Sie eventuelle Änderungen.\n\nTrotzdem zurückgehen?");
			} else return true;

		}

		';
	}
	function get_room_info ($id)
	{
		$result = $this->connection->db_single_row ("SELECT * FROM `$this->rooms_db_table` WHERE `RoomId` = ".$id);
		return $result;
	}
}

?>