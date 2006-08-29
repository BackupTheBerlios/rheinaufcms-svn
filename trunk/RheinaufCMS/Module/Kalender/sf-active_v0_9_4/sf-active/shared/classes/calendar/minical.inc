<?
// this should be made object oriented to match other sf-active code

include_once(SF_WEB_PATH . "/calendar/common_include.inc");


class Minical extends Cache{
	
	var $event_array;
	var $months = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
	
	function Minical ($location = '') {

		if ($GLOBALS['minical_num_events'] > 0)
			$limit = $GLOBALS['minical_num_events'];
		else 
			$limit = 5; // default value is 5

		if(is_array($location))
		{
		    include(SF_CACHE_PATH.'/location_options.inc');
		    $loc = $location_options[$location[location_id]];
		    $this->file_name = SF_CACHE_PATH.'/calendar/'.$loc.'_minical.html';
		}else{
		    $this->file_name = SF_CACHE_PATH.'/calendar/minical.html';
		}

		$begin_date = new Date;
		$begin_date->set_date_to_now();
		$begin_date->move_to_start_of_day();
		$end_date = new Date;
		$end_date->set_date_to_now();
		$end_date->move_forward_n_days(30);

		$begin_date = $begin_date->get_unix_time();
		$end_date = $end_date->get_unix_time();

		$event=new Event();
		$this->event_array=$event->find_between_dates(
			date("Y/m/d",$begin_date),
			date("Y-m-d",$end_date),
			$location,
			$limit); 

		$this->event_array = @array_reverse($this->event_array);
	}

	function display() {
		$template_obj = new FastTemplate(SF_TEMPLATE_PATH);
		$template_obj->clear_all();
		$template_obj->define( array(	box => 'minical_event_box.tpl',
					row => 'minical_event_row.tpl')
				);

		if ( sizeof($this->event_array) > 0 ) {
			foreach ($this->event_array as $next_event) {
			
				$date = $this->months[$next_event->get_start_month() - 1] . ' ' . $next_event->get_start_day();
				$link = '/calendar/event_display_detail.php?event_id=' . $next_event->get_id();
				$title = $next_event->get_title();
				
				$row = array (	DATE => $date,			
					LINK => $link,		
					TITLE => $title
				);
				$template_obj->assign($row);
				$template_obj->parse(CONTENT,"row");
				$rows .= $template_obj->fetch('CONTENT');
			}
		}else{
		    $rows = "<? echo(\$sftr->trans('cal_no_events')); ?>";
		}	
			$template_obj->assign(array(EVENTS => $rows));
			$template_obj->parse(CONTENT, 'box');
			$return_html = $template_obj->fetch('CONTENT');

		return $return_html;
	}

	function cache() {
		$this->cache_file($this->display(), $this->file_name);

	}

}
?>
