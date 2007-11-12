<?php //Das perfekte Popup.Immer die richtige Größe, schön gecentert

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
<head>
   <meta http-equiv="Content-type" content="text/html; charset=ISO-8859-1" />
   <title>buddY e.V. - Pädagogen | Buddy-Datenbank</title>
	<link rel="stylesheet" href="/RheinaufCMS/CSS/Design.css" media="screen" type="text/css" />
	
	
	<meta name="author" content="Buddy-e.V." />
	<meta name="keywords" content="buddY-Projekt, buddy, buddy-ev, soziale Kompetenz für Schüler" />

	<style type="text/css">
body,html{padding:0;background-color:black;text-align:center}

</style>
	<script type="text/javascript">
	function init()
	{
		var img = document.getElementById('img');
		var w = img.offsetWidth;
		var h = img.offsetHeight;
		
		img.style.cursor = 'pointer';
		img.onclick = function () {window.close();}
		img.title = 'Klicken, um das Fenster zu schließen';
		
		window.resizeTo(w + 25 ,h);

		if (opener && opener.outerWidth)
		{
			var x = opener.screenX + (opener.outerWidth - w) / 2;
			var y = opener.screenY + (opener.outerHeight - h) / 2;
		}
		else
		{//IE does not have window.outer... , so center it on the screen at least
			var x =  (self.screen.availWidth - w) / 2;
			var y =  (self.screen.availHeight - h) / 2;
		}
		window.moveTo(x,y);
	}
	window.onload = init;
	/** Detect the size of visible area
 *  @param {Window} scope optional When calling from a popup window, pass its window object to get the values of the popup
 *  @returns {Object} Object with Integer properties x and y
 */
function viewportSize(scope)
{
  scope = (scope) ? scope : window;
  var x,y;
  if (scope.innerHeight) // all except Explorer
  {
    x = scope.innerWidth;
    y = scope.innerHeight;
  }
  else if (scope.document.documentElement && scope.document.documentElement.clientHeight)
  // Explorer 6 Strict Mode
  {
    x = scope.document.documentElement.clientWidth;
    y = scope.document.documentElement.clientHeight;
  }
  else if (scope.document.body) // other Explorers
  {
    x = scope.document.body.clientWidth;
    y = scope.document.body.clientHeight;
  }
  return {'x':x,'y':y};
};
/** Detect the size of the whole document
 *  @param {Window} scope optional When calling from a popup window, pass its window object to get the values of the popup
 *  @returns {Object} Object with Integer properties x and y
 */
function pageSize (scope)
{
  scope = (scope) ? scope : window;
  var x,y;
 
  var test1 = scope.document.body.scrollHeight; //IE Quirks
  var test2 = scope.document.documentElement.scrollHeight; // IE Standard + Moz Here quirksmode.org errs! 

  if (test1 > test2) 
  {
    x = scope.document.body.scrollWidth;
    y = scope.document.body.scrollHeight;
  }
  else
  {
    x = scope.document.documentElement.scrollWidth;
    y = scope.document.documentElement.scrollHeight;
  }  
  return {'x':x,'y':y};
};
</script>
</head>

<body>
<img id="img" src="<?php print $_GET['img'] ?>" />
</body>
</html>
