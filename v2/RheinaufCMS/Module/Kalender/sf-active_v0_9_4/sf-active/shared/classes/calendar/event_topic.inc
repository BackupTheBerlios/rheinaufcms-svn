<?php

class EventTopic extends DBBasedObject {
	//class used to load a list of event topics and ids from the DB
	//(inherits from DBBasedObject which defines all of the methods for this class)	
	var $table_name="event_topic";
	var $id_colname="event_topic_id";
	var $name_colname="name";
}
?>
