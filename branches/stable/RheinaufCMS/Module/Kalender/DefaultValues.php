<?php
$this->scaff->cols_array['LOCATION']['value'] = ($_POST['LOCATION']) ? $_POST['LOCATION'] : 'Freie Waldorfschule, Mülheim';
$this->scaff->cols_array['CONTACT']['value'] = 'post@waldorfschule-mh.de';
$this->scaff->cols_array['STATUS']['value'] = ($_POST['STATUS']) ? $_POST['STATUS'] : 'CONFIRMED';
$this->scaff->cols_array['CLASS']['value'] = ($_POST['CLASS']) ? $_POST['CLASS'] : 'PUBLIC';
?>