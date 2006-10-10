/*------------------------------------------*\
SaveSubmit for Xinha
____________________

Registers a button an an ctrl-s event handler for submiting the Xinha form and uses asynchronous
postback for sending the data to the server

\*------------------------------------------*/

function SaveSubmit(editor) {
	this.editor = editor;
	this.initial_html = null;
	this.changed = false;
	var self = this;
	var cfg = editor.config;
	this.textarea = this.editor._textArea;

	this.imgage_changed = _editor_url+"plugins/SaveSubmit/img/ed_save_red.gif";
	this.imgage_unchanged = _editor_url+"plugins/SaveSubmit/img/ed_save_green.gif";
	cfg.registerButton({
	id       : "savesubmit",
	tooltip  : self._lc("Save"),
	image    : this.imgage_unchanged,
	textMode : true,
	action   :  function(editor) {
			self.save(editor);
		}
	});

	cfg.addToolbarElement("savesubmit", "popupeditor", -1);

};

SaveSubmit.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'SaveSubmit');
};

SaveSubmit._pluginInfo = {
  name          : "SaveSubmit",
  version       : "0.91",
  developer     : "Raimund Meyer",
  developer_url : "http://rheinauf.de",
  c_owner       : "Raimund Meyer",
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};

SaveSubmit.prototype.onGenerate = function() {
	var self = this;
	var doc = this.editordoc = this.editor._iframe.contentWindow.document;
	HTMLArea._addEvents(doc, ["mouseup","keyup","keypress","keydown"],
			    function (event) {
			    return self.onEvent(HTMLArea.is_ie ? self.editor._iframe.contentWindow.event : event);
			    });

	this.tmp_file_present();
};

SaveSubmit.prototype.onEvent = function(ev) {

	var keyEvent = (HTMLArea.is_ie && ev.type == "keydown") || (!HTMLArea.is_ie && ev.type == "keypress");

	if (keyEvent && ev.ctrlKey && String.fromCharCode(HTMLArea.is_ie ? ev.keyCode : ev.charCode).toLowerCase() == 's') {
			this.save(this.editor);
	}
	else {
		if (!this.changed) {
			if (this.getChanged()) this.setChanged();
		};
	};
};

SaveSubmit.prototype.getChanged = function() {
	if (this.initial_html == null) this.initial_html = this.editor.getHTML();
	if (this.initial_html != this.editor.getHTML() && this.changed == false) {

		this.changed = true;
		return true;
	}
	else return false;
}
SaveSubmit.prototype.setChanged = function() {
	var self=this;
	var toolbar_objects = this.editor._toolbarObjects;
	for (var i in toolbar_objects) {
		var btn = toolbar_objects[i];
		if (btn.name == 'savesubmit') {
			btn.swapImage(this.imgage_changed);
		};
	};
	this.editor.updateToolbar();
	//save_interval = function() { self.save_tmp()};
	//this.interval = window.setInterval("save_interval()",10000);

};
SaveSubmit.prototype.changedReset = function() {
	this.changed = false;
	this.initial_html = null;
	var toolbar_objects = this.editor._toolbarObjects;
	for (var i in toolbar_objects) {
		var btn = toolbar_objects[i];
		if (btn.name == 'savesubmit') {
			btn.swapImage(this.imgage_unchanged);
		};
	};
	//window.clearInterval(this.interval);
};

SaveSubmit.prototype.save =  function(editor) {
	if (typeof this.editor.plugins.OutlineElements.instance.removeAll == 'function')
		this.editor.plugins.OutlineElements.instance.removeAll();
	this.buildMessage();
	var self =this;
	var textareaname = editor._textArea.name;
	var post = new Object();
	post[textareaname] = editor.getHTML();
	HTMLArea._postback(editor._textArea.form.action+'&nohtml', post, function(getback) {

		if (getback) {
			var state = {'saved':false,'message':''};
			eval(getback);
			if (state.saved == true)
			{
				self.setMessage(state.message);
				self.changedReset();
			}
			else
			{
				alert(state.message);
			}		
	});
	HTMLArea._getback(editor._textArea.form.action+'&nohtml&workingvmenu',function(getback){if (getback)  eval(getback)});
};

SaveSubmit.prototype.save_tmp =  function() {
	var self =this;
	var textareaname = this.editor._textArea.name;
	var post = new Object();
	post[textareaname] = this.editor.getHTML();
	HTMLArea._postback(this.editor._textArea.form.action+'&nohtml&tmp', post, function(getback) {});
};
SaveSubmit.prototype.tmp_file_present = function () {
	if (document.getElementById('tmp_file').value == 'true') {
		if (confirm("Nach dem letzten Speichern sind noch Änderungen vorgenommen worden.\nWollen Sie die Datei wiederherstellen?")) {
			revert('tmp.html',this.editor);
		}

	}
}

SaveSubmit.prototype.setMessage = function(string) {
  var textarea = this.textarea;
  if ( !document.getElementById("message_sub_" + textarea.name)) { return ; }
  var elt = document.getElementById("message_sub_" + textarea.name);
  elt.innerHTML = HTMLArea._lc(string, 'SaveSubmit');
};

SaveSubmit.prototype.removeMessage = function() {
  var textarea = this.textarea;
  if (!document.getElementById("message_" + textarea.name)) { return ; }
  document.body.removeChild(document.getElementById("message_" + textarea.name));
};

SaveSubmit.prototype.buildMessage   = function() {

      // Create and show the main loading message and the sub loading message for details of loading actions
      // global element
      var textarea = this.textarea;
      var loading_message = document.createElement("div");
      loading_message.id = "message_" + textarea.name;
      loading_message.className = "loading";

      try
      {
        // how can i find the real width in pixels without % or em *and* with no visual errors ?
        // for instance, a textarea with a style="width:100%" and the body padding > 0 result in a horizontal scrollingbar while loading
        // A few lines above seems to indicate offsetWidth is not always set
        loading_message.style.width    = (textarea.offsetWidth != 0) ? textarea.offsetWidth +'px' : this.editor._initial_ta_size.w;;
      }
      catch (e)
      {
        // offsetWidth seems not set, so let's use this._initial_ta_size.w, but sometimes it may be too huge width
        loading_message.style.width = this.editor._initial_ta_size.w;
      };
      loading_message.style.left     = HTMLArea.findPosX(textarea) +  'px';
      loading_message.style.top      = (HTMLArea.findPosY(textarea) + parseInt(this.editor._initial_ta_size.h) / 2) +  'px';
      // main static message
      var loading_main = document.createElement("div");
      loading_main.className = "loading_main";
      loading_main.id = "loading_main_" + textarea.name;
      loading_main.appendChild(document.createTextNode(this._lc("Saving...")));
      // sub dynamic message
      var loading_sub = document.createElement("div");
      loading_sub.className = "loading_sub";
      loading_sub.id = "message_sub_" + textarea.name;
      loading_sub.appendChild(document.createTextNode(this._lc("in progress")));
      loading_message.appendChild(loading_main);
      loading_message.appendChild(loading_sub);
      document.body.appendChild(loading_message);
};