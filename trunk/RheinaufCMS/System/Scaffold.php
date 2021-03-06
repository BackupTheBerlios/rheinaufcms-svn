<?php
/*--------------------------------
--  RheinaufCMS Scaffold aka DBasio
--
--  Automatic Database I/O Interface Generation
--
--  $HeadURL$
--  $LastChangedDate$
--  $LastChangedRevision$
--  $LastChangedBy$
---------------------------------*/

class Scaffold extends RheinaufCMS
{
	var $table;
	/*
	# $this->cols_array[Spaltenname]['name']
	#								['type'] ->'text', 'select', 'radio','check', 'textarea', 'upload', 'hidden','custom','timestamp','email','ignore','info','changed'
	#								['value']
	#								['options'] (bei 'select') ->array('option1','option2') || string
	#								['options_sort'] -> true || false
	#								['options_insert_id'] -> true || false
	#								['options_hide_edit_button'] -> true || false
	#								['other_option']
	#								['disabled'] -> bool
	#								['hidden'] ->bool hides the table row initially
	#								['html'] (bei 'textarea')
	#								['custom_input']
	#								['attributes] ->array
	#								['required']
	#								['transform'] ->create_function('$key,$value','return do something..')
	#								['search_method']
	#								['upload_max_count']
	#								['upload_extensions'] => array('jpg','png')
	#								['upload_size'] =>max size KB
	#								['max_scale'] => array('x'=>1024,'y'=>768)
	#								['info']
	#								['maxlength']
	#								['multiple']
	#
	*/
	var $cols_array=array();
	var $re_entry; #true|false
	var $upload_path;
	var $upload_folder = array(); #array("Spaltenname1","Spaltenname2",..
	var $submit_button;
	var $order_by;
	var $order_dir = 'asc';
	var $group_by;
	var $results_per_page = 30;
	var $results_per_page_cookie_name = 'results_per_page';
	var $datumsformat; #'tag_lang','tag_kurz','kein_tag'
	var $enable_search_for = array(); #Spaltennamen
	var $search_combine =  ' AND ';
	var $search_method = 'LIKE %.%'; # '=','>','<','>=','<=','LIKE','LIKE %.%','LIKE %.','LIKE .%'
	var $use_ajax = true;
	var $show_buttons_above_form = true;
	var $text_above_form = ''; // Text to be printed above the form
	var $show_cancel = true;
	var $enable_events = true;
	var $edit_enabled = false;
	var $custom_parameter_filter = array();
	var $input_width = "300px";
	var $max_scale = array('x'=>1024,'y'=>768);
	var $options_table = null;
	var $show_export = false;
	function  Scaffold ($table,&$db_connection)
	{
		$this->upload_path = INSTALL_PATH.'/Download/';
		$GLOBALS['input_id'] = (isset($GLOBALS['input_id'])) ? $GLOBALS['input_id'] :0;
		$this->table = $table;
		$this->connection = $db_connection;
		//$this->connection->debug = true;
		$this->construct_array();
		//if ($this->edit_enabled)
		//{
			$this->edit_scripts();
		//}
		if ($this->use_ajax)
		{
			$this->http_request_scripts();
		}
		$this->loadCSS();
	}

	function show()
	{
		//return $this->make_form();
	}

	function construct_array()
	{
		$cols = $this->connection->db_col_props($this->table);

		foreach ($cols as $col)
		{
			$name = $col->name;
			$this->cols_array[$name] = array();
			$this->cols_array[$name]['name'] = $name;

			switch ($col->type)
			{
				case 'blob':
				$this->cols_array[$name]['type'] = 'textarea';
				break;
				default:
				$this->cols_array[$name]['type'] = 'text';
				break;
			}
		}
	}
	function print_cols_array()
	{
		$return = '';
		foreach ($this->cols_array as $key => $value)
		{
			$return .= "\$this->scaff->cols_array['$key']['name'] = '$key';\n";
			$return .= "\$this->scaff->cols_array['$key']['type'] = '".$value['type']."';\n";
			$return .= "\$this->scaff->cols_array['$key']['required'] = '';\n";
			$return .= "\$this->scaff->cols_array['$key']['value'] = '';\n";
			$return .= "\$this->scaff->cols_array['$key']['options'] = '';\n";
			if ($value['type'] == 'textarea')
			{
				$return .= "\$this->scaff->cols_array['$key']['attributes'] = array('onfocus' => \"growTextArea(this,150)\",'onblur' => \"sizeTextAreasToContent(this,'150px')\");\n\n";
			}
			else $return .= "\$this->scaff->cols_array['$key']['attributes'] = '';\n\n";

		}
		return $return;
	}
	function getSuggestions()
	{
		$key = General::input_clean($_GET['key'],true);
		$value = General::input_clean($_GET['value'],true);
		
		$result = $this->connection->db_assoc("SELECT `$key` FROM `$this->table` WHERE `$key` LIKE '$value%' ");
		$array = array();
		foreach ($result as $item)
		{
			$array[] = $item[$key];
		}
		$array = array_unique($array);
		print General::to_js($array);
		exit;
	}
	function make_table($where='',$template='',$make_template=false,$table_direction = 'horizontal')
	{
		$db_table = $this->table;
		$vars = (is_array($this->template_vars)) ? $this->template_vars : array();
		if ($this->edit_enabled && $this->enable_events)
		{
			if (isset($_GET['editoptions']) && !$this->options_editor) return $this->edit_options();
			if (isset($_GET['delete']))
			{
				$this->delete_entry();
			}
			if ($_GET['edit'] ) return $this->make_form($_GET['edit']);
			if (isset($_POST['edit_id'])) $this->db_insert($_POST['edit_id']);
			if (isset($_REQUEST['reentry'])) return $this->make_form(($_POST['edit_id']) ? $_POST['edit_id'] : $this->last_insert_id);
			if (isset($_GET['new'])) return $this->make_form();
		}
		if ($this->enable_events)
		{
			if (isset($_GET['getSuggestions'])) return $this->getSuggestions();
		}

		if (isset($_GET['img']))
		{
			$this->img_thumb();
		}

		if (isset($this->result_array))
		{
			$result = $this->result_array;
		}
		else
		{
			$order_by = ($this->order_by) ? $this->order_by : 'id';

			if ($_GET['dir'] == 'desc')
			{
				$order_dir = 'DESC';
			}
			else if ($_GET['dir'] == 'asc')
			{
				$order_dir = 'ASC';
			}
			else
			{
				$order_dir = ($this->order_dir) ? $this->order_dir : 'ASC';
			}

			if ($_GET['results_per_page'])
			{
				$results_per_page = $this->results_per_page = $_GET['results_per_page'];
				setcookie($this->results_per_page_cookie_name,$_GET['results_per_page'],10000000000,'/');
			}
			else if ($_COOKIE[$this->results_per_page_cookie_name])
			{
				$results_per_page = $this->results_per_page = $_COOKIE[$this->results_per_page_cookie_name];
			}
			else
			{
				$results_per_page = $this->results_per_page;
			}
			$results_per_page = General::input_clean($results_per_page,true);

			$start_by = ($_GET['start']) ? $_GET['start'] : $_GET['start'] = 0;
			$start_by = General::input_clean($start_by,true);

			foreach ($this->enable_search_for as $col)
			{
				if ($_GET[$col])
				{
					$value = General::input_clean($_GET[$col],true);
					$search_method = $this->cols_array[$col]['search_method'] ? $this->cols_array[$col]['search_method'] : $this->search_method;

					switch ($search_method)
					{
						case '=':
						case '<':
						case '>':
						case '>=':
						case '<=':
						case 'LIKE':
							$where[] = "`$col` $search_method '$value'";
						break;
						case 'LIKE %.%':
							$where[] = "`$col` LIKE '%$value%'";
						break;
						case 'LIKE %.':
							$where[] = "`$col` LIKE '%$value'";
						break;
						case 'LIKE .%':
							$where[] = "`$col` LIKE '$value%'";
						break;
					}
				}
			}
			$where = ($where) ? "WHERE ".implode($this->search_combine,$where) :'';

			$group_by = ($this->group_by) ? "GROUP BY `$this->group_by`" :'';
			$order = ($_GET['order']) ? rawurldecode($_GET['order']) : $order_by;
			$order = General::input_clean($order,true);

			if ($this->sql =='')
			{
			 	$sql = "SELECT * FROM `$db_table` $where $group_by ORDER BY `$order` $order_dir";
			}
			else $sql = $this->sql;

			$num_rows = $this->num_rows = $this->connection->db_num_rows($sql);
			if (!$results_per_page) $results_per_page = $this->results_per_page = $num_rows;


			if ($results_per_page || $start_by)
			{
				$num_rows = $this->num_rows = $this->connection->db_num_rows($sql);
				if (!isset($_GET['allresults'])) $sql .= " LIMIT $start_by,$results_per_page";
			}
			/*if ($this->last_insert_id)
			{
				$sql = "SELECT * FROM `$db_table` $group_by ORDER BY `$order` $order_dir";
				$result = $this->result = $this->connection->db_assoc($sql);
				for ($i = 0;$i<count($result);$i++)
				{
					if ($result[$i]['id'] == $this->last_insert_id)
					{
						$start_by = floor($i/$this->results_per_page) * $this->results_per_page;
						if ($start_by == $this->results_per_page) $start_by = 0;
						$url = SELF_URL.'?start='.$start_by.'&'.$this->GET_2_url(array('start'));
						$url = html_entity_decode($url);
						if (isset($_GET['noframe'])) $url .= '&noframe';
						$url .= '#entry'.$this->last_insert_id;
						header("Location: $url");
						exit;
					}
				}
			}*/
			$result = $this->result = $this->connection->db_assoc($sql);

		}
// now we have the result and can do things with it
		if (isset($_GET['export']))
		{
			$this->export($result,'id');
		}

		if (!$template || $make_template)
		{
			$head ='';
			$loop ='';

			$alt_col = '';
			$colspan = 0;
			foreach ($this->cols_array as $key => $col)
			{
				if ($key == 'id' ) continue;
				$type = $this->cols_array[$key]['type'];
				$button = '{'.$key.'_sort}';
				if ($type != 'ignore' && $type != 'hidden')
				{
					$head .="<th>$button</th>\n";
					$loop .= "<td class=\"$alt_col{If:alt_row}\">{If:$key}</td>\n";
					$alt_col = ($alt_col !== '') ? '' : 'alt_col';
					++$colspan;
				}
			}
			$loop .= "<td class=\"$alt_col{If:alt_row}\">{If:edit_btns}</td>\n";
			$loop = "<tr id=\"entry{id}\">\n$loop</tr>\n";
			$search =  (count($this->enable_search_for)) ?  $this->search_form() : '';
			
			$export_button = ($this->show_export) ? '<a href=\"{SELF_URL}?export&amp;allresults&amp;{If:export_get_vars}\"><img src=\"/RheinaufCMS/System/Scaffold/icon_excel_doc.gif\" alt=\"Excel\" title=\"Ergebnisse als Excel-Tabelle speichern\" /></a>' : '';
						
			$new_template = '';
			$new_template .= '
<!--PAGE_BROWSER-->
<form method="get" action="{SELF_URL}" onsubmit="httpRequestSubmit(this);return false;">

{IfNotEmpty:prev_url(<a href="[prev_url]" class="button" onclick="httpRequestGET(\'[prev_url]&amp;noframe\',setContent);return false">Zur�ck</a>)}
{IfNotEmpty:next_url(<a href="[next_url]" class="button" onclick="httpRequestGET(\'[next_url]&amp;noframe\',setContent);return false">Weiter</a>)}
&nbsp;&nbsp;&nbsp;{If:new_btn}
&nbsp;&nbsp;&nbsp;{num_entries} Eintr�ge auf {num_pages} Seiten
&nbsp;&nbsp;&nbsp;Zeige <input type="text" size="2" name="results_per_page" id="results_per_page" value="{results_per_page}" style="text-align:center"/> Eintr�ge pro Seite
<input type="submit" value="Aktualisieren" />

{If:results_per_page_get_vars}
</form>
<!--/PAGE_BROWSER-->';
$colspan_minus1 = $colspan -1;
$new_template .= "
<!--PRE-->
$search
<table>
<thead>
<tr><td colspan=\"$colspan_minus1\">{page_browser}</td>
<td>$export_button </td></tr>
{IfNotEmpty:pagination(<tr><td colspan=\"$colspan\">Seite [pagination]</td></tr>)}
<tr>$head</tr>
</thead>
<tbody>
<!--/PRE-->
<!--NO_RESULTS-->
<tr><td colspan=\"$colspan\">Keine Eintr�ge gefunden<td></tr>
<!--/NO_RESULTS-->
";
			$new_template .= "<!--LOOP-->\n$loop\n<!--/LOOP-->\n";


			$new_template .="<!--POST-->\n</tbody><tfoot><tr><td colspan=\"$colspan\">{If:new_btn}</td></tr></tfoot></table>\n<!--/POST-->\n";
			if ($make_template) RheinaufFile::write_file($template,$new_template);
			$template = $new_template;
		}

		$template = new Template($template);
		$return_string = '';

		foreach ($this->enable_search_for as $search_field)
		{
			$vars[$search_field."_search_value"] = $_GET[$search_field];
			$vars['filter_get_vars'] = $this->GET_2_input(array_merge($this->enable_search_for,array('start')));
		}

		if ($this->edit_enabled)
		{
			$icons['new'] = Html::img('/Libraries/Icons/16x16/edit_add.png','');
			$vars['new_btn']  =  Html::a(SELF_URL.'?new&amp;'.$this->GET_2_url(),$icons['new']. 'Eintrag hinzuf�gen',array('title'=>'Eintrag hinzuf�gen','class'=>'button'));
		}
		$vars['set_filters'] = $this->get_filters("&");
		$vars['export_get_vars'] = $this->GET_2_url();
		$vars['num_pages'] = $pages = $this->get_pages();
		$vars['num_entries'] = $num_rows;

		$vars['prev_url'] = ($prev = $this->prev_link()) ? SELF_URL.'?'.$prev.'&amp;'.$this->GET_2_url('start') :'';
		$vars['next_url'] = ($next = $this->next_link()) ? SELF_URL.'?'.$next.'&amp;'.$this->GET_2_url('start') :'';

		$vars['this_page'] = $this->get_page();
		$vars['results_per_page_get_vars'] = $this->GET_2_input('results_per_page');
		$vars['results_per_page'] = $results_per_page;

		$vars['page_browser'] = $template->parse_template('PAGE_BROWSER',$vars);
		$vars['pagination'] = $this->pagination();

		foreach ($this->cols_array as $key => $value)
		{
			$name = $this->cols_array[$key]['name'];

			if ($_GET['order'] == $key )
			{
				if ($_GET['dir'] == 'asc') $name .= '&#x25B2;' ; //up
				else $name .= '&#x25BC;'; //down
				$dir = ($_GET['dir'] == 'desc') ? 'asc' : 'desc';
			}
			else if (!isset($_GET['order'])&& $key == $this->order_by)
			{
				if ($this->order_dir == 'ASC')
				{
					$name .= '&#x25B2;'; // up
					$dir = 'desc';
				}
				else
				{
					$name .= '&#x25BC;'; //down
					$dir = 'asc';
				}
			}
			else
			{
				$dir = ($this->order_dir == 'ASC') ? 'asc' : 'desc';
			}
			$vars[$key.'_sort'] = $this->make_btn_link(SELF_URL.'?'.$this->GET_2_url(array('order','dir')).'&amp;order='.rawurlencode($key).'&amp;dir='.$dir,$name,array('class'=>'button','style'=>'display:block'));
		}


		$return_string .= $template->parse_template('PRE',$vars);
		$alternatig_rows = 0;

		foreach ($result as $entry)
		{
			$entry = array_merge($vars,$entry);
			foreach ($entry as $key =>$value)
			{
				$entry[$key.'_name'] = $this->cols_array[$key]['name'];
				if ($this->cols_array[$key]['options'] && ($this->cols_array[$key]['type'] == 'check' ||$this->cols_array[$key]['type'] == 'radio' || $this->cols_array[$key]['type'] == 'select'))
				{
					$options[$key] = $this->get_options($this->cols_array[$key]['options'],$this->cols_array[$key]['options_sort'],$this->cols_array[$key]['options_insert_id']);
					$v = explode('&delim;',$value);
					$v = General::trim_array($v);
					$value= array();
					foreach ($v as $k)
					{
						if ( $options[$key][$k]) $value[] = $options[$key][$k];
						else $value[] = $k;
					}
					$value = (count($value)) ? implode(', ',$value) : '';
				}
				if ($this->cols_array[$key]['type'] == 'timestamp')
				{
					$value = (intval(Date::unify_timestamp($value)) != '0') ? Date::timestamp2datum($value,($this->datumsformat)?$this->datumsformat:'tag_kurz') :'';
				}
				if ($this->cols_array[$key]['type'] == 'upload')
				{
					$value = rawurlencode($value);
				}
				elseif ($this->cols_array[$key]['type'] != 'textarea') $value = htmlspecialchars($value);

				if ($this->cols_array[$key]['type'] == 'textarea' && !$this->cols_array[$key]['html'])
				{
					$value = nl2br(htmlspecialchars($value));
				}
				
				if ($this->cols_array[$key]['max_length'] && strlen($value)>$this->cols_array[$key]['max_length'])
				{
					$value = General::clip_words($value,$this->cols_array[$key]['max_length']);
				}
				if ($transform = $this->cols_array[$key]['transform'])
				{
					if ( is_callable($transform))
					{
						$value = $transform($key,$value);
					}
					else 
					{
						eval($transform);
					}
				}
				$entry[$key] = $value;
			}
			if ($this->edit_enabled)
			{
				$icons['edit'] = Html::img('/Libraries/Icons/16x16/edit.png','');
				$icons['delete'] = Html::img('/Libraries/Icons/16x16/cancel.png','');

				$entry['edit_btn_url'] = SELF_URL.'?edit='.$entry['id'].'&amp;'.$this->GET_2_url();
				$entry['delete_btn_url'] = SELF_URL.'?delete='.$entry['id'].'&amp;'.$this->GET_2_url('delete','noframe');
				 
				$btns['edit'] = Html::a($entry['edit_btn_url'],$icons['edit'],array('title'=>'Eintrag bearbeiten'));
				$btns['delete'] = Html::a($entry['delete_btn_url'],$icons['delete'],array('title'=>'Eintrag l�schen','onclick'=>'return delete_confirm(this,\''.$entry['id'].'\')'));
				
				$entry['edit_btn'] = $btns['edit']; 
				$entry['delete_btn'] = $btns['delete']; 
				
				$entry['edit_btns'] = implode(' ',$btns);
			}

			$entry['alt_row'] = ' alt_row_'.$alternatig_rows;
			$return_string .= $template->parse_template('LOOP',$entry);
			$alternatig_rows = ($alternatig_rows == 1) ? 0 : 1;
		}
		if (!count($result)) $return_string .= $template->parse_template('NO_RESULTS',$vars);
		$return_string .= $template->parse_template('POST',$vars);
		return $return_string;
	}

	function search_form($legend='Filter')
	{
		$inputs = '';
		foreach ($this->enable_search_for as $search_field)
		{
			$name = $this->cols_array[$search_field]['name'];
			$id = Html::html_legal_id($search_field);
			$input_name = rawurlencode($search_field);
			if ($this->cols_array[$search_field]['options'] )
			{
				$options = $this->get_options($search_field,true);
				
				$select = new Select($encoded_name);
				$select->add_option('',$this->cols_array[$search_field]['name']);
				$attr_array = array();

				if (is_array($options))
				{
					foreach ($options as $option => $name)
					{
						if (isset($_GET['option']))  $attr_array['selected'] = 'selected';
						else unset ($attr_array['selected']);
						$select->add_option($option,$name,$attr_array);
					}
				}

				$inputs .= $select->flush_select();
			}
			else 
			{
				$input = Form::add_input('text',$input_name,"{If:".$search_field."_search_value}",array('id'=>$id,'onkeyup'=>'getSuggestions(event,this)'));
				$inputs .= Form::add_label($id,$name.' '.$input,array('class'=>'nowrap'));
			}
		}
		$inputs .= "{If:filter_get_vars}\n";
		$inputs .= Form::add_input('submit','Filter');
		$inputs .= Form::add_input('submit','','Zur�cksetzen',array('onclick'=>"resetFilter(this);return false;"));
		$form = new Form();
		$form->form_tag('{SELF_URL}','get','',array('onsubmit'=>'httpRequestSubmit(this);return false;','autocomplete'=>'off'));
		$form->fieldset($inputs,$legend);
		return $form->flush_form();
	}

	function next_link()
	{
		if ($this->results_per_page)
		{
			if (!$this->num_pages) $this->get_pages();
			if ($this->num_pages <= 1) return;
			$start = ($_GET['start']) ? $_GET['start'] : 0;
			$results_per_page = $this->results_per_page;
			$next =  $start + $results_per_page;
			if ($next >= $this->num_rows)
			{
				$next = 0;
			}
			return 'start='.$next;
		}
		else return '';
	}
	function prev_link()
	{
		if ($this->results_per_page)
		{
			if (!$this->num_pages) $this->get_pages();
			if ($this->num_pages <= 1) return;
			$start = ($_GET['start']) ? $_GET['start'] : 0;
			$results_per_page = $this->results_per_page;
			$prev =  $start - $results_per_page;
			if ($prev <0)
			{
				$prev = $this->num_pages * $this->results_per_page - $this->results_per_page;
			}
			return 'start='.$prev;
		}
		else return '';
	}

	function list_navigation()
	{
		$nav = array();
		if ($prev = $this->prev_link()) $nav[0] = Html::a(SELF_URL.'?'.$this->GET_2_url().'&amp;'.$prev,'Zur?ck');
		if ($next = $this->next_link()) $nav[1] = Html::a(SELF_URL.'?'.$this->GET_2_url().'&amp;'.$next,'Weiter');
		return implode(' | ',$nav);
	}
	function get_pages($sql='')
	{
		if (!$sql) $sql = "SELECT * FROM `$this->table`";
		if (!isset($this->num_rows) ) $num_rows = $this->num_rows = $this->connection->db_num_rows($sql);
		return  $this->num_pages = ($this->results_per_page) ? ceil($this->num_rows/$this->results_per_page) : 0;
	}
	function get_page($index = null)
	{
		$index = ($index !== null) ? $index +1 : $_GET['start']+1;
		return ($this->results_per_page) ? ceil($index / $this->results_per_page) : 0;
	}

	function pagination ()
	{

		$rows = $this->num_rows;
		$return_string = '';
		for ($i = 0;$i<$rows;$i += $this->results_per_page)
		{
			if ($i == $_GET['start'])
			{
				$return_string .= $this->get_page($i).' ';
			}
			else
			{
				$url = SELF_URL.'?start='.$i.'&amp;'.$this->GET_2_url('start');
				$url = preg_replace('/&amp;$/','',$url);
				$return_string .= $this->make_btn_link($url,$this->get_page($i),array('class'=>'button')).' ';
			}
		}
		return $return_string;
	}
	function get_entry($id)
	{
		$id = General::input_clean($id,true);
		$where = (is_array($id)) ? '`'.key($id)."`='".current($id)."'" : "`id` = '$id'";
		$db_table = $this->table;
		$result = $this->connection->db_assoc("SELECT * FROM `$db_table` WHERE $where");

		return $result[0];
	}

	function details($entry)
	{

	}
	function make_form($edit ='',$action = null,$action_parameter_filter = array(),$template = null)
	{
		if ($edit)
		{
			$values = $this->get_entry($edit);
			$edit = (is_array($edit)) ? current($edit) : $edit;
		}
		$GLOBALS['scripts'] .= Html::script("onLoad.push(checkConditions);");
		//$GLOBALS['scripts'] .= Html::script("onLoad.push(sizeTextAreas);");
		$return ='';
		$url = ($action) ? $action : SELF_URL;
		$url .= strstr($url,'?') ? '&amp;' : '?';
		$url .= $this->GET_2_url(array_merge(array('edit','new','noframe','reentry'),$action_parameter_filter));
		//$url .= ($_GET['edit']) ? '#entry'.$_GET['edit'] : '';
		$return .= Form::form_tag($url,'post','multipart/form-data',array('onsubmit'=>"loading();return checkform();"));
		$table = new Table(2,array('class'=>'scaffold'));

		$return .= $this->text_above_form;
		
		if ($this->show_buttons_above_form)
		{
			$input = ($this->submit_button) ? $this->submit_button : Form::add_input('submit','submit','Eintragen',array('class'=>'button'));
			if ($this->show_cancel) $input .= Form::add_input('button','cancel','Abbrechen',array('class'=>'button','onclick'=>'cancelEdit(this)'));
			$table->add_td(array(array(2=>$input)));
		}

		foreach ($this->cols_array as $key => $col)
		{
			$name = $key;
			//$show_name  =  General::wrap_string($col['name'],30);
			$show_name  = $col['name'];
			$show_name .= ($col['required']) ? ' *' :'';

			$id = 'input_'.$GLOBALS['input_id'];
			$encoded_name = rawurlencode($name);
			$attr_array = $col['attributes'];
			if ($col['disabled']) $attr_array['disabled'] = 'disabled';
			else if ($attr_array['disabled'])  unset($attr_array['disabled']);

			if ($this->re_entry || isset($_REQUEST['reentry']) && $_POST[$name]) $value = $_POST[$name];
			else if ($values[$key]) $value = $values[$key];
			else if ($col['value']) $value = $col['value'];
			else $value = '';

			if (isset($col['options']))
			{
				$options = $this->get_options($col['options'],$col['options_sort'],$col['options_insert_id']);
				if (!$col['options_hide_edit_button'])
				{
					$edit_options_btn = (is_string($col['options']) && $this->edit_enabled) ? Html::a("javascript:void(0);",'Optionen bearbeiten',array('class'=>'button','onclick'=>"window.open('".SELF_URL."?nomenu&editoptions=$encoded_name','scaff_dialog','toolbar=no,menubar=yes,personalbar=no,width=500,scrollbars=yes,resizable=yes,modal=yes,dependable=yes');var refresh=document.getElementById('${id}_refresh');refresh.style.display='';refresh.focus();return false;")) : '';
					$edit_options_btn .= Form::add_input('submit','reentry','Aktualisieren',array('id'=>$id.'_refresh','style'=>'display:none'));
					$edit_options_btn = Html::br().$edit_options_btn;
				}
			}


			if ($name != 'id')
			{
				switch ($col['type'])
				{
					case('text'):

						$attr_array['id'] = $id;
						if (isset($col['length']))
						{
							$attr_array['size'] = $field['length'];
							$attr_array['maxlength'] = $field['length'];
						}
						else if (!stristr($attr_array['style'],'width')) $attr_array['style'] .= "width:$this->input_width;";
						
						if ($col['multiple'])
						{
							$input = Form::add_input('text',$encoded_name.'[]',$value,$attr_array);
							$info .= Html::a('javascript:void(0);','+',array('onclick'=>'cloneInput(\''.$id.'\')'));	
						}
						else 
						{
							$input = Form::add_input('text',$encoded_name,$value,$attr_array);							
						}

					break;
					case('select'):
						$attr_array['id'] = $id;

						$select = new Select($encoded_name,array_merge($attr_array,array('onchange'=>"selectOtherOption('$id','".$col['other_option']."')")));
						$select->add_option('','--Bitte ausw�hlen--');
						$attr_array = array();
						if (is_array($options))
						{
							if (!in_array($value,$options) && !key_exists($value,$options)) $col['other'] = $value;
							foreach ($options as $option => $name)
							{
								if ($value == $option)  $attr_array['selected'] = 'selected';
								else unset ($attr_array['selected']);
								$select->add_option($option,$name,$attr_array);
							}
							if ($col['other_option'])
							{
								if ($col['other']) $attr_array['selected'] = 'selected';
								$attr_array['onclick'] = 'otherOption(this,\''.rawurlencode($encoded_name).'\')';
								$select->add_option('',$col['other_option'],$attr_array);
							}
							else unset($attr_array['onclick']);
						}
						$input = $select->flush_select();
						if ($col['other']) $input .= Form::add_input('text',$encoded_name,$col['other'],array('onfocus'=>"selectOtherOption('$id','".$col['other_option']."')",'id'=>$id.'_other'));
						$input .= $edit_options_btn;
					break;
					case('radio'):
						$attr_array['id'] = $id;
						$attr_array = array();
						$input = '';
						foreach ($options as $option => $name)
						{
							if ($value == $option)  $attr_array['checked'] = 'checked';
							else unset ($attr_array['checked']);
							if (isset($col['condition'][$option]))
							{
								$condition = "{input:'".$encoded_name."',value:'".$option."',target:'".$col['condition'][$option]."'}";
								$input .= Html::script("conditions.push($condition)");
								//$attr_array['onchange'] = "checkCondition($condition)";
							}
							else
							{
								//unset($attr_array['onchange']);
							}
							if (isset($col['condition']))
							{
								$attr_array['onchange'] = "checkCondition($condition)";
							}
							else
							{
								unset($attr_array['onchange']);
							}
							$input .= Form::add_input('radio',$encoded_name,$option,$attr_array).' '.$name.Html::br();
						}
						if ($col['condition'])
						{

						}
						$input .= $edit_options_btn;
					break;
					case ('check'):
						
						$input ='';
						if (!is_array($value)) $value = explode('&delim;',$value);

						foreach ($options as $option =>$name)
						{
							if (is_array($value) && in_array($option,$value)) $attr_array['checked'] = 'checked';
							else unset ($attr_array['checked']);
							$input .= Form::add_input('checkbox',$encoded_name.'[]',$option,$attr_array).' '.$name.Html::br();
						}
						if ($col['other_option'])
						{
							$other = array_diff($value,$options);
							$input .= $col['other_option'].' '.Form::add_input('text',$encoded_name.'[]',implode(', ',$other)).Html::br();
						}
						$input .= $edit_options_btn;
						$input = Html::div($input,array('id'=>$id,'name'=>$encoded_name));
					break;
					case ('textarea'):
						$attr_array['id'] = $id;
						if ($col['attributes']['cols'])
						{
							$col['attributes']['cols'];
						}
						else  if (!stristr($attr_array['style'],'width')) $attr_array['style'] .= "width:$this->input_width;";
						$attr_array['rows'] = ($col['attributes']['rows']) ? $col['attributes']['rows'] : 10;
						
						if ($col['max_length'])
						{
							$attr_array['onkeydown'] = 'return maxLength(event,this,'.$col['max_length'].')';
						}
						$input = Form::add_textarea($encoded_name,$value,$attr_array);//,'cols'=>'35','rows'=>'2','onfocus'=>'textarea_grow(\''.$id.'\')','onblur'=>'textarea_shrink(\''.$id.'\')'));

						if ($col['max_length'])
						{
							$input .= Html::span("Noch ".Html::span($col['max_length'] - strlen($value),array('id'=>$id.'_charsleft'))." Zeichen");
						}
						
						if ($col['options']) $input .= Html::br() . $edit_options_btn;
						if ($col['html'])
						{
							$this->xinha_scripts();
						}
					break;
					case ('upload'):

						$input ='';
						$value = $values[$key];
						$entries = array();
						if (!is_array($value)) $entries = explode('&delim;',$value);
						else $entries = $value;

						$upload_folder = '';
						if (is_string($this->upload_folder))
						{
							$this->upload_folder = array($this->upload_folder);
						}
						foreach ($this->upload_folder as $col_name)
						{
							$upload_folder .= $values[$col_name];
						}
						$upload_folder .= '/';


						if (count(General::trim_array($entries)) > 0)
						{
							$subtable = new Table(3);
							foreach ($entries as $file)
							{
								$img_info = @getimagesize($this->upload_path.$upload_folder.$file);
								if ($img_info)
								{
									$thumb = Html::img(SELF_URL.'?img='.rawurlencode($upload_folder.$file).'&amp;x=100',$file);
								}
								else  $thumb = '';
								$check = Form::add_input('hidden',$encoded_name.'[]',$file);
								$check .= Html::br().Form::add_input('checkbox',$encoded_name.'_delfile[]',$file,array("onclick"=>"confirmDelPic(this)")).' Datei l�schen';

								$subtable->add_td(array($thumb,$file.$check));
							}
							$input .= $subtable->flush_table();
							if ($col['upload_max_count']) $input .= Html::span("Maximal ".$col['upload_max_count']." Dateien".Html::br(),array('class'=>'klein'));
						}
						if ($col['upload_max_count'] && count(General::trim_array($entries)) >= $col['upload_max_count']) continue;
						$attr_array['id'] = $id;
						//$input = ($value) ? $value.Form::add_input('hidden',$encoded_name,$value,$attr_array).Html::br().Html::span('Neue Datei verkn�pfen:',array('class'=>'klein')).Html::br():'';
					
						$input .= Form::add_input('file',$encoded_name.'_upload[]');
					//	if ($col['upload_max_count'])
					//	{
							$input .= Form::add_input('submit','reentry','Hochladen');
					//	}
						if ($col['upload_extensions'])
						{
							$input .= Html::br() . Html::span("Erlaubte Erweiterungen: ".implode(', ',$col['upload_extensions']),array('class'=>'klein'));
						}
						if ($col['upload_size'])
						{
							$input .= Html::br() . Html::span("Maximale Dateigr��e: ".$col['upload_size'] .'KB',array('class'=>'klein'));
						}
					break;
					case 'EFM':

					break;
					case ('custom'):
						$input = $col['custom_input'];
					break;
					case ('timestamp'):
						$this->calendar_script();

						$attr_array['id'] = 'tag_'.$GLOBALS['input_id'];
						$attr_array['size'] = '2';
						$input = Form::add_input('text',$encoded_name.'_tag',(($tag=Date::tag($value)) !=0 && $value !='')?$tag:'',$attr_array).'.';


						$attr_array['id'] = 'monat_'.$GLOBALS['input_id'];
						$attr_array['size'] = '2';
						$input .= Form::add_input('text',$encoded_name.'_monat',(($monat=Date::monat($value)) !=0 && $value !='')?$monat:'',$attr_array).'.';


						$attr_array['id'] = 'jahr_'.$GLOBALS['input_id'];
						$attr_array['size'] = '2';
						$input .=Form::add_input('text',$encoded_name.'_jahr',(($jahr=Date::jahr($value)) !=0 && $value !='')?$jahr:'',$attr_array).'&emsp;';

						$attr_array['id'] = 'stunde_'.$GLOBALS['input_id'];
						$attr_array['size'] = '2';
						$input .= Form::add_input('text',$encoded_name.'_stunde',(($stunde=Date::stunde($value)) !=0 && $value !='')?$stunde:'',$attr_array).':';

						$attr_array['id'] = 'minute_'.$GLOBALS['input_id'];
						$attr_array['size'] = '2';
						$input .= Form::add_input('text',$encoded_name.'_minute',(($minute=Date::minute($value)) !=0 && $value !='')?$minute:'',$attr_array);

						$input .= Form::add_input('hidden',$encoded_name,$value,array('id'=>$id));

						$input .= Form::add_input('button','','Kalender',array('id'=>'trigger_'.$GLOBALS['input_id']));

						$script = '
						Calendar.setup(
							{
								inputField : "'.$id.'", // ID of the input field
								ifFormat : "%Y/%m/%d", // the date format
								button : "trigger_"+'.$GLOBALS['input_id'].', // ID of the button
								showsTime : false,
								timeFormat : "24",
								showOthers : true,
								onSelect : onSelect,
								onUpdate : onUpd,
								inputId : '.$GLOBALS['input_id'].',
								prevInput : "test"

							}
						);
						timefields.push("'.$id.'");
				';
						$input .= Html::script($script);
					break;
					case 'email':
						preg_match('/(.*?)<?([0-9a-z.+-]{2,}\@[0-9a-z.-]{2,}\.[a-z]{2,6})>?/',$value,$matches);
						$name_value = trim($matches[1]);
						$mail_value = $matches[2];

						$attr_array['id'] = 'name_'.$GLOBALS['input_id'];
						$input = 'Name '.Form::add_input('text',$encoded_name.'_name',$name_value,$attr_array);

						$attr_array['id'] = 'mail_'.$GLOBALS['input_id'];
						$input .= 'E-Mail '.Form::add_input('text',$encoded_name.'_mail',$mail_value,$attr_array);

					break;
					case 'info':
						$input = $col['value'];
						//$hidden_inputs .= Form::add_input('hidden',$encoded_name,$value,$attr_array);
					break;
					case 'hidden':
						$attr_array['id'] = $id;
						$hidden_inputs .= Form::add_input('hidden',$encoded_name,$value,$attr_array);
						$input ='';
					break;
					case 'ignore':
					unset ($input);
					break;
					case 'changed':
						$input = Form::add_textarea('',$value,array("disabled"=>"disabled")). Form::add_input('hidden',$encoded_name,$value);
					break;
				}
				if ($col['required'] && $input)
				{
					if ($col['type'] == 'timestamp')
					{
						$input .= Html::script("\nrequired_fields.push('".'tag_'.$GLOBALS['input_id']."');");
						$input .= Html::script("\nrequired_fields.push('".'monat_'.$GLOBALS['input_id']."');");
						$input .= Html::script("\nrequired_fields.push('".'jahr_'.$GLOBALS['input_id']."');");
					}
					else $input .= Html::script("\nrequired_fields.push('$id');");
				}
				$alternatig_rows = ($alternatig_rows == 1) ? 0 : 1;
				$td_atributes['class'] = ' alt_row_'.$alternatig_rows;
				if ($col['hidden']) $td_atributes['style'] = 'display:none;';
				else unset($td_atributes['style']);

				if ($col['info'])
				{
					if (!$GLOBALS['toolTipScriptLoaded'])
					{
						$GLOBALS['scripts'] .= Html::script(null,array('src'=>'/Libraries/ToolTip/ToolTip.js'));
						$GLOBALS['scripts'] .= Html::script('onLoad.push(toolTipOnLoad)');
						$GLOBALS['toolTipScriptLoaded'] =true;
					}
					$trigger_id = 'info'.$GLOBALS['input_id'];
					$source_id = "tooltip".$GLOBALS['input_id'];
					$info = ' '.Html::img('/'.INSTALL_PATH . "/System/Scaffold/info.gif",strip_tags($col['info']),array('id' =>$trigger_id,'title'=>strip_tags($col['info'])));
					$info .= Html::div($col['info'],array('id'=>$source_id,"style"=>"display:none"));
					$info .= Html::script("toolTips.push({trigger : '$trigger_id',source : '$source_id',className : 'tooltip'});");
				}
				else $info = '';

				if ($input) $table->add_td(array(Form::add_label($id,$show_name).$info,$input),$td_atributes);

				++$GLOBALS['input_id'];
			}
		}
		$input = ($this->submit_button) ? $this->submit_button : Form::add_input('submit','submit','Eintragen',array('class'=>'button'));
		if ($this->show_cancel)
		{
			if ($this->use_ajax)
			{
				$input .= Form::add_input('button','cancel','Abbrechen',array('class'=>'button','onclick'=>'cancelEdit(this)'));
			}
			else 
			{
				$input .= Form::add_input('submit','cancel','Abbrechen',array('class'=>'button'));
			}
		}
		$input .= Form::add_input('hidden','edit_id',($edit) ? $edit : '');
		$input .= Form::add_input('hidden','submit','submit');
		$input .= $hidden_inputs;
		$table->add_td(array(array(2=>$input)));
		$return .= $table->flush_table();
		$return .= Form::close_form();
		if ($template)
		{
			$t = new Template($template);
			$vars['form'] = $return;
			return $t->parse_template(null,$vars);
		}
		else return $return;
	}

	function db_insert($update = 0)
	{
		if (isset($_POST['cancel'])) return;
		if ($update) $update_array = array();
		$insert_sql = 'REPLACE INTO `'.$this->table.'` (';

		$field_names = array();

		foreach ($this->cols_array as $key => $col)
		{
			$field_name = $key;

			$field_names[] = '`'.$field_name.'`';
		}
		$insert_sql .= implode(', ',$field_names);

		$insert_sql .= ") VALUES (";

		$field_values = array();

		foreach ($_POST as $key => $value)
		{
			if ($key != rawurldecode($key))
			{
				$_POST[rawurldecode($key)] = $value;
				unset($_POST[$key]);
			}
		}
		foreach ($_FILES as $key => $value)
		{
			if ($key != rawurldecode($key))
			{
				$_POST[rawurldecode($key)] = $value;
				unset($_POST[$key]);
			}
		}
		foreach ($this->cols_array as $key => $col)
		{
			$field_value = ($_POST[$key]) ? $_POST[$key] : $col['value'];

			if ($col['type'] == 'select' && strstr($field_value,'--'))
			{
				$field_value = '';
			}


			if ($col['type'] == 'check')
			{
				$t = array();
				$c = count($field_value);
				for ($i =  0;$i<$c;++$i)
				{
					// was bedeutet das hier wohl? ah ja, sonsiges feld mit komma getrennt wird gesplitted und einzeln behandelt
					if (strstr($field_value[$i],','))
					{
						$t = explode(',',$field_value[$i]);
						unset($field_value[$i]);
					}
				}
				foreach ($t as $v)
				{
					$field_value[] = trim($v);
				}
				$field_value = (is_array($field_value)) ? implode('&delim;',General::trim_array( $field_value )) : $field_value;
				if (!$fieldvalue) $_POST[$key] = '';	
			}

			if ($col['type'] == 'timestamp')
			{
				$t = Date::unify_timestamp($_POST[$key.'_jahr'].$_POST[$key.'_monat'].$_POST[$key.'_tag'].$_POST[$key.'_stunde'].$_POST[$key.'_minute'].'00');
				$field_value = $t;
			}
			if ($col['type'] == 'email')
			{
				$field_value = $_POST[$key.'_name'];
				if ($_POST[$key.'_mail']) $field_value .= ' <'.$_POST[$key.'_mail'].'>';
			}
			if ($col['type'] == 'changed')
			{
				$field_value .= ($_POST[$key]) ? "\n" : '' ;
				$field_value .= Date::timestamp2datum( Date::now());
			}

			if ($col['type'] == 'upload')
			{
				if ($col['upload_extensions'])
				{
					$upload_extensions = array();
					foreach ($col['upload_extensions'] as $ext)
					{
						$upload_extensions[] = '\.'.$ext.'$';
					}
					$upload_extensions = implode('|',$upload_extensions);
				}
				if ($col['upload_size'])
				{
					$max_upload = $col['upload_size'] * 1024;
				}

				$field_value = ($_POST[$key]) ? $_POST[$key] :  array();
				$_POST[$key] = isset($_POST[$key]) ? $_POST[$key] : true;
				
				if ($this->upload_folder)
					{
						$upload_folder = '';
						if (is_string($this->upload_folder))
						{
							$this->upload_folder = array($this->upload_folder);
						}
						foreach ($this->upload_folder as $col_name)
						{
							$upload_folder .= $_POST[$col_name];
						}
						if (!RheinaufFile::is_dir($folder = $this->upload_path.$upload_folder))
						{
							RheinaufFile::mkdir($folder);
							RheinaufFile::chmod($folder,'777');
						}
						$upload_folder = $upload_folder."/";
					}
				
				if ($_FILES[$key.'_upload']['name'])
				{
					if (is_array($_FILES[$key.'_upload']['name']))
					{
						$c = count($_FILES[$key.'_upload']['name']);
						for ($i = 0; $i < $c;++$i)
						{
							$f_name = preg_replace("/[^0-9a-z.]/i",'_',$_FILES[$key.'_upload']['name'][$i]);
							if ($f_name && $upload_extensions && !preg_match("/$upload_extensions/i",$f_name))
							{
								$GLOBALS['scripts'] .= Html::script('onLoad.push(function() {alert("Dieses Dateiformat ist nicht erlaubt.")})');
								continue;
							}
							if ($f_name && $max_upload && $_FILES[$key.'_upload']['size'][$i] > $max_upload)
							{
								$GLOBALS['scripts'] .= Html::script('onLoad.push(function() {alert("Die Dateigr��e �bersteigt das erlaubte Maximum")})');
								continue;
							}

							$file = $this->upload_path .$upload_folder. $f_name;
							$uploaded_file = $_FILES[$key.'_upload']['tmp_name'][$i];
							RheinaufFile::move_uploaded_file($uploaded_file, $file);
							RheinaufFile::chmod($file,'777');
							$max_scale = ($col['max_scale']) ?  $col['max_scale'] : $this->max_scale;
							$this->max_scale_image($file,$max_scale);
							$field_value[] = $f_name;
						}
						//$field_value = (is_array($field_value)) ? implode('&delim;',General::trim_array( $field_value )) : $field_value;
					}
					else
					{
						$f_name = preg_replace("/[^0-9a-z.]/i",'_',$_FILES[$key.'_upload']['name']);

						if ($f_name && $upload_extensions && !preg_match("/$upload_extensions/",$f_name))
						{
							$GLOBALS['scripts'] .= Html::script('onLoad.push(function() {alert("Dieses Dateiformat ist nicht erlaubt.")})');
							continue;
						}
						if ($f_name && $max_upload && $_FILES[$key.'_upload']['size'] > $max_upload)
						{
							$GLOBALS['scripts'] .= Html::script('onLoad.push(function() {alert("Die Dateigr��e �bersteigt das erlaubte Maximum")})');
							continue;
						}

						$file = $this->upload_path .$upload_folder. $f_name;
						$uploaded_file = $_FILES[$key.'_upload']['tmp_name'];
						RheinaufFile::move_uploaded_file($uploaded_file, $file);
						RheinaufFile::chmod($file,'777');
						$max_scale = ($col['max_scale']) ?  $col['max_scale'] : $this->max_scale;
						$this->max_scale_image($file,$max_scale);
						$field_value[] = $f_name;
					}
				}
								
				if (is_array($_POST[$key."_delfile"]))
				{
					$field_value = array_diff($field_value,$_POST[$key."_delfile"]);
					foreach ($_POST[$key."_delfile"] as $file)
					{
						RheinaufFile::delete($this->upload_path .$upload_folder.$file);
					}
				}
			}
			if (is_array($field_value)) $field_value = implode('&delim;',General::trim_array( $field_value ));

			if ($key == 'id') $field_value =  ($_POST['edit_id'] !== '' ) ? $_POST['edit_id'] :'';
			$field_value = General::input_clean($field_value,true);
			$field_values[] = "'".$field_value."'";

			if ($update && isset($_POST[$key])) $update_array[$key] = $field_value;
		}

		if ($update)
		{
			$this->connection->db_update($this->table,$update_array,"`id` = $update");
		}
		else
		{
			$insert_sql .= implode(', ',$field_values).')';
			$this->connection->db_query ($insert_sql);
			$this->last_insert_id = $this->connection->db_last_insert_id();
		}
	}

	function delete_entry()
	{
		if (!$this->edit_enabled) return ;
		$id = intval($_GET['delete']);
		$this->connection->db_query("DELETE FROM `$this->table` WHERE `id` = '$id'");
		$url = SELF_URL.'?'.$this->GET_2_url('delete');
		$url = html_entity_decode($url);
		if (isset($_GET['noframe'])) $url .= '&noframe';
		//header("Location: $url");
	}

	function calendar_script ()
	{
		if (!$this->cal_script_loaded)
		{
		 	$GLOBALS['other_css'] .= Html::stylesheet('/'.INSTALL_PATH.'/Libraries/jscalendar/calendar-system.css');
			$GLOBALS['scripts'] .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/jscalendar/calendar.js'));
			$GLOBALS['scripts'] .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/jscalendar/lang/calendar-de.js'));
			$GLOBALS['scripts'] .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/jscalendar/calendar-setup.js'));
			$GLOBALS['scripts'] .= 	Html::script('function onSelect(cal,date) {
		var p = cal.params;

		var tag_if = document.getElementById("tag_"+p.inputId);
		var tag = date.substr(8,2);

		var monat_if = document.getElementById("monat_"+p.inputId);
		var monat = date.substr(5,2);

		var jahr_if = document.getElementById("jahr_"+p.inputId);
		var jahr = date.substr(0,4);

		var stunde_if = document.getElementById("stunde_"+p.inputId);
		var stunde = date.substr(11,2);

		var minute_if = document.getElementById("minute_"+p.inputId);
		var minute = date.substr(14,2);

		tag_if.value = tag;
		monat_if.value = monat;
		jahr_if.value = jahr;
		stunde_if.value = stunde;
		minute_if.value = minute;

		var update = (cal.dateClicked || p.electric);
		if (update && p.inputField) {
			p.inputField.value = cal.date.print(p.ifFormat);
			if (typeof p.inputField.onchange == "function")
				p.inputField.onchange();
		}
		if (update && p.displayArea)
			p.displayArea.innerHTML = cal.date.print(p.daFormat);
		if (update && typeof p.onUpdate == "function")
			p.onUpdate(cal);
		if (update && p.flat) {
			if (typeof p.flatCallback == "function")
				p.flatCallback(cal);
		}
		if (update && p.singleClick && cal.dateClicked)
			cal.callCloseHandler();


	}
	function debug (object) {
		for (var i in object) {
			alert(i + "=>" + object[i]);
		}
	}
	function onUpd (cal) {
		var next;
		var date = new Date(cal.date);
		for (var i=0;i<timefields.length-1;i++) {
			if (timefields[i] == cal.params.inputField.id) {
				next = timefields[i+1];
				if (document.getElementById(next).value == "")
					document.getElementById(next).value = date.print(cal.params.ifFormat);
			}
		}

	}
	var timefields = [];
	');

			$this->cal_script_loaded = true;
		}
	}
	function xinha_scripts($id)
	{
		if (!$this->xinha_loaded)
		{
			$GLOBALS['scripts'] .= Html::script(' _editor_url  = "/'.INSTALL_PATH.'/Libraries/Xinha/";_editor_lang = "de";_document_root = "'.DOCUMENT_ROOT.'"');
			$GLOBALS['scripts'] .= Html::script('',array('src'=>'/'.INSTALL_PATH.'/Libraries/Xinha/XinhaLoader.js'));
			$GLOBALS['scripts'] .= Html::script('
				xinha_editors = [];
				xinha_init    = null;
				xinha_config  = null;
				xinha_plugins = null;

				// This contains the names of textareas we will make into Xinha editors
				xinha_init = xinha_init ? xinha_init : function()
				{

					xinha_plugins = xinha_plugins ? xinha_plugins :
					[
					"SuperClean",

					"ExtendedFileManager",
					//"GetHtml",
					"Linker",
					"DoubleClick"
					];
				   
					xinha_editors.push("'.$id.'");

					if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;
					
					xinha_config = xinha_config ? xinha_config : new Xinha.Config();


					xinha_config.statusBar = false;
					xinha_config.toolbar =
					 [
					    ["bold","italic"],
					    ["separator","createlink","insertimage"],
					    ["separator","undo","redo","selectall"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
					    ["separator","killword","separator","htmlmode","about","showhelp"]
				 	 ];

					//xinha_config.flowToolbars = false;
					xinha_config.showLoading = true;
					//xinha_config.only7BitPrintablesInURLs = false;


					xinha_config.SuperClean.show_dialog = true;
				    xinha_config.SuperClean.filters = {
				               "tidy": Xinha._lc("General tidy up and correction of some problems.", "SuperClean"),
				               "word": "Word"
				    }

				    xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

					Xinha.startEditors(xinha_editors);

				}
			window.onload = xinha_init;
		');
			$this->xinha_loaded = true;
		}
		else
		{
			$GLOBALS['scripts'] .= Html::script('xinha_editors.push("'.$id.'")');
		}
	}
	function edit_scripts()
	{
		if ($GLOBALS['scaff_edit_scripts_loaded']) return;
		$GLOBALS['scaff_edit_scripts_loaded'] = true;
		$GLOBALS['scripts'] .= Html::script('',array('src'=>'/Scripts/ScaffoldScripts.js'));
		if (!$GLOBALS['toolTipScriptLoaded'])
		{
			$GLOBALS['scripts'] .= Html::script(null,array('src'=>'/Libraries/ToolTip/ToolTip.js'));
			$GLOBALS['scripts'] .= Html::script('onLoad.push(toolTipOnLoad)');
			$GLOBALS['toolTipScriptLoaded'] =true;
		}
	}
	function http_request_scripts()
	{
		if ($GLOBALS['http_request_scripts']) return;
		$GLOBALS['http_request_scripts'] = true;

		$GLOBALS['scripts'] .= Html::script('',array('src'=>'/Scripts/XMLHttpRequest.js'));
	}
	function GET_2_url ($skip = '')
	{
		$return = array();
		if (!is_array($skip)) $skip = array($skip);
		$skip = array_merge($skip,$this->custom_parameter_filter);
		foreach ($_GET as $key => $value)
		{
			if ($key == 'r' || $key == 's' || $key == 'noframe' || in_array($key,$skip) ) continue;
			$value = rawurlencode($value);
			$return[] = "$key=$value";
		}
		return implode('&amp;',$return);
	}
	function GET_2_input ($skip = '')
	{
		$return = array();
		if (!is_array($skip)) $skip = array($skip);
		$skip = array_merge($skip,$this->custom_parameter_filter);
		foreach ($_GET as $key => $value)
		{
			if ($key == 'r' || $key == 's' || $key == 'noframe' || in_array($key,$skip)) continue;
			$value = $value;
			$return[] = Form::add_input('hidden',$key,$value);
		}
		return implode("\n",$return);
	}
	
	function get_filters($glue = "&amp;")
	{
		$set_filters = array();
		foreach ($this->enable_search_for as $f)
		{
			if ($_GET[$f]) $set_filters[] = rawurlencode($f) .'='.rawurlencode($_GET[$f]);
		}
		if ($_GET['start']) $set_filters[] = "start=".intval($_GET['start']);
		return implode($glue,$set_filters);
	}

	function make_btn_link($url,$content,$attributes)
	{
		if (!is_array($attributes)) $attributes = array();
		if (!strstr($url,'noframe'))
		{
			$noframe = (strstr($url,'?')) ? '&noframe' : '?noframe';
		}
		$url_decoded = html_entity_decode($url);
		$ajax = array();
		if ($this->use_ajax) $ajax = array('onclick'=>"httpRequestGET('$url_decoded$noframe',setContent);return false");
		$attributes = array_merge($attributes,$ajax);
		$link = Html::a($url,$content,$attributes);

		return $link;
	}

	function add_search_field ($col_name,$search_method = '')
	{
		$this->enable_search_for[] = $col_name;
		if ($search_method) $this->cols_array[$col_name]["search_method"] = $search_method;
	}

	function export($result,$ignore = array('id'),$filename = 'export.xls')
	{
		if (!is_array($ignore)) $ignore = array($ignore);

		require_once 'Spreadsheet/Excel/Writer.php';

		$workbook = new Spreadsheet_Excel_Writer();

		// sending HTTP headers
		$workbook->send($filename);

		// Creating a worksheet
		$worksheet =& $workbook->addWorksheet(str_replace("RheinaufCMS>",'',$this->table));
		$row = 0;
		$col = 0;

		foreach ($result[0] as $key => $value)
		{
			if (in_array($key,$ignore)) continue;
			$worksheet->write($row,$col, $key);
			++$col;
		}

		foreach ($result as $key => $entry)
		{
			++$row;
			$col = 0;
			foreach ($entry as $row_key => $value)
			{
				if (in_array($row_key,$ignore)) continue;
				$value = preg_replace('/\r?\n|&delim;/',chr(10),$value);
				$worksheet->write($row,$col, $value);
				++$col;
			}

		}
		$workbook->close();
		$url = SELF_URL.'?'.$this->GET_2_url(array('export'));
		$url = html_entity_decode($url);
//		header("Location: $url");
		exit;
	}

	function insert_custom($next_to,$name,$custom_input,$where='after')
	{
		$temp = array();
		$GLOBALS['custom_input'] = $GLOBALS['custom_input'] ? $GLOBALS['custom_input'] : 1;
		
		foreach ($this->cols_array as $key => $value)
		{
			if ($key == $next_to)
			{
				if ($where == 'before')
				{
					$temp['custom'.$GLOBALS['custom_input']]['name'] = $name;
					$temp['custom'.$GLOBALS['custom_input']]['type'] = 'custom';
					$temp['custom'.$GLOBALS['custom_input']]['custom_input'] = $custom_input;
					$temp[$key] = $value;
				}
				else 
				{
					$temp[$key] = $value;
					$temp['custom'.$GLOBALS['custom_input']]['name'] = $name;
					$temp['custom'.$GLOBALS['custom_input']]['type'] = 'custom';
					$temp['custom'.$GLOBALS['custom_input']]['custom_input'] = $custom_input;
				}

				++$GLOBALS['custom_input'];
			}
			else $temp[$key] = $value;
		}
		$this->cols_array = $temp;
	}
	// DEPRECATED
	function insert_custom_after($after,$name,$custom_input)
	{
		$this->insert_custom($after,$name,$custom_input);
	}
	function img_thumb()
	{
		if (!class_exists('Bilder')) include_once('Bilder.php');

		$url = $this->upload_path . $_GET['img'];
		$x = $_GET['x'];
		$img = new Bilder($url);
		if ($x < $img->img_x)
		{
			$img->scaleMaxX($x);
		}
		else $img->new_image = $img->old_image;
		$img->output();
		exit;
	}
	
	function max_scale_image($file,$max_scale)
	{
		$size = @getimagesize($file);
		if (!$size) return;
		if ($size[0] > $max_scale['x'] || $size[1] > $max_scale['y'])
		{
			if (!class_exists('Bilder')) include_once('Bilder.php');
			if (!is_writeable($file)) RheinaufFile::chmod($file,'777');

			$img = new Bilder($file,$file);
			if ($size[0] > $max_scale['x'])
			{
				$img->scaleMaxX($max_scale['x']);
			}
			else
			{
				$img->scaleMaxY($max_scale['y']);
			}
			$img->output();
		}
	}

	function get_options($options_value,$sort = false,$insert_index = false)
	{
		if (is_string($options_value))
		{
			$options = array();
			$options_table = ($this->options_table) ? $this->options_table : $this->table.">Options";
			$a = $this->connection->db_assoc("SELECT * FROM `$options_table` WHERE `Context` = '$options_value' ORDER BY `id`");

			foreach ($a as  $v)
			{
				$index = ($insert_index) ? $v['id'] : $v['Text'];
				$options[$index] = $v['Text'];
			}
		}
		else
		{
			$options = array();
			$a = $options_value;
			foreach ($a as $k => $v)
			{
				if (is_numeric($k) && !$insert_index) $k = $v;
				$options[$k] = $v;
			}
		}

		if ($sort) asort($options);

		return $options;
	}

	function edit_options()
	{
		$context = $_GET['editoptions'];
		$options_table = ($this->options_table) ? $this->options_table : $this->table.">Options";
		$edit_options_scaff = new Scaffold($options_table,$this->connection);
		//$edit_options_scaff->connection->debug = true;
		$edit_options_scaff->edit_enabled = true;
		$edit_options_scaff->options_editor = true;
		$edit_options_scaff->show_buttons_above_form = false;
		$edit_options_scaff->cols_array['Context']['value'] =  $context;
		$edit_options_scaff->cols_array['Context']['type'] =  'hidden';
		$edit_options_scaff->sql = "SELECT * FROM `$edit_options_scaff->table` WHERE `Context` = '$context'";

		return $edit_options_scaff->make_table(null,INSTALL_PATH.'/System/Scaffold/EditOptions.table.template.html');
	}

	function create_options_table()
	{
		$options_table = ($this->options_table) ? $this->options_table : $this->table.">Options";

		$sql = "CREATE TABLE IF NOT EXISTS `$options_table` (
				  `id` int(11) NOT NULL auto_increment,
				  `Text` text NOT NULL,
				  `Context` varchar(50) NOT NULL default '',
				  PRIMARY KEY  (`id`)
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

		$this->connection->db_query($sql);
	}
	
	function loadCSS()
	{
	  if ( $GLOBALS['ScaffoldCSS_loaded'] ) 
	  {
	    return;
	  }
	  $GLOBALS['ScaffoldCSS_loaded'] = true;
	  $GLOBALS['other_css'] .= Html::stylesheet("/CSS/Scaffold.css");
	}
}

?>
