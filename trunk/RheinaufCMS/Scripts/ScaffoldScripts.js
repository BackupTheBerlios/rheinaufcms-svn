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