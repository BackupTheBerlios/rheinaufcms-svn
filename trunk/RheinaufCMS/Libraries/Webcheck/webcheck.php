<?php phpinfo();
		ini_set('display_errors',1);
exec("python webcheck.py -f -o ".$_SERVER['DOCUMENT_ROOT']."/RheinaufCMS/Download/webcheckreport/ http://www.buddy-ev.de/",$output);
print date("d.m.Y")."<br />\n";
print implode("<br />\n",$output);

?>