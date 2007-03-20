function delete_confirm(link) {
	if (confirm("Diesen Eintrag löschen?"))
	{
		var url = link.getAttribute("href");
		url +=  "&noframe"; 
		url += (url.indexOf("noframe") == -1) ? "&noframe" : ""; 
		httpRequestGET(url,setContent);
	}
	return false;
}

function checkform() {
	if (typeof passcheck != "undefined" && passcheck == true) return true;
	var i,e,firstFail,check = true;
	var bg_color_cache  = '';
	for (i=0;i<required_fields.length;i++)
	{
		e = document.getElementById(required_fields[i]);
		bg_color_cache = e.style.backgroundColor;
		if (e.value == "" || e.value.indexOf("--") != -1)
		{
			check = false;
			if (document.getElementById(e.id + '_other') && document.getElementById(e.id + '_other').value != "") check = true;		
			if (!check)
			{
				if (!firstFail) firstFail = e;
				e.style.backgroundColor = "red";
			}
		}
		else e.style.backgroundColor = bg_color_cache;
	}
	if (firstFail)
	{
		removeLoading();
		firstFail.focus();
		alert('Bitte füllen Sie alle Felder mit einem * aus.');
	}
	return check;
}
var required_fields = [];


function cancelEdit(button)
{
	var f = button.form;
	
	var url = f.getAttribute("action").replace(/#.*/,"");

	httpRequestGET(url+"&noframe",setContent);
	return false;
}

function resetFilter(el)
{
	var form = el.form;
	for (var i = 0;i<form.elements.length;i++)
	{
		if (form.elements[i].tagName.toLowerCase() == 'select')
		{
			form.elements[i].options[0].selected = true;
			
		}
		else if (form.elements[i].tagName.toLowerCase() == 'input' && form.elements[i].getAttribute("type").toLowerCase() == 'text')
		{
			form.elements[i].value = '';
		}
		
	}
	if (typeof form.onsubmit == "function")
	{
		form.onsubmit();
		return false;
	}
	else return true;
}
function getSuggestions(ev,input)
{
	ev = (ev) ? ev : window.event;
	if (ev.keyCode == 27)
	{
		hideSuggestions();
		return;
	}
	if (/[\s]/i.test(String.fromCharCode(ev.keyCode)) 
	&& ev.keyCode != 40 // arrow down
	&& ev.keyCode != 8 // back-space
	&& ev.keyCode != 32 // space
	)
	{
		return;
	}
	
	var form = input.form;
	var key = input.name;
	var value = input.value;
	var url = form.action.replace(/#.*/,'')+'?';
	url += '&getSuggestions&key='+escape(key) + '&value=' + escape(value);
	var keyCode = ev.keyCode;
	var handler = function (getback) {
		var suggestions = eval(getback);
		if (suggestions.length)
		{
			setSuggestions(keyCode,input,suggestions);	
		}
		else
		{
			hideSuggestions();
		}
	};
	httpRequestGET(url,handler);
	removeLoading();
}
function setSuggestions(keyCode,input,suggestions)
{
	addEvent(document.body,'click',hideSuggestions);
	if (!document.getElementById("suggestionList"))
	{
		var list = document.createElement("ul");
		list.id = "suggestionList";
		list.className = "suggestion_list";

		document.body.appendChild(list);
	}
	var list = document.getElementById("suggestionList");
	var initialValue = input.value;
	list.innerHTML = '';
	var pos = getElementTopLeft(input);
	
	with (list.style)
	{
		display = "block";
		top  = pos.top + input.offsetHeight + 'px';
		left = pos.left   + 'px';
	}
	if (typeof input.style.minWidth != "undefined")
	{
		list.style.minWidth = input.offsetWidth + 'px';
	}
	else
	{
		list.style.width = input.offsetWidth  + 'px';
		list.style.overflowX = 'visible';		
	}
	var listIndex = [];
	for (var i=0;i<suggestions.length;i++)
	{
		var li = document.createElement("li");
		list.appendChild(li);
		var a = listIndex[i] = document.createElement("a");
		a.index = i;
		a.href = 'javascript:void(0);';
		addEvent(a, 'keydown', function(ev) {ev = (ev) ? ev : window.event; stopEvent(ev);});
		addEvent(a, 'click', function(ev) {
			ev = (ev) ? ev : window.event;
			var target = (ev.target) ? ev.target : ev.srcElement;
			input.value = target.innerHTML;
		});
		addEvent(a, 'focus', function(ev) {
			ev = (ev) ? ev : window.event;
			var target = (ev.target) ? ev.target : ev.srcElement;
			input.value = target.innerHTML;
		});
		addEvent(a, 'keyup', function(ev) {
			ev = (ev) ? ev : window.event;
			var target = (ev.target) ? ev.target : ev.srcElement;
			switch (ev.keyCode)
			{
				case 40: // arrow down
					if (listIndex[target.index+1])
					{
						listIndex[target.index+1].focus();
					}
					else
					{
						input.focus();
						input.value = initialValue;
					}
				break;
					case 38: // arrow up
					if (listIndex[target.index-1])
					{
						listIndex[target.index-1].focus();
					}
					else
					{
						input.focus();
						input.value = initialValue;
					}
				break;
				case 13: //return
					input.focus();
					hideSuggestions();
				break;
				case 27: // escape
					input.focus();
					input.value = initialValue;
					hideSuggestions();
				break;
			}
			stopEvent(ev);
		});
		a.innerHTML = suggestions[i];
		li.appendChild(a);
	}
	
	if (keyCode == 40)
	{
		listIndex[0].focus();
	}
}
function hideSuggestions()
{
	removeEvent(document.body,'click',hideSuggestions);
	document.getElementById("suggestionList").style.display = 'none';
}
  function dump(o)
  {
    var s = '';
    for ( var prop in o )
    {
		s += prop + ' = ' + o[prop] + '\n';
    }
    var x = window.open("", "debugger");
    x.document.write('<pre>' + s + '</pre>');
  }
if ( document.addEventListener )
{
  function addEvent (el, evname, func)
  {
    el.addEventListener(evname, func, true);
  };
  function removeEvent (el, evname, func)
  {
    el.removeEventListener(evname, func, true);
  };
  function stopEvent (ev)
  {
    ev.preventDefault();
    ev.stopPropagation();
  };
}
else if ( document.attachEvent )
{
  function addEvent (el, evname, func)
  {
    el.attachEvent("on" + evname, func);
  };
  function removeEvent (el, evname, func)
  {
    el.detachEvent("on" + evname, func);
  };
  function stopEvent (ev)
  {
    try
    {
      ev.cancelBubble = true;
      ev.returnValue = false;
    }
    catch (ex)
    {
      // Perhaps we could try here to stop the window.event
      // window.event.cancelBubble = true;
      // window.event.returnValue = false;
    }
  };
}

function getElementTopLeft(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return { top:curtop, left:curleft };
}
function hideShowTrsAfter(btn)
{
	var tr = btn;
	while(tr.parentNode && tr.tagName.toLowerCase() != "tr")
	{
		tr = tr.parentNode;
	}
	
	while (tr.nextSibling)
	{
		tr = tr.nextSibling;
		if (typeof tr.tagName == "undefined") continue;
		if (tr.tagName.toLowerCase() != "tr") continue;
		tr.style.display = (tr.style.display == "none") ? "" : "none";
	}
}
function growTextArea(textArea,sizeTo)
{
	sizeTextAreasToContent (textArea);
	if (textArea.offsetHeight < sizeTo)
		textArea.style.height = sizeTo +"px";
}

function sizeTextAreas()
{
	var tas = document.getElementsByTagName("textarea");
	for (var i = 0; i < tas.length; i++)
	{
		sizeTextAreasToContent(tas[i],"150px");
	}
}
function sizeTextAreasToContent (textArea,max)
{					
	var scrollH = textArea.scrollHeight;
	var offsetH = textArea.offsetHeight
	max = parseInt(max);
	textArea.style.height =  "1px";	
	textArea.style.height = textArea.scrollHeight + 14 + "px";
	if (max && textArea.offsetHeight > max) textArea.style.height = max + "px";
	
}
function otherOption(option,name)
{
	var selectID = option.parentNode.id;
	if (!document.getElementById(selectID+"_other"))
	{
		var td = option.parentNode.parentNode;
		var input = document.createElement("input");
			input.type = "text";
			input.name = name;
			input.id = selectID+"_other";
		td.appendChild(input);
	}
}

function selectOtherOption (id,otherValue)
{
	var select = document.getElementById(id);
	var input = document.getElementById(id+"_other");
	if (!input) return;
	if ( !input.value)
	{
		input.parentNode.removeChild(input);
		return;
	}
	for (var i = 0; i < select.length;i++)
	{
		if (select.options[i].text == otherValue) select.options[i].selected = true; 
	}
}

function otherCheck(option,name)
{
	var td = option.parentNode;
	var input = document.createElement("input");
		input.type = "text";
		input.name = name;
	td.appendChild(input);
}

function checkConditions()
{
	for (var i = 0; i < conditions.length;i++)
	{
		checkCondition ( conditions[i] );
		
	}
}
function checkCondition(condition)
{
	var input = document.getElementsByName(condition.input);
	for (var j = 0; j < input.length;j++)
	{
		if (input[j].value == condition.value)
		{
			var target = document.getElementsByName(condition.target)[0];
			if (target) target.disabled = !input[j].checked;
		}
	}
	
}

function confirmDelPic(input)
{
	var table = input;
	var inputs = document.getElementsByName(input.name);
	var checked = false;
	for (var i = 0; i < inputs.length;i++)
	{
		if (inputs[i].checked) checked = true;
	}
	while (table.parentNode && table.tagName.toLowerCase() != "table" && table.parentNode && table.tagName.toLowerCase() != "tbody")
	{
		table = table.parentNode;
	}
	var btn = document.getElementById("confirmDelPicBtn");
	if (btn)
	{
		btn = btn.parentNode.removeChild(btn);
		if (checked) table.appendChild(btn);
	}
	else
	{
		var btn = document.createElement("input");
			btn.type = "submit";
			btn.name = "reentry";
			btn.value = "Löschen bestätigen";
			
			var tr = document.createElement("tr");
				tr.id = "confirmDelPicBtn";
			table.appendChild(tr);
			
			var td = document.createElement("td");
			tr.appendChild(td);
			
			var td = document.createElement("td");
			tr.appendChild(td);
						
			td.appendChild(btn);
	}
	
}

var conditions = [];
var onLoad = [];

if (typeof window.onload == "function") onLoad.push(window.onload);

window.onload = function ()
{
	for (var i = 0; i < onLoad.length; i++)
	{
		onLoad[i]();
	}
}