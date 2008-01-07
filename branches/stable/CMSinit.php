<?php
#Initialition des Systems
include('RheinaufCMS/Config.inc.php');
include('RheinaufCMS/Classes/RheinaufCMS.php');
$RheinaufCMS = new RheinaufCMS();

if (defined('HEADER')) 			print  (HEADER);
if (defined('INCLUDE_EXTERN')) 	include (INCLUDE_EXTERN);
if (defined('FOOTER')) 			print  (FOOTER);

?>