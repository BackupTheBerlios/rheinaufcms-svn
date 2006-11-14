function loading()
{
	var div = document.createElement('div');
	var body = document.getElementsByTagName('body')[0];
//	body.style.opacity = 0.3;
	div.id = 'loading';
	var scrolloffset = scrollOffset();
	var viewport = viewPort()
	
	with (div.style)
	{
		position = 'absolute';
		top = scrolloffset.top  + 'px';
		left = scrolloffset.left + 'px';;
		width = viewport.width  + 'px';
		height = viewport.height  + 'px';
		zIndex = 1000;
		textAlign = 'center';
		paddingTop = viewport.height / 2 - 100 +'px';
	}
	div.appendChild(document.createTextNode('Bitte warten ...'))
	body.appendChild(div);
}
function httpRequestGET (url, handler)
{
	loading();
  var req = null;
  if ( window.ActiveXObject )
  {
   req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  else
  {
   req = new XMLHttpRequest();
  }

  function callBack()
  {
    if ( req.readyState == 4 )
    {
      if ( req.status == 200 )
      {
        handler(req.responseText, url);
      }
      else
      {
        alert('An error has occurred: ' + req.statusText);
      }
    }
  }

  req.onreadystatechange = callBack;
  req.open('GET', url, true);
  req.send(null);
};

function httpRequestSubmit(form)
{
	if (!checkform()) return false;
	var content = '';
	for ( var i = 0; i < form.elements.length; i++ )
    {
    	if (form.elements[i].name == 'noframe' || form.elements[i].tagName.toLowerCase() == 'fieldset') continue;
    	if ((form.elements[i].type == 'checkbox' || form.elements[i].type == 'radio') && !form.elements[i].checked ) continue;
		content += (content.length ? '&' : '') + form.elements[i].name + '=' + escape(form.elements[i].value);
    }
    
    
	if (form.method.toLowerCase() == 'get' )
	{
		var url = form.action.replace(/#.*/,'')+'?';
		content += '&noframe';
	    httpRequestGET(url+content,setContent);
	}
	else
	{
		var url = form.action.replace(/#.*/,'');
		url += (url.indexOf('?') != -1) ? '&noframe' : '?noframe'; 
	    httpRequestPOST(url,content,setContent);
	}
}

function httpRequestPOST (url, data, handler)
{
  	loading();
	var req = null;
  if ( window.ActiveXObject )
  {
   req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  else
  {
   req = new XMLHttpRequest();
  }

  var content = '';
  if (typeof data == 'string')
  {
    content = data;
  }
  else if(data != null)
  {
    for ( var i in data )
    {
      content += (content.length ? '&' : '') + i + '=' + escape(data[i]);
    }
  }

  function callBack()
  {
    if ( req.readyState == 4 )
    {
      if ( req.status == 200 )
      {
        if ( typeof handler == 'function' )
        {
          handler(req.responseText, url);
        }
      }
      else
      {
        alert('An error has occurred: ' + req.statusText);
      }
    }
  }

  req.onreadystatechange = callBack;

  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
  //alert(content);
  req.send(content);
};


function setContent(getback,url) {

	var html = getback;
	if (html.indexOf('<script') != -1)
	{
		httpRequestGET(url+'&script',evalScripts)
	}
	document.getElementById('content').innerHTML = getback;
	
	var loading = document.getElementById('loading');
	loading.parentNode.removeChild(loading);
}
function evalScripts(getback)
{
	eval(getback);
}
function scrollOffset()
{
	var x,y;
	if (self.pageYOffset) // all except Explorer
	{
		x = self.pageXOffset;
		y = self.pageYOffset;
	}
	else if (document.documentElement && document.documentElement.scrollTop)
		// Explorer 6 Strict
	{
		x = document.documentElement.scrollLeft;
		y = document.documentElement.scrollTop;
	}
	else if (document.body) // all other Explorers
	{
		x = document.body.scrollLeft;
		y = document.body.scrollTop;
	}
	return {top:y,left:x}
}

function viewPort()
{
	var x,y;
	if (self.innerHeight) // all except Explorer
	{
		x = self.innerWidth;
		y = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
		// Explorer 6 Strict Mode
	{
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	}
	else if (document.body) // other Explorers
	{
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return {width:x,height:y}
}