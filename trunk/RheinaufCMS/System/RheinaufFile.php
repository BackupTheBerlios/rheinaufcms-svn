<?php
function docroot()
{
	if (preg_match("#/$#",$_SERVER['DOCUMENT_ROOT'])) return $_SERVER['DOCUMENT_ROOT'];
	else return $_SERVER['DOCUMENT_ROOT'].'/';
}
if (!defined('USE_FTP')) @include_once(docroot().'RheinaufCMS/Config.inc.php');
class RheinaufFile
{

	function get_enc($str)
	{
		return (defined('FS_ENCODING') && FS_ENCODING == 'UTF8') ? utf8_encode($str) : $str;	
	}
	#@todo: L�sung f�r UTF Problem
	function is_file($path)
	{
		return is_file(RheinaufFile::get_enc($path));
	}
	function is_dir($path)
	{
		return is_dir(RheinaufFile::get_enc($path));
	}
	
	function get_file($filename)
	{
		return file_get_contents(RheinaufFile::get_enc($filename));
	}

	function write_file($filename,$text,$db_escape=false)
	{
		$text = General::input_clean($text);
		$filename = RheinaufFile::get_enc($filename);
		if (!is_file($filename) && defined('USE_FTP') && USE_FTP === true)
		{
			$filename = str_replace(docroot(),'',$filename);
			$root_dir = FTP_ROOTDIR;
			$tmpname = TMPDIR.'/'.uniqid('RheinaufCMS_tmp_'.basename($filename));

			$file = fopen($tmpname,"wb");
			$fwrite = fwrite ($file, $text);
			fclose($file);
			
			$ftp_filename = $root_dir.$filename; 
			RheinaufFile::ftpcmd("ftp_put(\$conn_id,'$ftp_filename','$tmpname',FTP_BINARY);");
			RheinaufFile::chmod($filename,777);
			
			RheinaufFile::delete($tmpname);
		}
		else
		{
			if (is_file($filename) && !is_writable($filename))
			{
				RheinaufFile::chmod($filename,'0777');
			}
			$file = fopen($filename,"wb");
			$fwrite = fwrite ($file, $text);
			fclose($file);
			if (is_file($filename))
			{
				RheinaufFile::chmod($filename,777);
			}
			return $fwrite;
		}
	}

	function dir_array($dir,$dirs = false,$extension_filter='')
	{
		$dir = RheinaufFile::get_enc($dir);
		$handle=opendir($dir);
		$return_array = array();

		while ($file = readdir ($handle))
		{
			if ($file != "." && $file != ".." && preg_match('#.*?'.$extension_filter.'$#i',$file) && RheinaufFile::is_dir($dir.'/'.$file) == $dirs)
			{
				$return_array[] = $file;
			}
		}
		closedir($handle);
		natcasesort($return_array);
		return $return_array;
	}

	function dir_tree($dir, $durl = '',$include = '', $exclude = '', $dirinclude = '', $direxclude = '')
    {
		static $seen = array();

		$files = array();

		$dir = realpath($dir);
		if(isset($seen[$dir]))
		{
			return $files;
		}
		$seen[$dir] = TRUE;
		$dh = @opendir($dir);


		while($dh && ($file = readdir($dh)))
		{
			if($file !== '.' && $file !== '..')
			{
				$path = realpath($dir . '/' . $file);
				$url  = $durl . '/' . $file;

				if(($dirinclude && !preg_match($dirinclude, $url)) || ($direxclude && preg_match($direxclude, $url))) continue;
				if(RheinaufFile::is_dir($path))
				{
					if($subdir = RheinaufFile::dir_tree($path, $url))
					{
					  $files[] = array('url'=>$url, 'children'=>$subdir);
					}
				}
				elseif(RheinaufFile::is_file($path))
				{
					if(($include && !preg_match($include, $url)) || ($exclude && preg_match($exclude, $url))) continue;
					$files[] = array('url'=>$url);
				}

			}
		}
		@closedir($dh);

		return RheinaufFile::dirsort($files);
    }
	function dirsort($files)
    {
		$dircomp = create_function('$a, $b','if(is_array($a)) $a = $a[0];if(is_array($b)) $b = $b[0];return strcmp(strtolower($a), strtolower($b));');
    	usort($files, $dircomp);
		return $files;
    }

    function dircomp($a, $b)
    {

    }

	function xrmdir ($dir,$remove_first_dir=true)
	{
		$current_dir = opendir($dir);
		while($entryname = readdir($current_dir))
		{
			if(RheinaufFile::is_dir("$dir/$entryname") and ($entryname != "." and $entryname != ".."))
			{
			RheinaufFile::xrmdir("${dir}/${entryname}");
			}
			elseif($entryname != "." and $entryname != "..")
			{
				RheinaufFile::unlink("${dir}/${entryname}");
			}
		}
		closedir($current_dir);
		if ($remove_first_dir) rmdir(${dir});
	}

	function emptydir($dir)
	{
		RheinaufFile::xrmdir($dir,false);
	}

  	function ftpcmd ($ftp_befehl)
	{
		$conn_id = ftp_connect(FTP_SERVER);

		$ftp_login = ftp_login($conn_id, FTP_USER, FTP_PASS);
		if (!$ftp_login)
		{
			print 'Abbruch: Fehler';
			ftp_quit($conn_id);
			return;
		}
		ftp_pasv($conn_id, true);
		eval("\$return=".$ftp_befehl);

		ftp_quit($conn_id);

		return $return;
	}

	function server2ftppath($path)
	{
		if (defined('FTP_ROOTDIR')) $ftp_root = FTP_ROOTDIR;
		return $ftp_root.str_replace(docroot(),'',$path);
	}

	function chmod($file,$mode)
	{
		$file = RheinaufFile::get_enc($file);
		if (defined('USE_FTP') && USE_FTP === true) RheinaufFile::ftpcmd("ftp_site(\$conn_id,\"CHMOD ".'0'.strval($mode)." ".RheinaufFile::server2ftppath($file)."\");");
		else $c= chmod($file,0777);
	}

	function xchmod($dir,$mode)
	{
		RheinaufFile::chmod($dir,$mode);
		$current_dir = opendir($dir);
		while($entryname = readdir($current_dir))
		{
			if(RheinaufFile::is_dir("$dir/$entryname") and ($entryname != "." and $entryname != ".."))
			{
				RheinaufFile::xchmod("${dir}/${entryname}",$mode);
			}
			elseif($entryname != "." and $entryname != "..")
			{
				RheinaufFile::chmod("${dir}/${entryname}",$mode);
			}
		}
		closedir($current_dir);
	}
	
	function mkdir ($dirname)
	{
		$dirname = RheinaufFile::get_enc($dirname);
		if (defined('USE_FTP') && USE_FTP === true) RheinaufFile::ftpcmd("ftp_mkdir(\$conn_id,'".RheinaufFile::server2ftppath($dirname)."');");
		else mkdir($dirname);

	}

	function rename ($old_name,$new_name)
	{
		$old_name = RheinaufFile::get_enc($old_name);
		$new_name = RheinaufFile::get_enc($new_name);
		if (defined('USE_FTP') && USE_FTP === true) RheinaufFile::ftpcmd("ftp_rename(\$conn_id,'".RheinaufFile::server2ftppath($old_name)."','".RheinaufFile::server2ftppath($new_name)."');");
		else rename($old_name,$new_name);
	}

	function delete ($file)
	{
		$file = RheinaufFile::get_enc($file);
		unlink($file);
	}
	
	function unlink ($file)
	{
		$file = RheinaufFile::get_enc($file);
		unlink($file);
	}

	function copy ($old_name,$new_name)
	{
		$old_name = RheinaufFile::get_enc($old_name);
		$new_name = RheinaufFile::get_enc($new_name);
		if (defined('USE_FTP') && USE_FTP === true)
		{
			$old_file = file_get_contents($old_name);
			RheinaufFile::write_file($new_name,$old_file);
		}
		else copy($old_name,$new_name);
		
	}
	function move_uploaded_file($old_name,$new_name)
	{
		$old_name = RheinaufFile::get_enc($old_name);
		$new_name = RheinaufFile::get_enc($new_name);
		move_uploaded_file($old_name,$new_name);
	}
}
?>