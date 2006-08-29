<?php

class ArchiveCalendar extends Calendar
{
    //This class extends the Calendar class and highlights all weeks
    //that have archives cached for them
    

    var $week_has_stories;
    var $calendar_cachefile_basepath;
    var $calendar_cachefile_suffix;
    var $calendar_base_link_web_path;

    function ArchiveCalendar()
    {
    	//Default empty constructor
    }
    
    /*
        Generate the HTML for a given month
    */
    function getMonthHTML($m, $y, $highlight_week, $showYear = 1)
    {

	$week_has_stories=$this->week_has_stories;
	//returns the html for a gievn month
        $s = "";
        
        $a = $this->adjustDate($m, $y);
        $month = $a[0];
        $year = $a[1];        
        
    	$daysInMonth = $this->getDaysInMonth($month, $year);
    	$date = getdate(mktime(12, 0, 0, $month, 1, $year));
    	
    	$first = $date["wday"];
    	$monthName = $this->monthNames[$month - 1];
    	
    	$prev = $this->adjustDate($month - 1, $year);
    	$next = $this->adjustDate($month + 1, $year);
    	
    	if ($showYear == 1)
    	{
    	    $prevMonth = $this->getCalendarLink($prev[0], $prev[1]);
    	    $nextMonth = $this->getCalendarLink($next[0], $next[1]);
    	}
    	else
    	{
    	    $prevMonth = "";
    	    $nextMonth = "";
    	}
    	
    	$header = $monthName . (($showYear > 0) ? " " . $year : "");
    	
    	$s .= "<table class=\"calendar\" cellspacing=\"0\" cellpadding=\"2\">\n";
    	$s .= "<tr>\n";
    	$s .= "<td align=\"center\" valign=\"top\">" . (($prevMonth == "") ? "&nbsp;" : "<a href=\"$prevMonth\">&lt;&lt;</a>")  . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\" colspan=\"5\">$header</td>\n"; 
    	$s .= "<td align=\"center\" valign=\"top\">" . (($nextMonth == "") ? "&nbsp;" : "<a href=\"$nextMonth\">&gt;&gt;</a>")  . "</td>\n";
    	$s .= "</tr>\n";
    	
    	$s .= "<tr>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+1)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+2)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+3)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+4)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+5)%7] . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\">" . $this->dayNames[($this->startDay+6)%7] . "</td>\n";
    	$s .= "</tr>\n";
    	
    	// We need to work out what date to start at so that the first appears in the correct column
    	$d = $this->startDay + 1 - $first;
    	while ($d > 1)
    	{
    	    $d -= 7;
    	}

        // Make sure we know when today is, so that we can use a different CSS style
        $today = getdate(time());
    	
        $temp_date = $highlight_week->clone();
        $temp_date->move_forward_n_days(7);

    	while ($d <= $daysInMonth)
    	{

		
            if ( $this->does_week_exist_in_cache($d, $month, $year)) {
            	    $this->week_has_stories==true;
		    $s .= "<tr class=\"calendarHighlightWeek\">\n";       
    	        } else {
                    $this->week_has_stories=false;
		    $s .= "<tr>\n";             
                }    
    	    for ($i = 0; $i < 7; $i++) {
               	$class = ($year == $today["year"] && $month == $today["mon"] && $d == $today["mday"]) ? "calendarToday" : "calendar";

       	        $s .= "<td class=\"$class\" align=\"right\" valign=\"top\">";       

    	        if ($d > 0 && $d <= $daysInMonth)
    	        {
    	            $link = $this->getDateLink($d, $month, $year);
    	            $s .= (($link == "") ? $d : "<a href=\"$link\">$d</a>");
    	        }
    	        else
    	        {
    	            $s .= "&nbsp;";
    	        }
      	        $s .= "</td>\n";       
        	    $d++;
    	    }
    	    $s .= "</tr>\n";    
    	}
    	
    	$s .= "</table>\n";
    	
    	return $s;  	
    }

    function getDateLink($day, $month, $year){
	//returns the link on the dates
	if ($this->week_has_stories){
		return $this->calendar_base_link_web_path."day=".$day."&amp;month=".$month."&amp;year=".$year;
    	}else{
		return null;
	}
    }

   function does_week_exist_in_cache($day, $month, $year){
	//checks the cache to see if the week has been saved
	$date= new Date();
	$date->set_time(0,0,$day, $month, $year);
	$date->find_start_of_week();
	//echo $this->calendar_cachefile_basepath."/".$date->get_weekname().$this->calendar_cachefile_suffix."<br />";
	if (file_exists	($this->calendar_cachefile_basepath."/".$date->get_weekname().$this->calendar_cachefile_suffix)){
		//echo "found ".$date->get_weekname()."<br />";
		$this->week_has_stories=true;
		return true;
	}else{
		$this->week_has_stories=false;
		return false;
	}
	
   }
   
}

?>
