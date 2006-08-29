<?php

class DateRenderer{
	//DateRenderer helps render dropdowns fr dates and times
	//all functions that return lists or dates or times should be in this class

	function get_days_of_month(){
		//returns an an array of obejcts with ids and names set to numbers from 1 to 31
		$days_of_month=array();
		for ($i=1;$i<32;$i=$i+1){
			$new_object=new DefaultObject();
			$new_object->set_id($i);
			$new_object->set_name($i);
			array_unshift($days_of_month,$new_object);
		}
		return $days_of_month;
	}

	function get_months(){
		//returns an an array of obejcts with ids and names set to numbers from 1 to 12
		$months=array();
		for ($i=1;$i<13;$i=$i+1){
			$new_object=new DefaultObject();
			$new_object->set_id($i);
			$new_object->set_name($i);
			array_unshift($months,$new_object);
		}
		return $months;
	}
	
	function get_years(){
		//returns an an array of obejcts with ids and names set to numbers
		//between gloabl var $dropdown_min_year and $dropdown_max_year
                $dropdown_max_year=$GLOBALS['dropdown_max_year'];
                $dropdown_min_year=$GLOBALS['dropdown_min_year'];
		$now_array=getdate(time());
		if (strlen($dropdown_min_year)<1){
			$dropdown_min_year=2000;
		}
		if (strlen($dropdown_max_year)<1){
			$dropdown_max_year=$now_array["year"]+2;
		}
		$years=array();
		for ($i=$dropdown_min_year;$i<$dropdown_max_year;$i=$i+1){
			$new_object=new DefaultObject();
			$new_object->set_id($i);
			$new_object->set_name($i);
			array_unshift($years,$new_object);
		}
		return $years;
	}
	
	function get_hours(){
		//returns an an array of obejcts with ids and names set to numbers from 1 to 12
		
		$hours=array();
		for ($i=1;$i<13;$i=$i+1){
			$new_object=new DefaultObject();
			$new_object->set_id($i);
			$new_object->set_name($i);
			array_unshift($hours,$new_object);
		}
		return $hours;
	}

	function get_minutes(){
		//returns an an array of objects with ids 0 and 30 and names "00" and "30"
		$minutes=array();
		$new_object=new DefaultObject();
		$new_object->set_id(0);
		$new_object->set_name("00");
		array_unshift($minutes,$new_object);
		$new_object=new DefaultObject();
		$new_object->set_id(30);
		$new_object->set_name("30");
		array_unshift($minutes,$new_object);
		return $minutes;
	}

	function get_ampm(){
		//returns an an array of objects with ids 0 and 12 and names "AM" and "PM"
		$ampm=array();
		$new_object=new DefaultObject();
		$new_object->set_id(0);
		$new_object->set_name("AM");
		array_unshift($ampm,$new_object);
		$new_object=new DefaultObject();
		$new_object->set_id(12);
		$new_object->set_name("PM");
		array_unshift($ampm,$new_object);
		return $ampm;
	}	
}
