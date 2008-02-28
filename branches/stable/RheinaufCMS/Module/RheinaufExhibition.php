<?php
class RheinaufExhibition extends RheinaufCMS
{
	var $filepath;
	var $portrait_thumb_dir = 'tmb/';
	var $landscape_thumb_dir = 'tmb_quer/';
	
	var $rooms_db_table = 'RheinaufCMS>Exhibition>Rooms';
	var $bilder_db_table ='RheinaufCMS>Exhibition>Bilder';

	function RheinaufExhibition()
	{

	}
	function class_init(&$system)
	{
		$this->system &= $system;
		$this->connection = $system->connection;
		
		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		if (!class_exists('GalerieScaffold')) include_once('RheinaufExhibition/GalerieScaffold.php');
		
		$this->scaff = new GalerieScaffold($this->bilder_db_table,$this->connection);
		$this->scaff->order_by = 'Jahr';
		$this->scaff->cols_array['Dateiname']['type'] = 'upload';

		 		$rooms_sql = "SELECT * FROM `$this->rooms_db_table`";
		//$this->rooms =  $this->connection->db_assoc($rooms_sql);
		
		include ('RheinaufExhibition/config.php');
		
		$this->scaff->template_vars['filepath'] = $this->filepath;
		$this->scaff->template_vars['portrait_thumb_dir'] = $this->portrait_thumb_dir;
		$this->scaff->template_vars['landscape_thumb_dir'] = $this->landscape_thumb_dir;
	}



	function show()
	{
		if ($_GET['room'])
		{
			$this->get_room_info();
		}
		else $this->room_name = 'Bildauswahl';
		$this->exhibition_list = $this->scaff->template_vars['list'] = $this->exhibition_list();

		if (isset($_GET['Einzelansicht'])) return $this->einzel();
		else if (isset($_GET['Einzelansicht'])) return $this->einzel();
		else if (isset($_GET['Detailansicht']) || $_GET['Detailid']) return $this->detail();
		else if($_GET['room']) return $this->rooms();
		else
		{
			return $this->scaff->make_table('',INSTALL_PATH.'/Module/RheinaufExhibition/Templates/GalerieTabelle.template.html');
		}

	}


	function exhibition_list($id='')
	{
		$exhibition_sql = "SELECT rooms.*, indices.Raum_id,indices.Exhibition_id,indices.index
			FROM `RheinaufCMS>Exhibition>Rooms` `rooms`
			LEFT JOIN `RheinaufCMS>Exhibition>ExhibitionIndices` `indices`
			     ON rooms.RoomId = indices.Raum_id";
			    if ($id) $exhibition_sql .= "WHERE indices.Exhibition_id = '".$id;
			     $exhibition_sql .= " ORDER BY indices.index ASC, indices.id ASC";
		$this->rooms_list = $this->connection->db_assoc($exhibition_sql);

		$list1 = new HtmlList('ul',array('id'=>'drop'));
		$list2 = new HtmlList();

		if ($this->room_name)  $name = $this->room_name ;
		foreach ($this->rooms_list as $room)
		{
			$list2->add_li(Html::a(SELF.'?room='.$room['RoomId'],$room['Roomname']));
		}
		$list1->add_li($name .$list2->flush_list());
		return $list1->flush_list();
	}

	function rooms()
	{

		$this->scaff->template_vars['list'] = $this->exhibition_list;
		$this->scaff->template_vars['Raum'] = $this->room_name;
		$this->scaff->template_vars['up'] = SELF;
		return $this->show_room();

	}

	function get_room_info()
	{
		$this->room = $_GET['room'];
		$rooms_sql = "SELECT * FROM `$this->rooms_db_table` WHERE `RoomId`=$this->room";

		$room_info = $this->connection->db_single_row($rooms_sql);
		$this->room_name = $room_info['Roomname'];
		$this->room_id = $this->scaff->room = $room_info['RoomId'];
	}
	function show_room()
	{

		$images_sql ="SELECT bilder.*, indices.Bild_id,indices.Raum_id,indices.index
			FROM `RheinaufCMS>Exhibition>Bilder` `bilder`
			LEFT JOIN `RheinaufCMS>Exhibition>Indices` `indices`
			     ON bilder.id = indices.Bild_id
			     WHERE indices.Raum_id = '".$this->room_id."'
			     ORDER BY indices.index ASC, indices.id ASC
			     ";
		return $this->scaff->make_table($images_sql,INSTALL_PATH.'/Module/RheinaufExhibition/Templates/GalerieTabelle.template.html');
	}
	function einzel()
	{
		$einzel = $_GET['start'] + $_GET['Einzelansicht'];

		if ($_GET['room'])
		{
			$sql ="SELECT bilder.*, indices.Bild_id,indices.Raum_id,indices.index
			FROM `RheinaufCMS>Exhibition>Bilder` `bilder`
			LEFT JOIN `RheinaufCMS>Exhibition>Indices` `indices`
			     ON bilder.id = indices.Bild_id
			     WHERE indices.Raum_id = '".$this->room_id."'
			     ORDER BY indices.index ASC, indices.id ASC
			     ";
			if (!$this->num_rows) $num_rows = $this->scaff->num_rows = $this->connection->db_num_rows($sql);
		}
		else
		{
			$order = "ORDER BY `".$this->scaff->order_by."` ".$this->scaff->order_dir;
			$sql = "SELECT * FROM `$this->bilder_db_table` $order";
			if (!$this->num_rows) $num_rows = $this->scaff->num_rows = $this->connection->db_num_rows($sql);
		}


		$this->scaff->template_vars['detail_link'] = SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'].'&amp;Detailansicht='.$_GET['Einzelansicht'];
		$this->scaff->template_vars['up'] = SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'];

		$next_start = $_GET['start'];
		if (($next = $_GET['Einzelansicht']+1) == $this->scaff->results_per_page)
		{
			$next_start = $_GET['start'] + $this->scaff->results_per_page;
			$next = 0;
		}
		if ($einzel+1 == $num_rows)
		{
			$next_start = 0;
			$next = 0;
		}
		$this->scaff->template_vars['next'] = SELF.'?room='.$_GET['room'].'&amp;start='.$next_start.'&amp;Einzelansicht='.$next;

		if (($back = $_GET['Einzelansicht']-1) < 0)
		{
			$_GET['start'] = $_GET['start'] - $this->scaff->results_per_page;
			$back = $this->scaff->results_per_page-1;
		}
		if ($_GET['start'] < 0)
		{
			if (!$this->scaff->num_pages) $pages = $this->scaff->get_pages();

			$_GET['start'] = $this->scaff->num_pages * $this->scaff->results_per_page - $this->scaff->results_per_page;
			$back = $num_rows -1- $_GET['start'];
		}
		$this->scaff->template_vars['back'] = SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'].'&amp;Einzelansicht='.$back;

		return $this->scaff->parse_single($sql." LIMIT $einzel,1",INSTALL_PATH . '/Module/RheinaufExhibition/Templates/Einzel.template.html');
	}
	function detail()
	{
		$einzel = $_GET['start'] + $_GET['Detailansicht'];

		if ($_GET['room'])
		{
			$sql ="SELECT bilder.*, indices.Bild_id,indices.Raum_id,indices.index
			FROM `RheinaufCMS>Exhibition>Bilder` `bilder`
			LEFT JOIN `RheinaufCMS>Exhibition>Indices` `indices`
			     ON bilder.id = indices.Bild_id
			     WHERE indices.Raum_id = '".$this->room_id."'
			     ORDER BY indices.index ASC, indices.id ASC
			     ";
			if (!$this->num_rows) $num_rows = $this->scaff->num_rows = $this->connection->db_num_rows($sql);
		}
		else
		{
			$order = "ORDER BY `".$this->scaff->order_by."` ".$this->scaff->order_dir;
			$where = ($id = $_GET['Detailid'])? " WHERE `id`='$id'":'';
			$sql = "SELECT * FROM `$this->bilder_db_table` $where $order";

			if (!$this->num_rows) $num_rows = $this->scaff->num_rows = $this->connection->db_num_rows($sql);
		}

		$this->scaff->template_vars['einzel_link'] = (isset($_GET['room'])) ? SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'].'&amp;Einzelansicht='.$_GET['Detailansicht']: 'javascript:window.history.back();';
		$this->scaff->template_vars['up'] = SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'];


		if (($next = $_GET['Detailansicht']+1) == $this->scaff->results_per_page)
		{
			$_GET['start'] = $_GET['start'] + $this->scaff->results_per_page;
			$next = 0;
		}
		if ($einzel+1 == $num_rows)
		{
			$_GET['start'] = 0;
			$next = 0;
		}
		$this->scaff->template_vars['next'] =  SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'].'&amp;Einzelansicht='.$next;

		if (($back = $_GET['Detailansicht']-1) < 0)
		{
			$_GET['start'] = $_GET['start'] - $this->scaff->results_per_page;
			$back = $this->scaff->results_per_page-1;
		}
		if ($_GET['start'] < 0)
		{
			if (!$this->scaff->num_pages) $pages = $this->scaff->get_pages();

			$_GET['start'] = $this->scaff->num_pages * $this->scaff->results_per_page - $this->scaff->results_per_page;
			$back = $num_rows -1- $_GET['start'];
		}
		$this->scaff->template_vars['back'] = SELF.'?room='.$_GET['room'].'&amp;start='.$_GET['start'].'&amp;Einzelansicht='.$back;

		$sql .= " LIMIT $einzel,1";
		return $this->scaff->parse_single($sql,INSTALL_PATH . '/Module/RheinaufExhibition/Templates/Detail.template.html');

	}


}

?>