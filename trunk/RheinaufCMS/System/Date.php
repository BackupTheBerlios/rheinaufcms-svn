<?php
class Date
{

	function monate($art='lang')
	{
		$monate_lang = array(	1=>"Januar", 2=>"Februar", 3=>"März", 4=>"April", 5=>"Mai",  6=>"Juni",
                  			7=>"Juli", 8=>"August", 9=>"September", 10=>"Oktober", 11=>"November",12=>"Dezember");
		$monate_kurz = array(	1=>"Jan", 2=>"Feb", 3=>"Mär", 4=>"Apr", 5=>"Mai",  6=>"Jun",
                  			7=>"Jul", 8=>"Aug", 9=>"Sep", 10=>"Okt", 11=>"Nov",12=>"Dez");

        return ($art=='kurz') ? $monate_kurz : $monate_lang;
	}

	function month_name($month_num,$art='lang')
	{
		$months=Date::monate($art);

		return $months[intval($month_num)];
	}
	/**
	 * SQL-Timestamp zu Unix-Time
	 *
	 * @param integer $t
	 * @return integer
	 */
	function timestamp2unix($t)
	{
		$tag = Date::tag($t);
		$monat = Date::monat($t); //Monat
		$jahr = Date::jahr($t); //Jahr
		$stunde = Date::stunde($t); //Stunde
		$minute = Date::minute($t); //Minute
		$sekunde = Date::sekunde($t); //Sekunde
		return mktime($stunde,$minute,$sekunde,$monat,$tag,$jahr);
	}

	function unix2timestamp($t)
	{
		return date("YmdHis",$t);
	}
	/**
	 * Julian date Quelle: http://aa.usno.navy.mil/data/docs/JulianDate.html (konvertiert aus Javascript)
	 *
	 * @param int $y
	 * @param int $m
	 * @param int $d
	 * @param int $h
	 * @param int $mn
	 * @param int $s
	 * @param int $era
	 * @return int julian date
	 */
	function jd( $y, $m, $d, $h =12 , $mn = 0, $s = 0, $era="CE" )
	{
		if( $y == 0 ) {
			//alert("There is no year 0 in the Julian system!");
			return "invalid";
		}
		if( $y == 1582 && $m == 10 && $d > 4 && $d < 15 && $era == "CE" ) {
			//alert("The dates 5 through 14 October, 1582, do not exist in the Gregorian system!");
			return "invalid";
		}

		//	if( y < 0 )  ++y;
		if( $era == "BCE" ) $y = -$y + 1;
		if( $m > 2 ) {
			$jy = $y;
			$jm = $m + 1;
		} else {
			$jy = $y - 1;
			$jm = $m + 13;
		}

		$intgr = floor(floor(365.25*$jy) + floor(30.6001*$jm) + $d + 1720995 );

		//check for switch to Gregorian calendar
		$gregcal = 15 + 31*( 10 + 12*1582 );
		if( $d + 31*($m + 12*$y) >= $gregcal ) {
			$ja = floor(0.01*$jy);
			$intgr += 2 - $ja + floor(0.25*$ja);
		}

		//correct for half-day offset
		$dayfrac = $h/24.0 - 0.5;
		if( $dayfrac < 0.0 ) {
			$dayfrac += 1.0;
			$intgr--;
		}

		//now set the fraction of a day
		$frac = $dayfrac + ($mn + $s/60.0)/60.0/24.0;

		//round to nearest second
		$jd0 = ($intgr + $frac)*100000;
		$jd  = floor($jd0);
		if( $jd0 - $jd > 0.5 ) $jd++;
		return $jd/100000;
	}

	function unify_timestamp ($timestamp)
	{
		$timestamp = preg_replace('/[^0-9]/','',$timestamp);
		$timestamp = preg_replace('/^0{'.strlen($timestamp).'}/',$timestamp,'00000000000000');
		return $timestamp;
	}

	function add_0 ($zahl)
	{
		return (strlen($zahl)==1) ? '0'.$zahl : $zahl;
	}

	function make_timestamp ($jahr,$monat,$tag,$stunde='00',$minute='00',$sekunde='00')
	{
		 return $jahr.Date::add_0($monat).Date::add_0($tag).Date::add_0($stunde).Date::add_0($minute).Date::add_0($sekunde);
	}
	/**
	 * Extrahiert Jahr aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Jahr
	 *
	 * @author Raimund Meyer
	 */
	function jahr ($timestamp='')
	{
		if (!$timestamp) return date("Y");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 0, 4);
	}

	/**
	 * Extrahiert Monat aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Monat
	 *
	 * @author Raimund Meyer
	 */
	function monat ($timestamp='')
	{
		if (!$timestamp) return date("m");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 4, 2);
	}

	/**
	 * Extrahiert Tag aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Tag
	 *
	 * @author Raimund Meyer
	 */
	function tag ($timestamp='')
	{
		if (!$timestamp) return date("d");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 6, 2);
	}

	/**
	 * Extrahiert Stunde aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Stunde
	 *
	 * @author Raimund Meyer
	 */
	function stunde ($timestamp='')
	{
		if (!$timestamp) return date("H");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 8, 2);
	}

	/**
	 * Extrahiert Minute aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Minute
	 *
	 * @author Raimund Meyer
	 */
	function minute ($timestamp='')
	{
		if (!$timestamp) return date("i");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 10, 2);
	}

	/**
	 * Extrahiert Sekunde aus SQL-Timestamp
	 *
	 * @param integer $timestamp
	 * @return string Minute
	 *
	 * @author Raimund Meyer
	 */
	function sekunde ($timestamp='')
	{
		if (!$timestamp) return date("s");
		$timestamp = Date::unify_timestamp($timestamp);
		return substr($timestamp, 10, 2);
	}


	function timestamp2datum($t,$art = '')
	{
		$t = Date::timestamp2unix($t);

		$tage_lang = array('Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag');
		$tage_kurz = array('So','Mo','Di','Mi','Do','Fr','Sa');
		if ( $art == 'tag_kurz' )
		{
			$return = $tage_kurz[date("w",$t)] . ', ' . date("d.m.Y",$t);
			$return .= (intval(date("Hi",$t)) !=0) ?' ' . date("H:i",$t) :'';
			return $return;
		}
		else if ( $art == 'tag_lang' )
		{
			$return = $tage_lang[date("w",$t)] . ', ' . date("d.m.Y",$t);
			$return .= (intval(date("Hi",$t)) !=0) ?' um ' . date("H:i",$t) . ' Uhr':'';
			return $return;
		}
		else if ($art == 'Array')
		{
			$array[0] = date("d.m.Y",$t);
			$array[1] = date("H:i",$t);
			$array[2] =  $tage_kurz[date("w",$t)];
			$array[3] =  $tage_lang[date("w",$t)];

			return $array;
		}
		else if ( $art == '' || $art == 'kein_tag' )
		{
			$return = date("d.m.Y",$t);
			$return .= (intval(date("Hi",$t)) !=0) ?' ' . date("H:i",$t) :'';
			return $return;
		}
	}
	/**
	 * Erzeugt aus einem Unix-Timestamp eine Datumsanzeige; Entweder mit kurzen, langen oder ohne Tagnamen
	 *
	 * @param integer $t Timestamp
	 * @param string  $art 'tag_kurz' | 'tag_lang | ''
	 * @return string
	 */
	function unix2datum($t,$art='')
	{
		$tage_lang = array('Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag');
		$tage_kurz = array('So','Mo','Di','Mi','Do','Fr','Sa');
		$monate_lang = array(	1=>"Januar", 2=>"Februar", 3=>"M&auml;rz", 4=>"April", 5=>"Mai",  6=>"Juni",
	                  			7=>"Juli", 8=>"August", 9=>"September", 10=>"Oktober", 11=>"November",12=>"Dezember");

		$monat = date("n",$t);
		if ( $art == 'tag_kurz' )
		{
			return $tage_kurz[date("w",$t)] . ', ' . date("j.m.Y",$t) . ', ' . date("H:i",$t) ;
		}
		else if ( $art == 'tag_lang' )
		{
			return $tage_lang[date("w",$t)] . ', ' . date("j", $t) . '.' . $monate_lang[$monat] . ' ' . date("Y",$t) . ', ' . date("H.i",$t) . ' Uhr';
		}
		else
		{

			return date("d.m.Y",$t) . ' ' . date("H.i",$t) ;
		}
	}


	function now($format='timestamp')
	{
		switch ($format)
		{
			case 'timestamp':
				return date("YmdHis");
			break;
		}
	}
	function add ($timestamp,$interval,$value)
	{
		$tag = Date::tag($timestamp);
		$monat = Date::monat($timestamp); //Monat
		$jahr = Date::jahr($timestamp); //Jahr
		$stunde = Date::stunde($timestamp); //Stunde
		$minute = Date::minute($timestamp); //Minute
		$sekunde = Date::sekunde($timestamp); //Sekunde

		switch ($interval)
		{
			case 'day':
				$tag += $value;
			break;
			case 'month':
				$monat += $value;
			break;
			case 'year':
				$jahr += $value;
			break;
			case 'hour':
				$stunde += $value;
			break;
			case 'minute':
				$minute += $value;
			break;
			case 'second':
				$sekunde += $value;
			break;

		}
		return Date::unix2timestamp(mktime($stunde,$minute,$sekunde,$monat,$tag,$jahr));
	}
}

?>