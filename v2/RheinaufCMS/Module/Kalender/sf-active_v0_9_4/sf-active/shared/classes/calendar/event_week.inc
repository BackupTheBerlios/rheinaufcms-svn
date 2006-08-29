<?php

class EventWeek{
	//Thsi class defines a week of events
	//it holds an array of events for every day of the week and is capable of returning
	//from memory event for a given day and time range (this will work for
	//a grid calendar with events listed by time period as well as the all current (events for 
	//each day) format)

	var $events=array();

	function EventWeek($first_day_of_week, $filter){
		//Constructor loads all events for a given week given a filter of field names and values
		global $db_obj;
		$date=new Date();
		$date->set_time_from_unix_time($first_day_of_week);
		$this->events=array(
			array(),
			array(),
			array(),
			array(),
			array(),
			array(),
			array()
			);
		$date->move_forward_n_days(7);
		$last_day_of_week=$date->get_unix_time();
		$event=new Event();
		$events_for_week=$event->find_between_dates(
			date("Y/m/d", $first_day_of_week),
			date("Y-m-d",$last_day_of_week),
			$filter);
		$day=0;
		if (sizeof($events_for_week)>0){
			while ($next_event=array_pop($events_for_week)){
				while ($day<7 && $day<$next_event->get_start_day_of_week()){
					$day=$day+1;
				}
				$next_days_events=$this->events[$day];
				array_push($next_days_events,$next_event);
				$this->events[$day]=$next_days_events;
			}
		}
	}

	function getEvents($start_time, $end_time, $start_day){
		//returns an array of events for a given day in a given time range
		//(assuming the events have already been loaded)
		$i=0;
		$event_array=array();
		$day=0;
		$next_day_events=$this->events[$start_day];
		while ($i<sizeof($next_day_events)){
			$next_event=$next_day_events[$i];
			if ($next_event->get_start_time()>=$start_time
			    &&
			    $next_event->get_start_time()<$end_time
			    ){
				array_push($event_array,$next_event);
			}
			$i=$i+1;
		}
		//$event_array[0]=new Event();
		//$event_array[0]->set_title(date("D M d",$start_datetime)."<BR>".date("g:i A",$start_datetime));
		return $event_array;
	}


}

?>
