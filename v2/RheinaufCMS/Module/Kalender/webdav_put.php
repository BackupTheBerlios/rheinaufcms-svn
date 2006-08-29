<?php
class webdav_put extends HTTP_WebDAV_Server
{
	var $output_path;
	var $data;

	function PUT (&$params)
	{
		$res = $params['stream'];
		if (is_resource($res) && get_resource_type($res) == "stream")
		{
		  	while(!@feof($res))
				{
				    $this->data .= fgets($res,4096);
				}
				@fclose($res);
		}
		return '200 OK';
	}
}

?>