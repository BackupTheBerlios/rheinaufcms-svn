<?php
class Bilder
{
	var $type;
	var $type_constant;
	var $img_x;
	var $img_y;
	var $old_image;
	var $new_image;
	var $istruecolor;
	var $output_file;

	function  Bilder($image='new',$output_file='',$x=0,$y=0)
	{
		$this->output_file = $output_file;
		if ($image != 'new')
		{
			$is_img = $this->get_image_details($image);
			if (!$is_img) return false;
			$this->get_image($image);
		}
		else
		{
			$this->get_image ($image);
		}

	}

	    /**
     * Scale the image to have the max x dimension specified.
     *
     * @param int $new_x Size to scale X-dimension to
     * @return none
     */
    function scaleMaxX($new_x)
    {
        $new_y = round(($new_x / $this->img_x) * $this->img_y, 0);
        return $this->resize($new_x, $new_y);
    } // End resizeX

	function scaleMaxY($new_y)
    {
        $new_x = round(($new_y / $this->img_y) * $this->img_x, 0);
        return $this->resize($new_x, $new_y);
    } // End resizeY

    /**
     * Scale Image to a maximum or percentage
     *
     * @access public
     * @param mixed (number, percentage 10% or 0.1)
     * @return mixed none or PEAR_error
     */
    function scale($size)
    {
        if ((strlen($size) > 1) && (substr($size,-1) == '%')) {
            return $this->scaleByPercentage(substr($size, 0, -1));
        } elseif ($size < 1) {
            return $this->scaleByFactor($size);
        } else {
            return $this->scaleByLength($size);
        }
    } // End scale

    /**
     * Scales an image to a percentage of its original size.  For example, if
     * my image was 640x480 and I called scaleByPercentage(10) then the image
     * would be resized to 64x48
     *
     * @access public
     * @param int $size Percentage of original size to scale to
     * @return none
     */
    function scaleByPercentage($size)
    {
        return $this->scaleByFactor($size / 100);
    } // End scaleByPercentage

    /**
     * Scales an image to a factor of its original size.  For example, if
     * my image was 640x480 and I called scaleByFactor(0.5) then the image
     * would be resized to 320x240.
     *
     * @access public
     * @param float $size Factor of original size to scale to
     * @return none
     */
    function scaleByFactor($size)
    {
        $new_x = round($size * $this->img_x, 0);
        $new_y = round($size * $this->img_y, 0);
        return $this->resize($new_x, $new_y);
    } // End scaleByFactor

    /**
     * Scales an image so that the longest side has this dimension.
     *
     * @access public
     * @param int $size Max dimension in pixels
     * @return none
     */
    function scaleByLength($size)
    {
         if ($this->img_x >= $this->img_y) {
            $new_x = $size;
            $new_y = round(($new_x / $this->img_x) * $this->img_y, 0);
        } else {
            $new_y = $size;
            $new_x = round(($new_y / $this->img_y) * $this->img_x, 0);
        }
        return $this->resize($new_x, $new_y);
    } // End scaleByLength


	    /**
	 * Sets the image type (in lowercase letters), the image height and width.
	 *
	 * @return mixed TRUE or PEAR_error
	 * @access protected
	 * @see PHP_Compat::image_type_to_mime_type()
	 * @link http://php.net/getimagesize
	 */
	function get_image_details($image)
	{
	    $data = @getimagesize($image);
	    //  1 = GIF,   2 = JPG,  3 = PNG,  4 = SWF,  5 = PSD,  6 = BMP,
	    //  7 = TIFF (intel byte order),   8 = TIFF (motorola byte order),
	    //  9 = JPC,  10 = JP2, 11 = JPX, 12 = JB2, 13 = SWC, 14 = IFF,
	    // 15 = WBMP, 16 = XBM
	    if (!is_array($data)) {
	        return false;
	    }

	    switch ($data[2]) {
	        case IMAGETYPE_GIF:
	            $type = 'gif';
	            break;
	        case IMAGETYPE_JPEG:
	            $type = 'jpeg';
	            break;
	        case IMAGETYPE_PNG:
	            $type = 'png';
	            break;
	        case IMAGETYPE_SWF:
	            $type = 'swf';
	            break;
	        case IMAGETYPE_PSD:
	            $type = 'psd';
	            break;
	        case IMAGETYPE_BMP:
	            $type = 'bmp';
	            break;
	        case IMAGETYPE_TIFF_II:
	        case IMAGETYPE_TIFF_MM:
	            $type = 'tiff';
	            break;
	        case IMAGETYPE_JPC:
	            $type = 'jpc';
	            break;
	        case IMAGETYPE_JP2:
	            $type = 'jp2';
	            break;
	        case IMAGETYPE_JPX:
	            $type = 'jpx';
	            break;
	        case IMAGETYPE_JB2:
	            $type = 'jb2';
	            break;
	        case IMAGETYPE_SWC:
	            $type = 'swc';
	            break;
	        case IMAGETYPE_IFF:
	            $type = 'iff';
	            break;
	        case IMAGETYPE_WBMP:
	            $type = 'wbmp';
	            break;
	        case IMAGETYPE_XBM:
	            $type = 'xbm';
	            break;
	        default:
	            return false;
	        break;
	    }
	    $this->img_x = $this->new_x = $data[0];
	    $this->img_y = $this->new_y = $data[1];
		$this->type_constant = $data[2];
	    $this->type  = $type;


	    return true;
	}

	function get_image ($image)
	{
		$this->old_image = imagecreatefromstring(file_get_contents($image));
		$this->istruecolor = imageistruecolor($this->old_image);

	}

	function new_gd($x,$y,$truecolor=true)
	{

		$im = imagecreatetruecolor($x,$y);
		$black = imagecolorallocate($im,0,0,0);
		imagecolortransparent($im,$black);
		return $im;
	}

	function resize($new_x,$new_y)
	{
		$this->new_image = $this->new_gd($new_x,$new_y,$this->istruecolor);
		imagecopyresampled($this->new_image,$this->old_image,0,0,0,0,$new_x,$new_y,$this->img_x,$this->img_y);
	}

	function output()
	{
		$file = $this->output_file;
		switch ($this->type)
		{
			case 'jpeg':
				if ($file == '')
				{
					header("Content-type: image/jpeg");
					imagejpeg($this->new_image);
				}
				else imagejpeg($this->new_image,$file);
			break;
			case 'gif':
			if (function_exists('imagegif'))
			{
				if ($file == '')
				{
					header("Content-type: image/gif");
					imagegif($this->new_image);
				}
				else imagegif($this->new_image,$file);
			}
			else
			{
				if ($file == '')
				{
					header("Content-type: image/png");
					imagepng($this->new_image,preg_replace('#\.gif$#','.png',$file));
				}
				else imagepng($this->new_image,$file);
			}
			break;
			case 'png':
				if ($file == '')
				{
					header("Content-type: image/png");
					imagepng($this->new_image);
				}
				else imagepng($this->new_image,$file);
			break;
			default:
			 return false;
			break;
		}
		imagedestroy($this->new_image);
		imagedestroy($this->old_image);
	}
}
?>