<?php
class bdm extends RheinaufExhibitionAdmin
{
	function bdm(&$scaff,&$system)
	{
		$this->system &= $system;
		$this->connection = $system->connection;

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