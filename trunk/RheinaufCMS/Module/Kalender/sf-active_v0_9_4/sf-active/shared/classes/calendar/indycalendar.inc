<?php

class IndyCalendar extends Calendar{
	//Specialized Calendar for the Indymedia site that inherits from the Calendar class

	function getDateLink($day, $month, $year){
		//returns a link for a given day
		$date= new Date;
		$date->set_time(0,0, $day, $month,$year);
		$day=$date->get_day();
		$month=$date->get_month();
		$year=$date->get_year();
		return "event_display_week.php?day=".$day."&amp;month=".$month."&amp;year=".$year;
	}
	function getCalendarLink($month, $year){
		//returns link to allow navigation by month
		global $unusedmonthvalue;
		global $isleft;
		//for now disable link
		//$unusedmonthvalue=$month;
		if ($unusedmonthvalue==$month){
			return "";
		}else{
			$date= new Date;
			if ($isleft){
				//if ($month==12){
				//	$date->set_time(0,0,1,1,$year+1);
				//}else{
					$date->set_time(0,0,1,$month+1,$year);
				//}
				$date->move_forward_n_days(-1);
			}else{
				//if ($month==1){
				//	$date->set_time(0,0,1,1,$year+1);
				//}else{
					$date->set_time(0,0,1,$month,$year);
				//}
				$date->find_start_of_week();
				if ($month!=$date->get_month()){
					$date->move_n_weeks_forward(1);
				}
			}
			$day1=$date->get_day();
			$month1=$date->get_month();
			$year1=$date->get_year();
			//return "or=".$ormonth."un=".$unusedmonthvalue;
			return "event_display_week.php?day=".$day1."&amp;month=".$month1."&amp;year=".$year1."&amp;isl=".$isleft;
		}
	}
}
?>
