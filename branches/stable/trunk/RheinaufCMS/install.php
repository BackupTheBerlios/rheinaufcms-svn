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

		include_once('Classes/Date.php');
		include_once('Classes/HTML.php');
		include_once('Classes/Template.php');
		include_once('Classes/RheinaufDB.php');
		include_once('Classes/General.php');
	
		if (isset($_POST['install_submit'])) $this->install();
		else $this->form();
	}

	function install ()
	{
		preg_match('#/(.*?)/install.php#',$_SERVER['PHP_SELF'],$match);
		$this->install_path = $match[1];
		
		$this->project_name = $_POST['project_name'];
		
		
		#Database
		$this->db_server = $_POST['db_server'];
		$this->db_name = $_POST['db_name'];
		$this->db_user = $_POST['db_user'];
		$this->db_pass = $_POST['db_pass'];
			
		#FTP
		$this->ftp_server = $_POST['ftp_server'];
		$this->ftp_user = $_POST['ftp_user'];
		$this->ftp_pass = $_POST['ftp_pass'];
		$this->ftp_root = preg_replace("/\/*$/","",$_POST['ftp_root']).'/';
			
		$this->main_user = $_POST['main_user'];
		$this->mail = $_POST['main_user_mail'];
		$this->main_pass = $_POST['main_pass'];
		
		if ($this->create_config()) print "Konfigurationsdatei geschrieben<br />";
		else
		{
			print "Konfigurationsdatei nicht geschrieben. Installation abgebrochen<br />";
			return;
		}
		$this->create_tables();
		$this->create_content_path();
	}
	
	function create_config ()
	{
		$config_file = file_get_contents('Config.inc.php');
		
		$config_file = preg_replace("/(define\('PROJECT_NAME',').*?('\))/","define('PROJECT_NAME','$this->project_name')",$config_file);
		$config_file = preg_replace("/(define\('DB_SERVER',').*?('\))/","define('DB_SERVER','$this->db_server')",$config_file);
		$config_file = preg_replace("/(define\('DB_NAME',').*?('\))/","define('DB_NAME','$this->db_name')",$config_file);
		$config_file = preg_replace("/(define\('DB_USER',').*?('\))/","define('DB_USER','$this->db_user')",$config_file);
		$config_file = preg_replace("/(define\('DB_PASS',').*?('\))/","define('DB_PASS','$this->db_pass')",$config_file);
		
		$config_file = preg_replace("/(define\('FTP_SERVER',').*?('\))/","define('FTP_SERVER','$this->ftp_server')",$config_file);
		$config_file = preg_replace("/(define\('FTP_USER',').*?('\))/","define('FTP_USER','$this->ftp_user')",$config_file);
		$config_file = preg_replace("/(define\('FTP_PASS',').*?('\))/","define('FTP_PASS','$this->ftp_pass')",$config_file);
		$config_file = preg_replace("/(define\('FTP_ROOTDIR',').*?('\))/","define('FTP_ROOTDIR','$this->ftp_root')",$config_file);
		
		define('USE_FTP',true);
		define('FTP_SERVER',$this->ftp_server);
		define('FTP_USER',$this->ftp_user);
		define('FTP_PASS',$this->ftp_pass);
		define('FTP_ROOTDIR',$this->ftp_root);
		include_once('Classes/RheinaufFile.php');
		$this->docroot = docroot();
		return RheinaufFile::write_file($this->docroot.$this->install_path.'/Config.inc.php',$config_file);
	}
	
	function create_content_path()
	{
		$content_dir = $this->docroot.$this->install_path.'/Content';
		if (!is_dir($content_dir))
		{
			RheinaufFile::mkdir($content_dir);
		}
		if (!is_writable($content_dir))
		{
			RheinaufFile::xchmod($content_dir,'777');
		}
		
		$images_dir = $this->docroot.$this->install_path.'/Images';
		if (!is_dir($images_dir))
		{
			RheinaufFile::mkdir($images_dir);
		}
		if (!is_writable($images_dir))
		{
			RheinaufFile::xchmod($images_dir,'777');
		}
		print 'Schreibrechte gesetzt<br />';
		
		print 'Weiter zum <a href="/Admin">Login</a>';
	}
	function create_tables()
	{
		include('Config.inc.php');
	
		$sql_file =  RheinaufFile::get_file('tables.sql');

		
		$connection = new RheinaufDB();
		$connection->debug = false;
		
		preg_match_all('/.*?[^(]*;',$sql_file,$sql_queries);

		foreach ($sql_queries[0] as $query)
		{
			$query = preg_replace("/(INSERT INTO `RheinaufCMS>User` VALUES \('', '){admin_name}(', '', '){admin_pass}(', '', '', 0, 'Admin'\);)/",
												"$1".$_POST['admin_name']."$2".$_POST['admin_pass']."$3",$query);
			
			if (!$connection->db_query($query))
			{
				print 'Fehler beim Datenbankzugriff. Installation abgebrochen<br />';
				return;
			}
		}
		print  'Tabellen geschrieben<br />';
	}

	
	function form()
	{
		print '
		<h1>Installation RheinaufCMS</h1>
		<p>Die Installation legt automatisch die nötigen Datenbankstrukturen an, setzt Zugriffsrechte für Verzeichnisse und schreibt die Zugangsdaten in die Konfigurationsdatei.</p>
		<p>bitte tragen sie die folgenden Angaben ein</p>
		    <form action="install.php" method="post">
      <table>

        <tr>
          <td>
            Projektname
          </td>
          <td>
            <input type="text" name="project_name" />
          </td>
		  <td class="advice">
		  Geben Sie hier einen Namen für das Projekt an. Dieser Name wird intern verwendet, und erscheint beispielsweise auch im Stantardtemplate als Title der HTML-Seiten.
		  </td>
        </tr>
        <tr>

          <td colspan="3">
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
		  <td class="advice">z.B. \'localhost\', oder \'mysql4.domain.xy\' (meist vom Provider vergeben)
		  </td>
        </tr>
        <tr>
          <td>
            Datenbankname
          </td>
          <td>
            <input type="text" name="db_name" />
          </td>
		  <td class="advice">Name der Datenbank, z.B \'db1234\'. (oft vom Provider vergeben)
		  </td>
        </tr>
        <tr>
          <td>
            Datenbankbenutzer
          </td>
          <td>
            <input type="text" name="db_user" />
          </td>
		<td class="advice">Benutzername mit dem sich RheinaufCMS an der Datenbank anmelden soll, z.B \'db1234\'. (oft vom Provider vergeben) Bitte Groß- und Kleinschreibung beachten
		  </td>
        </tr>
        <tr>
          <td>
            Datenbankkennwort
          </td>
          <td>
            <input type="text" name="db_pass" />
          </td>
		  <td class="advice">Zum obigen Datenbankbenutzer gehöriges Kennwort. Bitte Groß- und Kleinschreibung beachten (oft vom Provider vergeben)
		  </td>
        </tr>

        <tr>
          <td colspan="3">
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
		  <td class="advice">z.B. ftp.domain.xy (oft vom Provider vergeben)
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
          <td>
            FTP-Pfad zum Webroot
          </td>
          <td>
            <input type="text" name="ftp_root" />
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <strong>Sonstiges</strong>
          </td>
        </tr>
        <tr>

          <td>
            Stammnutzer
          </td>
          <td colspan="2">
            Login 
            <input type="text" name="admin_name" /> 
            Passwort
            <input type="text" name="admin_pass" /> 
          </td>
		  </tr>
		  <tr>
		  <td class="advice" colspan="3">Bitte notieren! Mit diesen Daten loggen Sie sich im nächsten Schritt als Administrator ins RheinaufCMS ein.
		  </td>
        </tr>
        <tr>

          <td colspan="2">
            <input type="submit" name="install_submit" value="    Installieren    " />
          </td>
        </tr>
      </table>
    </form>
	<p>

Nach der Installation wird jeder Aufruf der Domain \'Ihre-Domain.xy\' auf die Startseite des CMS geleitet. Eine eventuell vorhanden index.html wird ignoriert.</p> 

<p>Zur Verwaltung des CMS gelangen Sie über den nach der Installation erscheinenden Link \'weiter zum Login\'.
Direkte Aufrufe sind über \'Ihre-Domain.xy/Admin\' möglich. Unter Angabe der vorher vergebenen Zugangsdaten für den Stammnutzer (Username und Passwort) erhalten Sie Zugriff auf die RheinaufCMS-Kommandozentrale. Hier definieren sie unter anderem die Navigationsstruktur der Site legen Inhalte an.';
	
	}
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
   <meta http-equiv="Content-type" content="text/html; charset=ISO-8859-1" />
    <title>RheinaufCMS Installation</title>
    <style type="text/css">
body {
padding:25px;
font-family: Arial, Helvetica, sans-serif;
	background-color:whitesmoke;
	background-image:url(./Images/admin_logo.png);
	background-repeat:no-repeat;
	background-position:top right;
}

table {
width:800px;
}

p {
width:600px;
}

input {
border:1px solid grey;
}
td.advice {
font-size: 0.8em;
color:grey;
}
</style>
  </head>
  <body>
<?php $install = new RheinaufCMS_Install(); ?>
  </body>
</html>