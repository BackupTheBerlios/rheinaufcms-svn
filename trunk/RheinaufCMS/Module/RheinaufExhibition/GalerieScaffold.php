<?php
class GalerieScaffold extends FormScaffold
{
	var $results_per_page = 8;
	var $room;
	function  GalerieScaffold ($table,$db_connection='',$path_information='')
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


		$vars['next_link'] = ($next = $this->next_link()) ? "?$next":'';
		$vars['next_link'] .= ($this->room && $vars['next_link']) ? "&amp;room=".$this->room:'';
		$vars['prev_link'] = ($prev = $this->prev_link()) ? "?$prev":'';
		$vars['prev_link'] .= ($this->room && $vars['prev_link']) ? "&amp;room=".$this->room:'';
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

				$result[$i][$key] = nl2br($value);
			}
			$result[$i]['Dateiname'] = rawurlencode($result[$i]['Dateiname']);
			$result[$i]['Titelbild'] = rawurlencode($result[$i]['Titelbild']);

			$result[$i]['clip_name'] = General::clip_words($result[$i]['Name'],22);



			$room =  ($_GET['room']) ? $_GET['room'] : $result[$i]['RoomId'];
			$result[$i]['einzel_link'] = SELF.'?room='.$room.'&amp;start='.$_GET['start'];
			if (!$this->exhibition_room_selection) $result[$i]['einzel_link'] .='&amp;Einzelansicht='.$einzel;
			$result[$i]['alt_row'] = ' alt_row_'.$alternatig_rows;
			$row .= $template->parse_template('LOOP',$result[$i]);
			if ($loop_count == 4 || $i == $count-1)
			{
				if ($i == $count-1)
				{
					for ($j=$loop_count;$j<4;$j++)
					{
						$row .= '<td class="gal_element">&nbsp;</td>';

					}
				}
				$return_string .= '<tr>'.$row.'</tr>';
				$row = '';
				$loop_count = 0;
			}
			$alternatig_rows = ($alternatig_rows == 1) ? 0 : 1;
			//$einzel = ($einzel == $this->results_per_page-1) ? 0 : $einzel++;
			$einzel++;
		}
		$return_string .= $template->parse_template('POST',$vars);
		return $return_string;
	}

	function parse_single ($sql,$template)
	{
		$vars = (is_array($this->template_vars)) ? $this->template_vars : array();

		$result = $this->connection->db_single_row($sql);
		$template = new Template($template);
		$return_string = '';

		$result = array_merge($result,$vars);

		foreach ($result as $key =>$value)
		{
			if (is_array($this->cols_array[$key]['options']))
			{
				$result[$key] = $this->cols_array[$key]['options'][$value];
			}
			if ($this->cols_array[$key]['type'] == 'timestamp')
			{
				$result[$key] = (intval(Date::unify_timestamp($value)) != '0') ? Date::timestamp2datum($value,($this->datumsformat)?$this->datumsformat:'tag_kurz') :'';
			}
			if ($this->cols_array[$key]['type'] == 'upload')
			{
				$result[$key] = rawurlencode($value);
			}
			elseif (!$this->cols_array[$key]['html'])
			{
				$result[$key] = htmlspecialchars($value);
			}
		}
		$result['Dateiname'] = rawurlencode($result['Dateiname']);
		$result['alt_row'] = ' alt_row_'.$alternatig_rows;
		$return_string .= $template->parse_template('LOOP',$result);

		return $return_string;
	}
}

?>