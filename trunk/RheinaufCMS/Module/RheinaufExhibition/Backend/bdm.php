<?php
class bdm extends RheinaufExhibitionAdmin
{
	function bdm($scaff,$db_connection='',$path_information='')
	{
		$this->connection = $db_connection;
		$this->path_information = $path_information;

		$this->pics_db_table = 'RheinaufCMS>Exhibition>Bilder';
		$this->scaff = $scaff;

		$this->event_listen();
	}
	function show()
	{

	}

	function event_listen()
	{

	}
	function overview()
	{

	}
}

?>