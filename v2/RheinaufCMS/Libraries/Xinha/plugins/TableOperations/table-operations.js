// Table Operations Plugin for HTMLArea-3.0
// Implementation by Mihai Bazon.  Sponsored by http://www.bloki.com
//
// htmlArea v3.0 - Copyright (c) 2002 interactivetools.com, inc.
// This notice MUST stay intact for use (see license.txt).
//
// A free WYSIWYG editor replacement for <textarea> fields.
// For full source code and docs, visit http://www.interactivetools.com/
//
// Version 3.0 developed by Mihai Bazon for InteractiveTools.
//   http://dynarch.com/mishoo
//
// $Id: table-operations.js 4 2006-08-29 13:09:31Z ray_cologne $

// Object that will encapsulate all the table operations provided by
// HTMLArea-3.0 (except "insert table" which is included in the main file)
function TableOperations(editor) {
	this.editor = editor;

	var cfg = editor.config;
	var bl = TableOperations.btnList;
	var self = this;

	// register the toolbar buttons provided by this plugin

  // Remove existing inserttable and toggleborders, we will replace it in our group  
  cfg.removeToolbarElement(' inserttable toggleborders '); 
  
	var toolbar = ["linebreak", "inserttable", "toggleborders"];
    
	for (var i = 0; i < bl.length; ++i) {
		var btn = bl[i];
		if (!btn) {
			toolbar.push("separator");
		} else {
			var id = "TO-" + btn[0];
			cfg.registerButton(id, HTMLArea._lc(btn[2], "TableOperations"), editor.imgURL(btn[0] + ".gif", "TableOperations"), false,
					   function(editor, id) {
						   // dispatch button press event
						   self.buttonPress(editor, id);
					   }, btn[1]);
			toolbar.push(id);
		}
	}

	// add a new line in the toolbar
	cfg.toolbar.push(toolbar);
}

TableOperations._pluginInfo = {
	name          : "TableOperations",
	version       : "1.0",
	developer     : "Mihai Bazon",
	developer_url : "http://dynarch.com/mishoo/",
	c_owner       : "Mihai Bazon",
	sponsor       : "Zapatec Inc.",
	sponsor_url   : "http://www.bloki.com",
	license       : "htmlArea"
};

TableOperations.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'TableOperations');
};

/************************
 * UTILITIES
 ************************/

// retrieves the closest element having the specified tagName in the list of
// ancestors of the current selection/caret.
TableOperations.prototype.getClosest = function(tagName) {
	var editor = this.editor;
	var ancestors = editor.getAllAncestors();
	var ret = null;
	tagName = ("" + tagName).toLowerCase();
	for (var i = 0; i < ancestors.length; ++i) {
		var el = ancestors[i];
		if (el.tagName.toLowerCase() == tagName) {
			ret = el;
			break;
		}
	}
	return ret;
};

// this function requires the file PopupDiv/PopupWin to be loaded from browser
TableOperations.prototype.dialogTableProperties = function() {
	// retrieve existing values
	var table = this.getClosest("table");
	// this.editor.selectNodeContents(table);
	// this.editor.updateToolbar();

	var dialog = new PopupWin(this.editor, HTMLArea._lc("Table Properties", "TableOperations"), function(dialog, params) {
		TableOperations.processStyle(params, table);
		for (var i in params) {
      if(typeof params[i] == 'function') continue;
			var val = params[i];
			switch (i) {
			    case "f_caption":
				if (/\S/.test(val)) {
					// contains non white-space characters
					var caption = table.getElementsByTagName("caption")[0];
					if (!caption) {
						caption = dialog.editor._doc.createElement("caption");
						table.insertBefore(caption, table.firstChild);
					}
					caption.innerHTML = val;
				} else {
					// search for caption and delete it if found
					var caption = table.getElementsByTagName("caption")[0];
					if (caption) {
						caption.parentNode.removeChild(caption);
					}
				}
				break;
			    case "f_summary":
				table.summary = val;
				break;
			    case "f_width":
				table.style.width = ("" + val) + params.f_unit;
				break;
			    case "f_align":
				table.align = val;
				break;
			    case "f_spacing":
				table.cellSpacing = val;
				break;
			    case "f_padding":
				table.cellPadding = val;
				break;
			    case "f_borders":
				table.border = val;
				break;
			    case "f_frames":
				table.frame = val;
				break;
			    case "f_rules":
				table.rules = val;
				break;
			}
		}
		// various workarounds to refresh the table display (Gecko,
		// what's going on?! do not disappoint me!)
		dialog.editor.forceRedraw();
		dialog.editor.focusEditor();
		dialog.editor.updateToolbar();
		var save_collapse = table.style.borderCollapse;
		table.style.borderCollapse = "collapse";
		table.style.borderCollapse = "separate";
		table.style.borderCollapse = save_collapse;
	},

	// this function gets called when the dialog needs to be initialized
	function (dialog) {

		var f_caption = "";
		var capel = table.getElementsByTagName("caption")[0];
		if (capel) {
			f_caption = capel.innerHTML;
		}
		var f_summary = table.summary;
		var f_width = parseInt(table.style.width);
		isNaN(f_width) && (f_width = "");
		var f_unit = /%/.test(table.style.width) ? 'percent' : 'pixels';
		var f_align = table.align;
		var f_spacing = table.cellSpacing;
		var f_padding = table.cellPadding;
		var f_borders = table.border;
		var f_frames = table.frame;
		var f_rules = table.rules;

		function selected(val) {
			return val ? " selected" : "";
		}

		// dialog contents
		dialog.content.style.width = "400px";
		dialog.content.innerHTML = " \
<div class='title'\
 style='background: url(" + dialog.baseURL + dialog.editor.imgURL("table-prop.gif", "TableOperations") + ") #fff 98% 50% no-repeat'>" + HTMLArea._lc("Table Properties", "TableOperations") + "\
</div> \
<table style='width:100%'> \
  <tr> \
    <td> \
      <fieldset><legend>" + HTMLArea._lc("Description", "TableOperations") + "</legend> \
       <table style='width:100%'> \
        <tr> \
          <td class='label'>" + HTMLArea._lc("Caption", "TableOperations") + ":</td> \
          <td class='value'><input type='text' name='f_caption' value='" + f_caption + "'/></td> \
        </tr><tr> \
          <td class='label'>" + HTMLArea._lc("Summary", "TableOperations") + ":</td> \
          <td class='value'><input type='text' name='f_summary' value='" + f_summary + "'/></td> \
        </tr> \
       </table> \
      </fieldset> \
    </td> \
  </tr> \
  <tr><td id='--HA-layout'></td></tr> \
  <tr> \
    <td> \
      <fieldset><legend>" + HTMLArea._lc("Spacing and padding", "TableOperations") + "</legend> \
       <table style='width:100%'> \
"+//        <tr> \
//           <td class='label'>" + HTMLArea._lc("Width", "TableOperations") + ":</td> \
//           <td><input type='text' name='f_width' value='" + f_width + "' size='5' /> \
//             <select name='f_unit'> \
//               <option value='%'" + selected(f_unit == "percent") + ">" + HTMLArea._lc("percent", "TableOperations") + "</option> \
//               <option value='px'" + selected(f_unit == "pixels") + ">" + HTMLArea._lc("pixels", "TableOperations") + "</option> \
//             </select> &nbsp;&nbsp;" + HTMLArea._lc("Align", "TableOperations") + ": \
//             <select name='f_align'> \
//               <option value='left'" + selected(f_align == "left") + ">" + HTMLArea._lc("Left", "TableOperations") + "</option> \
//               <option value='center'" + selected(f_align == "center") + ">" + HTMLArea._lc("Center", "TableOperations") + "</option> \
//               <option value='right'" + selected(f_align == "right") + ">" + HTMLArea._lc("Right", "TableOperations") + "</option> \
//             </select> \
//           </td> \
//         </tr> \
"        <tr> \
          <td class='label'>" + HTMLArea._lc("Spacing", "TableOperations") + ":</td> \
          <td><input type='text' name='f_spacing' size='5' value='" + f_spacing + "' /> &nbsp;" + HTMLArea._lc("Padding", "TableOperations") + ":\
            <input type='text' name='f_padding' size='5' value='" + f_padding + "' /> &nbsp;&nbsp;" + HTMLArea._lc("pixels", "TableOperations") + "\
          </td> \
        </tr> \
       </table> \
      </fieldset> \
    </td> \
  </tr> \
  <tr> \
    <td> \
      <fieldset><legend>" + HTMLArea._lc("Frame and borders", "TableOperations") + "</legend> \
        <table width='100%'> \
          <tr> \
            <td class='label'>" + HTMLArea._lc("Borders", "TableOperations") + ":</td> \
            <td><input name='f_borders' type='text' size='5' value='" + f_borders + "' /> &nbsp;&nbsp;" + HTMLArea._lc("pixels", "TableOperations") + "</td> \
          </tr> \
          <tr> \
            <td class='label'>" + HTMLArea._lc("Frames", "TableOperations") + ":</td> \
            <td> \
              <select name='f_frames'> \
                <option value='void'" + selected(f_frames == "void") + ">" + HTMLArea._lc("No sides", "TableOperations") + "</option> \
                <option value='above'" + selected(f_frames == "above") + ">" + HTMLArea._lc("The top side only", "TableOperations") + "</option> \
                <option value='below'" + selected(f_frames == "below") + ">" + HTMLArea._lc("The bottom side only", "TableOperations") + "</option> \
                <option value='hsides'" + selected(f_frames == "hsides") + ">" + HTMLArea._lc("The top and bottom sides only", "TableOperations") + "</option> \
                <option value='vsides'" + selected(f_frames == "vsides") + ">" + HTMLArea._lc("The right and left sides only", "TableOperations") + "</option> \
                <option value='lhs'" + selected(f_frames == "lhs") + ">" + HTMLArea._lc("The left-hand side only", "TableOperations") + "</option> \
                <option value='rhs'" + selected(f_frames == "rhs") + ">" + HTMLArea._lc("The right-hand side only", "TableOperations") + "</option> \
                <option value='box'" + selected(f_frames == "box") + ">" + HTMLArea._lc("All four sides", "TableOperations") + "</option> \
              </select> \
            </td> \
          </tr> \
          <tr> \
            <td class='label'>" + HTMLArea._lc("Rules", "TableOperations") + ":</td> \
            <td> \
              <select name='f_rules'> \
                <option value='none'" + selected(f_rules == "none") + ">" + HTMLArea._lc("No rules", "TableOperations") + "</option> \
                <option value='rows'" + selected(f_rules == "rows") + ">" + HTMLArea._lc("Rules will appear between rows only", "TableOperations") + "</option> \
                <option value='cols'" + selected(f_rules == "cols") + ">" + HTMLArea._lc("Rules will appear between columns only", "TableOperations") + "</option> \
                <option value='all'" + selected(f_rules == "all") + ">" + HTMLArea._lc("Rules will appear between all rows and columns", "TableOperations") + "</option> \
              </select> \
            </td> \
          </tr> \
        </table> \
      </fieldset> \
    </td> \
  </tr> \
  <tr> \
    <td id='--HA-style'></td> \
  </tr> \
</table> \
";
		var st_prop = TableOperations.createStyleFieldset(dialog.doc, dialog.editor, table);
		var p = dialog.doc.getElementById("--HA-style");
		p.appendChild(st_prop);
		var st_layout = TableOperations.createStyleLayoutFieldset(dialog.doc, dialog.editor, table);
		p = dialog.doc.getElementById("--HA-layout");
		p.appendChild(st_layout);
		dialog.modal = true;
		dialog.addButtons("OK", "Cancel");
		dialog.showAtElement(dialog.editor._iframe, "c");
	});
};

// this function requires the file PopupDiv/PopupWin to be loaded from browser
TableOperations.prototype.dialogRowCellProperties = function(cell) {
	// retrieve existing values
	var element = this.getClosest(cell ? "td" : "tr");
	var table = this.getClosest("table");
	// this.editor.selectNodeContents(element);
	// this.editor.updateToolbar();

	var dialog = new PopupWin(this.editor, cell ? HTMLArea._lc("Cell Properties", "TableOperations") : HTMLArea._lc("Row Properties", "TableOperations"), function(dialog, params) {
		TableOperations.processStyle(params, element);
		for (var i in params) {
      if(typeof params[i] == 'function') continue;
			var val = params[i];
			switch (i) {
			    case "f_align":
				element.align = val;
				break;
			    case "f_char":
				element.ch = val;
				break;
			    case "f_valign":
				element.vAlign = val;
				break;
			}
		}
		// various workarounds to refresh the table display (Gecko,
		// what's going on?! do not disappoint me!)
		dialog.editor.forceRedraw();
		dialog.editor.focusEditor();
		dialog.editor.updateToolbar();
		var save_collapse = table.style.borderCollapse;
		table.style.borderCollapse = "collapse";
		table.style.borderCollapse = "separate";
		table.style.borderCollapse = save_collapse;
	},

	// this function gets called when the dialog needs to be initialized
	function (dialog) {

		var f_align = element.align;
		var f_valign = element.vAlign;
		var f_char = element.ch;

		function selected(val) {
			return val ? " selected" : "";
		}

		// dialog contents
		dialog.content.style.width = "400px";
		dialog.content.innerHTML = " \
<div class='title'\
 style='background: url(" + dialog.baseURL + dialog.editor.imgURL(cell ? "cell-prop.gif" : "row-prop.gif", "TableOperations") + ") #fff 98% 50% no-repeat'>" + HTMLArea._lc(cell ? "Cell Properties" : "Row Properties", "TableOperations") + "</div> \
<table style='width:100%'> \
  <tr> \
    <td id='--HA-layout'> \
"+//      <fieldset><legend>" + HTMLArea._lc("Layout", "TableOperations") + "</legend> \
//        <table style='width:100%'> \
//         <tr> \
//           <td class='label'>" + HTMLArea._lc("Align", "TableOperations") + ":</td> \
//           <td> \
//             <select name='f_align'> \
//               <option value='left'" + selected(f_align == "left") + ">" + HTMLArea._lc("Left", "TableOperations") + "</option> \
//               <option value='center'" + selected(f_align == "center") + ">" + HTMLArea._lc("Center", "TableOperations") + "</option> \
//               <option value='right'" + selected(f_align == "right") + ">" + HTMLArea._lc("Right", "TableOperations") + "</option> \
//               <option value='char'" + selected(f_align == "char") + ">" + HTMLArea._lc("Char", "TableOperations") + "</option> \
//             </select> \
//             &nbsp;&nbsp;" + HTMLArea._lc("Char", "TableOperations") + ": \
//             <input type='text' style='font-family: monospace; text-align: center' name='f_char' size='1' value='" + f_char + "' /> \
//           </td> \
//         </tr><tr> \
//           <td class='label'>" + HTMLArea._lc("Vertical align", "TableOperations") + ":</td> \
//           <td> \
//             <select name='f_valign'> \
//               <option value='top'" + selected(f_valign == "top") + ">" + HTMLArea._lc("Top", "TableOperations") + "</option> \
//               <option value='middle'" + selected(f_valign == "middle") + ">" + HTMLArea._lc("Middle", "TableOperations") + "</option> \
//               <option value='bottom'" + selected(f_valign == "bottom") + ">" + HTMLArea._lc("Bottom", "TableOperations") + "</option> \
//               <option value='baseline'" + selected(f_valign == "baseline") + ">" + HTMLArea._lc("Baseline", "TableOperations") + "</option> \
//             </select> \
//           </td> \
//         </tr> \
//        </table> \
//       </fieldset> \
"    </td> \
  </tr> \
  <tr> \
    <td id='--HA-style'></td> \
  </tr> \
</table> \
";
		var st_prop = TableOperations.createStyleFieldset(dialog.doc, dialog.editor, element);
		var p = dialog.doc.getElementById("--HA-style");
		p.appendChild(st_prop);
		var st_layout = TableOperations.createStyleLayoutFieldset(dialog.doc, dialog.editor, element);
		p = dialog.doc.getElementById("--HA-layout");
		p.appendChild(st_layout);
		dialog.modal = true;
		dialog.addButtons("OK", "Cancel");
		dialog.showAtElement(dialog.editor._iframe, "c");
	});
};

// this function gets called when some button from the TableOperations toolbar
// was pressed.
TableOperations.prototype.buttonPress = function(editor, button_id) {
	this.editor = editor;
	var mozbr = HTMLArea.is_gecko ? "<br />" : "";

	// helper function that clears the content in a table row
	function clearRow(tr) {
		var tds = tr.getElementsByTagName("td");
		for (var i = tds.length; --i >= 0;) {
			var td = tds[i];
			td.rowSpan = 1;
			td.innerHTML = mozbr;
		}
	}

	function splitRow(td) {
		var n = parseInt("" + td.rowSpan);
		var nc = parseInt("" + td.colSpan);
		td.rowSpan = 1;
		tr = td.parentNode;
		var itr = tr.rowIndex;
		var trs = tr.parentNode.rows;
		var index = td.cellIndex;
		while (--n > 0) {
			tr = trs[++itr];
			var otd = editor._doc.createElement("td");
			otd.colSpan = td.colSpan;
			otd.innerHTML = mozbr;
			tr.insertBefore(otd, tr.cells[index]);
		}
		editor.forceRedraw();
		editor.updateToolbar();
	}

	function splitCol(td) {
		var nc = parseInt("" + td.colSpan);
		td.colSpan = 1;
		tr = td.parentNode;
		var ref = td.nextSibling;
		while (--nc > 0) {
			var otd = editor._doc.createElement("td");
			otd.rowSpan = td.rowSpan;
			otd.innerHTML = mozbr;
			tr.insertBefore(otd, ref);
		}
		editor.forceRedraw();
		editor.updateToolbar();
	}

	function splitCell(td) {
		var nc = parseInt("" + td.colSpan);
		splitCol(td);
		var items = td.parentNode.cells;
		var index = td.cellIndex;
		while (nc-- > 0) {
			splitRow(items[index++]);
		}
	}

	function selectNextNode(el) {
		var node = el.nextSibling;
		while (node && node.nodeType != 1) {
			node = node.nextSibling;
		}
		if (!node) {
			node = el.previousSibling;
			while (node && node.nodeType != 1) {
				node = node.previousSibling;
			}
		}
		if (!node) {
			node = el.parentNode;
		}
		editor.selectNodeContents(node);
	}

	switch (button_id) {
		// ROWS

	    case "TO-row-insert-above":
	    case "TO-row-insert-under":
		var tr = this.getClosest("tr");
		if (!tr) {
			break;
		}
		var otr = tr.cloneNode(true);
		clearRow(otr);
		tr.parentNode.insertBefore(otr, /under/.test(button_id) ? tr.nextSibling : tr);
		editor.forceRedraw();
		editor.focusEditor();
		break;
	    case "TO-row-delete":
		var tr = this.getClosest("tr");
		if (!tr) {
			break;
		}
		var par = tr.parentNode;
		if (par.rows.length == 1) {
			alert(HTMLArea._lc("HTMLArea cowardly refuses to delete the last row in table.", "TableOperations"));
			break;
		}
		// set the caret first to a position that doesn't
		// disappear.
		selectNextNode(tr);
		par.removeChild(tr);
		editor.forceRedraw();
		editor.focusEditor();
		editor.updateToolbar();
		break;
	    case "TO-row-split":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		splitRow(td);
		break;

		// COLUMNS

	    case "TO-col-insert-before":
	    case "TO-col-insert-after":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		var rows = td.parentNode.parentNode.rows;
		var index = td.cellIndex;
    var lastColumn = (td.parentNode.cells.length == index + 1);
		for (var i = rows.length; --i >= 0;) {
			var tr = rows[i];			
			var otd = editor._doc.createElement("td");
			otd.innerHTML = mozbr;
      if (lastColumn && HTMLArea.is_ie) 
      {
        tr.insertBefore(otd);
      } 
      else 
      {
        var ref = tr.cells[index + (/after/.test(button_id) ? 1 : 0)];
        tr.insertBefore(otd, ref);
      }
		}
		editor.focusEditor();
		break;
	    case "TO-col-split":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		splitCol(td);
		break;
	    case "TO-col-delete":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		var index = td.cellIndex;
		if (td.parentNode.cells.length == 1) {
			alert(HTMLArea._lc("HTMLArea cowardly refuses to delete the last column in table.", "TableOperations"));
			break;
		}
		// set the caret first to a position that doesn't disappear
		selectNextNode(td);
		var rows = td.parentNode.parentNode.rows;
		for (var i = rows.length; --i >= 0;) {
			var tr = rows[i];
			tr.removeChild(tr.cells[index]);
		}
		editor.forceRedraw();
		editor.focusEditor();
		editor.updateToolbar();
		break;

		// CELLS

	    case "TO-cell-split":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		splitCell(td);
		break;
	    case "TO-cell-insert-before":
	    case "TO-cell-insert-after":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		var tr = td.parentNode;
		var otd = editor._doc.createElement("td");
		otd.innerHTML = mozbr;
		tr.insertBefore(otd, /after/.test(button_id) ? td.nextSibling : td);
		editor.forceRedraw();
		editor.focusEditor();
		break;
	    case "TO-cell-delete":
		var td = this.getClosest("td");
		if (!td) {
			break;
		}
		if (td.parentNode.cells.length == 1) {
			alert(HTMLArea._lc("HTMLArea cowardly refuses to delete the last cell in row.", "TableOperations"));
			break;
		}
		// set the caret first to a position that doesn't disappear
		selectNextNode(td);
		td.parentNode.removeChild(td);
		editor.forceRedraw();
		editor.updateToolbar();
		break;
	    case "TO-cell-merge":
		// !! FIXME: Mozilla specific !!
		var sel = editor._getSelection();
		var range, i = 0;
		var rows = [];
		var row = null;
		var cells = null;
		if (!HTMLArea.is_ie) {
			try {
				while (range = sel.getRangeAt(i++)) {
					var td = range.startContainer.childNodes[range.startOffset];
					if (td.parentNode != row) {
						row = td.parentNode;
						(cells) && rows.push(cells);
						cells = [];
					}
					cells.push(td);
				}
			} catch(e) {/* finished walking through selection */}
			rows.push(cells);
		} else {
			// Internet Explorer "browser"
			var td = this.getClosest("td");
			if (!td) {
				alert(HTMLArea._lc("Please click into some cell", "TableOperations"));
				break;
			}
			var tr = td.parentElement;
			var no_cols = prompt(HTMLArea._lc("How many columns would you like to merge?", "TableOperations"), 2);
			if (!no_cols) {
				// cancelled
				break;
			}
			var no_rows = prompt(HTMLArea._lc("How many rows would you like to merge?", "TableOperations"), 2);
			if (!no_rows) {
				// cancelled
				break;
			}
			var cell_index = td.cellIndex;
			while (no_rows-- > 0) {
				td = tr.cells[cell_index];
				cells = [td];
				for (var i = 1; i < no_cols; ++i) {
					td = td.nextSibling;
					if (!td) {
						break;
					}
					cells.push(td);
				}
				rows.push(cells);
				tr = tr.nextSibling;
				if (!tr) {
					break;
				}
			}
		}
		var HTML = "";
		for (i = 0; i < rows.length; ++i) {
			// i && (HTML += "<br />");
			var cells = rows[i];
			for (var j = 0; j < cells.length; ++j) {
				// j && (HTML += "&nbsp;");
				var cell = cells[j];
				HTML += cell.innerHTML;
				(i || j) && (cell.parentNode.removeChild(cell));
			}
		}
		var td = rows[0][0];
		td.innerHTML = HTML;
		td.rowSpan = rows.length;
		td.colSpan = rows[0].length;
		editor.selectNodeContents(td);
		editor.forceRedraw();
		editor.focusEditor();
		break;

		// PROPERTIES

	    case "TO-table-prop":
		this.dialogTableProperties();
		break;

	    case "TO-row-prop":
		this.dialogRowCellProperties(false);
		break;

	    case "TO-cell-prop":
		this.dialogRowCellProperties(true);
		break;

	    default:
		alert("Button [" + button_id + "] not yet implemented");
	}
};

// the list of buttons added by this plugin
TableOperations.btnList = [
	// table properties button
    ["table-prop",       "table", "Table properties"],
	null,			// separator

	// ROWS
	["row-prop",         "tr", "Row properties"],
	["row-insert-above", "tr", "Insert row before"],
	["row-insert-under", "tr", "Insert row after"],
	["row-delete",       "tr", "Delete row"],
	["row-split",        "td[rowSpan!=1]", "Split row"],
	null,

	// COLS
	["col-insert-before", "td", "Insert column before"],
	["col-insert-after",  "td", "Insert column after"],
	["col-delete",        "td", "Delete column"],
	["col-split",         "td[colSpan!=1]", "Split column"],
	null,

	// CELLS
	["cell-prop",          "td", "Cell properties"],
	["cell-insert-before", "td", "Insert cell before"],
	["cell-insert-after",  "td", "Insert cell after"],
	["cell-delete",        "td", "Delete cell"],
	["cell-merge",         "tr", "Merge cells"],
	["cell-split",         "td[colSpan!=1,rowSpan!=1]", "Split cell"]
	];



//// GENERIC CODE [style of any element; this should be moved into a separate
//// file as it'll be very useful]
//// BEGIN GENERIC CODE -----------------------------------------------------

TableOperations.getLength = function(value) {
	var len = parseInt(value);
	if (isNaN(len)) {
		len = "";
	}
	return len;
};

// Applies the style found in "params" to the given element.
TableOperations.processStyle = function(params, element) {
	var style = element.style;
	for (var i in params) {
    if(typeof params[i] == 'function') continue;
		var val = params[i];
		switch (i) {
		    case "f_st_backgroundColor":
			style.backgroundColor = val;
			break;
		    case "f_st_color":
			style.color = val;
			break;
		    case "f_st_backgroundImage":
			if (/\S/.test(val)) {
				style.backgroundImage = "url(" + val + ")";
			} else {
				style.backgroundImage = "none";
			}
			break;
		    case "f_st_borderWidth":
			style.borderWidth = val;
			break;
		    case "f_st_borderStyle":
			style.borderStyle = val;
			break;
		    case "f_st_borderColor":
			style.borderColor = val;
			break;
		    case "f_st_borderCollapse":
			style.borderCollapse = val ? "collapse" : "";
			break;
		    case "f_st_width":
			if (/\S/.test(val)) {
				style.width = val + params["f_st_widthUnit"];
			} else {
				style.width = "";
			}
			break;
		    case "f_st_height":
			if (/\S/.test(val)) {
				style.height = val + params["f_st_heightUnit"];
			} else {
				style.height = "";
			}
			break;
		    case "f_st_textAlign":
			if (val == "char") {
				var ch = params["f_st_textAlignChar"];
				if (ch == '"') {
					ch = '\\"';
				}
				style.textAlign = '"' + ch + '"';
			} else if (val == "-") {
			    style.textAlign = "";
			} else {
				style.textAlign = val;
			}
			break;
		    case "f_st_verticalAlign":
		    element.vAlign = "";
			if (val == "-") {
			    style.verticalAlign = "";
			    
		    } else {
			    style.verticalAlign = val;
			}
			break;
		    case "f_st_float":
			style.cssFloat = val;
			break;
// 		    case "f_st_margin":
// 			style.margin = val + "px";
// 			break;
// 		    case "f_st_padding":
// 			style.padding = val + "px";
// 			break;
		}
	}
};

// Returns an HTML element for a widget that allows color selection.  That is,
// a button that contains the given color, if any, and when pressed will popup
// the sooner-or-later-to-be-rewritten select_color.html dialog allowing user
// to select some color.  If a color is selected, an input field with the name
// "f_st_"+name will be updated with the color value in #123456 format.
TableOperations.createColorButton = function(doc, editor, color, name) {
	if (!color) {
		color = "";
	} else if (!/#/.test(color)) {
		color = HTMLArea._colorToRgb(color);
	}

	var df = doc.createElement("span");
 	var field = doc.createElement("input");
	field.type = "hidden";
	df.appendChild(field);
 	field.name = "f_st_" + name;
	field.value = color;
	var button = doc.createElement("span");
	button.className = "buttonColor";
	df.appendChild(button);
	var span = doc.createElement("span");
	span.className = "chooser";
	// span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	span.style.backgroundColor = color;
	button.appendChild(span);
	button.onmouseover = function() { if (!this.disabled) { this.className += " buttonColor-hilite"; }};
	button.onmouseout = function() { if (!this.disabled) { this.className = "buttonColor"; }};
	span.onclick = function() {
		if (this.parentNode.disabled) {
			return false;
		}
		editor._popupDialog("select_color.html", function(color) {
			if (color) {
				span.style.backgroundColor = "#" + color;
				field.value = "#" + color;
			}
		}, color);
	};
	var span2 = doc.createElement("span");
	span2.innerHTML = "&#x00d7;";
	span2.className = "nocolor";
	span2.title = HTMLArea._lc("Unset color", "TableOperations");
	button.appendChild(span2);
	span2.onmouseover = function() { if (!this.parentNode.disabled) { this.className += " nocolor-hilite"; }};
	span2.onmouseout = function() { if (!this.parentNode.disabled) { this.className = "nocolor"; }};
	span2.onclick = function() {
		span.style.backgroundColor = "";
		field.value = "";
	};
	return df;
};

TableOperations.createStyleLayoutFieldset = function(doc, editor, el) {
	var fieldset = doc.createElement("fieldset");
	var legend = doc.createElement("legend");
	fieldset.appendChild(legend);
	legend.innerHTML = HTMLArea._lc("Layout", "TableOperations");
	var table = doc.createElement("table");
	fieldset.appendChild(table);
	table.style.width = "100%";
	var tbody = doc.createElement("tbody");
	table.appendChild(tbody);

	var tagname = el.tagName.toLowerCase();
	var tr, td, input, select, option, options, i;

	if (tagname != "td" && tagname != "tr" && tagname != "th") {
		tr = doc.createElement("tr");
		tbody.appendChild(tr);
		td = doc.createElement("td");
		td.className = "label";
		tr.appendChild(td);
		td.innerHTML = HTMLArea._lc("Float", "TableOperations") + ":";
		td = doc.createElement("td");
		tr.appendChild(td);
		select = doc.createElement("select");
		td.appendChild(select);
		select.name = "f_st_float";
		options = ["None", "Left", "Right"];
		for (var i = 0; i < options.length; ++i) {
			var Val = options[i];
			var val = options[i].toLowerCase();
			option = doc.createElement("option");
			option.innerHTML = HTMLArea._lc(Val, "TableOperations");
			option.value = val;
			option.selected = (("" + el.style.cssFloat).toLowerCase() == val);
			select.appendChild(option);
		}
	}

	tr = doc.createElement("tr");
	tbody.appendChild(tr);
	td = doc.createElement("td");
	td.className = "label";
	tr.appendChild(td);
	td.innerHTML = HTMLArea._lc("Width", "TableOperations") + ":";
	td = doc.createElement("td");
	tr.appendChild(td);
	input = doc.createElement("input");
	input.type = "text";
	input.value = TableOperations.getLength(el.style.width);
	input.size = "5";
	input.name = "f_st_width";
	input.style.marginRight = "0.5em";
	td.appendChild(input);
	select = doc.createElement("select");
	select.name = "f_st_widthUnit";
	option = doc.createElement("option");
	option.innerHTML = HTMLArea._lc("percent", "TableOperations");
	option.value = "%";
	option.selected = /%/.test(el.style.width);
	select.appendChild(option);
	option = doc.createElement("option");
	option.innerHTML = HTMLArea._lc("pixels", "TableOperations");
	option.value = "px";
	option.selected = /px/.test(el.style.width);
	select.appendChild(option);
	td.appendChild(select);

	select.style.marginRight = "0.5em";
	td.appendChild(doc.createTextNode(HTMLArea._lc("Text align", "TableOperations") + ":"));
	select = doc.createElement("select");
	select.style.marginLeft = select.style.marginRight = "0.5em";
	td.appendChild(select);
	select.name = "f_st_textAlign";
	options = ["Left", "Center", "Right", "Justify", "-"];
	if (tagname == "td") {
		options.push("Char");
	}
	input = doc.createElement("input");
	input.name = "f_st_textAlignChar";
	input.size = "1";
	input.style.fontFamily = "monospace";
	td.appendChild(input);
	for (var i = 0; i < options.length; ++i) {
		var Val = options[i];
		var val = Val.toLowerCase();
		option = doc.createElement("option");
		option.value = val;
		option.innerHTML = HTMLArea._lc(Val, "TableOperations");
		option.selected = ((el.style.textAlign.toLowerCase() == val) || (el.style.textAlign == "" && Val == "-"));
		select.appendChild(option);
	}
	function setCharVisibility(value) {
		input.style.visibility = value ? "visible" : "hidden";
		if (value) {
			input.focus();
			input.select();
		}
	}
	select.onchange = function() { setCharVisibility(this.value == "char"); };
	setCharVisibility(select.value == "char");

	tr = doc.createElement("tr");
	tbody.appendChild(tr);
	td = doc.createElement("td");
	td.className = "label";
	tr.appendChild(td);
	td.innerHTML = HTMLArea._lc("Height", "TableOperations") + ":";
	td = doc.createElement("td");
	tr.appendChild(td);
	input = doc.createElement("input");
	input.type = "text";
	input.value = TableOperations.getLength(el.style.height);
	input.size = "5";
	input.name = "f_st_height";
	input.style.marginRight = "0.5em";
	td.appendChild(input);
	select = doc.createElement("select");
	select.name = "f_st_heightUnit";
	option = doc.createElement("option");
	option.innerHTML = HTMLArea._lc("percent", "TableOperations");
	option.value = "%";
	option.selected = /%/.test(el.style.height);
	select.appendChild(option);
	option = doc.createElement("option");
	option.innerHTML = HTMLArea._lc("pixels", "TableOperations");
	option.value = "px";
	option.selected = /px/.test(el.style.height);
	select.appendChild(option);
	td.appendChild(select);

	select.style.marginRight = "0.5em";
	td.appendChild(doc.createTextNode(HTMLArea._lc("Vertical align", "TableOperations") + ":"));
	select = doc.createElement("select");
	select.name = "f_st_verticalAlign";
	select.style.marginLeft = "0.5em";
	td.appendChild(select);
	options = ["Top", "Middle", "Bottom", "Baseline", "-"];
	for (var i = 0; i < options.length; ++i) {
		var Val = options[i];
		var val = Val.toLowerCase();
		option = doc.createElement("option");
		option.value = val;
		option.innerHTML = HTMLArea._lc(Val, "TableOperations");
		option.selected = ((el.style.verticalAlign.toLowerCase() == val) || (el.style.verticalAlign == "" && Val == "-"));
		select.appendChild(option);
	}

	return fieldset;
};

// Returns an HTML element containing the style attributes for the given
// element.  This can be easily embedded into any dialog; the functionality is
// also provided.
TableOperations.createStyleFieldset = function(doc, editor, el) {
	var fieldset = doc.createElement("fieldset");
	var legend = doc.createElement("legend");
	fieldset.appendChild(legend);
	legend.innerHTML = HTMLArea._lc("CSS Style", "TableOperations");
	var table = doc.createElement("table");
	fieldset.appendChild(table);
	table.style.width = "100%";
	var tbody = doc.createElement("tbody");
	table.appendChild(tbody);

	var tr, td, input, select, option, options, i;

	tr = doc.createElement("tr");
	tbody.appendChild(tr);
	td = doc.createElement("td");
	tr.appendChild(td);
	td.className = "label";
	td.innerHTML = HTMLArea._lc("Background", "TableOperations") + ":";
	td = doc.createElement("td");
	tr.appendChild(td);
	var df = TableOperations.createColorButton(doc, editor, el.style.backgroundColor, "backgroundColor");
	df.firstChild.nextSibling.style.marginRight = "0.5em";
	td.appendChild(df);
	td.appendChild(doc.createTextNode(HTMLArea._lc("Image URL", "TableOperations") + ": "));
	input = doc.createElement("input");
	input.type = "text";
	input.name = "f_st_backgroundImage";
	if (el.style.backgroundImage.match(/url\(\s*(.*?)\s*\)/)) {
		input.value = RegExp.$1;
	}
	// input.style.width = "100%";
	td.appendChild(input);

	tr = doc.createElement("tr");
	tbody.appendChild(tr);
	td = doc.createElement("td");
	tr.appendChild(td);
	td.className = "label";
	td.innerHTML = HTMLArea._lc("FG Color", "TableOperations") + ":";
	td = doc.createElement("td");
	tr.appendChild(td);
	td.appendChild(TableOperations.createColorButton(doc, editor, el.style.color, "color"));

	// for better alignment we include an invisible field.
	input = doc.createElement("input");
	input.style.visibility = "hidden";
	input.type = "text";
	td.appendChild(input);

	tr = doc.createElement("tr");
	tbody.appendChild(tr);
	td = doc.createElement("td");
	tr.appendChild(td);
	td.className = "label";
	td.innerHTML = HTMLArea._lc("Border", "TableOperations") + ":";
	td = doc.createElement("td");
	tr.appendChild(td);

	var colorButton = TableOperations.createColorButton(doc, editor, el.style.borderColor, "borderColor");
	var btn = colorButton.firstChild.nextSibling;
	td.appendChild(colorButton);
	// borderFields.push(btn);
	btn.style.marginRight = "0.5em";

	select = doc.createElement("select");
	var borderFields = [];
	td.appendChild(select);
	select.name = "f_st_borderStyle";
	options = ["none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
	var currentBorderStyle = el.style.borderStyle;
	// Gecko reports "solid solid solid solid" for "border-style: solid".
	// That is, "top right bottom left" -- we only consider the first
	// value.
	(currentBorderStyle.match(/([^\s]*)\s/)) && (currentBorderStyle = RegExp.$1);
	for (var i in options) {
    if(typeof options[i] == 'function') continue;
		var val = options[i];
		option = doc.createElement("option");
		option.value = val;
		option.innerHTML = val;
		(val == currentBorderStyle) && (option.selected = true);
		select.appendChild(option);
	}
	select.style.marginRight = "0.5em";
	function setBorderFieldsStatus(value) {
		for (var i = 0; i < borderFields.length; ++i) {
			var el = borderFields[i];
			el.style.visibility = value ? "hidden" : "visible";
			if (!value && (el.tagName.toLowerCase() == "input")) {
				el.focus();
				el.select();
			}
		}
	}
	select.onchange = function() { setBorderFieldsStatus(this.value == "none"); };

	input = doc.createElement("input");
	borderFields.push(input);
	input.type = "text";
	input.name = "f_st_borderWidth";
	input.value = TableOperations.getLength(el.style.borderWidth);
	input.size = "5";
	td.appendChild(input);
	input.style.marginRight = "0.5em";
	var span = doc.createElement("span");
	span.innerHTML = HTMLArea._lc("pixels", "TableOperations");
	td.appendChild(span);
	borderFields.push(span);

	setBorderFieldsStatus(select.value == "none");

	if (el.tagName.toLowerCase() == "table") {
		// the border-collapse style is only for tables
		tr = doc.createElement("tr");
		tbody.appendChild(tr);
		td = doc.createElement("td");
		td.className = "label";
		tr.appendChild(td);
		input = doc.createElement("input");
		input.type = "checkbox";
		input.name = "f_st_borderCollapse";
		input.id = "f_st_borderCollapse";
		var val = (/collapse/i.test(el.style.borderCollapse));
		input.checked = val ? 1 : 0;
		td.appendChild(input);

		td = doc.createElement("td");
		tr.appendChild(td);
		var label = doc.createElement("label");
		label.htmlFor = "f_st_borderCollapse";
		label.innerHTML = HTMLArea._lc("Collapsed borders", "TableOperations");
		td.appendChild(label);
	}

// 	tr = doc.createElement("tr");
// 	tbody.appendChild(tr);
// 	td = doc.createElement("td");
// 	td.className = "label";
// 	tr.appendChild(td);
// 	td.innerHTML = HTMLArea._lc("Margin", "TableOperations") + ":";
// 	td = doc.createElement("td");
// 	tr.appendChild(td);
// 	input = doc.createElement("input");
// 	input.type = "text";
// 	input.size = "5";
// 	input.name = "f_st_margin";
// 	td.appendChild(input);
// 	input.style.marginRight = "0.5em";
// 	td.appendChild(doc.createTextNode(HTMLArea._lc("Padding", "TableOperations") + ":"));

// 	input = doc.createElement("input");
// 	input.type = "text";
// 	input.size = "5";
// 	input.name = "f_st_padding";
// 	td.appendChild(input);
// 	input.style.marginLeft = "0.5em";
// 	input.style.marginRight = "0.5em";
// 	td.appendChild(doc.createTextNode(HTMLArea._lc("pixels", "TableOperations")));

	return fieldset;
};

//// END GENERIC CODE -------------------------------------------------------