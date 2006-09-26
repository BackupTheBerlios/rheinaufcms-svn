<?php
/**
 * HTML
 *
 * @author Ray
 * @package RheinaufCMS
 *
 *
 */

class Html
{
	var $return_string ='';
	var $header_string = '';
	var $title ='';
	var $body_attributes = array();

	function Html()
	{
	}

	function doctype($doctype = 'xhtml_1_strict')
	{
		switch ($doctype)
		{
			case ('xhtml_1_strict'):
				$return = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">';
			break;
		}

		return $return;
	}

	function title()
	{
		$return = "<title>$this->title</title>\n";
		$this->header_string .= $return;
	}

	function meta ($attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);
		$return = "<meta $attributes_string />\n";
		$this->header_string .= $return;
		return $return;
	}
	function link ($attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = "<link $attributes_string />\n";
		$this->header_string .= $return;
		return $return;
	}
	function stylesheet ($href,$media='screen')
	{
		return '<link rel="stylesheet" href="'.$href.'" media="'.$media.'" type="text/css" />';
	}
	function style ($content)
	{	if ($content != '') $content = "\n/*<![CDATA[ */\n$content\n/*]]>*/\n";
		$return = '<style type="text/css">'."\n$content\n</style>\n";
		$this->header_string .= $return;
		return $return;
	}

	function head ($charset="ISO-8850-1",$doctype = 'xhtml_1_strict')
	{
		$return = $this->doctype($doctype);
		$this->meta(array('http-equiv'=>'Content-type','content'=>'text/html; charset='.$charset));
		$return .= "<head>\n".$this->title().$this->header_string."\n</head>\n";
		$return .= $this->body();
		return $return;
	}
	function body ()
	{
		$attributes_string = Html::make_attribute_string($this->body_attributes);

		$return = "<body$attributes_string>\n";
		return $return;
	}

	function div ($content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = "<div$attributes_string>$content\n</div>\n";
		$this->return_string .= $return;
		return $return;
	}

	function p ($content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = "<p$attributes_string>$content\n</p>\n";
		$this->return_string .= $return;
		return $return;
	}

	function span ($content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = "<span$attributes_string>$content</span>";
		$this->return_string .= $return;
		return $return;
	}

	function img($src,$alt='',$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = '<img src="'.$src.'" alt="'.$alt.'"'."$attributes_string />\n";
		$this->return_string .= $return;
		return $return;
	}

	function h ($ordnung,$content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = '<h'.$ordnung.$attributes_string.'>'.$content."</h$ordnung>\n";
		$this->return_string .= $return;
		return $return;
	}

	function a ($href,$content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = '<a href="'.$href.'"'."$attributes_string>$content</a>\n";
		$this->return_string .= $return;
		return $return;
	}

	function script ($content,$attributes=array(),$type='text/javascript')
	{
		$attributes_string = Html::make_attribute_string($attributes);

		if ($content != '') $content = "\n//<![CDATA[\n$content\n//]]>\n";

		$return = "<script type=\"$type\"$attributes_string>$content\n</script>\n";
		$this->return_string .= $return;
		return $return;
	}

	function custom ($element)
	{
		$this->return_string .= $element;
		return $element;
	}

	function bold ($content)
	{
		$return = "<strong>$content</strong>";
		$this->return_string .= $return;
		return $return;
	}

	function italic ($content)
	{
		$return = "<em>$content</em>";
		$this->return_string .= $return;
		return $return;
	}
	function br ()
	{
		$return = '<br />';
		$this->return_string .= $return;
		return $return;
	}

	function flush_page()
	{
		return $this->head().$this->return_string."</body>\n</html>";
	}

	function html_legal_id ($str)
	{
		return preg_replace('/^[0-9]|[^0-9a-z-_.:%[\]]/i','',$str);
	}

	function css_legal_classname ($str)
	{
		 return preg_replace('/^[0-9\-]|[^0-9a-z_\s\-]/i','',$str);
	}

	function cdata ($str)
	{
		$str = strip_tags($str);
		$str = htmlspecialchars($str);
		return $str;
	}
	function pcdata ($str)
	{
		$str = htmlspecialchars($str);
		return $str;
	}
	function make_attribute_string ($attr_array)
	{if (!is_array($attr_array)) return '';
		$attributes_string = '';
		foreach ($attr_array as $attribute => $value)
		{
			if ($attribute == 'id' || $attribute == 'for' || $attribute == 'name' || $attribute == 'headers')
			{
				$value = Html::html_legal_id($value);
			}
			else if ($attribute == 'class')
			{
				$value = Html::css_legal_classname($value);
			}
			else $value = Html::cdata($value);

			$attributes_string .= ' '. $attribute.'="'.$value.'"';
		}
		return $attributes_string;
	}
}

class HtmlList extends Html
{
	var $return_string;
	var $tag;

	function HtmlList($tag='ul',$attributes=array())
	{
		$this->tag = $tag;
		$attributes_string = Html::make_attribute_string($attributes);

		$this->return_string = "<$tag $attributes_string>\n";
	}

	function add_li ($content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$return = "<li$attributes_string>$content</li>\n";
		$this->return_string .= $return;
		return $return;
	}

	function flush_list()
	{
		$tag = $this->tag;
		return $this->return_string."</$tag>\n";
	}
}
class Form extends Html
{
	var $return_string;

	function Form()
	{
	}

	function form_tag ($action,$method='',$enctype = '',$attributes=array())
	{
		$method = ($method != '') ? $method : "post";
		$enctype = ($enctype != '') ? $enctype : 'application/x-www-form-urlencoded';

		$attributes_string = Html::make_attribute_string($attributes);

		$element .= '<form action="'.$action.'" method="'.$method.'" enctype="'.$enctype.'" '.$attributes_string.'>'."\n";
		$this->return_string .= $element;
		return $element;
	}

	function add_custom ($element)
	{
		$this->return_string .= $element;
		return $element;
	}

	function add_input($type,$name,$value='',$attributes=array())
	{

		$element ='';

		$value = ($value != '') ? 'value="'.Html::pcdata($value).'"' : '';

		$attributes_string = Html::make_attribute_string($attributes);

		if ($type == 'image')
		{
			$element .= '<input type="hidden" name="'.Html::html_legal_id($name).'" '.$value.' />';
		}
		$element .= '<input type="'.$type.'" name="'.Html::html_legal_id($name).'" '.$value.$attributes_string ."/>\n";
		$this->return_string .= $element;
		return $element;
	}

	function add_textarea($name,$content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$element = '<textarea name="'.Html::html_legal_id($name).'"'.$attributes_string.' >'.Html::pcdata($content).'</textarea>';
		$this->return_string .= $element;
		return $element;
	}

	function add_label ($for_id, $content,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$element = '<label for="'.$for_id.'"'.$attributes_string.' >'.$content.'</label>';
		$this->return_string .= $element;
		return $element;
	}

	function close_form()
	{
		return "\n</form>\n";
	}

	function flush_form()
	{
		return $this->return_string.$this->close_form();
	}

	function fieldset($content,$legend,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$element = '<fieldset'.$attributes_string.' ><legend>'.$legend.'</legend>'.$content.'</fieldset>';

		$this->return_string .= $element;
		return $element;
	}
}

class Select extends Form
{
	var $select;

	function Select($name,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$element = '<select name="'.Html::html_legal_id($name).'"'." $title$attributes_string $custom>\n";
		$this->select .= $element;
		return $element;
	}

	function add_option ($value,$text ='',$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		if ($text == '') $text = $value;
		$element = '<option value="'.$value.'" '.$attributes_string.'>'.$text.'</option>'."\n";
		$this->select .= $element;
		return $element;
	}

	function flush_select()
	{
		return $this->select."\n</select>\n";
	}
}

class Table extends Html
{
	var $cols;
	var $caption ='';
	var $thead;
	var $tbody;
	var $tbody_id ='';
	var $table_attributes;

	function Table($cols,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$this->cols = $cols;
		$this->table_attributes = $attributes_string;
	}

	function id_tbody ($id)
	{
		$this->tbody_id = ' id="'.$id.'"';
	}

	function add_caption ($data,$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$this->caption = "<caption$attributes_string>$data</caption>\n";
	}

	function add_th ($data = array(),$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$this->thead .= "<tr>\n";
		for ($i = 0;$i<$this->cols;$i++)
		{
			if (is_array($data[$i]))
			{
				$this->thead .= '<th colspan="'.key($data[$i]).'"'.$attributes_string.'>'.current($data[$i]).'</th>'."\n";
				$i + key($data[$i]);
			}
			else
			{
				$this->thead .= "<th$attributes_string>$data[$i]</th>\n";
			}
		}

		$this->thead .= "</tr>\n";
	}

	function add_td ($data = array(),$attributes=array())
	{
		$attributes_string = Html::make_attribute_string($attributes);

		$this->tbody .= "<tr>\n";
		for ($i = 0;$i<$this->cols;$i++)
		{
			if (is_array($data[$i]))
			{
				$this->tbody .= '<td colspan="'.key($data[$i]).'"'.$attributes_string.'>'.current($data[$i]).'</td>'."\n";
				$i = $i + key($data[$i]);
			}
			else
			{
				$this->tbody .= "<td$attributes_string>$data[$i]</td>\n";
			}
		}

		$this->tbody .= "</tr>\n";
	}

	function flush_table()
	{
		$thead = ($this->thead != '') ? "<thead>\n".$this->thead."\n</thead>\n" : '';
		$tbody = ($this->tbody != '') ? '<tbody'.$this->tbody_id.'>'."\n".$this->tbody."\n</tbody>\n" : '';
		return "\n<table$this->table_attributes>\n".$this->caption."\n".$thead.$tbody."\n</table>\n";
	}
}
?>