<?php
class General
{
	/**
	* Schneidet String nach x Buchstaben ab , wobei Wörter nicht getrennt werden
	*
	* @param string $string
	* @param integer $max_length
	* @return string
	* @access public
	* @author Raimund Meyer
	*/
	function clip_words($string, $max_length)
	{
		$string = $string_cache = html_entity_decode($string);

		$br_array = array('<br>','<br />',"\n");
		$string = str_replace ($br_array, ' ',$string);
		if (strlen($string) > $max_length )
		{
			$string = substr ($string, 0, $max_length);
			$string_clipped = explode (' ', $string);
			array_pop ($string_clipped);
			$string_clipped = implode (' ', $string_clipped);

			$string = ( $string_clipped != '') ? $string_clipped.'...' : $string;

		}
		return Html::span($string,array('title'=>$string_cache)) ;
	}

	function wrap_string($string, $line_length)
	{

		if (strlen($string) > $line_length )
		{
			$array = explode(' ',$string);

			$count=0;

			for ($i=0;$i<count($array);$i++)
			{
				$count += strlen($array[$i]);
				if ($count >= $line_length)
				{
					$array[$i] .= Html::br();
					$count = 0;
				}
			}

			$string = implode(' ',$array);
		}
		return $string;
	}
	/**
	 * unserialize rekursiv
	 *
	 * @param Array | String $array
	 * @return Array
	 */
	function multi_unserialize($array)
	{
		if (!is_array($array)) return $array;
		foreach ($array as $key => $value)
		{
			if (is_array($value))
			{
				$array[$key] = General::multi_unserialize($value);
			}
			elseif (strpos($value,'{') && strpos($value,':'))
			{
				$array[$key] = General::multi_unserialize(unserialize($value));
			}
			else $array[$key] = $value;
		}
		return $array;
	}

	function array_encode($array)
	{
		return rawurlencode(serialize($array));
	}

	function array_decode($array)
	{
		return unserialize(rawurldecode($array));
	}

	function docroot()
	{
		if (preg_match("#/$#",$_SERVER['DOCUMENT_ROOT'])) return $_SERVER['DOCUMENT_ROOT'];
		else return $_SERVER['DOCUMENT_ROOT'].'/';
	}

	function input_clean($str,$db_escape=false,$striptags=false)
	{
		if (get_magic_quotes_gpc())
		{
			if ($db_escape) 
			{
				$str = stripslashes($str);
				$str = mysql_real_escape_string($str);
			}
			else $str = stripslashes($str);
		}
		else
		{
			if ($db_escape) $str = mysql_real_escape_string($str);
			else $str = $str;
		}
		if ($striptags) $str = strip_tags($str);
		return trim($str);
	}

	function output_clean($str,$db_escape=false)
	{

		$str = htmlspecialchars($str);
		$str = nl2br($str);
		//if ($db_escape) return  stripslashes($str);
		//else
		return $str;
	}

	function array2js ($name,$array)
	{
		return 'var '.$name.' = new Array(\''.implode("', '",$array)."');\n";
	}
	function alert($string)
	{
		print '<script type="text/javascript">alert("'.addslashes(str_replace("\n",'\n',$string)).'")</script>';
	}

	function error_regex ($str)
	{
		$array = preg_split('//',trim($str));
		$vokale = array('a','e','i','o','u','ä','ü','ü');
		$array = array_unique($array);
		foreach ($array as $key => $value)
		{
			switch (strtolower($array[$key]))
			{
				case '':
				unset($array[$key]);
				break;
				case 'a':
				case 'e':
				case 'i':
				case 'o':
				case 'u':
				case 'ä':
				case 'ö':
				case 'ü':
				$array[$key] = '[aeiouäüöAEIOUÄÜÖ]+.*';
				break;
				case 'b':
				case 'p':
				$array[$key] = '[bBpP]+.*';
				break;
				case 'c':
				case 'z':
				$array[$key] = '[cCzZsS]+.*';
				break;
				case 'd':
				case 't':
				$array[$key] = '[dDtT]+.*';
				break;
				case 'f':
				case 'v':
				$array[$key] = '[fFvV]+.*';
				break;
				case 'g':
				case 'k':
				case 'k':
				$array[$key] = '[gGkK]+.*';
				break;
				case 'h':
				$array[$key] = '[hH]*.*';
				break;
				break;
				case 'q':
				$array[$key] = '[qQkK]+.*';
				break;
				case 'w':
				$array[$key] = '[wWvV]+.*';
				break;
				case 'y':
				$array[$key] = '[yYüÜ]+.*';
				break;
				default:
					$array[$key] = '['.strtolower($array[$key]).strtoupper($array[$key]).']+.*';
				break;

			}
		}
		return implode('',$array);
	}
	function utf_8_decode($str)
	{
		include("UTF2entity.php");
		include("UTF2entity.php");

		return utf8_decode($str);
	}
	function get_add()
	{
		if (strstr($_SERVER['REQUEST_URI'],'?')) return '&';
		else return '?';
	}

	function upload_error($no)
	{
		switch ($no)
		{
			case 1:
			case 2:
				return 'Die hochgeladene Datei überschreitet die erlaubte Dateigröße.';
			break;
			case 3:
				return 'Die Datei wurde nur teilweise hochgeladen.';
			break;
			case 4:
				return 'Es wurde keine Datei hochgeladen.';
			break;

		}
	}

	function regex_escape($string)
	{
		return  addcslashes($string,'\^$.[]|()?*+{}');
	}

	function integrated_enc($str)
	{
		return rawurlencode($this->path_encode($str));
	}

	function integrated_dec($str)
	{
		return $this->path_decode(General::input_clean(rawurldecode($str)));
	}

	function alfanum($str)
	{
		return preg_replace('/[^a-z0-9]/i','',$str);
	}	
	
	function num($str)
	{
		return preg_replace('/[^0-9]/i','',$str);
	}
	
	function special_char_convert($str)
	{
		$verboten = array('ä','Ä','ö','Ö','ü','Ü','é','è','É','È','á','à','Á','À','ß',' ',':','&','+');
		$erlaubt = array('ae','Ae','oe','Oe','ue','Ue','e','e','E','E','a','a','A','A','ss', '','','','');
		$str = str_replace($verboten,$erlaubt,$str);
		
		return preg_replace('/^[0-9]*|[^0-9a-z-_.:%[\]]/i','',$str);
	}
	function PostToHost($host, $path, $referer, $data_to_send)
	{
		$fp = fsockopen($host, 80);

		fputs($fp, "POST $path HTTP/1.1\r\n");
		fputs($fp, "Host: $host\r\n");
		fputs($fp, "Referer: $referer\r\n");
		fputs($fp, "Content-type: application/x-www-form-urlencoded\r\n");
		fputs($fp, "Content-length: ". strlen($data_to_send) ."\r\n");
		fputs($fp, "Connection: close\r\n\r\n");
		fputs($fp, $data_to_send);
		while(!feof($fp))
		{
			$res[] = fgets($fp);
		}

		fclose($fp);

		return $res;
	}
	
	//function generating a pseudo-random UUID according to RFC 4122
	function uuid()
	{
	   return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
       mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
       mt_rand( 0, 0x0fff ) | 0x4000,
       mt_rand( 0, 0x3fff ) | 0x8000,
       mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ) );
	}

	function trim_array($array)
	{
		$t = array();
		foreach ($array as $key => $value)
		{
			if ($value)
			{
				if (is_numeric($key)) $t[] = $value;
				else $t[$key] = $value;
			}
		}
		return $t;
	}
}
?>