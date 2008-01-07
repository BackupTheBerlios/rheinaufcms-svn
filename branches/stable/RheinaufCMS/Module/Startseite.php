<?php
class Startseite extends RheinaufCMS
{
	function Startseite()
	{
		if (!$this->connection) $this->connection = new RheinaufDB();
		$this->title = 'Rheinauf.de';
	}
	function show()
	{
		$content = '<div style="width:230px;float:left;text-align:justify;margin-right:20px">';
		$content .= $this->get_file('content/Startseite/index/content.php');
		$content .= '</div>';
		return $content.$this->aktuell().$this->tipp();
	}
	
	function aktuell()
	{
		$return = $this->connection->db_assoc("SELECT * FROM `aktuell` WHERE `show` = 1 ORDER BY `datum` DESC");
		$return_string;
		foreach ($return as $eintrag)
		{
			$return_string .= '<div class="aktuell_box">
					<div class="aktuell_box_ueber" >
						Aktuell <span class="klein">'.$this->aktuell_date($eintrag['datum']).'</span>
					</div>
					<div class="aktuell_box_inhalt">'.$eintrag['text'].'
					</div>
				</div>';
		}
		return $return_string;
		
	}
	function aktuell_date ($timestamp)
	{
		$tag = substr($timestamp, 6, 2); //Tag
		$monat = substr($timestamp, 4, 2); //Monat
		$jahr = substr($timestamp, 0, 4); //Jahr
		
		return $jahr.'-'.$monat.'-'.$tag;
	}
	
	function tipp()
	{
		$array = $this->connection->db_assoc("SELECT * FROM `programm` WHERE `wann` >= NOW()");
				
		array_pop($array);
		$rand = array_rand($array);
		return ' <div class="aktuell_box">
						<div class="aktuell_box_ueber" >
							Der Tipp
						</div>
						<div class="aktuell_box_inhalt"><h2>'.$array[$rand]['wer_ueber'].'</h2>
						<p style="text-align:center">'.$this->im_tag ('content/Programm/'.$array[$rand]['bild'],'',210).'</p>
						<p>'.$array[$rand]['wer_text'].'</p>
						<p style="text-align:center">'.$this->im_tag ('content/Programm/'.$array[$rand]['cafe_logo'],'',210).'</p>
						<p><strong>'.$this->timestamp_mysql2datum($array[$rand]['wann'],'tag_kurz').'</strong></p>
						</div>
					</div>';

	}

}
?>