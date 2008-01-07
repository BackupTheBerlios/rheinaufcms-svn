<?php
class BildDesMonats extends RheinaufCMS
{

	var  $db_table ='RheinaufCMS>Exhibition>Bilder';

	function BildDesMonats()
	{

	}
	function class_init($db_connection='',$path_information='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();//$this->connection->debug=true;
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();


	}

	function show()
	{
		$year = date("Y");
		$month = date("n");
		$monate = Date::monate();
		$monat = $monate[$month];

		$sql = "SELECT * FROM `$this->db_table` WHERE `BDM_Monat`='$month' AND `BDM_Jahr`='$year'";
		$result = $this->connection->db_single_row($sql);

		extract($result);
		$img = Html::img('/Images/Galerie/'.$Dateiname,$Name,array('width'=>450,'class'=>'rahmen','title'=>$Name.' - klicken für mehr Informationen'));
		$link = Html::a('/Bilder?Detailid='.$id,$img);

		$return = $link.Html::h(2,"Bild des Monats $monat $year",array('style'=>'font-size:18px;text-indent:3px;'));
		$return .= Html::p("\"$Name\"",array('style'=>'color:white;font-size:18px;margin-top:15px;text-indent:3px;'));
		$return .= Html::p("$Technik, $Jahr",array('style'=>'text-indent:3px;'));
		return $return;
	}
}

?>