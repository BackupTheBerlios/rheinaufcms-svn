<?php
class Modul extends RheinaufCMS 
{

	function Modul()
	{
		
	}
	function class_init (&$system)
	{
		$this->connection &= $system->connection;
	}

	function show()
	{
		
		return '';
	}
}

?>