<?php
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

    function Kalender($db_connection='',$path_information='')
	{

		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		define ('BASE',DOCUMENT_ROOT.INSTALL_PATH.'/Module/Kalender/phpicalendar/');

		switch ($this->uri_components[count($this->uri_components)-1])
		{
			case 'day.php':
				 $this->extern = BASE .'day.php';
			break;
			case 'week.php':
				 $this->extern = BASE .'week.php';
			break;
			case 'year.php':
				 $this->extern = BASE .'year.php';
			break;
			case 'print.php':
				 $this->extern = BASE .'print.php';
			break;
			case 'event.php':
				$this->noframe = true;
				$this->extern = BASE .'includes/event.php';
			break;
			case 'todo.php':
				$this->noframe = true;
				$this->extern = BASE .'includes/todo.php';
			break;
			default:
				$this->extern = BASE .'month.php';
			break;

		}

		$this->add_css('<link rel="stylesheet" href="/'.INSTALL_PATH.'/Module/Kalender/phpicalendar/templates/buddy/default.css" media="screen" type="text/css" />');
	}

	function show ()
	{
		return;
	}
}