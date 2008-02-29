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
	var $memointerval = 3;
	var $num_show_next_dates;

    function Kalender($num_show_next_dates = null)
    {
    	 $this->num_show_next_dates = $num_show_next_dates;
    }
	function class_init(&$system)
	{
		$this->system =& $system;
		$this->connection = $system->connection;
		$this->pfad();
		if ($this->check_right('KalenderIntern')&& !stristr(SELF,'admin')  && stristr(SELF,'Kalender') )
		{
			header("Location: http://".$_SERVER['SERVER_NAME']."/Admin/KalenderAdmin");
		}
		else $GLOBALS['TemplateVars']['NaviLogin'] = true;
		
		if (!class_exists('FormScaffold')) include_once('FormScaffold.php');
		if (!class_exists('KalFormScaff')) include_once('Kalender/KalFormScaff.php');

		$this->scaff = new KalFormScaff($this->db_table,$this->connection);
		$this->scaff->monate = $this->monate;
		$this->scaff->cols_array['STATUS']['options'] = array('CONFIRMED'=>'fest','TENTATIVE'=>'vorläufig','CANCELLED'=>'storniert');
		$this->scaff->cols_array['CLASS']['options'] = array('PUBLIC'=>'öffentlich','PRIVATE'=>'nicht öffentlich');
		$this->scaff->cols_array['DESCRIPTION']['html'] = true;
		$this->scaff->cols_array['DTSTART']['type'] = 'timestamp';
		$this->scaff->cols_array['DTEND']['type'] = 'timestamp';

		$this->categories = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>Kategorien`");

		$GLOBALS['other_css'] = Html::link(array('rel'=>'stylesheet', 'type'=>'text/css','href'=>'/Module/Kalender/Kalender.css'));

		$this->event_listen();
	}

	function event_listen()
	{
		if (isset($_POST['memo'])) $this->memo_input();
		if($_SERVER['REQUEST_METHOD'] == 'PUT') $this->collect_ical_data();
		if (isset($_GET['memosend'])) $this->memo_send();
	}

	function show ()
	{
		if (isset($_GET['Kontakt'])) return $this->kontakt();
		if (isset($this->num_show_next_dates)) return $this->next_dates();
		if (preg_match("/\.ics$/i",SELF_URL))
		{
			$this->http_login();
			$this->noframe();

			$ical_output = true;
		}
		$this->cal = new CalendarLinked();

		for ($i =0;$i<count($this->uri_components);$i++)
		{
			if (preg_match('/^[0-9]{4}$/',$this->uri_components[$i])) $year_offset = $i;
		}

		$year_request = (isset($year_offset)) ? $this->uri_components[$year_offset] : Date::jahr();
		$month_request = (isset($this->uri_components[$year_offset+1]) && preg_match('/^[0-9]{1,2}$/',$this->uri_components[$year_offset+1])) ? Date::add_0($this->uri_components[$year_offset+1]) : Date::monat();
		$day_request = (isset($this->uri_components[$year_offset+2]) && preg_match('/^[0-9]{1,2}$/',$this->uri_components[$year_offset+2])) ? Date::add_0($this->uri_components[$year_offset+2]) : '01';//Date::tag();

		$page_root = '/'.rawurlencode($this->uri_components[0]).'/'.rawurlencode($this->uri_components[1]);

		for ($i=2;$i<(($year_offset)? $year_offset : count($this->uri_components));$i++)
		{
			$page_root .= '/'.rawurlencode($this->uri_components[$i]);
		}
		$this->cal->root = $page_root;

		if ($this->check_right('KalenderIntern')) $access ='';
		elseif ($this->check_right('KalenderExtern')) $access = "AND `CLASS` = 'PUBLIC'";
		else
		{
			$allowed_categories = array();
			foreach ($this->categories as $cat)
			{
				if ($cat['Access']=='PUBLIC') $allowed_categories[] = "`CATEGORIES` = '".$cat['Name']."'";
			}
			$access = "AND `CLASS` = 'PUBLIC'";
			if ($allowed_categories)
			{
				$access .= " AND (" . implode(' OR ',$allowed_categories).")";
			} 

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
		$this->cal->dates = array();

		$this->cal->edit_enabled = $this->scaff->edit_enabled;
		foreach ($overview as $date)
		{
			$date['DTSTART'] = Date::unify_timestamp($date['DTSTART']);
			$day =  Date::jahr($date['DTSTART']).Date::monat($date['DTSTART']).Date::tag($date['DTSTART']).'000000';
			$end =  Date::jahr($date['DTEND']).Date::monat($date['DTEND']).Date::tag($date['DTEND']).'000000';

			$array = array();
			$array['start'] = $day;
			$array['SUMMARY'] ='';
			$array['SUMMARY'] .= (intval(Date::stunde($date['DTSTART']).Date::minute($date['DTSTART'])) != 0) ?Date::stunde($date['DTSTART']).':'.Date::minute($date['DTSTART']):'';
			$array['SUMMARY'] .= ($day == $end) ? '-'.Date::stunde($date['DTEND']).':'.Date::minute($date['DTEND']).' ' :' ';
			$array['SUMMARY'] .= $date['SUMMARY'];

			$array['time'] = Date::stunde($date['DTSTART']).':'.Date::minute($date['DTSTART']);

			$array['id'] = $date['id'];
			$this->cal->dates[$day][] =$array;

			if ($day != $end)
			{
				while ($day < $end)
				{
					$day = Date::add($day,'day',1);
					$this->cal->dates[$day][] = $array;
				}
			}

		}

		$month[0] = $month_request;
		$year[0] = $year_request;
		$month[1] = ($month[0]+1 != 13) ? $month[0]+1 : 1;
		$year[1] = ($month[0]+1 != 13) ? $year[0] : $year[0]+1;
		$month[2] = ($month[1]+1 != 13) ? $month[1]+1 : 1;
		$year[2] = ($month[1]+1 != 13) ? $year[1] : $year[0]+1;


		$prev_month = ($month[0]-1 !=0) ? $month[0]-1 :12;
		$prev_year = ($month[0]-1 !=0) ? $year[0] : $year[0]-1;

		$this->template = ($this->template) ? $this->template : INSTALL_PATH.'/Module/Kalender/Templates/KalenderTabelle.template.html';

		$prev_month_link = Html::a($page_root.'/'.$prev_year.'/'.$prev_month.$this->cat_get(),'&lt;&lt; ');
		$next_month_link = Html::a($page_root.'/'.$year[1].'/'.$month[1].$this->cat_get(),' &gt;&gt;');

		$sidebar[] = $this->cat_select();
		$sidebar[] = $this->cal->getMonthHTML($month[0],$year[0],1,$prev_month_link,$next_month_link);
		$sidebar[] = $this->cal->getMonthHTML($month[1],$year[1]);
		$sidebar[] = $this->cal->getMonthHTML($month[2],$year[2]);


		$this->scaff->datumsformat='tag_kurz';
		$result_table =$this->scaff->make_table($show_sql,$this->template);

		if ($ical_output)
		{
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

		$return_string .= Form::form_tag(SELF);
		$return_string .= $result_table;
		//$return_string .=implode(' | ',$nav);

		$return_string .= Form::close_form();

		return Html::div($return_string,array('id'=>'box-mitte','class'=>'box-mitte')).Html::div(implode("\n",$sidebar),array('id'=>'monatskalender'));
	}

	function next_dates()
	{
		$show_sql = "SELECT * FROM `$this->db_table` WHERE `DTSTART` >= '".Date::now()."' AND `CLASS` = 'PUBLIC' ORDER BY `DTSTART` ASC LIMIT 0,$this->num_show_next_dates";
		$vars = array();
		
		$template = new Template(INSTALL_PATH.'/Module/Kalender/Templates/NextDates.template.html');
		$return = $template->parse_template('PRE',$vars);

		$entries = $this->connection->db_assoc($show_sql);
		foreach ($entries as $entry)
		{
			$date = $entry['DTSTART'];
			
			$entry['start_tag'] = Date::tag($date);
			$entry['start_num_monat'] = Date::monat($date);
			$entry['start_monat'] = Date::month_name($entry['start_num_monat'],'kurz');
			$entry['start_jahr'] = Date::jahr($date);
			
			$date = $entry['DTEND'];
			if ($date)
			{
				$entry['end_tag'] = Date::tag($date);
				$entry['end_num_monat'] = Date::monat($date);
				$entry['end_monat'] = Date::month_name($entry['end_num_monat'],'kurz');
				$entry['end_jahr'] = Date::jahr($date);
			}
			
			$entry['clip'] = General::clip_words($entry['SUMMARY'],50);
			
			$return .= $template->parse_template('LOOP',$entry);
		}
		$return .= $template->parse_template('POST',$vars);

		return $return;
	}

	function memo_input()
	{
		$mail = (preg_match('/^[0-9a-z.+-]{2,}\@[0-9a-z.-]{2,}\.[a-z]{2,6}$/i',$_POST['memo_email'])) ?$_POST['memo_email']:'';
		if (!$mail) $GLOBALS['scripts'] .= Html::script("alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.')");
		foreach ($_POST['memo'] as $memo)
		{
			$result = $this->connection->db_single_row("SELECT * FROM `$this->db_table` WHERE `id` = '$memo'");
			$date = $result['DTSTART'];
			$insert_sql = "INSERT INTO `RheinaufCMS>Kalender>MemoMail` ( `id` , `KalenderID` , `E-Mail` , `Datum` )
																VALUES ( '', '$memo', '$mail', '$date')";
			$this->connection->db_query($insert_sql);
		}
	}

	function memo_send()
	{
		$this->noframe =true;
		$to_send = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>MemoMail` WHERE `Datum` = DATE_ADD(CURDATE(),INTERVAL $this->memointerval DAY)");
		$this->connection->debug = true;
		print_r ($to_send);
		exit;
	}
	function cat_get()
	{
		if (is_array($_GET['Kategorie']))
		{
			$get =array();
			foreach ($_GET['Kategorie'] as $cat)
			{
				$get[] = rawurlencode($cat);
			}
			return '?Kategorie%5B%5D='.implode('&Kategorie%5B%5D=',$get);
		}
		else return '';
	}
	function cat_select()
	{
		$return_string = Form::form_tag(SELF,'get');
		$attr = array();
		$table = new Table(2,array('id'=>'cat_select'));
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
				$inputs[] = Form::add_input('checkbox','Kategorie[]',rawurlencode($cat['Name']),$attr);
				$labels[] = $cat['Name'];
			}
		}
		$submit = Form::add_input('submit','filter','Auswählen', array('class'=>'button'));

		//$table->add_td(array(array(2=>'Ansicht')));
		$table->add_caption('Ansicht');
		for ($i=0;$i<count($inputs);$i++)
		{
			$table->add_td(array($labels[$i],$inputs[$i]));
		}
		$table->add_td(array(array(2=>$submit)),array('style'=>'text-align:center'));
		$return_string .= $table->flush_table().Form::close_form();
		return $return_string;
	}

	function kontakt()
	{
		$this->noframe = true;
		$cal_id = $_GET['Kontakt'];
		$cal_entry = $this->connection->db_single_row("SELECT * FROM `$this->db_table` WHERE `id` = '$cal_id'");
		$empf = $cal_entry['CONTACT'];

		if (!class_exists('Kontakt')) include_once('Kontakt.php');
		$vars = array();
		$cont = new Kontakt($empf);
		$vars['contact_form'] = $cont->show();
		$page = new Template(INSTALL_PATH.'/Module/Kalender/Templates/Kontakt.template.html');
		return $page->parse_template('',$vars);
	}

	function collect_ical_data()
	{
		$vevents=array();
		$fields = 'UID|SUMMARY|DESCRIPTION|LOCATION|CATEGORIES|URL|STATUS|CLASS|DTSTART|DTEND|DTSTAMP|X-RHEINAUF-LOGO|X-RHEINAUF-BILD|X-RHEINAUF-PREIS|CONTACT|X-RHEINAUF-EVENT';

		if($_SERVER['REQUEST_METHOD'] == 'PUT')
		{

			$this->add_incl_path(INSTALL_PATH.'/Libraries/PEAR/');
			if (!class_exists('HTTP_WebDAV_Server ')) include_once('HTTP/WebDAV/Server.php');
			if (!class_exists('webdav_put ')) include_once('Kalender/webdav_put.php');
			$webdav_server = new webdav_put();
			$webdav_server->ServeRequest();


		    if(isset($webdav_server->data))
		    {

				$cal_arr = explode("\r\n",$webdav_server->data);
				foreach($cal_arr as $k => $v)
				{
				    $v = trim(mb_convert_encoding($v,'ISO-8859-15','UTF-8'));
					if(strstr($v,'X-WR-CALNAME:'))
				    {
					$arr = explode(':',$v);
					$calendar_name = trim($arr[1]);
					//break;
				    }
				    if ($v == 'BEGIN:VEVENT') $vevent = array();
				    else if (preg_match("/($fields)(;VALUE=DATE)?:(.*?)$/s",$v,$match))
				    {
				    	$vevent[$match[1]] = stripcslashes(str_replace('\n',"\n",trim($match[3])));

				    }
				    else if (preg_match('/ATTENDEE(;CN=("?(.*?)"?))?(;ROLE=OWNER)?:MAILTO:(.*?)$/s',$v,$match))
				    {
				    	if ($match[4] && $match[5]) $vevent['CONTACT'] = $match[3].' <'.$match[5].'>' ;

				    }
				    else if ($v == 'END:VEVENT') $vevents[] = $vevent;
				    else $vevent['X-OTHER-VCAL'] .= $v."\r\n";

				}


				$vevents_ordered = array();
				$out = '';
				foreach ($vevents as $vevent)
				{
					if (strstr($vevent['UID'],'online'))
					{
						$uid = $vevent['UID'];
						$out .=$this->connection->db_update($this->db_table,$vevent,"`UID` = '$uid'");

					}

				}

				exit;
			}
			return;
		}
	}

}

class CalendarLinked extends Calendar
{
	var $dates;
	var $monthNames = array("Januar", "Februar", "März", "April", "Mai", "Juni",
                            "Juli", "August", "September", "Oktober", "November", "Dezember");
	var $dayNames = array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");
	var $startDay = 1;
	var $cal_links = array();
	var $cal_ids = array();
	function getDateLink($day, $month, $year)
    {
    	$date = Date::unify_timestamp($year.Date::add_0($month).Date::add_0($day));

    	if (isset($this->dates[$date]))
    	{
    		$id = 'link_'.$date;
    		$start = $this->dates[$date][0]['start'];
    		$summary =array();
    		foreach ($this->dates[$date] as $entry)
    		{
    			$summary[] = $entry['SUMMARY'];
    			$this->cal_links[$id][] = array($entry['id'],$entry['SUMMARY'],$date);
    		}
    		$summary = implode(', ',$summary);
    		$link = $this->root.'/'.Date::jahr($start).'/'.Date::monat($start).'/'.Date::tag($start);
    		$attr = array();

    		return Html::div(Html::a($link,$day,array('id'=>$id)),array('title'=>$summary));
    	}
		else return '';

    }

    function cellAction($day, $month, $year)
    {
    	if ($this->edit_enabled)
    	{
    		$date = $year.Date::add_0($month).Date::add_0($day);
    		$return = ' ondblclick="ctx_new_entry(\''.$date.'\')"';

    		return $return;
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
    function getMonthHTML($m, $y, $showYear = 1,$prevMonth = "",$nextMonth = "")
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


    	$header = $monthName . (($showYear > 0) ? " " . $year : "");

    	$s .= "<table class=\"calendar\">\n";
    	$s .= "<tr>\n";
    	$s .= "<td>" . (($prevMonth == "") ? "&nbsp;" : $prevMonth)  . "</td>\n";
    	$s .= "<td class=\"calendarHeader\" colspan=\"5\">$header</td>\n";
    	$s .= "<td>" . (($nextMonth == "") ? "&nbsp;" : $nextMonth)  . "</td>\n";
    	$s .= "</tr>\n";

    	$s .= "<tr>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+1)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+2)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+3)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+4)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+5)%7] . "</td>\n";
    	$s .= "<td class=\"calendarHeader\">" . $this->dayNames[($this->startDay+6)%7] . "</td>\n";
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
	    	    	$id = 'td_'.$year.Date::add_0($month).Date::add_0($d);
	    	    	$this->cal_ids[] = $id;
    	            $s .= '<td class="'.$class.'"'.$this->cellAction($d, $month, $year).' id="'.$id.'">';
    	        	$link = $this->getDateLink($d, $month, $year);
    	            $s .= ($link == "") ? $d : $link;
    	        }
    	        else
    	        {
    	            $s .= '<td class="'.$class.'">';
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