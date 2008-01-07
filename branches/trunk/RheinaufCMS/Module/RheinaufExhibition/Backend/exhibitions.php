<?php
class exhibitions extends RheinaufExhibitionAdmin
{
	var $exhibitions_db_table;
	var $exhibitions_scaff;
	var $indices_db_table;
	var $indices_scaff;
	var $rooms_db_table;
	var $rooms_scaff;

	function exhibitions($scaff,$db_connection='',$path_information='')
	{

		$this->connection = $db_connection;
		$this->path_information = $path_information;

		$this->exhibitions_db_table = 'RheinaufCMS>Exhibition>Exhibitions';
		$this->indices_db_table =  'RheinaufCMS>Exhibition>ExhibitionIndices';
		$this->rooms_db_table = 'RheinaufCMS>Exhibition>Rooms';

		$this->rooms_scaff = $scaff;

		$this->indices_scaff = new FormScaffold($this->indices_db_table,$this->connection,$this->path_information);
		$this->exhibitions_scaff = new FormScaffold($this->exhibitions_db_table,$this->connection,$this->path_information);

		$this->exhibitions_sql = "SELECT * FROM `$this->exhibitions_db_table` ORDER BY `ExhibitionIndex`";
		$this->exhibitions = $this->connection->db_assoc($this->exhibitions_sql);

		$this->get_exhibitions();
		$this->event_listen();
	}

	function get_exhibitions()
	{
		$this->exhibitions_sql = "SELECT * FROM `$this->exhibitions_db_table` ORDER BY `ExhibitionIndex`";
		$this->exhibitions = $this->connection->db_assoc($this->exhibitions_sql);
	}
	function show()
	{

		if (isset($_GET['new'])) $this->return .= $this->new_exhibition_form();
		else if ($_GET['add'] && !isset($_POST['room']))$this->return .= $this->add_rooms_table();
		else if ($_GET['order'] && !isset($_POST['new_world_order'])) $this->return .= $this->order_rooms();
		else if ($_GET['rename_exhibition']) $this->return .= $this->rename_form();
		else if (isset($_GET['orderexhibitions']) && !isset($_POST['new_world_order'])) $this->return .= $this->order_exhibitions();
		else $this->return .= $this->select_exhibition();

		return Html::div($this->return);
	}

	function event_listen()
	{
		if (isset($_GET['deleteexhibition'])) $this->delete_exhibition();
		if (isset($_GET['inputnew'])) $this->input_new_exhibition();
		if (isset($_POST['new_world_order']) && $_GET['order']) $this->order_rooms_apply();
		if (isset($_POST['new_world_order']) && isset($_GET['orderexhibitions'])) $this->order_exhibitions_apply();
		if (isset($_POST['room'])&&isset($_GET['add'])) $this->add_rooms();
		if ($_POST['edit_id']) $this->input_new_exhibition();
	}

	function delete_exhibition()
	{
		$this->connection->db_query("DELETE FROM `$this->exhibitions_db_table` WHERE `ExhibitionId` =".$_GET['deleteexhibition'] );
		$this->connection->db_query("DELETE FROM `$this->indices_db_table` WHERE `Exhibition_id` =".$_GET['deleteexhibition'] );

		$this->exhibitions = $this->connection->db_assoc($this->exhibitions_sql);
	}


	function input_new_exhibition()
	{
		$this->exhibitions_scaff->db_insert();
		$this->exhibitions = $this->connection->db_assoc($this->exhibitions_sql);
	}

	function add_rooms()
	{

		$this->indices_scaff->cols_array['Exhibition_id']['value'] =  $_GET['add'];

		foreach ($_POST['room'] as  $value)
		{
			$this->indices_scaff->cols_array['Raum_id']['value'] = $value;
			$this->indices_scaff->db_insert();

		}
		$GLOBALS['backchannel'] = 'Die Räume wurden zur Austellung hinzugefügt';
	}
	function order_rooms_apply()
	{
		$this->indices_scaff->cols_array['Exhibition_id']['value'] = $_GET['order'];
		$this->connection->db_query("DELETE FROM `$this->indices_db_table` WHERE `Exhibition_id` =".$_GET['order'] );
		$index = 1;
		foreach ($_POST['new_world_order'] as $Exhibition_id)
		{
			$this->indices_scaff->cols_array['Raum_id']['value'] = $Exhibition_id;
			$this->indices_scaff->cols_array['index']['value'] = $index;

			$this->indices_scaff->db_insert();
			$index++;
		}
		$GLOBALS['backchannel'] = "Die Änderungen wurden gespeichert";

	}
	function order_exhibitions_apply()
	{

		$index = 1;

		foreach ($_POST['new_world_order'] as $id)
		{
			$this->connection->db_update($this->exhibitions_db_table,array('ExhibitionIndex'=>$index),"`ExhibitionId` = $id");

			$index++;
		}
		$this->get_exhibitions();
		$GLOBALS['backchannel'] = "Die Änderungen wurden gespeichert";
	}


	function new_exhibition_form()
	{
		$this->exhibitions_scaff->cols_array['ExhibitionId']['type'] = 'ignore';
		$this->exhibitions_scaff->cols_array['ExhibitionIndex']['type'] = 'ignore';
		$this->exhibitions_scaff->cols_array['Exhibitionname']['name'] = 'Name';

		$this->exhibitions_scaff->action = SELF.'?inputnew';
		$this->exhibitions_scaff->submit_button = Form::add_input('submit','submit','Eintragen',array('class'=>'button')).Html::a(SELF,'Zurück',array('class'=>'button'));
		return  Html::h(2,'Neue Ausstellung').$this->exhibitions_scaff->make_form();
	}

	function rename_form()
	{
		$id = $_GET['rename_exhibition'];
		$this->exhibitions_scaff->cols_array['ExhibitionId']['type'] = 'hidden';
		$this->exhibitions_scaff->cols_array['ExhibitionIndex']['type'] = 'hidden';
		$this->exhibitions_scaff->cols_array['Exhibitionname']['name'] = 'Name';

		$this->exhibitions_scaff->action = SELF;
		$this->exhibitions_scaff->submit_button = Form::add_input('submit','submit','Eintragen',array('class'=>'button')).Html::a(SELF,'Zurück',array('class'=>'button'));

		return  Html::h(2,'Ausstellung umbenennen').$this->exhibitions_scaff->make_form(array('ExhibitionId'=>$id));
	}
	function add_rooms_table()
	{

		$rooms_sql = $all_rooms_sql= "SELECT * FROM `$this->rooms_db_table`  ORDER BY `Roomname` ASC";

		$this->rooms_scaff->template_vars['action'] = SELF.'?add='.$_GET['add'];

		$return =  Html::h(2,'Räume auswählen',array('style'=>'display:inline') );

		$return .= $this->rooms_scaff->make_table($rooms_sql,INSTALL_PATH.'/Module/RheinaufExhibition/Backend//Templates/ExhibitionExhibitionAddRooms.template.html');

		return $return;
	}

	function order_exhibitions()
	{
		$script = $this->order_script();
		$return = Html::h(2,'Ausstellungen: Reihenfolge bearbeiten');
		$return .= Form::form_tag(SELF.'?orderexhibitions','','',array('onsubmit'=>'updateOrder()','id'=>'orderform'));

		$GLOBALS['scripts'] .=Html::script($script);

		$select = new Select('select[]',array('size'=>24,'id'=>'select'));

		foreach ($this->exhibitions as $exhibition)
		{
			$select->add_option($exhibition['ExhibitionId'],$exhibition['Exhibitionname']);
		}
		$return .= $select->flush_select().Html::br();

		$return .= Html::a('javascript:up();','Hoch',array('class'=>'button'));
		$return .= Html::a('javascript:down();','Runter',array('class'=>'button'));

		$return .= Form::add_input('submit','submit','Speichern',array('class'=>'button'));
		$return .= Html::a(SELF,'Zurück',array('class'=>'button','onclick'=>'return getChanged()'));
		$return .= Form::close_form();

		return $return;
	}
	function select_exhibition()
	{
		$table = new Table(5);
		$new_exhibition_button =  Html::a('/Admin/RheinaufExhibitionAdmin/Exhibitions?new','Neue Ausstellung',array('class'=>'button'));
		$order_exhibitions_button = Html::a('/Admin/RheinaufExhibitionAdmin/Exhibitions?orderexhibitions','Ausstellungen anordnen',array('class'=>'button'));

		foreach ($this->exhibitions as $exhibition)
		{
			$name = $exhibition['Exhibitionname'];
			$add_button = Html::a(SELF.'?add='.$exhibition['ExhibitionId'],'Räume hinzufügen',array('class'=>'button'));
			$order_button = Html::a(SELF.'?order='.$exhibition['ExhibitionId'],'Räume anordnen/löschen',array('class'=>'button'));
			$edit_button = Html::a(SELF.'?edit='.$exhibition['ExhibitionId'],'Bearbeiten',array('class'=>'button'));
			$rename_button = Html::a(SELF.'?rename_exhibition='.$exhibition['ExhibitionId'],'Umbenennen',array('class'=>'button'));
			$loeschen_button = Html::a(SELF.'?deleteexhibition='.$exhibition['ExhibitionId'],'Löschen',array('class'=>'button','onclick'=>"return confirm('Wirklich löschen?')"));

			$table->add_td(array($name,$add_button,$order_button,$rename_button,$loeschen_button));
		}
		return Html::h(2,'Bitte auswählen:').$table->flush_table().$new_exhibition_button.$order_exhibitions_button;
	}

	function order_rooms()
	{
		$rooms_sql ="SELECT rooms.*, indices.Exhibition_id,indices.Exhibition_id,indices.index
		FROM `$this->rooms_db_table` `rooms`
		LEFT JOIN `$this->indices_db_table` `indices`
		     ON rooms.RoomId = indices.Raum_id
		WHERE indices.Exhibition_id = ".$_GET['order']."
		ORDER BY indices.index ASC";

		$rooms = $this->connection->db_assoc($rooms_sql);

		$script = $this->order_script();
		$return = Html::h(2,$this->get_exhibition_name('order').': Reihenfolge bearbeiten');
		$return .= Form::form_tag(SELF.'?order='.$_GET['order'],'','',array('onsubmit'=>'updateOrder()','id'=>'orderform'));

		$GLOBALS['scripts'] .=Html::script($script);

		$select = new Select('select[]',array('size'=>24,'id'=>'select'));

		foreach ($rooms as $room)
		{
			$select->add_option($room['RoomId'],$room['Roomname']);
		}
		$return .= $select->flush_select().Html::br();

		$return .= Html::a('javascript:up();','Hoch',array('class'=>'button'));
		$return .= Html::a('javascript:down();','Runter',array('class'=>'button'));
		$return .= Html::a('javascript:del();','Löschen',array('class'=>'button'));

		$return .= Form::add_input('submit','submit','Speichern',array('class'=>'button'));
		$return .= Html::a(SELF,'Zurück',array('class'=>'button','onclick'=>'return getChanged()'));
		$return .= Form::close_form();

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

		function getChanged() {
			if (changed) {
				return confirm("Wenn Sie jetzt zurückgehen, verlieren Sie eventuelle Änderungen.\n\nTrotzdem zurückgehen?");
			} else return true;

		}

		';
	}
	function get_exhibition_name ($get)
	{
		$result = $this->connection->db_single_row ("SELECT * FROM `$this->exhibitions_db_table` WHERE `ExhibitionId` = ".$_GET[$get]);
		return $result['Exhibitionname'];
	}
}

?>