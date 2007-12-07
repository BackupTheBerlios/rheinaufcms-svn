<?php
class Page
{
	private $id;
	private $name;
	private $URL;
	private $hidden;
	private $module;
	private $parentID;
	
	private $ancestors = array();
	private $children  = array();
	
	
	private $view_previleges;
	private $edit_previleges;
	
	private $content;
	
	private $changed;
	private $changed_by;
	
	private $locked;
	private $locked_by;
	
	function __construct($page_props)
	{
		$this->name = $page_props['name'];
		$this->URL  = $page_props['URL'];
		$this->hidden  = $page_props['hidden'];
		$this->module = $page_props['module'];
		$this->parentID = $page_props['parentID'];
	}
	

	public function get_name()
	{
		return $this->name;
	}
	public function get_URL()
	{
		return $this->URL;
	}
	public function get_parent_id()
	{
		return $this->parentID;
	}
	public function get_child($index)
	{
		return $this->children[$index];
	}
	public function get_parent()
	{
		return $this->ancestors[count($this->ancestors)-1];
	}
	public function get_ancestors()
	{
		return $this->ancestors;
	}
	public function add_child(Page $page)
	{
		$this->children[] =& $page;
	}
	public function add_ancestor(Page $page)
	{
		$this->ancestors[] =& $page;
	}
	public function get_breadcrumbs()
	{
		return new Breadcrumbs($this);
	}
	public function get_content()
	{
		
	}
}
class Breadcrumbs
{
	private $page;
	private $array = array();
	
	function __construct(Page $page)
	{
		$this->page = $page;
		$this->to_array();
	}
	private function to_array()
	{
		$ancestors = array_reverse($this->page->get_ancestors());
		$ancestors[] = $this->page;
		foreach ($ancestors as $v)
		{
			$this->array[] = array(
				'name'=> $v->get_name(),
				'URL' => $v->get_URL()
			);
		}
		
	}
	public function to_html()
	{
		$ret = "<ul>\n";
		foreach ($this->array as $v)
		{
			$ret .= '<li><a href="'.$v['URL'].'">'.$v['name'].'</a></li>'."\n";
		}
		$ret .= '</ul>';
		return $ret;
	}
}  
?>
