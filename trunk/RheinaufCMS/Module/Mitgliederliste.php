<?php
class Mitgliederliste extends RheinaufCMS 
{
	var $mitglieder_array;
	
	function  Mitgliederliste()
	{
		if (!$this->connection) $this->connection = new RheinaufDB();
		if (!$this->homepath) $this->pfad();
		$this->mitglieder_array = $this->connection->db_assoc('SELECT `forum_id`,`Titel`,`Vorname`,`Nachname`,`Praxisname`,`Taetigkeitsschwerpunkte`,`Strasse`,`PLZ`,`Ort`,`Fon_Praxis`,`Fax_Praxis`,`E-Mail`,`Homepage`,`Bild`,`Logo` FROM `mitglieder` WHERE 1 ORDER BY `Nachname` ASC');
	}

	function show()
	{
		print_r ($this->mitglieder_array);
		return ;
	}
	
	

}

?>