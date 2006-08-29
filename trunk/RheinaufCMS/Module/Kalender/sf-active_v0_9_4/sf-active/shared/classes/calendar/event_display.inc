<?php
// Event Display Helper Class

class EventDisplay extends Page {

    function EventDisplay () {
        // Class constructor, does nothing
        return 1;
    }


	// Render Functions	
	function renderShortMonthViewPrev ($date, $datenow) {

		$calendar = new IndyCalendar();
		if ($date->get_month() == $datenow->get_month() ||
			$date->get_month() == $datenow->get_month()+1) {
			$date_to_use = $datenow;
		} else {
				$date_to_use=$date;
		}

		$month = $date_to_use->get_month();
		$year = $date_to_use->get_year();
			
		return $calendar->getMonthView($month, $year, $date);

	}

	function renderShortMonthViewNext ($date, $datenow) {

		$calendar = new IndyCalendar();
		if ($date->get_month() == $datenow->get_month() ||
			$date->get_month() == $datenow->get_month()+1) {
			$date_to_use = $datenow;
		} else {
				$date_to_use=$date;
		}

		$month = $date_to_use->get_month();
		$year = $date_to_use->get_year();
		$month = $month+1;		
		
		return $calendar->getMonthView($month, $year, $date);

	}

	function renderWeekHTML ($date, $filter ) {
		
		// FIXME some fkn "globals" from event_render make real globals form that and fix where it is used..
		$sunday=0;
		$saturday=6;
		
		$event_renderer = new EventRenderer();
// corrected mistake 	
//		$event_week = new EventWeek($date->get_unix_time(), 0, $filter );
		$event_week = new EventWeek($date->get_unix_time(), $filter );
		
		$html_for_week = "<tr>";
		$tmpday = $sunday;

		while ( $tmpday < $saturday + 1 )
		{
			$html_for_week = $html_for_week."<td valign=\"top\" class=\"eventText\">";
			$html_for_week = $html_for_week.$event_renderer->render($event_week->getEvents(0, 25, $tmpday ));
			$html_for_week = $html_for_week."</td>";
			$tmpday++;			
		}
		
		$html_for_week = $html_for_week."</tr>";

		return $html_for_week;
	}
	
	function renderEventHTML ($eventid) {

		$ede = new Page ('event_display_event');		
		$GLOBALS['caleventid'] = $eventid;	// FIXME...
		
		if ( $ede->get_error() ) {
    		$event_html = "Fatal error: " . $ede->get_error();
		} else {
    		$ede->build_page();
    		$event_html = $ede->get_html();
		}
		
		return $event_html;
		
	}
	

}


?>
