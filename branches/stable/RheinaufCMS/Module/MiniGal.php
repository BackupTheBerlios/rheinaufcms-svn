<?php
class MiniGal extends RheinaufCMS
{
	var $gal_path = '/Images/MiniGal/';

	function Minigal($db_connection='',$path_information='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		($path_information != '') ? $this->extract_to_this($path_information) : $this->pfad();

	}

	function show()
	{
		$return_string = '';
		if (count($files = $this->get_names()) > 0)
		{

			$return_string = Html::script("var minigal_pix = new Array('".implode("','",$files)."');\nvar galpath = '".$this->gal_path."'");
			$return_string .= Html::img('',PROJECT_NAME.' MiniGal',array('id'=>'MiniGal'));
			$return_string .= Html::div('<input class="slider-input" id="slider-input-1" name="slider-input-1"/>',array('class'=>"slider",'id'=>"slider-1"));
			$return_string .= Html::div(Html::span('&nbsp;',array('id'=>'nummer')).'/'.count($files),array('class'=>'klein'));
			$return_string .= Html::script('
var s = new Slider(document.getElementById("slider-1"), document.getElementById("slider-input-1"));
var rand = Math.ceil(Math.random() * minigal_pix.length);
document.getElementById("MiniGal").src = galpath + minigal_pix[rand-1];
document.getElementById("nummer").firstChild.nodeValue = rand.toString();
s.setMinimum(1);
s.setMaximum(minigal_pix.length);
s.setValue(rand);
s.onchange = function () {
document.getElementById("nummer").firstChild.nodeValue = s.getValue().toString();
document.getElementById("MiniGal").src = galpath + minigal_pix[s.getValue()-1];

}');
		}
		return $return_string;
	}


	function get_names()
	{
		return RheinaufFile::dir_array(DOCUMENT_ROOT.INSTALL_PATH.$this->gal_path,false,'.jpg');

	}
}

?>