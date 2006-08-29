<?php

class EventType extends DBBasedObject {
	//class used to load a list of event types and ids from the DB
	//(inherits from DBBasedObject which defines all of the methods for this class)	
	var $table_name="event_type";
	var $id_colname="event_type_id";
	var $name_colname="name";
}
?>
