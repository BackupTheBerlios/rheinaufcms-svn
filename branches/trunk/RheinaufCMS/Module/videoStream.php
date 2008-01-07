<?php
class videoStream extends RheinaufCMS
{

	function videoStream ($id,$path,$name,$linktext,$image='',$embed='embed',$width='320',$height='260')
	{
		$this->id = $id;
		$this->path = $path;
		$this->name = $name;
		$this->linktext = $linktext;
		$this->image = $image;
		$this->embed = $embed;
		$this->width = $width;
		$this->height = $height;
	}
	function class_init()
	{
		
	}
	function show()
	{
		$path = $this->path;
		$name =$this->name;
		$linktext = $this->linktext;
		$url = 'http://'.$_SERVER['SERVER_NAME']. "/Download/$path".rawurlencode($name);

		if (preg_match('/\.mov$/',$name))
		{
			return Html::a($url,$linktext);
		}
		else if (preg_match('/\.flv$/',$name))
		{
			$url = "/Download/$path".rawurlencode($name);
			switch ($this->embed)
			{
				case 'popup':
					if ($_GET['id']==$this->id)
					{

					}
					else
					{
						return Html::a($url,$linktext);
					}
				break;
				case 'embed':
					//$url = '/Libraries/flvplayer/flvplayer.swf?file='.$url;//.'&amp;autostart=false&amp;repeat=false';
					//if ($this->image) $url .= '&amp;image='.$this->image;
					$image = ($this->image) ? 's1.addVariable("image","'.$this->image.'");' : '';
					return  '<div id="'.$this->id.'"><a href="http://www.macromedia.com/go/getflashplayer">Get the Flash Player</a> to see this video.</div>
		
<script type="text/javascript">
if (typeof SWFObject != "function")
{
	document.write(\'<\'+\'script type="text/javascript" src="/Libraries/flvplayer/swfobject.js"></\'+\'script>\');
}
</script>
<script type="text/javascript">
	var s1 = new SWFObject("/Libraries/flvplayer/flvplayer.swf","single","400","300","7");
	s1.addParam("allowfullscreen","true");
	s1.addVariable("file","'.$url.'");
	'.$image.'
	s1.write("'.$this->id.'");
</script>';
					
					/*return '
<object type="application/x-shockwave-flash" data="'.$url.'" width="320" height="260" wmode="transparent">
  <param name="movie" value="'.$url.'" />
  <param name="wmode" value="transparent" />
</object>
				';*/
				break;
			}
		}
		else if (preg_match('/\.wmv$/',$name))
		{
			if ($_GET['id']==$this->id)
			{

				header("Content-Disposition: attachment; filename=$name.wvx");
				header("Content-Type: video/x-ms-wvx");
				print '<ASX version = "3.0">
	<ENTRY>
	<REF HREF="'.$url.'" />
	</ENTRY>
	</ASX>';

				exit;
			}
			else return Html::a(SELF.'/'.rawurlencode($name).'.wvx?id='.$this->id,$linktext);
		}
	}



}

?>