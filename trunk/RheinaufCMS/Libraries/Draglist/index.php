<?php

// -------------------------------------------------------------
// Copyright DTLink, LLC 2005.
// by: Yermo Lamers
//
// This software is governed by the new BSD License. Please see the
// accompanying LICENSE.txt file.
//
// See assets/domdrag.js and assets/draglist.js
// 
// For more information please see:
//
//    http://www.formvista.com/otherprojects/draglist.html


// -------------------------------------------------------------
// For purposes of demonstration print out the order if submit
// was pressed.
//
// We make use of the fact that arrays in PHP work like associative arrays,
// so the offset in the array can be used as a "mysql unique key field" (i.e.
// it does not need to be sequential). The value is the position in the list.
// On Submit the values fields are updated before being submitted back to the
// server.
//
// --------------------------------------------------------------------

if ( @$_POST["cmd"] == "reorder" )
	{

	print( "<h1>New Ordering for the " . $_POST["list"] . " list is:</h1>" );

	foreach ( $_POST["draglist_items"] as $name => $value )
		print( "Image <b>$name</b> was moved to position <b>$value</b><br>\n" );

	}

// as an improvement we could dynamically generate the list of graphics below
// to preserve the order between requests and give some more visual feedback.

// ---------------------------------------------------------------------------
?><html><head>

<title>DragList - Javascript Drag and Drop Ordered Lists in Javascript</title>

<link rel="STYLESHEET" type="text/css" href="assets/default.css">

<script language="JavaScript" src="assets/dom-drag.js" type="text/javascript"></script>
<script language="JavaScript" src="assets/draglist.js" type="text/javascript"></script>

</head>

<body leftmargin="0" topmargin="0" bgcolor="#ffffff" marginheight="0" marginwidth="0">

<!-- top of main table -->

<table cellpadding="10" width="100%">
<tbody><tr>
<td colspan="2" align="center" width="100%">
<span class="header">draglist - Drag and Drop Ordered Lists in Javascript</span>
</td>
</tr>
<tr>
<td colspan="2" align="left" width="100%">
<div class="contentText">
This is a demonstration of the draglist Drag and Drop Ordered list implementation used
in the <a href="http://www.formVista.com">formVista</a> business component framework 
by <a href="http://www.dtlink.com">DTLink Software</a>.
<br><br>
You can grab the (drag) text and reorder the items on the list. On pressing submit,
the new order of the items will be sent to the server and displayed.
<br><br>
draglists are enclosed in a wrapping <b>&lt;DIV&gt;</b> tag. Each item in the list
is contained in a draggable div or span. When submit is pressed the list of items is 
queried and the position values are modified. 
<br><br>
For more information see the <a href="http://www.formvista.com/otherprojects/draglist.html">Drag List home page.</a>
</div>
</td>
</tr>

<?php

// ========================== VERTICAL DRAGGING EXAMPLE ========================

?>

<tr>

<td align="center" valign="top">
<br>

<!-- Form Wrapper Table -->
<table border="0" cellpadding="0" cellspacing="0">
<tbody><tr>
<td>

<form name="draglist_form" action="index.php" method="post">

<input type="hidden" name="cmd" value="reorder">
<input type="hidden" name="list" value="vertical">

<!-- Tab Table -->
<table border="0" cellpadding="0" cellspacing="0">
<tbody><tr>

<!-- Tab Table, Left Corner Cell -->
<td width="10"><img src="graphics/flattabsimple_003.gif" alt="" border="0" height="19" width="10"></td>

<!-- Tab Table, Title Cell -->
<td background="graphics/flattabsimple.gif"><div class="flattabsimpleFormTitle">Vertical Dragging Example</div></td>

<!-- Tab Table, Right Corner Cell -->
<td width="10"><img src="graphics/flattabsimple_005.gif" alt="" border="0" height="19" width="13"></td>

</tr>
</tbody></table>
<!-- Tab Table, END -->


<!-- Border Color Table -->
<table class="flattabsimpleFormBorderColor" border="0" cellpadding="1" cellspacing="0">
<tbody><tr><td>

<!-- Background Color Table -->
<table class="flattabsimpleFormTable" border="0" cellpadding="0" cellspacing="0">

<tbody><tr><td><img src="graphics/spacer.gif" border="0" height="10" width="1"></td></tr>

<tr>

<td width="10"><img src="graphics/spacer.gif" border="0" height="1" width="10"></td>

<td valign="top">

<table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width="">The items below are draggable.</td></tr><tr>
	<td colspan="1">
		<img src="graphics/spacer.gif" height="5" width="1">
	</td>
</tr><tr><td colspan="1" align="left" valign="center" width=""></td></tr>

<tr>
<td colspan="3" align="left">

<?php  

// -------------------------------------------------------
// Container Div that wraps the list. It contains divs that 
// are draggable. see the assets/default.css stylesheet, 
// the do_submit() method in assets/draglist.js and the
// submit button below.

?>

<div id="draglist_container">

<?php  // first draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.nosoftwarepatents.com"><img src="graphics/nosoftware_patents_90x40_1.jpg" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 1)</td></tr>
</tbody></table>

<?php 

// If these items were coming from a database, we would use the offset in 
// the draglist_items array to hold the unique key of the item. We make use 
// of the fact that PHP arrays do not have sequential keys to do this.
//
// The value here is the items initial position. the draglist.do_submit() function
// updates these values onSubmit. 

?>

<input name="draglist_items[1]" value="0" type="hidden">

</div>

<?php  // second draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.dtlink.com"><img src="graphics/dtlink_logo_129x58.gif" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 2)</td></tr>
</tbody></table>

<input name="draglist_items[2]" value="1" type="hidden">
</div>

<?php  // third draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.formvista.com"><img src="graphics/formvista.gif" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 3)</td></tr>
</tbody></table>

<input name="draglist_items[3]" value="2" type="hidden">
</div>

<?php  // fourth draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.personalstockstreamer.com"><img src="graphics/pss.gif" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 4)</td></tr>
</tbody></table>

<input name="draglist_items[4]" value="3" type="hidden">
</div>

<?php  // fifth draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.neophoto.com"><img src="graphics/neophoto.gif" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 5)</td></tr>
</tbody></table>

<input name="draglist_items[5]" value="4" type="hidden">
</div>

<?php  // sixth draggable div ?>

<div style="position: relative; left: 0px; top: 0px;">
<table cellpadding="5" cellspacing="0" width="100%">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width=""><a target="_blank" href="http://www.answertool.com"><img src="graphics/logo.gif" border="0"></a></td><td colspan="1" align="left" valign="center" width=""></td></tr>
</tbody></table></td><td colspan="1" align="right" valign="center" width="">
													(Drag 6)</td></tr>
</tbody></table>

<input name="draglist_items[6]" value="5" type="hidden">
</div>

<?php  // end of draglist_container div ?>

</div>

</td>
</tr><tr>
	<td colspan="1">
		<img src="graphics/spacer.gif" height="5" width="1">
	</td>
</tr><tr><td colspan="1" align="center" valign="center" width="">

<?php 

// do_submit() queries the new order of the items in the list and 
// updates the hidden values.

?>

<INPUT TYPE="button" VALUE="Reorder" onClick="javascript:draglist_manager.do_submit('draglist_form','draglist_container')">

</td></tr>
</tbody></table>

</td>

<td width="10"><img src="graphics/spacer.gif" border="0" height="1" width="10"></td>

</tr>


<tr><td><img src="graphics/spacer.gif" border="0" height="10" width="1"></td></tr>


</tbody></table>
<!-- Background Color Table, END -->

</td></tr>
</tbody></table>
<!-- Border Color Table, END -->


</form>


</td>
</tr>
</tbody></table>
<!-- Form Wrapper Table -->
<br>
<br>

</td>
</tr>


<?php

// ========================== HORIZONTAL DRAGGING EXAMPLE ========================

?>

<tr>

<td align="center" valign="top">
<br>

<!-- Form Wrapper Table -->
<table border="0" cellpadding="0" cellspacing="0">
<tbody><tr>
<td>

<form name="draglist_form_horz" action="index.php" method="post">

<input type="hidden" name="cmd" value="reorder">
<input type="hidden" name="list" value="horizontal">

<!-- Tab Table -->
<table border="0" cellpadding="0" cellspacing="0">
<tbody><tr>

<!-- Tab Table, Left Corner Cell -->
<td width="10"><img src="graphics/flattabsimple_003.gif" alt="" border="0" height="19" width="10"></td>

<!-- Tab Table, Title Cell -->
<td background="graphics/flattabsimple.gif"><div class="flattabsimpleFormTitle">Horizontal Example</div></td>

<!-- Tab Table, Right Corner Cell -->
<td width="10"><img src="graphics/flattabsimple_005.gif" alt="" border="0" height="19" width="13"></td>

</tr>
</tbody></table>
<!-- Tab Table, END -->


<!-- Border Color Table -->
<table class="flattabsimpleFormBorderColor" border="0" cellpadding="1" cellspacing="0">
<tbody><tr><td>

<!-- Background Color Table -->
<table class="flattabsimpleFormTable" border="0" cellpadding="0" cellspacing="0">

<tbody><tr><td><img src="graphics/spacer.gif" border="0" height="10" width="1"></td></tr>

<tr>

<td width="10"><img src="graphics/spacer.gif" border="0" height="1" width="10"></td>

<td valign="top">

<table cellpadding="5" cellspacing="0" width="">
<tbody><tr><td colspan="1" align="left" valign="center" width="">The items below are draggable.</td></tr><tr>
	<td colspan="1">
		<img src="graphics/spacer.gif" height="5" width="1">
	</td>
</tr><tr><td colspan="1" align="left" valign="center" width=""></td></tr>

<tr>
<td colspan="3" align="left">

<?php  

// Notice that this div has a distinct name from the other
// draggable container div.

?>

<div id="draglist_container_horz">

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/nosoftware_patents_90x40_1.jpg" border="0">&nbsp;&nbsp;
  <input name="draglist_items[1]" value="0" type="hidden">
  </span>

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/dtlink_logo_129x58.gif" border="0">&nbsp;&nbsp;
  <input name="draglist_items[2]" value="1" type="hidden">

  </span>

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/formvista.gif" border="0">&nbsp;&nbsp;
  <input name="draglist_items[3]" value="2" type="hidden">
  </span>

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/pss.gif" border="0">&nbsp;&nbsp;
  <input name="draglist_items[4]" value="3" type="hidden">

  </span>

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/neophoto.gif" border="0">&nbsp;&nbsp;
  <input name="draglist_items[5]" value="4" type="hidden">
  </span>

  <span style="position: relative; left: 0px; top: 0px;">
  <img src="graphics/logo.gif" border="0">&nbsp;&nbsp;
  <input name="draglist_items[6]" value="5" type="hidden">

  </span>
</div>

</td>
</tr><tr>
	<td colspan="1">
		<img src="graphics/spacer.gif" height="5" width="1">
	</td>
</tr><tr><td colspan="1" align="center" valign="center" width="">

<?php 

// do_submit() queries the new order of the items in the list and 
// updates the hidden values.

?>

<INPUT TYPE="button" VALUE="Reorder" onClick="javascript:draglist_manager.do_submit('draglist_form_horz','draglist_container_horz')">

</td></tr>
</tbody></table>

</td>

<td width="10"><img src="graphics/spacer.gif" border="0" height="1" width="10"></td>

</tr>


<tr><td><img src="graphics/spacer.gif" border="0" height="10" width="1"></td></tr>


</tbody></table>
<!-- Background Color Table, END -->

</td></tr>
</tbody></table>
<!-- Border Color Table, END -->


</form>


</td>
</tr>
</tbody></table>
<!-- Form Wrapper Table -->
<br>
<br>

</td>
</tr>

</tbody></table>

<!-- end of main table -->

<center>
<p>Logos for AnswerTool, NeoPhoto, PersonalStockStreamer and formVista are trademarks of DTLink, LLC.</p>
</center>

<center>
<a href="http://www.formvista.com/otherprojects/draglist.html">Back to Drag List Page</a>
</center>

<br>
<br>

<hr>

<script language="JavaScript">

// a bit ugly. draglist.js assumes the existence of a global
// dragListIndex array.

var dragListIndex = new Array();

// manager classes. 

draglist_manager = new fv_dragList( 'draglist_container' );
draglist_manager_horz = new fv_dragList( 'draglist_container_horz' );

// queries all top level <divs> under the draglist_container
// div and sets up dragging.

draglist_manager.setup();

// queries all top level <span>'s under the draglist_container_horz
// div and sets up horizontal dragging.

draglist_manager_horz.setup( "horz", "span");

// addes the newly created dragList to the list of draglists on 
// the page (i.e. we can have more than one on a page)

addDragList( draglist_manager );
addDragList( draglist_manager_horz );

</script>

<table width="100%">
<tbody><tr>
<td align="left" valign="top">
</div>
</td>
<td align="right" valign="top">
<div class="copyright">Copyright © 1997 - 2005 <a target="_blank" href="http://www.dtlink.com/">DTLink Software</a> <br>
</div></td>
</tr>
</tbody></table>

<br>
<br>

</body></html>
