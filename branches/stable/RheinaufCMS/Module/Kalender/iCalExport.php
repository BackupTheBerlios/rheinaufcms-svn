<?
/**
 * Creates a vcal version 1.0 stream from an sf-active event object
 *
 *  @package	sf-active
 *  @subpackage	calendar
 */

class iCal {

	/**
	 *  array of Sf-Active Event objects
	 *  @var    array
	 */
	var $events;
	/**
	 *  @var    string
	 */
	var $timezone;
	/**
	 *  @var    string
	 */
	var $prodid;

	/**
	 *  class constructor. sets the default values.
	 *  @param  array   $events_array
	 *  @param  string  $prodid
	 *  @param  string  $timezone
	 */
	function iCal($events_array = Array(), $prodid ='Kalender', $timezone = '+0100') {
		$this->prodid = '-//Rheinauf.de//NONSGML '.PROJECT_NAME.' Kalender//EN';
		$this->timezone = $timezone;
		$this->events = $events_array;
	}

	/**
	 *  takes sf-active Event object
	 *  @param  object  $event
	 */
	function addEvent($event) {
		$this->events[] = $event;
	}

	/**
	 *  either vcal or ical type output
	 *  @param  string  $type
	 *  @return string
	 */
	function toString($type = 'v' ) {
		return $type == 'v' ? $this->display_vcal() : $this->display_ical();
	}


	/**
	 * Alias of toString()
	 */
	function display() {
		return $this->toString();
	}

	/**
	 *  renders as vcal.
	 * @returns a vcal stream
	 */
	function display_vcal() {
		$text = "BEGIN:VCALENDAR\r\nVERSION:1.0\r\nPRODID:{$this->prodid}\r\nTZ:{$this->timezone}";
		foreach ($this->events as $event) {
			$text .= "\r\n" . $this->event_to_vcal($event);
		}
		$text .= "\r\nEND:VCALENDAR";
		return $text;
	}

	/**
	 *  renders as ical.
	 *  @return string
	 */
	function display_ical() {
		$text = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:{$this->prodid}\r\nTZ:{$this->timezone}";
		foreach ($this->events as $event) {
			$text .= "\r\n" . $this->event_to_vcal($event);
		}
		$text .= "\r\nEND:VCALENDAR";
		return $text;
	}

	/**
	 * cleanup a string to remove characters not allowed in a
	 * vcal format file
	 * taken from RSSiCal version 0.8.3
	 *  @param  string  $ts
	 */
	function cleanup($ts) {

		$patterns = array(
			'/<br \/>/',
			'/<\/p>/',
			'/<p.*?>/',

			'/(.*?)<a href="(.*?http:\/\/.+?)".*?>(.*?)<\/a>(.*?)/',

			'/<code.*?>(.*?)<\/code>/',
			'/<img.*?src=".*?".*?[\/]*>/',

			'/<blockquote.*?cite="(http:\/\/.+?)".*?>(.*?)<\/blockquote>/',
			'/<cite.*?>(.*?)<\/cite>/',

			'/<[ou]l*?>(.+?)<\/[ou]l>/',
			'/<li*?>(.+?)<\/li>/',


			'/<span.*?>(.*?)<\/span>/',
			'/<strong.*?>(.*?)<\/strong>/',
			'/<b.*?>(.*?)<\/b>/',
			'/<em.*?>(.*?)<\/em>/',
			'/<i.*?>(.*?)<\/i>/',
			'/,/',

			'/&lt;/',
			'/&gt;/',
			'/&amp;/',
			'/&#821[67];/',
			'/&#822[01];/'
			);

		$replace = array(
			//br and p
			"\\n",
			"\\n\\n",
			"",
			//a element
			"\\1\\3 [link: \\2]\\4",
			//code
			"\\1",
			//img
			"[img]\\n",
			//cite=,cite
			"\\n\\2[cite: \\1]\\n\\n",
			"[cite]\\1",
			//ul/ol, li
			"\\n\\1",
			"* \\1\\n",

			"\\1",
			"\\1",
			"\\1",
			"\\1",
			"\\1",
			"\\,",

			"<",
			">",
			"&",
			"'",
			"\""
			);

		$ts = preg_replace($patterns, $replace, trim($ts));
		return $ts;
	}

	/**
	 *  renders an event into vcal format.
	 *  @param  object  $event
	 *  @return string
	 */
	function event_to_vcal($event) {

		$uid = $event['UID'];
		$start = $event['DTSTART'];
		$end =  (intval(Date::unify_timestamp($event['DTEND'])) != 0)?$event['DTEND'] :'';
		$stamp = $event['DTSTAMP'];

		if ($end)
		{
			if (intval(Date::stunde($end).Date::minute($end)) !=0)
			{
				$dtend = "\r\nDTEND:".date("Ymd\THi00", Date::timestamp2unix($end));
			}
			else
			{
				$end = Date::add(Date::unify_timestamp($end),'day',1);
				$dtend = "\r\nDTEND;VALUE=DATE:".date("Ymd", Date::timestamp2unix($end));
			}
		}

		if (intval(Date::stunde($start).Date::minute($start)) !=0)
		{
			$dtstart = "\r\nDTSTART:".date("Ymd\THi00", Date::timestamp2unix($start));
		}
		else
		{
			$dtstart = "\r\nDTSTART;VALUE=DATE:".date("Ymd", Date::timestamp2unix($start));

		}
		if (!end)
		{
			$end = Date::add(Date::unify_timestamp($start),'day',1);
			$dtend = "\r\nDTEND;VALUE=DATE:".date("Ymd", Date::timestamp2unix($end));
		}
		$dtstamp = date("Ymd\THi00", Date::timestamp2unix($stamp));


		$text = 'BEGIN:VEVENT';
		$text .= "\r\nUID:". $uid;
		($event['CATEGORIES']) ? $text .= "\r\nCATEGORIES:" . $event['CATEGORIES'] :'';

		$text .= "\r\nSUMMARY:" . $this->cleanup($event['SUMMARY']);
		$text .= "\r\nDESCRIPTION: ". $this->cleanup($event['DESCRIPTION']);
		($event['LOCATION']) ? $text .= "\r\nLOCATION:" . $this->cleanup($event['LOCATION']) : '';
		($event['CONTACT']) ? $text .= "\r\nATTENDEE;ROLE=OWNER;STATUS=CONFIRMED: ".$event['CONTACT'] :'';
		$text .= "\r\nCLASS:PUBLIC";
		$text .= "\r\nSTATUS:".$event['STATUS'];
		($event['URL']) ? $text .= "\r\nURL:".$event['URL'] :'';

		$text .= $dtstart;
		($dtend) ? $text .= $dtend :'';
		$text .= "\r\nDTSTAMP:$dtstamp";
		$text .= "\r\nEND:VEVENT";

		return $text;
	}
}

?>
