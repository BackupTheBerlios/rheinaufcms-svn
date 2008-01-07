<?php
class LocationsScaffold extends FormScaffold
{
	var $results_per_page = 8;
	var $room;
	function  LocationsScaffold ($table,$db_connection='',$path_information='')
	{
		$this->connection = ($db_connection != '') ? $db_connection : new RheinaufDB();
		if ($path_information != '')
		{
			$this->extract_to_this($path_information);
			$this->path_information = $path_information;
		}
		else $this->pfad();
		$this->table = $table;
//$this->connection->debug = true;
	}
	function make_table($sql ='',$template='')
	{
		$db_table = $this->table;
		$vars = (is_array($this->template_vars)) ? $this->template_vars : array();


		$order_by = ($this->order_by) ? $this->order_by : 'id';
		$order_dir = ($this->order_dir) ? $this->order_dir : 'ASC';
		$results_per_page = ($this->results_per_page) ? $this->results_per_page : '';
		$start_by = ($_GET['start']) ? $_GET['start'] : 0;

		if ($sql =='')
		{
			$sql = "SELECT * FROM `$db_table` ORDER BY `$order_by` $order_dir";
		}


		$vars['pages'] = $this->get_pages($sql);
		$vars['page'] = $this->get_page();
		if ($results_per_page || $start_by)
		{
			if (!$this->num_rows) $num_rows = $this->num_rows = $this->connection->db_num_rows($sql);
			else $num_rows = $this->num_rows;
			if (!$results_per_page) $results_per_page = $num_rows;
			$sql .= " LIMIT $start_by,$results_per_page";
		}

		$result = $this->connection->db_assoc($sql);


		$template = new Template($template);


		$return_string = '';
		$return_string .= $template->parse_template('PRE',$vars);
		$alternatig_rows = 0;
		$loop_count = 0;
		$einzel=0;
		$row ='';
		for ($i=0;$i<$count=count($result);$i++)
		{
			$loop_count++;
			$result[$i] = array_merge($vars,$result[$i]);
			foreach ($result[$i] as $key =>$value)
			{
				if (is_array($this->cols_array[$key]['options']))
				{
					$result[$i][$key] = $this->cols_array[$key]['options'][$value];
				}
				if ($this->cols_array[$key]['type'] == 'timestamp')
				{
					$result[$i][$key] = (intval(Date::unify_timestamp($value)) != '0') ? Date::timestamp2datum($value,($this->datumsformat)?$this->datumsformat:'tag_kurz') :'';
				}
				if ($this->cols_array[$key]['type'] == 'upload')
				{
					$result[$i][$key] = rawurlencode($value);
				}
				elseif (!$this->cols_array[$key]['html'])
				{
					$result[$i][$key] = htmlspecialchars($value);
				}
			}			$result[$i]['alt_row'] = ' alt_row_'.$alternatig_rows;

			$return_string .=$template->parse_template('LOOP',$result[$i]);


			$alternatig_rows = ($alternatig_rows == 1) ? 0 : 1;
			//$einzel = ($einzel == $this->results_per_page-1) ? 0 : $einzel++;
			$einzel++;
		}
		$return_string .= $template->parse_template('POST',$vars);
		return $return_string;
	}
}



?>