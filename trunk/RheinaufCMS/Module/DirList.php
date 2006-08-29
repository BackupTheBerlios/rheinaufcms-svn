<?php
class DirList extends RheinaufCMS
{

	function DirList($start_folder='',$db_connection='',$path_information='')
	{
		$this->list_id = $start_folder;
		$this->start_folder = ($start_folder !='') ? INSTALL_PATH.'/Download/'.$start_folder : INSTALL_PATH.'/Download';
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

		$this->list_path = '/'.($_GET['list']) ? $_GET['list'] :'';
		$this->icons = array();
		$this->icons['folder'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/folder.png');
		$this->icons['file'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/file.png');
		$this->icons['pdf'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/pdf.png');
		$this->icons['excel'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/excel.png');
		$this->icons['word'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/word.png');
		$this->icons['jpg'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/jpg.png');
		$this->icons['gif'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/png.png');
		$this->icons['png'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/png.png');
		$this->icons['sound'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/sound.png');
		$this->icons['zip'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/zip.png');
		$this->icons['download'] = Html::img('/'.INSTALL_PATH.'/Module/DirList/Icons/download.png');


	}

	function show()
	{
		return Html::div($this->ls(),array('id'=>$this->list_id));
	}

	function ls ()
	{
		$return = '';
		if ($_GET['list'])
		{
			$array = split('/',$_GET['list']);
			array_pop($array);
			$return .= Html::a(SELF.'?list='.implode('/',$array)."#$this->list_id",'Eine Ebene höher<br />');
		}
		$list_dirs = RheinaufFile::dir_array($this->start_folder.$this->list_path,true);
		natcasesort($list_dirs);
		for ($i=0;$i<count($list_dirs);$i++)
		{
			$return .=Html::a(SELF.'?list='.$this->list_path.'/'.$list_dirs[$i]."#$this->list_id", $this->icons['folder'] . ' '.$list_dirs[$i]).'<br />' ;
		}
		$list_files = RheinaufFile::dir_array($this->start_folder.$this->list_path,false);
		natcasesort($list_files);
		for ($i=0;$i<count($list_files);$i++)
		{
			$return .= $this->file_link($this->start_folder.$this->list_path.'/'.$list_files[$i],$list_files[$i]).'<br />' ;
		}
		if (count($list_dirs)==0&&count($list_files)==0) $return .= 'Verzeichnis ist leer';
		return $return;
	}

	function file_link ($file,$name)
	{
		if (preg_match('/\.(jpg|jpeg)$/i',$name)) $type = 'jpg';
		else if (preg_match('/\.gif$/i',$name)) $type = 'gif';
		else if (preg_match('/\.png$/i',$name)) $type = 'png';
		else if (preg_match('/\.pdf$/i',$name)) $type = 'pdf';
		else if (preg_match('/\.doc$/i',$name)) $type = 'word';
		else if (preg_match('/\.xls$/i',$name)) $type = 'excel';
		else if (preg_match('/\.(zip|rar|gz|tar|cab)$/i',$name)) $type = 'zip';
		else if (preg_match('/\.(mp3|wav)$/i',$name)) $type = 'sound';

		$url = str_replace(INSTALL_PATH,'',$file);
		$_url = explode('/',$url);

		foreach ($_url as $key => $chunk)
		{
			$_url[$key] = rawurlencode($chunk);
		}
		$url = implode('/',$_url);
		switch ($type)
		{
			case 'jpg':
			case 'gif':
			case 'png':
			case 'word':
			case 'excel':
			case 'pdf':
			case 'sound':
			case 'zip':
			return Html::a($url,$this->icons[$type].' '.$name);
			break;
			default:
				return Html::a($url,$this->icons['file'].' '.$name);
			break;

		}
	}
}

?>