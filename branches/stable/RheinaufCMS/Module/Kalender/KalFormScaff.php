<?php
class KalFormScaff extends FormScaffold
{
	var $monate;
	function make_table($sql ='',$template='',$make_template=false)
	{
		$db_table = $this->table;
		$vars = (is_array($this->template_vars)) ? $this->template_vars : array();
		if ($this->edit_enabled)
		{
			if ($_GET['delete']) $this->connection->db_query("DELETE FROM `$db_table` WHERE `id` = ".$_GET['delete']);
		}

		$order_by = ($this->order_by) ? $this->order_by : 'id';
		$order_dir = ($this->order_dir) ? $this->order_dir : 'ASC';
		$results_per_page = ($this->results_per_page) ? $this->results_per_page : '';
		$start_by = ($_GET['start']) ? $_GET['start'] : $_GET['start'] = 0;

		if ($sql =='')
		{
			$sql = "SELECT * FROM `$db_table` ORDER BY `$order_by` $order_dir";
		}
		if ($results_per_page || $start_by)
		{
			$num_rows = $this->num_rows = $this->connection->db_num_rows($sql);
			if (!$results_per_page) $results_per_page = $num_rows;
			$sql .= " LIMIT $start_by,$results_per_page";
		}
		$result = $this->connection->db_assoc($sql);

		if (!$template || $make_template)
		{
			$new_template = '';
			$new_template .= "<!--PRE-->\n<table>\n<!--/PRE-->\n<!--LOOP-->\n";
			foreach ($this->cols_array as $key => $col)
			{
				$type = $col['type'];
				$name  = $col['name'];
				if ($type != 'ignore' && $type != 'hidden')
				{
					$new_template .= "{IfNotEmpty:$key(<tr><td>$name</td><td>[$key]</td></tr>)}\n";
				}
			}
			$new_template .="<!--/LOOP-->\n<!--POST-->\n</table>\n<!--/POST-->\n";
			if ($make_template) RheinaufFile::write_file($template,$new_template);
			$template = $new_template;
		}

		$template = new Template($template);
		$return_string = '';
		$return_string .= $template->parse_template('PRE',$vars);
		$alternatig_rows = 0;
		foreach ($result as $entry)
		{
			$month = Date::monat($entry['DTSTART']);
			if ($month_shown == $month)
			{
				$entry['MONTH_HEAD'] = '';
			}
			else
			{
				$entry['MONTH_HEAD'] = $this->monate[intval($month)].' '.Date::jahr($entry['DTSTART']);
				$month_shown = $month;
			}

			foreach ($entry as $key =>$value)
			{
				if (is_array($this->cols_array[$key]['options']))
				{
					$entry[$key] = $this->cols_array[$key]['options'][$value];
				}
				if ($this->cols_array[$key]['type'] == 'timestamp')
				{
					$entry[$key] = (intval(Date::unify_timestamp($value)) != '0') ? Date::timestamp2datum($value,($this->datumsformat)?$this->datumsformat:'tag_kurz') :'';
				}
				if (!$this->cols_array[$key]['html']) $entry[$key] = Html::pcdata($entry[$key]);
			}
			if ($this->edit_enabled)
			{
				$icons['edit'] = Html::img('/'.INSTALL_PATH.'/Libraries/Icons/16x16/edit.png','');
				$icons['delete'] = Html::img('/'.INSTALL_PATH.'/Libraries/Icons/16x16/cancel.png','');

				$btns['edit'] = Html::a(SELF.'?edit='.$entry['id'],$icons['edit'],array('title'=>'Eintrag bearbeiten'));
				$btns['delete'] = Html::a(SELF.'?delete='.$entry['id'],$icons['delete'],array('title'=>'Eintrag löschen','onclick'=>'return delete_confirm(\''.$entry['id'].'\')'));

				$entry['edit_btns'] .= implode(' ',$btns);
			}
			$entry['alt_row'] = ' alt_row_'.$alternatig_rows;
			$return_string .= $template->parse_template('LOOP',$entry);
			$alternatig_rows = ($alternatig_rows == 1) ? 0 : 1;
		}
		$return_string .= $template->parse_template('POST',$vars);
		return $return_string;
	}


}

?>