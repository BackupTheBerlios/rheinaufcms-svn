<?php
/*--------------------------------
--  RheinaufCMS Database Functions
--
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/
class RheinaufDB
{
	var $connection;
	var $debug = false;
	function RheinaufDB()
	{
		return $this->connection = $this->db_connect();
	}

	function db_connect()
	{
		$resource = mysql_connect(DB_SERVER,DB_USER,DB_PASS);
		mysql_select_db(DB_NAME);
		return $resource;
	}

	function db_query ($sql)
	{
		if (!isset($this->connection)) $this->connection = $this->connection->db_connect();
		$result = mysql_query($sql,$this->connection);
		if ($this->debug)
		{
			 print $sql.'<br />';
			 print mysql_error();
			/* print '<pre>';
			 print_r(debug_backtrace());
			 print '</pre>';
			 */
		}
		return $result;
	}

	function db_assoc ($sql)
	{
		$assoc = array();
		$result = $this->db_query($sql);
		while ($row = mysql_fetch_assoc($result))
		{
			$assoc[] = $row;
		}
		return $assoc;
	}

	function db_single_row ($sql)
	{
		$result = $this->db_query($sql);
		if (!mysql_num_rows($result))
		{
			return false;
		}
		else
		{
			return mysql_fetch_assoc($result);
		}

	}

	function db_fetch_assoc($result)
	{
		return mysql_fetch_assoc($result);
	}

	function db_num_rows ($sql,$result_given=false)
	{
		if ($result_given)  $result = $result_given;
		else $result = $this->db_query($sql);
		return mysql_num_rows($result);
	}
	function db_last_insert_id()
	{
		return mysql_insert_id();
	}

	function db_col_props ($table)
	{
		$result = $this->db_query("SELECT * FROM `$table`");
		$array = array();
		while ($filed = mysql_fetch_field($result))
		{
			$array[] = $filed;
		}
		return $array;
	}

	/**
	 * Update-Query
	 *
	 * @param string $table
	 * @param array $data 'col'=>'value'
	 * @param string $where
	 */
	function db_update($table,$data,$where)
	{
		$set = array();
		foreach ($data as $key =>$value)
		{
			$set[] =  "`$key` = '$value'";
		}
		$set = implode(',',$set);
		return $this->db_query("UPDATE `$table` SET $set  WHERE $where");
	}

	function db_insert($table,$data)
	{

		$cols = array();
		$values = array();
		foreach ($data as $key => $value)
		{
			$cols[] = "`$key`";
			$values[] = "'$value'";
		}
		$sql = "INSERT INTO `$table` (".implode(',',$cols).") VALUES (".implode(',',$values).")";
		return $this->db_query($sql);
	}
}
?>