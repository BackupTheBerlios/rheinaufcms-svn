<?php
class Sitemap extends RheinaufCMS 
{
	var $navi;
	function Sitemap()
	{
		if (!$this->connection) $this->connection = new RheinaufDB();
		if (!$this->homepath) $this->pfad();
		$this->navi = $this->navi_array();
	}

	function show()
	{
		return $this->make_sitemap();
	}
	
	function make_sitemap()
	{
		$return_string;
		
		for ($i=0;$i<count($this->navi);$i++)
		{
			$rubrik = $this->navi[$i]['Rubrik'];
			$rubrik_enc = $this->path_encode($rubrik);
			$return = Html::div(Html::bold($rubrik));
			for ($j=0;$j<count($this->navi[$i]['Subnavi']);$j++)
			{
				$seite = $this->navi[$i]['Subnavi'][$j]['Seite'];
				$seite_enc = $this->path_encode($seite);
				$return .= Html::div(Html::a("/$rubrik_enc/$seite_enc",$seite));
			}
			$return_string .= Html::div($return,array('style'=>'float:left;margin-left:40px'));	
		}
		return Html::div($return_string,array('style'=>'width:500px'));
	}
}

?>