<?php
class Programm extends RheinaufCMS 
{
	var $monate = array(	1=>"Januar", 2=>"Februar", 3=>"März", 4=>"April", 5=>"Mai",  6=>"Juni",
                  			7=>"Juli", 8=>"August", 9=>"September", 10=>"Oktober", 11=>"November",12=>"Dezember");
	var $this_month;
	var $next_month;
	
	
	function Programm()
	{
		if (!$this->connection) $this->connection = new RheinaufDB();
		if (!$this->homepath) $this->pfad();
		
		$this->this_month = date("n");
		$this->next_month = date("n") +1;
		$this->programm_array = $this->abfrage();
		$this->memo_eintrag();
				
	}
	function show()
	{
		$this->template = $this->get_file('Templates/Programm.template.html');
		preg_match('#<!--MENU-->(.*?)<!--/MENU-->.*?<!--TABLE-->(.*?)<!--/TABLE-->.*?<!--FOOTER-->(.*?)<!--/FOOTER-->#s',$this->template,$matches);
		
		$this->menu_template = addslashes($matches[1]);
		$this->table_template = addslashes($matches[2]);
		$this->footer_template = addslashes($matches[3]);
		
		return $this->menu().$this->programm_table().$this->footer_template;
	}
	
	function startseite()
	{
		$array = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>Termine` WHERE  `DTSTART`>= NOW() AND `X-RHEINAUF-EVENT` = '1' ORDER BY `DTSTART` ASC");
		
		$return_string = '<div id="programm_table_front" > <div id="programm_rechts" > 
  <div id="programm_table_front_kopf">Unser aktuelles Programm</div> 
  <div>';
    	foreach ($array as $row_programm)
		{ 
		$return_string .= '	<div class="wann" style="float:left ">'.Date::timestamp_mysql2datum($row_programm['wann'],'tag_kurz').'
				</div> 
				<div style="text-align:right;font-variant:small-caps"  class="wann">'.htmlspecialchars($row_programm['was']).'
				</div>
				<div  class="wer"><a href="Programm/?month='.intval(substr($row_programm['wann'], 4, 2)).'#tag_'.intval(substr($row_programm['wann'], 6, 2)).'">
				<strong>'.htmlspecialchars($row_programm['wer_ueber']).'</strong></a>
				</div>'; 
		$last = $row_programm['wann'];
		
		}
		$last_month = $this->monat($last);
		$last_day = $this->tag($last);

		$return_string .= '</div><hr /><a href="'.SELF.'?month='.$last_month.'#tag_'.$last_day.'" class="klein">...mehr</a></div></div>';
		return $return_string;
	
	}
	
	function menu ()
	{
		
		$return_string = '';
		
		$phpself = SELF;
		if ($this_month == 12) 
		{ 	
			$dieser_monat = 'Dezember';
			$naechster_monat = 'Januar';
		}
		else 
		{
			$dieser_monat = $this->monate[$this->this_month];
			$naechster_monat = $this->monate[$this->next_month];
  		}
  		
  		$this->sonder_array = array_unique($this->sonder_array);
		if (count($this->sonder_array) > 0)
		{
			$sonder_string = '';
			$sonder_checked = array();
			foreach ($this->sonder_array as $sonder)
			{	
				if (strstr($this->search,$sonder)) $sonder_checked[$sonder] = 'checked="checked"';
				else $sonder_checked[$sonder] = '';
				$sonder_string .= '<td> <input name="ansicht[]" type="checkbox" value="%'.$sonder.'%"  '.$sonder_checked[$sonder].' onclick="no_event(document.getElementById(\'event_selection\'))" /> 
    		<strong>'.$sonder.'</strong>  &nbsp; </td>';
			}
		}
		$event_checked = $this->checked ('event');
		$party_checked = $this->checked ('party');
		$konzert_checked = $this->checked ('konzert');
		$cafe_checked = $this->checked ('caf');
		$selbstverwaltung_checked = $this->checked ('selbstverwaltung');
		$radio_checked = $this->checked ('radio');
		
		$return = $this->menu_template;
		eval("\$return=\"$return\";\n");
		return  $return;
	}
	
	function programm_table()
	{
		$return_string ='';
	
		for ($i=1;$i <= date("t");$i++)
		{
			$tage[] = $i;
		}

		for ($i = 0; $i < count ($this->programm_array); $i++)
		{
			$anchors = '';
			
			$tag_der_veranstaltung = Date::tag($this->programm_array[$i]['wann']);
			$link_was = strstr($this->programm_array[$i]['was'],'Radio') ? 'Radiosendung' : urlencode($this->programm_array[$i]['was']);
			$link_stunde = Date::stunde($this->programm_array[$i]['wann']);
			$link_monat = Date::monat($this->programm_array[$i]['wann']);
			$link_jahr = Date::jahr($this->programm_array[$i]['wann']);
			
			while ($tag_der_veranstaltung >= $tage[0] && $tag_der_veranstaltung <  date("t"))
			{
				$anchors .= '<a id="tag_'.$tage[0].'"></a>';
				array_shift($tage);
			}
			$link_veranstaltung = substr($link_was,0,3).'_'.$tag_der_veranstaltung.'_'.$link_stunde;
			$anchors .= '<a id="'.$link_veranstaltung.'"></a>'; 
			$wann = Date::timestamp_mysql2datum($this->programm_array[$i]['wann'],'tag_lang');
			if ($this->programm_array[$i]['kostet'] != '') 
			{
				$kostet = '<br />Eintritt '.$this->programm_array[$i]['kostet'].' &euro;';
			} 
			else if ($this->programm_array[$i]['event'] == '1')
			{
				$kostet = '<br />Eintritt frei';
			}			
  		 	if ($this->programm_array[$i]['cafe_logo'] != '' && $this->programm_array[$i]['bild'] != '') 
	 		{
				$bild_ueber = $this->im_tag_vert('content/Programm/' . $this->programm_array[$i]['cafe_logo'],htmlspecialchars($this->programm_array[$i]['wer_ueber'],40));
			}
	  		$id = $this->programm_array[$i]['id'];
			$ueberschrift = nl2br(htmlspecialchars($this->programm_array[$i]['wer_ueber']));
	  		$was = $this->programm_array[$i]['was'];
			if ($this->programm_array[$i]['cafe_logo'] != '' && $this->programm_array[$i]['bild'] == '') 
 			{
				$bild_seite =  $this->im_tag('content/Programm/' . $this->programm_array[$i]['cafe_logo'],htmlspecialchars($this->programm_array[$i]['wer_ueber']),240);
			}
			else if ($this->programm_array[$i]['bild'] != '') 
			{
				$bild_seite = $this->im_tag('content/Programm/' . $this->programm_array[$i]['bild'],htmlspecialchars($this->programm_array[$i]['wer_ueber']));
			} 
			else $bild_seite = '&nbsp;';
			
			$wer_text =  stripslashes($this->programm_array[$i]['wer_text']);
			
			$return = $this->table_template;
			eval("\$return=\"$return\";\n");
			$return_string .=  $return;
			
		}
		return  $return_string; 		
	
	}
	
	function memo_eintrag()
	{
		if (isset($_REQUEST['memo_submit']))
		{
			if (count($_REQUEST['id']) > 0)
			{
				foreach ($_REQUEST['id'] as $id)
				{
					
					$row_programm = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Kalender>Termine` WHERE `id` = '$id'");
					$row_programm = $row_programm[0];
					$datum = date("Ymd",Date::timestamp_mysql2unix($row_programm['wann']));
					$uhr = date("H:i",Date::timestamp_mysql2unix($row_programm['wann']));
					$wer_ueber = html_entity_decode(strip_tags($row_programm['wer_ueber']));
					$wer_text = strip_tags($row_programm['wer_text']);
					$email = strip_tags($_REQUEST['email']);			
					
					$input_sql = "INSERT INTO `programm_mail` (`id`, `datum`, `uhr`, `wer_ueber`, `wer_text`, `email`,`eingetragen`) 
									VALUES ('', '$datum', '$uhr', '$wer_ueber', '$wer_text', '$email', NOW())";
					$this->connection->db_query($input_sql);
					
				}
			preg_match("#(.*)@#",$email,$match);
			$email = ucfirst($match[1]);
			print '<script type="text/javascript"> alert("Danke '.$email.',\nwir schicken Dir dann einen Tag vorher eine Erinnerungs-Mail.\n\nDein Rheinauf-Team.")</script>';
			}
			
		}
	
	}
		
	function checked ($string)
	{
		if (stristr($this->search,$string)) return 'checked="checked"';
		else return '';
	}
	
	function search()
	{
		if (isset ($_REQUEST['ansicht'])) 
		{
			$ansicht_array = $_REQUEST['ansicht'];
			$imploded = implode("' OR `was` LIKE '", $ansicht_array);
			if ($_REQUEST['event_select'] == '1')
			{
				$ansicht_sql_sring = array ( " AND  ((`X-RHEINAUF-EVENT` = 1) OR (`was` LIKE '" . $imploded . "'))",TRUE);
			}
			else
				$ansicht_sql_sring = array (" AND  (`was` LIKE '" . $imploded . "')",TRUE);
		}
		else if (isset($_GET['showall']))
		{
			$ansicht_sql_sring = array ( "  AND  ((`X-RHEINAUF-EVENT` = 1) OR (`X-RHEINAUF-EVENT` = 0)) ",FALSE);
		}
		else $ansicht_sql_sring = array ( " AND  (`X-RHEINAUF-EVENT` = 1)",FALSE);
		
		
		if (isset ($_GET[month]) )
		{
			if (isset($_GET['year']))
			{
				$month = $_GET['month'];
				$year = $_GET['year'];
				$query_programm = "SELECT *
				FROM `RheinaufCMS>Kalender>Termine`
				WHERE (MONTH( `DTSTART` ) = $month) AND (YEAR( `DTSTART` ) = $year) " . $ansicht_sql_sring[0] . " ORDER BY `DTSTART` ASC";
			}
			else if ($_GET[month] == 13) 
			{ 
				$query_programm = "SELECT  * FROM  `RheinaufCMS>Kalender>Termine` WHERE (  MONTH(`DTSTART`) = 1 AND YEAR(`DTSTART`)  = YEAR( DATE_ADD(CURDATE() ,  INTERVAL 1 YEAR )) )" . $ansicht_sql_sring[0] . " ORDER BY `DTSTART` ASC";
			}
			else 
			{ 
				$query_programm = "SELECT  * FROM  `RheinaufCMS>Kalender>Termine` WHERE (MONTH(`DTSTART`)  = " . $_GET[month] .  
											" AND YEAR(`DTSTART`) = YEAR(CURDATE()) )" . $ansicht_sql_sring[0] . " ORDER BY `DTSTART` ASC";
			}
			if (isset ($_GET['archiv']))
			{
				if ($_GET['month'] != '' && $_GET['year'] != '')
				{
					$month = $_GET['month'];
					$year = $_GET['year'];
					$query_programm = "SELECT *
					FROM `RheinaufCMS>Kalender>Termine`
					WHERE (MONTH( `DTSTART` ) = $month) AND (YEAR( `DTSTART` ) = $year) " . $ansicht_sql_sring[0] . " ORDER BY `DTSTART` ASC";
				}
				else $fehler = 'Bitte Monat und Jahr wählen:&nbsp;';
			}
		}
		else 
		{  
			$query_programm = "SELECT * FROM `RheinaufCMS>Kalender>Termine` WHERE (MONTH( `DTSTART` ) = MONTH( CURDATE( ) ) AND YEAR( `DTSTART` ) = YEAR( CURDATE( ) )) " . $ansicht_sql_sring[0] . " ORDER BY `DTSTART` ASC";
		};
		return $query_programm;
	}
	
	function abfrage ()
	{
		$result = $this->connection->db_query($this->search = $this->search());
		$this->sonder_array = array();
		$programm_array = array();
		
		while($row = $this->connection->db_fetch_assoc($result))
		{
			$this->programm_array[] = $row;
			if ($row['event'] =='1' && !strstr($row['was'],'Konzert') && !strstr($row['was'],'Caf') && !strstr($row['was'],'Party'))
			{
				$this->sonder_array[] = $row['was'];
			}
		}
		return $this->programm_array;
	}
}
?>