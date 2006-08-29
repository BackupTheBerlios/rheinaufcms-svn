<?php

if (!$event_is_declared){
$event_is_declared=true;

class Event extends Cache {
	//The Event class is used to define an event in the calendar	
	
	var $id;
	var $title;
	var $start_time;
	var $end_time;
	var $start_day;
	var $end_day;
	var $start_month;
	var $end_month;
	var $start_year;
	var $end_year;
	var $start_day_of_week;
	var $description;
	var $detail_info_is_loaded=false;
	var $event_type_id;
	var $event_type_name;
	var $event_topic_id;
	var $event_topic_name;
	var $event_location_id;
	var $event_location_name;
	var $event_location_details;
	var $contact_name;
	var $contact_phone;
	var $contact_email;
  	var $confirmation_number;
	var $file ;
	var $mime_type;
	var $language_id;
	var $artmime;
	
	var $common_select_sql="Select e.event_id, e.title, e.confirmation_number, HOUR(e.start_date)+MINUTE(e.start_date)/60 as start_time, e.start_date, DAYOFWEEK(e.start_date) as start_day_of_week, DAYOFMONTH(e.start_date) as start_day, MONTH(e.start_date) as start_month, YEAR(e.start_date) as start_year, e.duration, e.location_id, e.location_other, e.event_topic_id, e.event_topic_other, e.event_type_id, e.event_type_other, l.name as location_name, eto.name as event_topic_name, ety.name as event_type_name, e.linked_file as linked_file, e.mime_type as mime_type, e.language_id as language_id, e.artmime as artmime from event e, location l, event_type ety, event_topic eto ";
	var $common_join_sql="e.event_type_id=ety.event_type_id and e.event_topic_id=eto.event_topic_id and e.location_id=l.location_id ";
	
	function Event(){
		//default constructor
	}
	
	function stripDangerousHTML($text){
	$text = eregi_replace("(<applet|<body|<head|<html|<link|<meta|<object|<script|<iframe)", "<null", $text);
        $text = eregi_replace("(</applet|</body|</head|</html|</link|</meta|</object|</script|</iframe)","</null",$text);
        $text = eregi_replace('<title>','<!-- ',$text);
        $text = eregi_replace('</title>',' -->',$text);
        $text = str_replace(array('<?','?>','&quot;'),array('<!--','-->','"'),$text);
        return $text;
		// return str_replace("<?", "??", $text);        	return str_replace("<?", "??", $text);
	}

	function get_id(){
		//returns the id for the event
		return $this->id;
	}

	function set_id($new_id){
		//sets the id for the event
		$this->id=$new_id;
	}
	
	function get_title(){
		//returns the title for the event
		$title=$this->title;
		return $this->stripDangerousHTML($title);
	}
	
	function set_title($new_title){
		//sets the title for the event
		$this->title=$new_title;
	}
	
	function get_start_time(){
		//returns the start time for an event
		return $this->start_time;
	}

	function set_start_time($new_start_time){
		//sets the start time for the event
		$this->start_time=$new_start_time;
	}

	function get_start_day(){
		//returns the day the event starts
		return $this->start_day;
	}

	function set_start_day($new_start_day){
		//sets the day teh event starts
		$this->start_day=$new_start_day;
	}
	
	function get_start_month(){
		//returns the month that the event starts
		return $this->start_month;
	}

	function set_start_month($new_start_month){
		//sets the month that the event starts
		$this->start_month=$new_start_month;
	}

	function get_start_year(){
		//returns the yeat that teh event starts
		return $this->start_year;
	}

	function set_start_year($new_start_year){
		//sets the year that the event starts
		$this->start_year=$new_start_year;
	}

	function get_start_day_of_week(){
		//returns the start day of the week that the event starts
		return $this->start_day_of_week;
	}

	function set_file($linked_file){
	    // sets the linked_file
	    return $this->file=$linked_file ;
	}

	function get_file(){
	    // returns the linked_file();
	    return $this->file ;
	}

	function set_mime_type($mime_type){
	    // sets the mime_type
	    return $this->mime_type=$mime_type;
	}

	function get_mime_type(){
	    // returns the mime_type
	    return $this->mime_type ;
	}

	function set_language_id($language_id){
	    // sets the language_id
	    return $this->language_id=$language_id ;
	}

	function get_language_id(){
	    // returns the language_id
	    return $this->language_id ;
	}

	function set_artmime($artmime){
	    // sets the mime_type of the text of the event (text or html)
	    return $this->artmime=$artmime;
	}

	function get_artmime(){
	    // returns the mime_type of the text of the event (either text or html)
	    return $this->artmime;
	}

	function set_start_day_of_week($new_start_day_of_week){
		//sets the start day of the week that teh event starts
		$this->start_day_of_week=$new_start_day_of_week;
	}

	function get_start_time_object(){
		//returns the start time that the event starts as a Time object
		$time= new Time;
		$time->set_time($this->get_start_time());
		return $time;
	}

	function get_end_time_object(){
		//gets the time that the event ends
		$time=new Time;
		$time->set_time($this->get_duration()+$this->get_start_time());
		return $time;
	}
	
	function get_start_date(){
		//returns the date and time that the event starts as a string
		$start_date=$this->get_start_year()."-";
		$start_date=$start_date.$this->get_start_month()."-";
		$start_date=$start_date.$this->get_start_day()." ";
		$start_time=$this->get_start_time();
		$start_hour=floor($start_time);
		$start_minute=round(60*($start_time-$start_hour));
		if ($start_minute<10){
			$start_minute="0".$start_minute;
		}
		if ($start_hour<10){
			$start_hour="0".$start_hour;
		}
		$start_date=$start_date.$start_hour.":".$start_minute.":00";
		return $start_date;
	}

	function get_start_date_object(){
		//returns the start date as a Date object
		$start_time=$this->get_start_time();
		$start_hour=floor($start_time);
		$start_minute=round(60*($start_time-$start_hour));
		$start_day=$this->get_start_day();
		$start_month=$this->get_start_month();
		$start_year=$this->get_start_year();
		$date= new Date;
		$date->set_time($start_hour, $start_minute, $start_day, $start_month, $start_year);
		return $date;
	}
	
	function get_duration(){
		//returns the length of the event
		$duration=$this->duration;
		return $this->stripDangerousHTML($duration);
	}

	function set_duration($new_duration){
		//sets the length of the event
		$this->duration=$new_duration;
	}
	
	function get_location_id(){
		//returns the location id for the event
		return $this->location_id;
	}
	
	function set_location_id($new_location_id){
		//sets the location id for the event
		$this->location_id=$new_location_id;
	}

	function get_location_name(){
		//get location name for the event (either other name or name from id)
		$location=$this->location_name;
		return $this->stripDangerousHTML($location);
	}

	function set_location_other($new_location_other){
		//sets the "location other" field (name of a location not predefined in the DB)
		return $this->location_name=$new_location_other;
	}

	function get_location_details(){
		//returns details about the location for an event
		if ($this->detail_info_is_loaded==false){
			$this->load_detail_info();
		}
		$location_details=$this->location_details;
		return $this->stripDangerousHTML($location_details);
	}

	function set_location_details($new_location_details){
		//sets details about the location for an event
		$thuis->detail_info_is_loaded=true;
		$this->location_details=$new_location_details;
	}
	
	function get_event_type_id(){
		//gets the event type id for an event
		return $this->event_type_id;
	}

	function set_event_type_id($new_event_type_id){
		//sets the event type id for an event
		$this->event_type_id=$new_event_type_id;
	}

	function get_event_type_name(){
		//returns the event type name for an event (either other value or name from id)
		$event_type_name=$this->event_type_name;
		return $this->stripDangerousHTML($event_type_name);
	}

	function set_event_type_other($new_event_name){
		//sets the event type name for an event where the name isnt already in the DB
		$this->event_type_name=$new_event_name;
	}

	function get_event_topic_id(){
		//returns the event topic id for an event
		return $this->event_topic_id;
	}

	function set_event_topic_id($new_topic_id){
		//sets the event topic id for an event
		$this->event_topic_id=$new_topic_id;
	}

	function get_event_topic_name(){
		//returns the event topic name for an event (either other value of name from id)
		$topic=$this->event_topic_name;
		return $this->stripDangerousHTML($topic);
	}

	function set_event_topic_other($new_event_topic_name){
		//sets the event topic name to be a nonstandard value (ie no id)
		$this->event_topic_name=$new_event_topic_name;
	}
	
	function get_contact_name(){
		//returns the contact name for the event
		if ($this->detail_info_is_loaded==false){
			$this->load_detail_info();
		}
		$contact_name=$this->contact_name;
		return $this->stripDangerousHTML($contact_name);
	}

	function set_contact_name($new_contact_name){
		//sets the contact name for the event
		$this->detail_info_is_loaded=true;
		$this->contact_name=$new_contact_name;
	}

	function get_contact_phone(){
		//returns the contact phone number for an event
		if ($this->detail_info_is_loaded==false){
			$this->load_detail_info();
		}
		$contact_phone=$this->contact_phone;
		return $this->stripDangerousHTML($contact_phone);
	}

	function set_contact_phone($new_contact_phone){
		//sets the conact phone number for an event
		$this->detail_info_is_loaded=true;
		$this->contact_phone=$new_contact_phone;
	}

	function get_contact_email(){
		//returns the contact email address for an event
		if ($this->detail_info_is_loaded==false){
			$this->load_detail_info();
		}
		$contact_email=$this->contact_email;
		return $this->stripDangerousHTML($contact_email);
	}

	function set_contact_email($new_contact_email){
		//sets the contact email address for an event
		$this->detail_info_is_loaded=true;
		$this->contact_email=$new_contact_email;
	}
	
	function get_description(){
		//returns a description for an event
		global $db_obj;
		if ($this->detail_info_is_loaded==false){
			$this->load_detail_info();
		}
		$descr=$this->description;
		return $this->stripDangerousHTML($descr);
	}

	function set_description($new_description){
		//sets the description for an event
		$this->description=$new_description;
		$this->detail_info_is_loaded=true;
	}
	
	function get_confirmation_number(){
		//return the confirmation number used for updating and event
		return $this->confirmation_number;
	}

	function set_confirmation_number($new_conf_num){
		$this->confirmation_number=$new_conf_num;
	}

	function get_weekname(){
		//returns the name fo teh week for an event (used for the caced week file)
		$date= new Date;
		$date->set_time(0,0, $this->get_start_day(), $this->get_start_month(), $this->get_start_year());
		return $date->get_weekname();
	}	
	function parse_db_row($db_row){
		$this->set_id($db_row["event_id"]);
		$this->set_title($db_row["title"]);
		$this->set_start_time($db_row["start_time"]);
		$this->set_start_day($db_row["start_day"]);
		$this->set_start_month($db_row["start_month"]);
		$this->set_start_year($db_row["start_year"]);
		$this->set_start_day_of_week($db_row["start_day_of_week"]-1);
		$this->set_duration($db_row["duration"]);
		$this->set_event_type_id($db_row["event_type_id"]);
		if ($db_row["event_type_id"]==0){
			$this->set_event_type_other($db_row["event_type_other"]);
		}else{
			$this->set_event_type_other($db_row["event_type_name"]);
		}
		$this->set_event_topic_id($db_row["event_topic_id"]);
		if ($db_row["event_topic_id"]==0){
			$this->set_event_topic_other($db_row["event_topic_other"]);
		}else{
			$this->set_event_topic_other($db_row["event_topic_name"]);
		}
		$this->set_location_id($db_row["location_id"]);
		if ($db_row["location_id"]==0){
			$this->set_location_other($db_row["location_other"]);
		}else{
			$this->set_location_other($db_row["location_name"]);
		}
		$this->set_confirmation_number($db_row["confirmation_number"]);
		if(strlen($db_row['linked_file']) > 0)
		{
		    $this->set_file($db_row['linked_file']);
		}
		if(strlen($db_row['mime_type']) > 0)
		{
		    $this->set_mime_type($db_row['mime_type']);
		}
		$this->set_language_id($db_row['language_id']);
		$this->set_artmime($db_row['artmime']);
	}


	function load_detail_info(){
		//loads event information not normally needed for lists of events
		global $db_obj;
		$sql="select description, contact_name, contact_phone, ";
		$sql=$sql."contact_email, location_details from event where event_id=";
		$sql=$sql.$this->get_id();
		$resultset=$db_obj->query($sql);
		if (sizeof($resultset)==1){
			$result_row=$resultset[0];
			$this->set_description($result_row["description"]);
			$this->set_location_details($result_row["location_details"]);
			$this->set_contact_name($result_row["contact_name"]);
			$this->set_contact_phone($result_row["contact_phone"]);
			$this->set_contact_email($result_row["contact_email"]);
			$this->detail_info_is_loaded=true;
		}
	}	

	function add(){
		//add this event to the db (fields must already be set)
		$db_obj = new DB();

		srand((double)microtime()*1000);
		$confirmation_number=rand(1000,9999).rand(1000,9999);

		$sql="insert into event (title, start_date, duration, ";
		$sql=$sql."location_id, location_other, location_details, ";
		$sql=$sql."event_type_id, event_type_other, ";
		$sql=$sql."event_topic_id, event_topic_other, ";
		$sql=$sql."contact_name, contact_phone, contact_email, ";
		$sql=$sql."confirmation_number, description, linked_file, mime_type, language_id, artmime)";
		$sql=$sql." VALUES ('";
		$sql=$sql.$this->get_title()."', '";
		$sql=$sql.$this->get_start_date()."', ";
		$sql=$sql.$this->get_duration().", ";
		$sql=$sql.$this->get_location_id().", '";
		$sql=$sql.$this->get_location_name()."', '";
		$sql=$sql.$this->get_location_details()."', ";
		$sql=$sql.$this->get_event_type_id().", '";
		$sql=$sql.$this->get_event_type_name()."', ";
		$sql=$sql.$this->get_event_topic_id().", '";
		$sql=$sql.$this->get_event_topic_name()."', '";
		$sql=$sql.$this->get_contact_name()."', '";
		$sql=$sql.$this->get_contact_phone()."', '";
		$sql=$sql.$this->get_contact_email()."', ";
		$sql=$sql.$confirmation_number.", '";
		$sql=$sql.$this->get_description()."', '";
		$sql=$sql.$this->get_file(). "', '";
		$sql=$sql.$this->get_mime_type(). "', '";
		$sql=$sql.$this->get_language_id(). "', '";
		$sql=$sql.$this->get_artmime()."'";
		$sql=$sql.")";

		
		$result=$db_obj->execute_statement_return_autokey($sql);
		$this->set_id($result);

		if ($result<0){
			return $result;
		}
		
		return $confirmation_number;
	}

	function update($confirmation_number){
		//updates the DB to have the values in this object (takes teh confirmation
		//number to validate user identification)

		global $db_obj;
		if (sizeof($confirmation_number)==0 || !is_int((int)$confirmation_number)){
			return -1;
		}
		$sql="select event_id from event where event_id=".$this->get_id();
		$sql=$sql." and confirmation_number=".$confirmation_number;
		$test_result=$db_obj->query($sql);
		if (sizeof($test_result)>0){
			$sql="update event set ";
			$sql=$sql."title='".$this->get_title()."', ";
			$sql=$sql."start_date='".$this->get_start_date()."', ";
			$sql=$sql."duration=".$this->get_duration().", ";
			$sql=$sql."location_id=".$this->get_location_id().", ";
			$sql=$sql."location_other='".$this->get_location_name()."', ";
			$sql=$sql."event_topic_id=".$this->get_event_topic_id().", ";
			$sql=$sql."event_topic_other='".$this->get_event_topic_name()."', ";
			$sql=$sql."event_type_id=".$this->get_event_type_id().", ";
			$sql=$sql."event_type_other='".$this->get_event_type_name()."', ";
			$sql=$sql."location_details='".$this->get_location_details()."', ";
			$sql=$sql."contact_name='".$this->get_contact_name()."', ";
			$sql=$sql."contact_phone='".$this->get_contact_phone()."', ";
			$sql=$sql."contact_email='".$this->get_contact_email()."', ";
			$sql=$sql."description='".$this->get_description()."', ";
			$sql=$sql."linked_file='".$this->get_file()."', ";
			$sql=$sql."mime_type='".$this->get_mime_type()."', ";
			$sql=$sql."language_id='".$this->get_language_id()."', ";
			$sql=$sql."artmime='".$this->get_artmime()."'";
			$sql=$sql." where event_id=".$this->get_id();
			$return_val=$db_obj->execute_statement($sql);
		}else{
			$return_val=-1;
		}
		return $return_val;
	}
	
	function delete($confirmation_number){
		//Delets an event from the DB given a confirmation number for validation
		global $db_obj;
		if (sizeof($confirmation_number)==0 || !is_int((int)$confirmation_number)){
			return -1;
		}
		$sql="select event_id from event where event_id=".$this->get_id();
		$sql=$sql." and confirmation_number=".$confirmation_number;
		$test_result=$db_obj->query($sql);
		if (sizeof($test_result)>0){
			$sql="delete from event where event_id=".$this->get_id();
			$return_val=$db_obj->execute_statement($sql);
		}else{
			$return_val=-1;
		}
		return $return_val;
	}
	
	function find_by_id($event_id){
		//loads the values of an event into a new Event object given an id
		global $db_obj;
		$db_obj = new DB();
		$sql=$this->common_select_sql." where e.event_id=";
		$sql=$sql.$event_id;
		$sql=$sql." AND ".$this->common_join_sql;
		$events=$db_obj->query($sql);
		if (sizeof($events)>0){
			$new_event=new Event();
			$next_db_row=$events[0];
			$new_event->parse_db_row($next_db_row);
			return $new_event;
		}
	}

	function find_between_dates($begin_date, $end_date, $filter, $limit=0){
		//returns a list of events given a date range and a filter of field names and values

		global $db_obj;
		$db_obj = new DB();
		
		$sql=$this->common_select_sql;
		$sql=$sql." where  e.start_date > \"".$begin_date."\"";
		$sql=$sql." and e.start_date < \"".$end_date."\"";
		if (strlen($filter[topic_id])>0){
			$sql=$sql." and e.event_topic_id=".$filter[topic_id];
		}
		if (strlen($filter[type_id])>0){
			$sql=$sql." and e.event_type_id=".$filter[type_id];
		}
		if (strlen($filter[location_id])>0){
			$sql=$sql." and e.location_id=".$filter[location_id];
		}
		$sql=$sql." and ".$this->common_join_sql;
		$sql=$sql." order by e.start_date";
		if ($limit != 0 && $limit > 0) {
		    $sql .= ' limit ' . $limit;
		}
		$result=$db_obj->query($sql);
		$i=0;
		$day=0;
		$return_array=array();
		if (sizeof($result)>0 ){
			while ($next_event_row=array_shift($result)){
				$next_event=new Event();
				$next_event->parse_db_row($next_event_row);
				array_push($return_array, $next_event);
			}
		}	
		return $return_array;
	}

	function find_all(){
		//returns all events in the system from the DB

		global $db_obj;
		$sql=$this->common_select_sql;
		$sql=$sql." where ".$this->common_join_sql;
		$sql=$sql." order by e.start_date";
		$result=$db_obj->query($sql);
		$i=0;
		$day=0;
		$return_array=array();
		if (sizeof($result)>0){
			while ($next_event_row=array_shift($result)){
				$next_event=new Event();
				$next_event->parse_db_row($next_event_row);
				array_push($return_array, $next_event);
			}
		}	
		return $return_array;
	}
	
	function createWeekCache ($newdate) {
	// Generates the Cache Page HTML for a Week

		$event_display = new EventDisplay();
		
		// Naviagtion 
		$newdate->find_start_of_week();

		$html_for_week = $event_display->renderWeekHTML($newdate, $filter);
		
		$filename = SF_CACHE_PATH."/calendar/event_week_cache/".$newdate->get_weekname();
		$f = fopen($filename, "w");
		fwrite ($f, $html_for_week, strlen($html_for_week) );
		fclose ($f);
		
	}

	function createEventCache ($eventid) {
	// Generates the Cache Page HTML for a Event
				
		if (strlen($eventid>0)){
			$event_display = new EventDisplay();
			$html_for_event = $event_display->renderEventHTML($eventid);

			$filename = SF_CACHE_PATH."/calendar/event_cache/".$eventid;
			$f = fopen($filename, "w");
			fwrite ( $f, $html_for_event, strlen($html_for_event) );
			fclose ( $f );
		}

	}

	function get_syndication_data ($location)
        {
        // gets data out of the dbase needed for creating rss files.
		if(strlen($location) > 0)
		{
			$location = " and e.location_id = '".$location."' ";
		}
                $sql = "select e.event_id as event_id, date_format(e.start_date, '%Y-%m-%d %H:%i:%s') as start_date, date_format((e.start_date + interval e.duration hour), '%Y-%m-%d %H:%i:%s') as end_date, e.title as title, e.description as description, e.contact_name as contact_name, e.event_topic_other as topic_other, e.location_other as location_other, e.event_type_other as type_other, l.name as location_name, t.name as type_name, o.name as topic_name, e.linked_file as linked_file, e.language_id as language_id from event e, location l, event_type t, event_topic o where e.start_date > CURRENT_TIMESTAMP ".$location." and e.location_id = l.location_id and e.event_type_id = t.event_type_id and e.event_topic_id = o.event_topic_id order by e.start_date asc limit 0,".$GLOBALS['calendar_length'] ;
                $db_obj = new DB ;
                $result = $db_obj->query($sql);
                return $result ;
        }


    function make_calendar_rdf ($location="")
    {
	$GLOBALS['print_rss'] = "" ;
	$lang_obj = new language ;
	$syndication_data=$this->get_syndication_data($location);
	$rows = sizeof($syndication_data);
	$time_zone = date(O);
	$webroot_url = SF_ROOT_URL;
	$site_nick = $GLOBALS['site_nick'];
	$site_name = $GLOBALS['site_name'];
	$rss_file = $GLOBALS['calendar_file'] ;
        $xml_logo = $GLOBALS['xml_logo'];
        include_once(SF_SHARED_PATH . '/classes/rss10.inc');
	if($location !== "") { $location = strtolower(str_replace(" ", "_", $syndication_data['0']['location_name']))."_"; }
	$rss_long=new RSSWriter($webroot_url, $site_nick, $site_name, $webroot_url."/syn/".$location.$rss_file, array("dc:publisher" => $site_nick, "dc:creator" => $site_nick));
	$rss_long->useModule("ev", "http://purl.org/rss/1.0/modules/event/");
	$rss_long->useModule("content", "http://purl.org/rss/1.0/modules/content/");
        $rss_long->useModule("dcterms", "http://purl.org/dc/terms/");
        $rss_long->setImage($xml_logo, $site_nick);
	foreach (array_reverse($syndication_data) as $row)
        {
	    if($GLOBALS['lang'] == "hr") { $char = "utf-8" ; }
	    else { $char = "cp1252";}
	    $this_feature_url = "/calendar/event_display_detail.php?event_id=" . $row['event_id'];
	    $link = $webroot_url . $this_feature_url;
            if(ereg(SF_UPLOAD_PATH, $row['linked_file']))
            {
                // note: this will only work if you never moved your images across the filesystem.
                $file = str_replace(SF_UPLOAD_PATH, SF_UPLOAD_URL, $row['linked_file']) ;
            }else {
                $file = '';
            }
	    $author = trim(utf8_encode(htmlspecialchars($row['contact_name'])));
	    $title1 = trim(utf8_encode(htmlspecialchars($row['title'])));
	    $row['description_new'] = preg_replace("(<.*?>)", '', $row['description']);
	    $title2 = trim(utf8_encode(htmlspecialchars($row['description_new'])));
	    $event_topic = trim(utf8_encode(htmlspecialchars($row['topic_name'])));
	    if($row["topic_other"] !=="") { $event_topic .= " (".trim(utf8_encode(htmlspecialchars($row['topic_other']))).")"; }
	    $event_location = trim(utf8_encode(htmlspecialchars($row['location_name'])));
	    if($row["location_other"] !=="") { $event_location .= " (". trim(utf8_encode(htmlspecialchars($row['location_other']))). ")"; }
	    $event_type = trim(utf8_encode(htmlspecialchars($row['type_name'])));
	    if($row["type_other"] !=="") { $event_type .= " (".trim(utf8_encode(htmlspecialchars($row['type_other']))).")"; }
	    $cat_name = trim(utf8_encode(htmlspecialchars($row['name'])));
	    $subject = trim(utf8_encode(htmlspecialchars($row['topic_id'])));
	    $summary = str_replace(array('&lt;','&gt;','&amp;', '&quot;'), array('<','>','&', '"'), htmlentities(stripslashes($row['description']), ENT_QUOTES, $char));
	    $date = gmdate('Y-m-d\TH:i:s\Z',strtotime($row['start_date']));
	    $enddate = gmdate('Y-m-d\TH:i:s\Z',strtotime($row['end_date']));
	    $language = trim(utf8_encode($lang_obj->get_language_code($row['language_id'])));
	    $rss_long->addItem($link, $title1, array("description" => $title2, "dc:date" => $date, "dc:subject" => $event_topic, "dc:creator" => $author, "dc:resource" => "event", "dc:language" => $language, "ev:startdate" => $date, "ev:type" => $event_type, "ev:location" => $event_location, "ev:enddate" => $enddate, "content:encoded" => $summary, "dcterms:hasPart" => $file));
	}
        $print_long=$rss_long->serialize();
	$print_long=str_replace(array("&amp;#","&amp;amp;","&amp;gt;","&amp;lt;","&amp;quot;"), array("&#", "&amp;", "&gt;", "&lt;", "&quot;"), $print_long);
	$fffp = fopen(SF_WEB_PATH."/syn/".$location.$rss_file, "w");
        fwrite($fffp, $print_long, strlen($print_long));
        fclose($fffp);
        }

function cleanup_text($tmpvar)
    {
        // Process text articles, adds url's, etc
        $tmpvar = stripslashes($tmpvar);

        // encode
        $tmpvar = str_replace(array('<','>','"'),array('&lt;','&gt;','&quot;'),$tmpvar);

        // re-encode to avoid confusing the link generator
        $tmpvar = str_replace(array('&quot;','&lt;','&gt;'),array(' &quot; ',' &lt; ',' &gt; '),$tmpvar);

        // replace newlines with html
        $tmpvar = eregi_replace("(\n\n|\r\r|\r\n\r\n|\n\t|\r\t\|\r\n\t)", " <br /><br /> ", $tmpvar);
        $tmpvar = eregi_replace("(\n|\r|\r\n)", " <br /> ", $tmpvar);

        // turn e-mail addresses into mailto links
        $tmpvar = eregi_replace('[A-Za-z0-9_]([-._]?[A-Za-z0-9])*@[A-Za-z0-9]([-.]?[A-Za-z0-9])*\.[A-Za-z]+', '<a href="mailto:\\0">\\0</a>', $tmpvar);

        // turn URLs into links;
        $tmpvar = eregi_replace("((www\.)([a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/]))", "http://\\1", $tmpvar);
        $tmpvar = eregi_replace("((ftp://|http://|https://){2})([a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/])", "http://\\3", $tmpvar);
        $tmpvar = eregi_replace("(((ftp://|http://|https://){1})[a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/])", "<a href=\"\\1\">\\1</a>", $tmpvar);

		// turn <a href="<a href=""></a>"> and <a href=<a href=""></a>> back into links
        $tmpvar = eregi_replace("(( &lt; a href= &quot; <a href=\")(((ftp://|http://|https://){1})[a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/]\">))((((ftp://|http://|https://)([a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/]))))(</a> &quot;  &gt; )", "<a href=\"\\6\">", $tmpvar);
        $tmpvar = eregi_replace("(( &lt; a href=<a href=\")(((ftp://|http://|https://){1})[a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/]\">))((((ftp://|http://|https://)([a-zA-Z0-9@:%_.~#-\?&]+[a-zA-Z0-9@:%_~#\?&/]))))(</a> &gt; )", "<a href=\"\\6\">", $tmpvar);
        $tmpvar = eregi_replace(" &lt; /a &gt; ", "</a>", $tmpvar);

        // de-reencode
        $tmpvar = str_replace(array(' &lt; ',' &gt; ',' &quot; '), array('<','>','"'),$tmpvar);

        return $tmpvar;
    }

    function cleanup_html ($tmpvar)
    {
        // Removes unwanted HTML from the article
        $tmpvar = eregi_replace("(<applet|<body|<head|<html|<link|<meta|<object|<script|<iframe|<font)", "<null", $tmpvar);
        $tmpvar = eregi_replace("(</applet|</body|</head|</html|</link|</meta|</object|</script|</iframe|</font)","</null",$tmpvar);
        $tmpvar = eregi_replace('<title>','<!-- ',$tmpvar);
        $tmpvar = eregi_replace('</title>',' -->',$tmpvar);
        $tmpvar = str_replace(array('<?','?>','&quot;', '<%', '%>'),array('<!--','-->','"','<!--','-->'),$tmpvar);
        $tmpvar = eregi_replace('(style|class|color|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onreset|onselect|onsubmit|onunload)="[^"]+"', " ", $tmpvar);
        $tmpvar = eregi_replace('(style|class|color|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onreset|onselect|onsubmit|onunload)=[^\>]+\>', ">", $tmpvar);
        return $tmpvar;
    }


    function set_this_delete_info($event_id)
    {
	$db = new DB;
	$query = "select confirmation_number, location_id from event where event_id = '".$event_id."'";
	$result = $db->query($query);
	while($row = array_pop($result))
	{
	    $this->delete_info["location_id"] = $row['location_id'] ;
	    $this->delete_info["confirmation_number"] = $row['confirmation_number'] ;
	}
	return $this->delete_info;
    }

    function make_calendar_minical($location_id = '') {
	include_once(SF_SHARED_PATH.'/classes/calendar/minical.inc');
	if($location_id > 0) $loc_array[location_id] = $location_id ;
	$minical = new Minical($loc_array);
	$minical->cache();
    }

    function update_from_yesterday()
    {
	// if there was an event yesterday, we need to update minicalendar.html & calendar.rdf
	// if the events of yesterday had a specific location set, we need to update those too.
	$db = new DB ;
	$yesterday = date('U', time()-86400);
	$query = "select event_id, location_id from event where event.start_date like '".date('Y-m-d', $yesterday)."%'";
	$result = $db->query($query);
	if(is_array($result) && sizeof($result) > 0)
	{
	    $this->make_calendar_rdf();
	    $this->make_calendar_minical();
	    $locs = array();
	    while($row = array_pop($result))
	    {
		if($row['location_id'] && !in_array($row['location_id'], $locs))
		{
		    $locs[] = $row['location_id'] ;
		    $this->make_calendar_rdf($row['location_id']);
		    $this->make_calendar_minical($row['location_id']);
		}
	    }
	    return 1;
	}
    }



}
}
?>
