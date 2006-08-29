<?php

// PHP Calendar Class Version 1.4 (5th March 2001)
//  
// Copyright David Wilkinson 2000 - 2001. All Rights reserved.
// 
// This software may be used, modified and distributed freely
// providing this copyright notice remains intact at the head 
// of the file.
//
// This software is freeware. The author accepts no liability for
// any loss or damages whatsoever incurred directly or indirectly 
// from the use of this script. The author of this software makes 
// no claims as to its fitness for any purpose whatsoever. If you 
// wish to use this software you should first satisfy yourself that 
// it meets your requirements.
//
// URL:   http://www.cascade.org.uk/software/php/calendar/
// Email: davidw@cascade.org.uk

if (!$calendar_is_declared){
$calendar_is_declared=true;

class Calendar
{
//Thsi class is used for rendering the small monthly calendars at the top of the weekly view of events
//The Calendar class is a slight modification of a freeware class developed by David Wilkinson.
// URL:   http://www.cascade.org.uk/software/php/calendar/
// Email: davidw@cascade.org.uk

    function Calendar()
    {
        //Constructor for the Calendar class
    }
    
    

    function getDayNames()
    {
        //Get the array of strings used to label the days of the week. This array contains seven 
        //elements, one for each day of the week. The first entry in this array represents Sunday. 
        //return $this->dayNames;
    }
    


    function setDayNames($names)
    {
        //Set the array of strings used to label the days of the week. This array must contain seven 
        //elements, one for each day of the week. The first entry in this array represents Sunday. 
        $this->dayNames = $names;
    }
    

    function getMonthNames()
    {
        //Get the array of strings used to label the months of the year. This array contains twelve 
        //elements, one for each month of the year. The first entry in this array represents January. 
        return $this->monthNames;
    }
    

    function setMonthNames($names)
    {
        //Set the array of strings used to label the months of the year. This array must contain twelve 
        //elements, one for each month of the year. The first entry in this array represents January. 
        $this->monthNames = $names;
    }
    
    
    

      function getStartDay()
    {
        //Gets the start day of the week. This is the day that appears in the first column
        //of the calendar. Sunday = 0.
        //return $this->startDay;
    }
    

    function setStartDay($day)
    {
        //Sets the start day of the week. This is the day that appears in the first column
        //of the calendar. Sunday = 0.
        $this->startDay = $day;
    }
    
    

    function getStartMonth()
    { 
        //Gets the start month of the year. This is the month that appears first in the year
        //view. January = 1.
        return $this->startMonth;
    }
    
    
    function setStartMonth($month)
    {
    	//Sets the start month of the year. This is the month that appears first in the year
        //view. January = 1.
        $this->startMonth = $month;
    }
    
    

    function getCalendarLink($month, $year)
    {
        //Return the URL to link to in order to display a calendar for a given month/year.
        //You must override this method if you want to activate the "forward" and "back" 
        //feature of the calendar.
        //
        //Note: If you return an empty string from this function, no navigation link will
        //be displayed. This is the default behaviour.
        //
        //If the calendar is being displayed in "year" view, $month will be set to zero.
        return "";
    }
    
    
    function getDateLink($day, $month, $year)
    {
        //Return the URL to link to  for a given date.
        //You must override this method if you want to activate the date linking
        //feature of the calendar.
        //Note: If you return an empty string from this function, no navigation link will
        //be displayed. This is the default behaviour.
        return "";
    }



    function getCurrentMonthView()
    {
        //Return the HTML for the current month
        $d = getdate(time());
        return $this->getMonthView($d["mon"], $d["year"]);
    }
    


    function getCurrentYearView()
    {
        //Return the HTML for the current year
        $d = getdate(time());
        return $this->getYearView($d["year"]);
    }
    
    
    function getMonthView($month, $year, $highlight_week)
    {
        //Return the HTML for a specified month
        return $this->getMonthHTML($month, $year, $highlight_week );
    }


    function getYearView($year)
    {
        //Return the HTML for a specified year

        return $this->getYearHTML($year);
    }
    
    
    
    /********************************************************************************
    
        The rest are private methods. No user-servicable parts inside.
        
        You shouldn't need to call any of these functions directly.
        
    *********************************************************************************/



    function getDaysInMonth($month, $year)
    {
	//private method (should not be called directly):
        //Calculate the number of days in a month, taking into account leap years.
        if ($month < 1 || $month > 12)
        {
            return 0;
        }
   
        $d = $this->daysInMonth[$month - 1];
   
        if ($month == 2)
        {
            // Check for leap year
            // Forget the 4000 rule, I doubt I'll be around then...
        
            if ($year%4 == 0)
            {
                if ($year%100 == 0)
                {
                    if ($year%400 == 0)
                    {
                        $d = 29;
                    }
                }
                else
                {
                    $d = 29;
                }
            }
        }
    
        return $d;
    }


    function getMonthHTML($m, $y, $highlight_week, $showYear = 1)
    {
	//private method (should not be called directly):
        //Generate the HTML for a given month

	$check_m = date('m') -1;
	$check_y = date('Y') + 1;

        $s = "";
        
        $a = $this->adjustDate($m, $y);
        $month = $a[0];
        $year = $a[1];        
        
    	$daysInMonth = $this->getDaysInMonth($month, $year);
    	$date = getdate(mktime(12, 0, 0, $month, 1, $year));
    	
    	$first = $date["wday"];
    	$monthName = $this->monthNames[$month - 1];
    	
        if ($y > $GLOBALS['site_start_year']-1) $prev = $this->adjustDate($month - 1, $year);
        if ($y < date(Y)+3) $next = $this->adjustDate($month + 1, $year);

	if($showYear == 1)
	{ 
		$prevMonth = $this->getCalendarLink($prev[0], $prev[1]);
		$nextMonth =  $this->getCalendarLink($next[0], $next[1]);
		
	}else {
		$prevMonth = "";
		$nextMonth = "";
	}
	if($y < $GLOBALS['site_start_year'])
	{
		$prevMonth = "";
		$nextMonth = "";
	}
	if($y == $GLOBALS['site_start_year'] && $m <= $GLOBALS['site_start_month'])
	{
		$prevMonth = "";
	}
	if($y > $check_y)
	{
		$prevMonth = "";
		$nextMonth = "";
	}
	if($y == $check_y && $m >= $check_m)
	{
		$nextMonth = "";
	}
    	$header = $monthName . (($showYear > 0) ? " " . $year : "");
    	
    	$s .= "<table class=\"calendar\" cellspacing=\"0\" cellpadding=\"2\">\n";
    	$s .= "<tr>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendar\">" . (($prevMonth == "") ? "&nbsp;" : "<a href=\"$prevMonth\">&lt;&lt;</a>")  . "</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendarHeader\" colspan=\"5\">$header</td>\n"; 
    	$s .= "<td align=\"center\" valign=\"top\" class=\"calendar\">" . (($nextMonth == "") ? "&nbsp;" : "<a href=\"$nextMonth\">&gt;&gt;</a>")  . "</td>\n";
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

            if ( ( $month == $highlight_week->get_month() && $d < $highlight_week->get_day() + 7 && $d >= $highlight_week->get_day() ) || (  $highlight_week->get_month() != $temp_date->get_month() && $month==$temp_date->get_month() && $d < $temp_date->get_day()    ) ) {
            	    $s .= "<tr class=\"calendarHighlightWeek\">\n";       
    	        } else {
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
    
    function getYearHTML($year)
    {
	//private method (should not be called directly):
        //Generate the HTML for a given year
        $s = "";
    	$prev = $this->getCalendarLink(0, $year - 1);
    	$next = $this->getCalendarLink(0, $year + 1);
        
        $s .= "<table class=\"calendar\" border=\"0\">\n";
        $s .= "<tr>";
    	$s .= "<td align=\"center\" valign=\"top\" align=\"left\">" . (($prev == "") ? "&nbsp;" : "<a href=\"$prev\">&lt;&lt;</a>")  . "</td>\n";
        $s .= "<td class=\"calendarHeader\" valign=\"top\" align=\"center\">" . (($this->startMonth > 1) ? $year . " - " . ($year + 1) : $year) ."</td>\n";
    	$s .= "<td align=\"center\" valign=\"top\" align=\"right\">" . (($next == "") ? "&nbsp;" : "<a href=\"$next\">&gt;&gt;</a>")  . "</td>\n";
        $s .= "</tr>\n";
        $s .= "<tr>";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(0 + $this->startMonth, $year, NULL, 0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(1 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(2 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "</tr>\n";
        $s .= "<tr>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(3 + $this->startMonth, $year,NULL, 0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(4 + $this->startMonth, $year,NULL, 0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(5 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "</tr>\n";
        $s .= "<tr>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(6 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(7 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(8 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "</tr>\n";
        $s .= "<tr>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(9 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(10 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "<td class=\"calendar\" valign=\"top\">" . $this->getMonthHTML(11 + $this->startMonth, $year, NULL,0) ."</td>\n";
        $s .= "</tr>\n";
        $s .= "</table>\n";
        
        return $s;
    }


    function adjustDate($month, $year)
    {
	//private method (should not be called directly):
        //Adjust dates to allow months > 12 and < 0. Just adjust the years appropriately.
        //e.g. Month 14 of the year 2001 is actually month 2 of year 2002.
        $a = array();  
        $a[0] = $month;
        $a[1] = $year;
        
        while ($a[0] > 12)
        {
            $a[0] -= 12;
            $a[1]++;
        }
        
        while ($a[0] <= 0)
        {
            $a[0] += 12;
            $a[1]--;
        }
        
        return $a;
    }

	function cache_location_array()
	{
		$db = new DB;
		$query = "select location_id, name from location";
		$result = $db->query($query);

		$file = "<?\n\n";

        while($row = array_pop($result))
        {
            $file .= "\$location_options[\"".$row['location_id']."\"]  =  \"".$row['name']."\";\n";
        }
        $file .= "\n?>";
		$cache = new Cache ;
        $cache->cache_file($file, SF_CACHE_PATH.'/location_options.inc');
    }

    function cache_event_topic_array()
    {
        $db = new DB;
        $query = "select event_topic_id, name from event_topic";
        $result = $db->query($query);

        $file = "<?\n\n";

        while($row = array_pop($result))
        {
            $file .= "\$event_topic_options[\"".$row['event_topic_id']."\"]  =  \"".$row['name']."\";\n";
        }
        $file .= "\n?>";
        $cache = new Cache ;
        $cache->cache_file($file, SF_CACHE_PATH.'/event_topic_options.inc');
    }

    function cache_event_type_array()
    {
        $db = new DB;
        $query = "select event_type_id, name from event_type";
        $result = $db->query($query);

        $file = "<?\n\n";

        while($row = array_pop($result))
        {
            $file .= "\$event_type_options[\"".$row['event_type_id']."\"]  =  \"".$row['name']."\";\n";
        }
        $file .= "\n?>";
        $cache = new Cache ;
        $cache->cache_file($file, SF_CACHE_PATH.'/event_type_options.inc');
    }



    /* 
        The start day of the week. This is the day that appears in the first column
        of the calendar. Sunday = 0.
    */
    var $startDay = 0;

    /* 
        The start month of the year. This is the month that appears in the first slot
        of the calendar in the year view. January = 1.
    */
    var $startMonth = 1;

    /*
        The labels to display for the days of the week. The first entry in this array
        represents Sunday.
    */
    var $dayNames = array("S", "M", "T", "W", "T", "F", "S");
    
    /*
        The labels to display for the months of the year. The first entry in this array
        represents January.
    */
    var $monthNames = array("January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December");
                            
                            
    /*
        The number of days in each month. You're unlikely to want to change this...
        The first entry in this array represents January.
    */
    var $daysInMonth = array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    
}
}

?>
