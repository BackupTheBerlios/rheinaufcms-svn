<?php

class Location extends DBBasedObject {
	//class used to load a list of event locations and ids from teh DB
	//(inherits from DBBasedObject which defines all of the methods for this class)	
	function Location(){
		//constructor that defines common variables
		$this->set_table_name("location");
		$this->set_id_colname("location_id");
		$this->set_name_colname("name");
	}
}
?>
