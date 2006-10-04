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
		$this->ftp_root = $_POST['ftp_root'];
			
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
		
		$config_file = preg_replace("/(define\('PROJECT_NAME',').*?('\))/","$1$this->project_name$2",$config_file);
		$config_file = preg_replace("/(define\('DB_SERVER',').*?('\))/","$1$this->db_server$2",$config_file);
		$config_file = preg_replace("/(define\('DB_NAME',').*?('\))/","$1$this->db_name$2",$config_file);
		$config_file = preg_replace("/(define\('DB_USER',').*?('\))/","$1$this->db_user$2",$config_file);
		$config_file = preg_replace("/(define\('DB_PASS',').*?('\))/","$1$this->db_pass$2",$config_file);
		
		$config_file = preg_replace("/(define\('FTP_SERVER',').*?('\))/","$1$this->ftp_server$2",$config_file);
		$config_file = preg_replace("/(define\('FTP_USER',').*?('\))/","$1$this->ftp_user$2",$config_file);
		$config_file = preg_replace("/(define\('FTP_PASS',').*?('\))/","$1$this->ftp_pass$2",$config_file);
		
		define('USE_FTP',true);
		define('FTP_SERVER',$this->ftp_server);
		define('FTP_USER',$this->ftp_user);
		define('FTP_PASS',$this->ftp_pass);
		define('FTP_ROOTDIR','');
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
	}
	function create_tables()
	{
		include('Config.inc.php');
	
		$sql_file =  RheinaufFile::get_file('tables.sql');

		
		$connection = new RheinaufDB();
		preg_match_all('/.*?[^(]*;/ms',$sql_file,$sql_queries);

		foreach ($sql_queries[0] as $query)
		{
			$query = preg_replace("/(INSERT INTO `RheinaufCMS>User` VALUES \('', '){admin_name}(', '', '){admin_pass}(', '', '', 0, 'Admin'\);)/",
												"$1".$_POST['admin_name']."$2".$_POST['admin_pass']."$3",$query);
			$connection->db_query($query);
		}
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
            <input type="text" name="admin_name" /> 
            Passwort
            <input type="text" name="admin_pass" /> 
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
    <title>RheinaufCMS Installation</title>
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