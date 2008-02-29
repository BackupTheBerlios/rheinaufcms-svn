<?php

$this->filepath = 'RheinaufCMS/Galerie/';

$this->max_scale = array('x'=>650,'y'=>650);

$this->portrait_thumb_height = 140;
$this->portrait_thumb_dir = 'tmb/';

$this->landscape_thumb_width = 170;
$this->landscape_thumb_dir = '180quer/';

$this->use_module['ausstellungen'] = true;
$this->use_module['orte'] = false;


//$this->scaff->cols_array['Beschreibung']['html'] = true;
$this->scaff->cols_array['Jahr']['type'] = 'ignore';
$this->scaff->cols_array['Höhe']['type'] = 'ignore';
$this->scaff->cols_array['Breite']['type'] = 'ignore';
$this->scaff->cols_array['Technik']['type'] = 'ignore';
$this->scaff->cols_array['Standort']['type'] = 'ignore';

?>