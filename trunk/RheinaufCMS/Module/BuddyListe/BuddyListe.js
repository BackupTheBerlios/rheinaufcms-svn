function checkform()
{
	var i,e,bgcolor,check = true;
	var bg_color_cache;
	for (i=0;i<required.length;i++)
	{
		e = document.getElementById(required[i]);
		bg_color_cache = e.style.backgroundColor;
		if (e.value == '' || e.value.indexOf('--') != -1)
		{
			check = false;
			e.style.backgroundColor = 'red';
		}
		else e.style.backgroundColor = bg_color_cache;
	}
	return check;
}

var uploads = 1;

function add_file_upload()
{

	var tbody = document.getElementById("form_tbody");

	var tbody_lastchild = tbody.lastChild;

	if (tbody_lastchild.nodeType != 1) tbody_lastchild = tbody.lastChild.previousSibling; //Mozilla nimmt zwischen jedem tr einen Text-Knoten an

	var input = document.createElement("input");
	var type = document.createAttribute("type");
	type.value= "file";
	input.setAttributeNode(type);

	var name = document.createAttribute("name");
	name.value= "bild["+uploads+"]";
	input.setAttributeNode(name);

	var tr = document.createElement("tr");
	var td1= document.createElement("td");
	var td2= document.createElement("td");
	var nr = uploads+1;
	var bild_i = document.createTextNode("Bild "+ nr);

	td1.appendChild(bild_i);
	td2.appendChild(input);
	tr.appendChild(td1);
	tr.appendChild(td2);

	tbody.insertBefore(tr,tbody_lastchild);
	uploads++;
}
function textarea_grow (id)
{
	var textarea = document.getElementById(id);
	textarea.rows = 20;
}
function textarea_shrink (id)
{
	var textarea = document.getElementById(id);
	//var text = textarea.value.length;
	//var rows = text / textarea.cols;
	//textarea.rows = rows;
	textarea.rows = 2;
}