<?php

if ($ev_renderer_is_defined!="true"){
$ev_renderer_is_defined="true";
$midnight=0;
$first_listed_hour=10;
$last_listed_hour=22;
$sunday=0;
$saturday=6;
$oneday=60*60*24;

class EventRenderer{
	//Event renderer is used to render the HTML for Event objects

	function render_daytitle($date){
		//returns a formatted date and time for an event
		$return_string= date ("D", $date->get_unix_time());
		$return_string=$return_string."<br />";
		$return_string=$return_string.date("M d", $date->get_unix_time());
		return $return_string;
	}
	
	function render($events){
		//renders the HTML for a list of event objects as seen for a day
		// in the weekly event view
		$number_of_events=sizeof($events);
		$i=0;
		$return_val="";
		while($i<$number_of_events){
			$next_event=$events[$i];
			$return_val=$return_val."<a href=\"event_display_detail.php?event_id=";
			$return_val=$return_val.($next_event->get_id());
			$return_val=$return_val."&amp;day=".$next_event->get_start_day();
			$return_val.="&amp;month=".$next_event->get_start_month();
			$return_val.="&amp;year=".$next_event->get_start_year();
			$return_val.="\" class=\"eventTitle\">";
			$return_val=$return_val.(htmlspecialchars($next_event->get_title()));
			$return_val=$return_val."</a><br />";

			$start_time_obj=$next_event->get_start_time_object();
			$display_timerange=$start_time_obj->get_display_time();
			if ($next_event->get_duration()>0){
				$end_time_obj=$next_event->get_end_time_object();
				$display_timerange=$display_timerange." - ".$end_time_obj->get_display_time();

			}

			$return_val=$return_val.$display_timerange."<br />";
			if (strlen(trim($next_event->get_event_type_name()))>0){
				$return_val=$return_val.htmlspecialchars($next_event->get_event_type_name())."<br />";
			}
			if (strlen(trim($next_event->get_location_name()))>0){
				$return_val=$return_val.htmlspecialchars($next_event->get_location_name())."<br />";
			}
			$return_val=$return_val."<br />";
			$i=$i+1;
		}
		if (strlen($return_val)==0){
			return "&nbsp;";
		}
		return $return_val;
	}

	function render_list($events,$detail_flag){
		//renders the HTML for the printable list of events
		$number_of_events=sizeof($events);
		$i=0;
		$return_val="";

		$return_val=$return_val."<table>";
		while($i<$number_of_events){
			$next_event=$events[$i];

			$return_val=$return_val.'<tr><td class="eventText">';

			if ($detail_flag=="off") {
				$return_val=$return_val."<b>";
			}
			$return_val=$return_val."(".($i+1).")&nbsp;&nbsp;";
			if ($detail_flag=="on") {
				$return_val=$return_val."<a href=\"#".($i+1)."\">";
			}
			$return_val=$return_val.(htmlspecialchars($next_event->get_title()));
			if ($detail_flag=="off") {
				$return_val=$return_val."</b>";
			}

			if ($detail_flag=="on") {
				$return_val=$return_val."</a>";
			}

			$return_val=$return_val.'<br />';
			$date=$next_event->get_start_date_object();
			$return_val=$return_val.date("D", $date->timestamp)."&nbsp;";
			$return_val=$return_val.date("M", $date->timestamp).".&nbsp;";
			$return_val=$return_val.$next_event->get_start_day().",&nbsp;";

			$start_time_obj=$next_event->get_start_time_object();
			$display_timerange=$start_time_obj->get_display_time();
			if ($next_event->get_duration()>0){
				$end_time_obj=$next_event->get_end_time_object();
				$display_timerange=$display_timerange." - ".$end_time_obj->get_display_time();
			}

			$return_val=$return_val.$display_timerange."&nbsp;-&nbsp;";
			if (strlen(trim($next_event->get_location_name()))>0){
				$return_val=$return_val.htmlspecialchars($next_event->get_location_name())."&nbsp;";
			}

			$return_val=$return_val.'<br />';
			$return_val=$return_val.'Event Topic:&nbsp;&nbsp;'.(htmlspecialchars($next_event->get_event_topic_name()));

			$return_val=$return_val.'<br />';
			$return_val=$return_val.'Event Type:&nbsp;&nbsp;'.(htmlspecialchars($next_event->get_event_type_name()));

			$return_val=$return_val."</td></tr>";
			$i=$i+1;
		}

		if ($detail_flag=="on") {

			if ($number_of_events >0)
				$return_val=$return_val."<tr><td>---------------------------------------------------</td></tr>";
			$i=0;

			while($i<$number_of_events){
				$next_event=$events[$i];

				$return_val=$return_val.'<tr><td class="eventText"><b>';
				$return_val=$return_val.'<a name="'.($i+1).'"></a>';
				$return_val=$return_val."(".($i+1).")&nbsp;&nbsp;";
				$return_val=$return_val.(htmlspecialchars($next_event->get_title()));
				$return_val=$return_val."</b></td></tr>";

				$return_val=$return_val.'<tr><td class="eventText">';
				$date=$next_event->get_start_date_object();

				$return_val=$return_val.date("D", $date->timestamp)."&nbsp;";
				$return_val=$return_val.date("M", $date->timestamp).".&nbsp;";
				$return_val=$return_val.$next_event->get_start_day().",&nbsp;";

				$start_time_obj=$next_event->get_start_time_object();
				$display_timerange=$start_time_obj->get_display_time();
				if ($next_event->get_duration()>0){
					$end_time_obj=$next_event->get_end_time_object();
					$display_timerange=$display_timerange." - ".$end_time_obj->get_display_time();
				}

				$return_val=$return_val.$display_timerange;
				$return_val=$return_val.'<br />';

				if (strlen(trim($next_event->get_location_name()))>0){
				$return_val=$return_val.htmlspecialchars($next_event->get_location_name())."&nbsp;";
				}

				$return_val=$return_val.'<br />';

				$return_val=$return_val.(htmlspecialchars($next_event->get_location_details()));
				$return_val=$return_val.'</td></tr>';

				$return_val=$return_val.'<tr><td class="eventText">';
				$return_val=$return_val."Contact:<br />";

				if (strlen(trim($next_event->get_contact_name()))>0){
					$return_val=$return_val.htmlspecialchars($next_event->get_contact_name())."<br />";
				}
				if (strlen(trim($next_event->get_contact_phone()))>0){
					$return_val=$return_val.htmlspecialchars($next_event->get_contact_phone())."<br />";
				}
				if (strlen(trim($next_event->get_contact_email()))>0){
					$return_val=$return_val.htmlspecialchars($next_event->get_contact_email())."<br />";
				}

				$return_val=$return_val.'</td><tr>';

				$return_val=$return_val.'<tr><td>&nbsp;</td></tr>';

				$return_val=$return_val.'<tr><td class="eventText">';
				$return_val=$return_val.(nl2br($next_event->get_description()));
				$return_val=$return_val.'</td></tr>';

				$return_val=$return_val."<tr><td>&nbsp;</td></tr>";
				$i=$i+1;
			}
		}

		$return_val=$return_val.'</table>';

		if (strlen($return_val)==0){
			return "&nbsp;";
		}
		return $return_val;
	}

	function create_dropdown($list_of_objs, $selected_item ){
		//renders dropdown for event updates
		$return_val="";
		for ($i=0;$i<sizeof($list_of_objs);$i=$i+1){
			$next_obj=$list_of_objs[$i];
			$return_val=$return_val."<option value=\"";
			$return_val=$return_val.$next_obj->get_id();
			$return_val=$return_val."\"";
			if ($selected_item==$next_obj->get_id()){
				$return_val=$return_val." selected=\"selected\" ";
			}
			$return_val=$return_val.">".$next_obj->get_name();
			$return_val=$return_val."</option>";
		}
		return $return_val;
	}

	function render_error_message($text){
		//renders the erro message for an event(should be in common rendering class?)
		if (sizeof($text)>0){
			return "<br /><span style=\"color: #ff0000\">".$text."</span><br />";
		}else{
			return "";
		}
	}



}
}
?>
