function delete_confirm(link) {
	if (confirm("Diesen Eintrag l�schen?"))
	{
		var url = link.getAttribute("href");
		url +=  "&noframe"; 
		url += (url.indexOf("noframe") == -1) ? "&noframe" : ""; 
		httpRequestGET(url,setContent);
	}
	return false;
}

function checkform() {
	var i,e,bgcolor,firstFail,check = true;
	var bg_color_cache;
	for (i=0;i<required_fields.length;i++)
	{
		e = document.getElementById(required_fields[i]);
		var to_color =  e;
		bg_color_cache = to_color.style.backgroundColor;
		if (e.value == "" || e.value.indexOf("--") != -1)
		{
			var group = document.getElementsByName(e.name);
			check = false;
			for (i=0;i<group.length;i++)
			{
				if (group[i].value) check = true;
			}
			if (!check)
			{
				if (!firstFail) firstFail = e;
				to_color.style.backgroundColor = "red";

			}
		}
		else to_color.style.backgroundColor = bg_color_cache;
	}
	if (firstFail) firstFail.focus();
	return check;
}
var required_fields = [];

function cancelEdit(button)
{
	var form = button;
	while (form.tagName.toLowerCase() != "form")
	{
		form = form.parentNode;
	}
	var url = form.action.replace(/#.*/,"");
	httpRequestGET(url+"&noframe",setContent);
	return false;
}
function resetFilter(el)
{
	var form = el.form;
	for (var i = 0;i<form.elements.length;i++)
	{
		form.elements[i].value = '';
	}
	form.onsubmit();
	return false;
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
function handleCondition(el,targetField)
{

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
			target.disabled = !input[j].checked;
		}
	}
	
}
var conditions = [];
var onLoad = [sizeTextAreas,checkConditions];

if (typeof window.onload == "function") onload.push(window.onload);

window.onload = function ()
{
	for (var i = 0; i < onLoad.length; i++)
	{
		onLoad[i]();
	}
}