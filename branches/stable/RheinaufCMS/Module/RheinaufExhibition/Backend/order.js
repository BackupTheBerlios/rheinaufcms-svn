var changed = false;

function updateOrder() {
	var form = document.getElementById("orderform");
	var new_order = "";
	var new_input;
	if (form.select.options.length)
	{
		for (var i=0;i<form.select.options.length;i++) {
			new_input = document.createElement("input");
			new_input.name = "new_world_order[]";
			new_input.value = form.select.options[i].value;
			new_input.type = "hidden";
			form.appendChild(new_input);
		}
	}
	else
	{
		new_input = document.createElement("input");
		new_input.name = "new_world_order";
		new_input.type = "hidden";
		form.appendChild(new_input);
	}

}
function up() {

	var select = document.getElementById("orderform").select;
	
	if (select.selectedIndex <= 0) return;
	var scrollTop = select.scrollTop;
	
	changed = true;

	var selected = select.options[select.selectedIndex];
	var selected_minus = select.options[select.selectedIndex-1];

	var value_1 = {id:selected.value,text:selected.text, filename: selected.getAttribute('filename')};
	var value_2 = {id:selected_minus.value,text:selected_minus.text, filename: selected_minus.getAttribute('filename')};

	selected_minus.value = value_1.id;
	selected_minus.text = value_1.text;
	selected_minus.setAttribute('filename', value_1.filename) ;
	selected.value = value_2.id;
	selected.text = value_2.text;
	selected.setAttribute('filename',  value_2.filename);

	select.selectedIndex = select.selectedIndex-1;

	if (selected.offsetTop - select.offsetTop - scrollTop < selected.offsetHeight) 
	{
		select.scrollTop = scrollTop - selected.offsetHeight;
	}
	else
	{
		select.scrollTop = scrollTop;
	}
}

function down() {

	var select = document.getElementById("orderform").select;
	var scrollTop = select.scrollTop;
	
	if (select.selectedIndex == -1 || select.selectedIndex == select.options.length-1) return;

	changed = true;

	var selected = select.options[select.selectedIndex];
	var selected_plus = select.options[select.selectedIndex+1];

	var value_1 = {id:selected.value,text:selected.text, filename: selected.getAttribute('filename')};
	var value_2 = {id:selected_plus.value,text:selected_plus.text, filename: selected_plus.getAttribute('filename')};

	selected_plus.value = value_1.id;
	selected_plus.text = value_1.text;
	selected_plus.setAttribute('filename', value_1.filename);
	
	selected.value = value_2.id;
	selected.text = value_2.text;
	selected.setAttribute('filename', value_2.filename);

	select.selectedIndex = select.selectedIndex+1;
	var x = select.offsetTop + select.offsetHeight + scrollTop - selected.offsetHeight ;
	
	if (x > selected.offsetTop)
	{
		select.scrollTop = scrollTop + selected.offsetHeight;
	}
	else
	{
		select.scrollTop = scrollTop;
	}
}

function del() {

	var form = document.getElementById("orderform");

	if (form.select.selectedIndex == -1) return;

	changed = true;

	var selected = form.select.options[form.select.selectedIndex];
	form.select.remove(form.select.selectedIndex);


}

function coverpic()
{
	var form = document.getElementById("orderform");
	var input = document.getElementById("coverpic");
	var preview = document.getElementById("coverpic_preview");
	var old_val = input.value;

	if (form.select.selectedIndex == -1) return;

	changed = true;

	var selected = form.select.options[form.select.selectedIndex];
	var new_val =  selected.getAttribute('filename');
	input.value = new_val;

	preview.src = RheinaufExhibitionImagesDir + RheinaufExhibitionThumbsDir  + new_val;
}
function preview(select)
{
	var selected = select.options[select.selectedIndex];
	var preview = document.getElementById('selected_preview');
	if (preview.parentNode.style.display == 'none' ) preview.parentNode.style.display = '';
	preview.src = RheinaufExhibitionImagesDir + RheinaufExhibitionThumbsDir + selected.getAttribute('filename');
}

function getChanged() {
	if (changed) {
		return confirm("Wenn Sie jetzt zurückgehen, verlieren Sie eventuelle Änderungen.\n\nTrotzdem zurückgehen?");
	} else return true;

}
