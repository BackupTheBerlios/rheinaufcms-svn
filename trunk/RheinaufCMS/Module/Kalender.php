<?php
if (!class_exists('Calendar')) include_once('Kalender/Calendar.php');
/**
 * RheinaufKalender
 *
 * Database structure table: `RheinaufCMS>Kalender>Termine`
 *
 * UID
 * SUMMARY
 * DESCRIPTION
 * LOCATION
 * CATEGORIES ==>
 * URL 		[URL]
 * STATUS 	[TENTATIVE | CONFIRMED | CANCELLED]
 * CLASS 	[PUBLIC | PRIVATE | CONFIDENTIAL]
 * DTSTART 	[TIMESTAMP]
 * DTEND 	[TIMESTAMP]
 * DTSTAMP 	[TIMESTAMP]
 * X-RHEINAUF-LOGO [URL]
 * X-RHEINAUF-BILD [URL]
 * X-RHEINAUF-PREIS
 * CONTACT
 * X-RHEINAUF-EVENT [1 | 0]
 *
 *
 */
class Kalender extends RheinaufCMS
{
	var $monate = array(	1=>"Januar", 2=>"Februar", 3=>"März", 4=>"April", 5=>"Mai",  6=>"Juni",
                  			7=>"Juli", 8=>"August", 9=>"September", 10=>"Oktober", 11=>"November",12=>"Dezember");

    var $termine = array();
	var $db_table = 'RheinaufCMS>Kalender>Termine';
	var $categories;

    function Kalender($db_connection='',$path_information='')
	{

		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		$this->scaff = new FormScaffold($this->db_table,$this->connection,$this->path_information);
		$this->scaff->cols_array['STATUS']['options'] = array('CONFIRMED'=>'fest','TENTATIVE'=>'vorläufig','CANCELLED'=>'storniert');
		$this->scaff->cols_array['CLASS']['options'] = array('PUBLIC'=>'öffentlich','PRIVATE'=>'nicht öffentlich');
		$this->scaff->cols_array['DTSTART']['type'] = 'timestamp';
		$this->scaff->cols_array['DTEND']['type'] = 'timestamp';

		$this->categories = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>Kategorien`");

		$GLOBALS['other_css'] = Html::style('#monatskalender a {display:block;padding:0 4px 0 4px;font-weight:900;} .calendarToday {} .termin{background-color:rgb(206, 211, 214)}');
	}

	function show ()
	{
		$cal = new CalendarLinked();
		$cal->root = '/'.rawurlencode($this->uri_components[0]).'/'.rawurlencode($this->uri_components[1]);

		$year_request = (isset($this->uri_components[2]) && preg_match('/[0-9]{4}/',$this->uri_components[2])) ? $this->uri_components[2] : Date::jahr();
		$month_request = (isset($this->uri_components[3]) && preg_match('/[0-9]{2}/',$this->uri_components[3])) ? $this->uri_components[3] : Date::monat();
		$day_request = (isset($this->uri_components[4]) && preg_match('/[0-9]{2}/',$this->uri_components[4])) ? $this->uri_components[4] : Date::tag();

		if ($this->check_right('KalenderIntern')) $access ='';
		elseif ($this->check_right('KalenderExtern')) $access = "AND `CLASS` = 'PUBLIC'";
		else
		{
			$allowed_categories = array();
			foreach ($this->categories as $cat)
			{
				if ($cat['Access']=='PUBLIC') $allowed_categories[] = "`CATEGORIES` = '".$cat['Name']."'";
			}
			$access = "AND `CLASS` = 'PUBLIC' AND (" . implode(' OR ',$allowed_categories).")";

		}
		if (isset($_GET['Kategorie']))
		{
			$cat_filter = array();
			foreach ($_GET['Kategorie'] as $cat)
			{
				$cat_filter[] = "`CATEGORIES` = '".rawurldecode($cat)."'";
				$filter = "AND (" . implode(' OR ',$cat_filter).")";
			}
		}
		else $filter = '';


		$show_sql = "SELECT * FROM `$this->db_table` WHERE `DTSTART` >= '".Date::unify_timestamp($year_request.$month_request.$day_request)."' $access $filter ORDER BY `DTSTART` ASC";
		$overview_sql = "SELECT * FROM `$this->db_table` WHERE `DTSTART` >= NOW() $access $filter ORDER BY `DTSTART` ASC";

		$overview = $this->connection->db_assoc($overview_sql);
		$cal->dates = array();
		foreach ($overview as $date)
		{
			$date['DTSTART'] = Date::unify_timestamp($date['DTSTART']);
			$day =  Date::jahr($date['DTSTART']).Date::monat($date['DTSTART']).Date::tag($date['DTSTART']).'000000';
			$cal->dates[$day]['start'] = $day;
			$cal->dates[$day]['SUMMARY'] =$date['SUMMARY'];

			while ($day < Date::unify_timestamp($date['DTEND']) )
			{
				$day = Date::add($day,'day',1);
				$cal->dates[$day]['start'] = $date['DTSTART'];
				$cal->dates[$day]['SUMMARY'] = $date['SUMMARY'];
			}

		}

		$month[0] = Date::monat();
		$year[0] = Date::jahr();
		$month[1] = ($month[0]+1 != 13) ? $month[0]+1 : 1;
		$year[1] = ($month[0]+1 != 13) ? $year[0] : $year[0]+1;
		$month[2] = ($month[0]+2 != 13) ? $month[0]+2 : 1;
		$year[2] = ($month[0]+2 != 13) ? $year[0] : $year[0]+1;

		$monthcals[0] = $cal->getMonthView($month[0],$year[0]);
		$monthcals[1] = $cal->getMonthView($month[1],$year[1]);
		$monthcals[2] = $cal->getMonthView($month[2],$year[2]);

		$result_table =$this->scaff->make_table($show_sql,INSTALL_PATH.'/Module/Kalender/Templates/KalenderTabelle.template.html');
		if (strstr($this->uri_components[count($this->uri_components)-1],'.ics'))
		{
			$this->noframe();
			$events = $this->connection->db_assoc($show_sql);
			if (!class_exists('iCal')) include_once('Kalender/iCalExport.php');
			//header("Content-Type: text/calendar");
			$ical = new	iCal($events);
			return mb_convert_encoding($ical->display_ical(),'UTF-8','ISO-8859-15');
		}
		$nav = array();
		if ($prev = $this->scaff->prev_link()) $nav[0] = Html::a(SELF.'?'.$prev,'Zurück');
		if ($next = $this->scaff->next_link()) $nav[1] = Html::a(SELF.'?'.$next,'Weiter');
		$return_string ='';

		$return_string .= $this->cat_select();
		$return_string .= Form::form_tag(SELF);
		$return_string .= $result_table;
		//$return_string .=implode(' | ',$nav);
		$return_string .= Form::close_form();

		return Html::div($return_string,array('class'=>'box-mitte')).Html::div(implode("\n",$monthcals),array('id'=>'monatskalender'));
	}

	function cat_select()
	{
		$return_string = Form::form_tag(SELF,'get');
		$attr = array();
		foreach ($this->categories as $cat)
		{
			if (isset($_GET['Kategorie']))
			{
				if (in_array(rawurlencode($cat['Name']),$_GET['Kategorie']))
				{
					$attr['checked'] = 'checked';
				}
				else unset ($attr['checked']);
			}
			if ($cat['Access'] == 'PUBLIC' || $this->check_right('KalenderExtern') || $this->check_right('KalenderIntern'))
			{
				$inputs[] = Form::add_input('checkbox','Kategorie[]',rawurlencode($cat['Name']),$attr). $cat['Name'];
			}
		}
		$inputs[] = Form::add_input('submit','filter','Auswählen');
		$return_string .= implode(' | ',$inputs).Form::close_form();
		return $return_string;
	}

}
class CalendarLinked extends Calendar
{
	var $dates;
	var $monthNames = array("Januar", "Februar", "März", "April", "Mai", "Juni",
                            "Juli", "August", "September", "Oktober", "November", "Dezember");
	var $dayNames = array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");
	var $startDay = 1;

	function getDateLink($day, $month, $year)
    {
    	$date = Date::unify_timestamp($year.Date::add_0($month).Date::add_0($day));

    	if (isset($this->dates[$date]))
    	{
    		$start = $this->dates[$date]['start'];
    		$summary = $this->dates[$date]['SUMMARY'];
    		$link = $this->root.'/'.Date::jahr($start).'/'.Date::monat($start).'/'.Date::tag($start);
    		return Html::a($link,$day,array('title'=>$summary));
    	}
		else return '';

    }

    function getDateClass($day, $month, $year)
    {
		$date = Date::unify_timestamp($year.Date::add_0($month).Date::add_0($day));

    	if (isset($this->dates[$date])) return ' termin';
		else return '';
    }

    /*
        Generate the HTML for a given month
    */
    function getMonthHTML($m, $y, $showYear = 1)
    {
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

    	$s .= "<table class=\"calendar\">\n";
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

    	while ($d <= $daysInMonth)
    	{
    	    $s .= "<tr>\n";

    	    for ($i = 0; $i < 7; $i++)
    	    {
				$class ='';
    	    	$class = ($year == $today["year"] && $month == $today["mon"] && $d == $today["mday"]) ? "calendarToday" : "calendar";

    	        if ($d > 0 && $d <= $daysInMonth)
    	        {
    	             $class .= $this->getDateClass($d, $month, $year);
	    	    	$s .= "<td class=\"$class\">";
    	        	$link = $this->getDateLink($d, $month, $year);
    	            $s .= ($link == "") ? $d : $link;
    	        }
    	        else
    	        {
    	            $s .= "<td class=\"$class\">";
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
}