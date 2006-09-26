<?php 
class RheinaufCMS_Install
{
	var $project_name;
	var $db_server;
	var $db_name;
	var $db_user;
	var $db_pass;
	var $ftp_server;
	var $ftp_user;
	var $ftp_pass;
	var $main_user;
	var $mail;
	var $main_pass;
	var $install_path;
	var $connection;
	
	function RheinaufCMS_Install ()
	{
		if (isset($_POST['install_submit'])) $this->install();
		else $this->form();
	}
	
	function db_connect ()
	{
		$this->connection = mysql_connect($this->db_server,$this->db_user,$this->db_pass);
		mysql_select_db($this->db_name,$this->connection);
		if ($this->connection) return true;
	}
	
	function db_query ($sql)
	{
		$result = mysql_query($sql,$this->connection) or print mysql_error();
		return $result;
	}
	
	function ftp ($ftp_befehl)
	{
		$conn_id = ftp_connect($this->ftp_server); 
	
		$ftp_login = ftp_login($conn_id, $this->ftp_user, $this->ftp_pass); 
		if (!$ftp_login) 
		{
			print 'Abbruch: Konnte nicht zum FTP-Server verbinden.';
			ftp_quit($conn_id);
			return;
		}
		eval($ftp_befehl);
		
		ftp_quit($conn_id); 
	}
	
	function install ()
	{
		preg_match('#/(.*?)/install.php#',$_SERVER['PHP_SELF'],$match);
		$this->install_path = $match[1];
		
		$this->project_name = $_POST['project_name'];
		
		$this->db_server = $_POST['db_server'];
		$this->db_name = $_POST['db_name'];
		$this->db_user = $_POST['db_user'];
		$this->db_pass = $_POST['db_pass'];
		$this->ftp_server = $_POST['ftp_server'];
		$this->ftp_user = $_POST['ftp_user'];
		$this->ftp_pass = $_POST['ftp_pass'];
		
		$this->main_user = $_POST['main_user'];
		$this->mail = $_POST['main_user_mail'];
		$this->main_pass = $_POST['main_pass'];
		
		if (!$this->db_connect()) print 'Fehler! Kann nicht mit der Datenbank verbinden.';
		$this->write_index();
		$this->write_htaccess();
		//$this->create_content_path();
		$this->create_admin_module_table();
		$this->create_module_table();
		$this->create_navi_table();
		$this->create_groups_table();
		$this->create_user_table();
		
	
	}
	
	function write_index ()
	{
		$this->ftp("ftp_site(\$conn_id,'CHMOD 0777 /');");
		if (is_file($_SERVER['DOCUMENT_ROOT'].'/index.php')) 
		{
			chmod($_SERVER['DOCUMENT_ROOT'].'/index.php',0777);
			$this->ftp("ftp_site(\$conn_id,'CHMOD 0777 /index.php');");
		}
		$ini ='<?php'."\n".'#RheinaufCMS Konstanten'."\n";
		$ini .= "define('PROJECT_NAME','$this->project_name');\n";
		$ini .= "define('INSTALL_PATH','$this->install_path');\n";
		$ini .="\n#Database\n";
		$ini .= "define('DB_SERVER','$this->db_server');\n";
		$ini .= "define('DB_NAME','$this->db_name');\n";
		$ini .= "define('DB_USER','$this->db_user');\n";
		$ini .= "define('DB_PASS','$this->db_pass');\n";
		$ini .="\n#FTP\n";
		$ini .= "define('FTP_SERVER','$this->ftp_server');\n";
		$ini .= "define('FTP_USER','$this->ftp_user');\n";
		$ini .= "define('FTP_PASS','$this->ftp_pass');\n";
		
		$ini .="\n#Initialition des Systems\n";
		$main_class = $this->install_path.'/Classes/RheinaufCMS.php';
		$ini .="include('$main_class');\n";
		$ini .='$RheinaufCMS = new RheinaufCMS();'."\n";
		$ini .= '?>';
		$index = $_SERVER['DOCUMENT_ROOT'].'/index.php';
		if ($this->write_file($index,$ini))
			print 'Indexdatei ('.$_SERVER['SERVER_NAME'].'/index.php) geschrieben.<br />';
		else print 'Fehler! Indexdatei nicht geschrieben.<br />';
		@chmod($index,0777);
	}
	
	function write_htaccess()
	{
		@$this->ftp("ftp_site(\$conn_id,'CHMOD 0777 /');");
		@$this->ftp("ftp_site(\$conn_id,'CHMOD 0777 /.htaccess');");
		
		$htaccess ="RewriteEngine On\n";
		$htaccess .="RewriteBase /\n";

		$htaccess .='RewriteRule .jpg$ - [L]'."\n";
		$htaccess .='RewriteRule .gif$ - [L]'."\n";
		$htaccess .='RewriteRule .png$ - [L]'."\n";
		$htaccess .='RewriteRule .css$ - [L]'."\n";
		$htaccess .='RewriteRule .js$ - [L]'."\n";

		$htaccess .='#--REWRITE_RULES--#'."\n";
		$htaccess .='RewriteRule .*Admin.* index.php [L]'."\n";
		$htaccess .='#--/REWRITE_RULES--#';
		
		if ($this->write_file($_SERVER['DOCUMENT_ROOT'].'/.htaccess',$htaccess)) 
		{
			print 'Server-Konfigurationsdatei geschrieben<br />';
		}
		else print 'Fehler! Server-Konfigurationsdatei nicht geschrieben.<br />';
		$this->ftp("ftp_site(\$conn_id,'CHMOD 0755 /');");
	}
	function create_content_path()
	{
		if (!is_dir($_SERVER['DOCUMENT_ROOT'].'/'.$this->install_path.'/Content')) $this->ftp("ftp_mkdir(\$conn_id,\$this->install_path.'/Content');");
		$this->ftp("ftp_site(\$conn_id,\"CHMOD 0777 \$this->install_path/Content\");");
	}
	
	function create_navi_table()
	{
		$sql = "CREATE TABLE `RheinaufCMS>Navi` (
		  `id` int(11) NOT NULL,
		  `Rubrik` text,
		  `Subnavi` text NOT NULL,
		  `show` tinyint(1) NOT NULL default '1',
		  PRIMARY KEY  (`id`)
		) TYPE=MyISAM";
		if ($this->db_query($sql)) print 'Tabelle Navigation erstellt<br />';
		else print 'Fehler: Tabelle Navigation nicht erstellt<br />';
	}
	
	function create_module_table()
	{
		$sql = "CREATE TABLE `RheinaufCMS>Module` (
				  `id` int(11) NOT NULL default '0',
				  `Name` text NOT NULL,
				  `Gruppen` text NOT NULL
				) TYPE=MyISAM";
			
		if ($this->db_query($sql)) print 'Tabelle Module erstellt<br />';
		else print 'Fehler: Tabelle Module nicht erstellt<br />';
		
		$this->db_query("INSERT INTO `RheinaufCMS>Module` ( `id` , `Name` , `Gruppen` )
							VALUES ('0', 'Admin', 'a:1:{i:0;s:5:\"Verwalter\";}')");
	}
	
	function create_user_table ()
	{
		$sql = "CREATE TABLE `RheinaufCMS>User` (
				  `ID` int(11) NOT NULL auto_increment,
				  `Name` text NOT NULL,
				  `E-Mail` text NOT NULL,
				  `Password` text NOT NULL,
				  `Group` text NOT NULL,
				  PRIMARY KEY  (`ID`)
				) TYPE=MyISAM";
		
		$this->db_query($sql);
		
		$sql = "INSERT INTO `RheinaufCMS>User` VALUES ('', '$this->main_user','$this->mail','$this->main_pass', 'Verwalter')";
		
		if ($this->db_query($sql)) print 'Tabelle Benutzer erstellt und Stammbenutzer eingetragen.<br /><br />
											<strong>Herzlichen Glückwunsch! Sie können sich jetzt unter '.$_SERVER['SERVER_NAME'].'/Admin einloggen!</strong><br />';
		else print 'Fehler: Tabelle Benutzer nicht erstellt<br />';
	}
	
	function create_groups_table ()
	{
		$sql = "CREATE TABLE `RheinaufCMS>Groups` (
				  `ID` int(11) NOT NULL auto_increment,
				  `Name` text NOT NULL,
				  PRIMARY KEY  (`ID`)
				) TYPE=MyISAM";
		
		$this->db_query($sql);
		
		$sql = "INSERT INTO `RheinaufCMS>Groups` VALUES ('', 'Verwalter')";
		
		if ($this->db_query($sql)) print 'Tabelle Gruppen erstellt und Gruppe Admin angelegt.<br />';
		else print 'Fehler: Tabelle Gruppen nicht erstellt<br />';
	}
	
	function create_admin_module_table ()
	{
		$sql = "CREATE TABLE `RheinaufCMS>Admin>Module` (
				  `ID` int(11) NOT NULL default '0',
				  `Name` text NOT NULL,
				  `LongName` text NOT NULL,
				  `Gruppen` text NOT NULL,
				  `Icon` text NOT NULL
				) TYPE=MyISAM
				";
		
		if ($this->db_query($sql)) print 'Tabelle Verwaltungs-Module erstellt<br />';
		else print 'Fehler: Tabelle  Verwaltungs-Module nicht erstellt<br />';
		
		$sql = "INSERT INTO `RheinaufCMS>Admin>Module` VALUES (0, 'Seite', 'Seiten bearbeiten', 'a:1:{i:0;s:9:\"Verwalter\";}','Classes/Admin/Icons/32x32/filenew.png')";
		$this->db_query($sql);
		
		$sql = "INSERT INTO `RheinaufCMS>Admin>Module` VALUES (0, 'User', 'User registrieren', 'a:1:{i:0;s:9:\"Verwalter\";}','Classes/Admin/Icons/32x32/edit_user.png')";
		$this->db_query($sql);
		
		$sql = "INSERT INTO `RheinaufCMS>Admin>Module` VALUES (0, 'Module', 'Module', 'a:1:{i:0;s:9:\"Verwalter\";}','Classes/Admin/Icons/32x32/connect_no.png')";
		$this->db_query($sql);
		
		$sql = "INSERT INTO `RheinaufCMS>Admin>Module` VALUES (0, 'NaviEdit', 'Navigation bearbeiten', 'a:1:{i:0;s:9:\"Verwalter\";}','Classes/Admin/Icons/32x32/folder_new.png')";
		$this->db_query($sql);
	}
	
	function write_file($filename,$text) 
	{
		$file = fopen($filename,"wb");
		$fwrite = fwrite ($file, $text);
		fclose($file);
		return $fwrite;
	}
	function form()
	{
		print '
		    <form action="install.php" method="post">
      <table>

        <tr>
          <td>
            Projektname
          </td>
          <td>
            <input type="text" name="project_name" />
          </td>
        </tr>
        <tr>

          <td colspan="2">
            <strong>Datenbank</strong>
          </td>
        </tr>
        <tr>
          <td>
            Datenbankserver
          </td>
          <td>

            <input type="text" name="db_server" />
          </td>
        </tr>
        <tr>
          <td>
            Datenbankname
          </td>
          <td>
            <input type="text" name="db_name" />

          </td>
        </tr>
        <tr>
          <td>
            Datenbankbenutzer
          </td>
          <td>
            <input type="text" name="db_user" />
          </td>

        </tr>
        <tr>
          <td>
            Datenbankkennwort
          </td>
          <td>
            <input type="text" name="db_pass" />
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <strong>FTP</strong>
          </td>
        </tr>
        <tr>
          <td>
            FTP-Server
          </td>

          <td>
            <input type="text" name="ftp_server" />
          </td>
        </tr>
        <tr>
          <td>
            Benutzername
          </td>
          <td>

            <input type="text" name="ftp_user" />
          </td>
        </tr>
        
        <tr>
          <td>
            Kennwort
          </td>
          <td>
            <input type="text" name="ftp_pass" />

          </td>
        </tr>
        <tr>
          <td colspan="2">
            <strong>Sonstiges</strong>
          </td>
        </tr>
        <tr>

          <td>
            Stammnutzer
          </td>
          <td>
            Login 
            <input type="text" name="main_user" /> 
            E-Mail-Adresse
            <input type="text" name="main_user_mail" /> 
            Passwort
            <input type="text" name="main_pass" /> 
          </td>
        </tr>
        <tr>

          <td colspan="2">
            <input type="submit" name="install_submit" value="    Installieren    " />
          </td>
        </tr>
      </table>
    </form>';
	
	}
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
    <title>RheinaufCMS Instalation</title>
    <style type="text/css">
body {
background-color:rgb(214, 223, 231);
padding:25px;
font-family: sans-serif;
font-size: 0.8em;
}
input {
border:1px solid gray;
}
</style>
  </head>
  <body>
<?php $install = new RheinaufCMS_Install(); ?>
  </body>
</html>