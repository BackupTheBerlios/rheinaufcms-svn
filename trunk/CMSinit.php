<?php

#Initialition des Systems
include('RheinaufCMS/Config.inc.php');
include('RheinaufCMS/System/RheinaufCMS.php');
$RheinaufCMS = new RheinaufCMS();
print '<pre>';
print $RheinaufCMS->content();

if (defined('HEADER')) 			print  (HEADER);
if (defined('INCLUDE_EXTERN')) 	include (INCLUDE_EXTERN);
if (defined('FOOTER')) 			print  (FOOTER);

?>