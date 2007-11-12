<?php
class RDirList
{
	var $show_only_folders;
	var $start_folder;
	var $dirlistDirActionJs;
	var $dirlistFileActionJs;
	var $hilited_file;
	
	function RDirList($start_folder='',$dirlistDirActionJs='',$dirlistFileActionJs='',$show_only_folders=false,$hilited_file=null)
	{
		$this->list_id = $start_folder;
		$this->dirlistDirActionJs = $dirlistDirActionJs;
		$this->dirlistFileActionJs = $dirlistFileActionJs;
		$this->show_only_folders = $show_only_folders;
		$this->hilited_file = $hilited_file;
		
		$this->start_folder = ($start_folder !='') ? INSTALL_PATH.'/Download/'.$start_folder : INSTALL_PATH.'/Download';

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
		
		$GLOBALS['other_css'] .= Html::style('
		.filelist ul{
			list-style-type:none;
			list-style-position:inside;
			margin-left:16px;
			padding:0;
		}
		.filelist ul ul {
			padding-left:8px;
			margin-left:8px;
			border-left:1px black dotted;
		} 
		.filelist a{
			text-decoration:none;
			white-space:nowrap;
		} 
		
		');
		/*$GLOBALS['scripts'] .= Html::script('
		function dirlistDirAction(el)
		{
			var url = el.getAttribute("href",2);

			return false;
		}
		');*/
		if ($dirlistDirActionJs || $dirlistFileActionJs)
		{
			$GLOBALS['scripts'] .= Html::script($dirlistDirActionJs."\n".$dirlistFileActionJs);
		}
	}

	function show()
	{
		return Html::div($this->ls(),array('id'=>$this->list_id,'class'=>'filelist'));
	}

	function ls ($path='')
	{
		$return = '';
	
		$list_dirs = RheinaufFile::dir_array($this->start_folder.$path,true);
		$ul = new HtmlList();
		natcasesort($list_dirs);
		foreach ($list_dirs as $dir) 
		{
			$url = $path.'/'.$dir;
			$ul->add_li($this->dir_link($url,$dir).$this->ls($url));
		}
		if (!$this->show_only_folders)
		{
			$list_files = RheinaufFile::dir_array($this->start_folder.$path,false);
			natcasesort($list_files);
			foreach ($list_files as $file)
			{
				$url = $path.'/'.$file;
				$ul->add_li($this->file_link($url,$file));
			}
		}
		return $ul->flush_list();
	}

	function type($file)
	{
		if (preg_match('/\.(jpe?g)$/i',$file)) $type = 'jpg';
		else if (preg_match('/\.gif$/i',$file)) $type = 'gif';
		else if (preg_match('/\.png$/i',$file)) $type = 'png';
		else if (preg_match('/\.pdf$/i',$file)) $type = 'pdf';
		else if (preg_match('/\.doc$/i',$file)) $type = 'word';
		else if (preg_match('/\.xls$/i',$file)) $type = 'excel';
		else if (preg_match('/\.(zip|rar|gz|tar|cab)$/i',$file)) $type = 'zip';
		else if (preg_match('/\.(mp3|wav)$/i',$file)) $type = 'sound';
		else $type = 'file';
		
		return $type;		
	}
	function dir_link($dir,$name)
	{
		$path_prefix = preg_replace("/.*?".str_replace("/","\/",INSTALL_PATH)."/",'',$this->start_folder);
		$url = $path_prefix.$dir;
		$_url = explode('/',$url);

		foreach ($_url as $key => $chunk)
		{
			$_url[$key] = rawurlencode($chunk);
		}
		//return Html::a($url,$this->icons['folder'].' '.$name,($this->dirlistDirActionJs) ? array('onclick'=>'return dirlistDirAction(this);') : array());
		if ($this->dirlistDirActionJs)
		{
			return Html::a($url,$this->icons['folder'].' '.$name, array('onclick'=>'return dirlistDirAction(this);'));
		}
		else return $this->icons['folder'].' '.$name;		
	}
	function file_link ($file,$name)
	{
		$path_prefix = preg_replace("/.*?".str_replace("/","\/",INSTALL_PATH)."/",'',$this->start_folder);
		$url = $path_prefix.$file;
		$_url = explode('/',$url);

		foreach ($_url as $key => $chunk)
		{
			$_url[$key] = rawurlencode($chunk);
		}
		$url = implode('/',$_url);
		
		$att_array = array();
		
		if ($this->dirlistFileActionJs) $att_array['onclick'] = 'return dirlistFileAction(this);';
		if ($this->hilited_file == $path_prefix.$file) $att_array['class'] = 'hilite';

		return Html::a($url,$this->icons['file'].' '.$name, $att_array);

	}
}

?>