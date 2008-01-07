Tree = function (linker)
{
  this.Dialog_nxtid = 0;
 
  this.id = { }; // This will be filled below with a replace, nifty

 
  this.files  = false;
  this.html   = false;
 

  // load the dTree script
  this.prepareTree();

};
Tree.prototype.prepareTree = function()
{
  var lDialog = this;
  var linker = this.linker;

  // We load some stuff up int he background, recalling this function
  // when they have loaded.  This is to keep the editor responsive while
  // we prepare the dialog.
  
  if(this.files == false)
  {
    if(linker.lConfig.backend)
    {
        //get files from backend
        HTMLArea._getback(linker.lConfig.backend,
                          function(txt) {
                            try {
                                eval('lDialog.files = '+txt);
                            } catch(Error) {
                                lDialog.files = [ {url:'',title:Error.toString()} ];
                            }
                            lDialog._prepareDialog(); });
    }
    else if(linker.lConfig.files != null)
    {
        //get files from plugin-config
        lDialog.files = linker.lConfig.files;
        lDialog._prepareDialog();
    }
    return;
  }
  var files = this.files;

  if(this.html == false)
  {
    HTMLArea._getback(_editor_url + 'plugins/Linker/dialog.html', function(txt) { lDialog.html = txt; lDialog._prepareDialog(); });
    return;
  }
  var html = this.html;

  // Now we have everything we need, so we can build the dialog.
  var dialog = this.dialog = new HTMLArea.Dialog(linker.editor, this.html, 'Linker');
  var dTreeName = HTMLArea.uniq('dTree_');

  this.dTree = new dTree(dTreeName, _editor_url + 'plugins/Linker/dTree/');
  eval(dTreeName + ' = this.dTree');

  this.dTree.add(this.Dialog_nxtid++, -1, document.location.host, null, document.location.host);
  this.makeNodes(files, 0);

  // Put it in
  var ddTree = this.dialog.getElementById('dTree');
  //ddTree.innerHTML = this.dTree.toString();
  ddTree.innerHTML = '';
  ddTree.style.position = 'absolute';
  ddTree.style.left = 1 + 'px';
  ddTree.style.top =  0 + 'px';
  ddTree.style.overflow = 'auto';
  this.ddTree = ddTree;
  this.dTree._linker_premade = this.dTree.toString();

  var options = this.dialog.getElementById('options');
  options.style.position = 'absolute';
  options.style.top      = 0   + 'px';
  options.style.right    = 0   + 'px';
  options.style.width    = 320 + 'px';
  options.style.overflow = 'auto';

  // Hookup the resizer
  this.dialog.onresize = function()
    {
      options.style.height = ddTree.style.height = (parseInt(dialog.height) - dialog.getElementById('h1').offsetHeight) + 'px';
      ddTree.style.width  = (parseInt(dialog.width)  - 322 ) + 'px';
    }

  this.ready = true;
};

Tree.prototype.makeNodes = function(files, parent)
{
  for(var i = 0; i < files.length; i++)
  {
    if(typeof files[i] == 'string')
    {
      this.dTree.add(Linker.nxtid++, parent,
                     files[i].replace(/^.*\//, ''),
                     'javascript:document.getElementsByName(\'' + this.dialog.id.href + '\')[0].value=decodeURIComponent(\'' + encodeURIComponent(files[i]) + '\');document.getElementsByName(\'' + this.dialog.id.type + '\')[0].click();document.getElementsByName(\'' + this.dialog.id.href + '\')[0].focus();void(0);',
                     files[i]);
    }
    else if(files[i].length)
    {
      var id = this.Dialog_nxtid++;
      this.dTree.add(id, parent, files[i][0].replace(/^.*\//, ''), null, files[i][0]);
      this.makeNodes(files[i][1], id);
    }
    else if(typeof files[i] == 'object')
    {
      if(files[i].children) {
        var id = this.Dialog_nxtid++;
      } else {
        var id = Linker.nxtid++;
      }

      if(files[i].title) var title = files[i].title;
      else if(files[i].url) var title = files[i].url.replace(/^.*\//, '');
      else var title = "no title defined";
      if(files[i].url) var link = 'javascript:document.getElementsByName(\'' + this.dialog.id.href + '\')[0].value=decodeURIComponent(\'' + encodeURIComponent(files[i].url) + '\');document.getElementsByName(\'' + this.dialog.id.type + '\')[0].click();document.getElementsByName(\'' + this.dialog.id.href + '\')[0].focus();void(0);';
      else var link = '';
      
      this.dTree.add(id, parent, title, link, title);
      if(files[i].children) {
        this.makeNodes(files[i].children, id);
      }
    }
  }
};