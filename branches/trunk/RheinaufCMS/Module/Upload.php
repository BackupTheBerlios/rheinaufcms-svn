<?php
class Upload extends RheinaufCMS 
{

	function Upload($db_connection='',$path_information='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();
		
	}

	function show()
	{
		
		return ;
	}
	
	

}

?>