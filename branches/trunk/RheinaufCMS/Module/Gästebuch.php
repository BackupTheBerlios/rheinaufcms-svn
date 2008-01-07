<?php
class Gästebuch extends RheinaufCMS 
{
	var $banned_names = array();
	var $admin;
		
	function Gästebuch($db_connection='',$path_information='',$admin = false)
	{
		$this->admin = $admin;
		$this->connection = $db_connection;
		//$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();
		
		$banned_names = $this->connection->db_query("SELECT * FROM `RheinaufCMS>Gästebuch>banned`");
		while ($row = $this->connection->db_fetch_assoc($banned_names))
		{
			$this->banned_names[] = $row['name'];
		}
		$this->event_listen();
	}
	
	function event_listen()
	{
		if (isset($_GET['seite'])) $this->gb_seite = $_GET['seite'];
		if (isset($_POST['gb_submit'])) $this->gb_input();
		if (isset($_GET['delete']) && $this->check_right('GästebuchEdit'))
		{
			$this->gb_delete();
		}
		if (isset($_GET['ban']) && $this->check_right('GästebuchEdit'))
		{
			$this->gb_ban();
		}
	}
	function show()
	{
		$this->template = new Template(DOCUMENT_ROOT.INSTALL_PATH.'/Module/Gästebuch/Gästebuch.parts.template.html');
		$this->last_id = $this->last_id();
		
		$return_string = '';
		$vars = array();
		
		
		if (isset($this->gb_seite)) 
		{
			$where = "WHERE `id` <= $this->gb_seite";
		}
		else 
		{
			$where = '';
		}
		
		$eintraege = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Gästebuch` $where ORDER BY `id` DESC LIMIT 0,10");
						
		if ($next = $this->next_page())
		{
			$vars['next_page'] = '<a href="?seite='.$next.'#eintraege">Nächste Seite</a>';
		}
		else $vars['next_page'] = '';
		if ($prev = $this->prev_page())
		{
			$vars['prev_page'] = '<a href="?seite='.$prev.'#eintraege">Vorige Seite</a>';
		}
		else $vars['prev_page'] = '';
		
		if (isset($_GET['neu'])) $vars['eintragen'] = $this->template->parse_template('EINTRAGEN',$vars);
		
				
		$return_string .= $this->template->parse_template('HEADER',$vars);
	
		$eintrag_vars = array();		
		for ($i=0;$i<count($eintraege);$i++)
		{
			$eintrag_vars['id'] = $eintraege[$i]['id'];
			$eintrag_vars['name'] = General::output_clean($eintraege[$i]['name']);
			$eintrag_tmp['email_und_url'] = array();
			$eintrag_vars['email_und_url'] = '';
			$email_und_url = false;
			if( $eintraege[$i]['email'])
			{
				$eintrag_tmp['email_und_url']['email'] = Html::a('mailto:'.$eintraege[$i]['email'],'E-Mail');
				$email_und_url = true;
			}
			if( $eintraege[$i]['url'])   
			{
				$eintrag_tmp['email_und_url']['url'] = Html::a($eintraege[$i]['url'],'Homepage');
				$email_und_url = true;
			}
			if ($email_und_url)
			{
				$eintrag_vars['email_und_url'] = Html::span(implode(' | ',$eintrag_tmp['email_und_url']),array('class'=>'klein'));
			}
			$eintrag_vars['beitrag'] = General::output_clean($eintraege[$i]['beitrag']);
			$date = Date::timestamp2datum($eintraege[$i]['datum'],'Array');
			$eintrag_vars['eintragdatum'] = $date [0] .' um ' . $date[1] . ' Uhr';
			if ($this->check_right('GästebuchEdit'))
			{
				$eintrag_vars['admin_elemente']= '<p><a href="?delete='.$eintraege[$i]['id'].'" onclick="return confirm(\'Eintrag '.$eintraege[$i]['id'].' von '.$eintraege[$i]['name'].' löschen?\')">Löschen</a>&nbsp;|&nbsp;'; 
				$eintrag_vars['admin_elemente'].= '<a href="?delete='.$eintraege[$i]['id'].'&amp;ban='.rawurlencode($eintraege[$i]['name']).'" onclick="return confirm(\'Eintrag '.$eintraege[$i]['id'].' löschen und Einträge von '.$eintraege[$i]['name'].' zukünftig unterdrücken?\')">Löschen und Namen verbieten</a>'; 
				$eintrag_vars['admin_elemente'] .= '</p>';
			}
			
			$return_string .= $this->template->parse_template('EINTRÄGE',$eintrag_vars);
		}
		
		$vars['seiten'] = $this->pages();
		
		$return_string .= $this->template->parse_template('FOOTER',$vars);
		
		return $return_string;
		
	}
	
	function install()
	{
		$this->connection->db_query("CREATE TABLE `RheinaufCMS>Gästebuch` (
									  `id` int(11) NOT NULL auto_increment,
									  `name` TEXT default NULL,
									  `email` TEXT default NULL,
									  `datum` TIMESTAMP default NULL,
									  `url` TEXT default NULL,
									  `beitrag` longtext,
									  PRIMARY KEY  (`id`)
									) TYPE=MyISAM");
		$this->connection->db_query("INSERT INTO `RheinaufCMS>Rechte` ( `id` , `Frontend_Backend` , `ModulName` , `RechtName` )
									VALUES ('GästebuchEdit', 'Backend', 'GästebuchAdmin', 'Gästebucheinträge bearbeiten')");
		
		$this->connection->db_query("CREATE TABLE `RheinaufCMS>Gästebuch>banned` (`name` TEXT NOT NULL)");
	
		Module::admin_install('GästebuchAdmin',true);
	}
	
	function last_id ()
	{
		$result = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Gästebuch` ORDER BY `id` DESC LIMIT 0,1");
		return $result[0]['id'];
	}
	
	function next_page ()
	{
		if (isset($this->gb_seite) && ($this->gb_seite-10 <=$this->first_id )) return false;
		if (isset($this->gb_seite)) return $this->gb_seite-10;
		else if ($this->last_id() -10 > 0) return $this->last_id -10;
		else return false;
	}
	function prev_page ()
	{
		if (!isset($this->gb_seite) || isset($this->gb_seite) && $this->gb_seite == $this->last_id) return false;
		if (isset($this->gb_seite)) return $this->gb_seite+10;
		else $this->last_id +10;
	}
	function pages()
	{
		$last_id = $this->last_id;
		$rows = $this->connection->db_num_rows("SELECT * FROM `RheinaufCMS>Gästebuch`");
		$this->first_id = $this->last_id-$rows;
		$return_string = '';
		for ($i = $last_id;$i>=$this->first_id;$i=$i-10)
		{
			if ($i == $this->gb_seite)
			{
				$return_string .= $i.' ';
			}
			else 
			{
				$return_string .= '<a href="/G%E4stebuch/?seite='.$i.'">'.$i.'</a> '."\n";
			}
		}
		return $return_string. ' ';
	}
	/*
	function neu_im_gb()
	{
		$daten = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Gästebuch` ORDER BY `id` DESC LIMIT 1");
		$daten = $daten[0];
		$wann = $this->gb_date2date($daten['datum']);
		$was = $this->clip_words($daten['beitrag'], 70);
		$was = $was['return'];
		$wer = $this->clip_words($daten['name'], 14);
		if ($wer['clipped']) { $punkte = '...'; }
		$wer = $wer['return'];
		
		$now = $this->timestamp_mysql2unix(date("YmdHi").'00');
		$last_date = $this->timestamp_mysql2unix($this->last_date($daten['datum']).'00');
		$vor = $this->intervall($now-$last_date);
		
		$return = '<span class="klein">Neu im Gästebuch&nbsp;</span><br />
					<span class="gross"><strong>$wer$punkte</strong></span>&nbsp; <span class="klein">schrieb &nbsp;$vor <br /></span>
					<span class="klein">$was <a href="$homepath/G%E4stebuch/#eintraege">...mehr</a></span>';
		
		$return = addslashes($return);
		eval("\$return=\"$return\";\n");		
		return $return;
	}*/
	
		function last_date($gb_string) 
	{
		$jahr = substr($gb_string, 0, 4); //Jahr
		$monat = substr($gb_string, 5, 2); //Monat
		$tag = substr($gb_string, 8, 2); //Tag
		$stunde = substr($gb_string, 11, 2); //Stunde
		$minute = substr($gb_string, 14, 2); //Minute
		
		return $jahr.$monat.$tag.$stunde.$minute;
	}
	
	function intervall($sek)
	{
	    		
		if ($sek > 86400)
		{			
			$i = sprintf('vor %d Tag%s, %d Stunde%s,'.
			' und %d Minute%s',
			$sek / 86400,
			floor($sek / 86400) != 1 ? 'en':'',
			$sek / 3600 % 24,
			floor($sek / 3600 % 24) != 1 ? 'n':'',
			$sek / 60 % 60,
			floor($sek / 60 % 60) != 1 ? 'n':''
			);
		}
		else if ($sek > 3600)
		{			
			$i = sprintf('vor %d Stunde%s,'.
			' und %d Minute%s',
			$sek / 3600 % 24,
			floor($sek / 3600 % 24) != 1 ? 'n':'',
			$sek / 60 % 60,
			floor($sek / 60 % 60) != 1 ? 'n':''
			);
		}
		else if ($sek > 60)
		{			
			$i = sprintf('vor %d Minute%s',
			$sek / 60 % 60,
			floor($sek / 60 % 60) != 1 ? 'n':''
			);
		}
		else $i = 'vor '.$sek . ' Sekunden';
	    return $i;
	}
	
	
	function gb_input()
	{
		$name = General::input_clean($_POST['x1']);
		$email = General::input_clean($_POST['email']);
		$url = General::input_clean($_POST['url']);
		if(!$name) return;
		if (!preg_match('#^http://.+#',$url) && $url != '') $url = 'http://'.$url;
		$beitrag = General::input_clean($_POST['beitrag']);

		$this->connection->db_query("INSERT INTO `RheinaufCMS>Gästebuch` ( `id` , `name` , `datum`,`email` , `url`, `beitrag` )
												VALUES ('', '$name', NOW(),'$email', '$url', '$beitrag')");
		$_SESSION['last_id']['id'] = $this->connection->db_last_insert_id();
		$_SESSION['last_id']['timestamp'] = time();
	}
	
	function gb_delete()
	{
		$id = $_GET['delete'];
		$this->connection->db_query("DELETE FROM `RheinaufCMS>Gästebuch` WHERE `id` = '$id'");
	
		$result = $this->connection->db_assoc("SELECT * FROM `RheinaufCMS>Gästebuch` WHERE  `id` > '$id' ORDER BY `id` ASC");
	
		
		if (count($result) > 0)
		{
			for ($i=0;$i<count($result);$i++)
			{
				$alt_id = $result[$i]['id'];
				$neu_id = $alt_id-1;
				$this->connection->db_query("UPDATE `RheinaufCMS>Gästebuch` SET `id` = '$neu_id' WHERE `id` = '$alt_id' LIMIT 1");
				
				$last_id = $alt_id;
			}
		}
		else $last_id = $id;
		
		$this->connection->db_query("ALTER TABLE `RheinaufCMS>Gästebuch` AUTO_INCREMENT = $last_id");
	}
	
	function gb_ban()
	{
		$name = rawurldecode($_GET['ban']);
		$id = $_GET['id'];
		
		$sql = "INSERT INTO `RheinaufCMS>Gästebuch>banned` ( `name` )VALUES ('$name')";
		$this->connection->db_query($sql);
		
	}
}
?>