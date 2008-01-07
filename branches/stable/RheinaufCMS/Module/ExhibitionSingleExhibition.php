<?php include_once('RheinaufExhibition.php');
class ExhibitionSingleExhibition extends RheinaufExhibition
{
	var $exhibition;
	var $überschrift;

	function ExhibitionSingleExhibition($exhibition,$überschrift)
	{
		$this->exhibition = $exhibition;
		$this->überschrift = $überschrift;
	}
	function show()
	{
		if ($_GET['room'])
		{
			$this->get_room_info();
		}
		else $this->room_name =$this->überschrift;

		$this->exhibition_list = $this->scaff->template_vars['list'] = $this->exhibition_list($this->exhibition);

		if (isset($_GET['Einzelansicht'])) return $this->einzel();
		else if (isset($_GET['Detailansicht'])) return $this->detail();
		else if($_GET['room']) return $this->rooms();
		else
		{
			$exhibition_sql = "SELECT rooms.*, indices.Raum_id,indices.Exhibition_id,indices.index
			FROM `RheinaufCMS>Exhibition>Rooms` `rooms`
			LEFT JOIN `RheinaufCMS>Exhibition>ExhibitionIndices` `indices`
			     ON rooms.RoomId = indices.Raum_id
			     WHERE indices.Exhibition_id = '".$this->exhibition."'
			     ORDER BY indices.index
			     ";
			$this->scaff->exhibition_room_selection = true;
			return $this->scaff->make_table($exhibition_sql,INSTALL_PATH.'/Module/RheinaufExhibition/Templates/GalerieTabelle.template.html');
		}

	}

}

?>