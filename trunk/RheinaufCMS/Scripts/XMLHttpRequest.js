function loading()
{
	var div = document.createElement('div');
	var body = document.getElementsByTagName('body')[0];
//	body.style.opacity = 0.3;
	div.id = 'loading';
	var scrolloffset = scrollOffset();
	var viewport = viewPort()

	div.style.position = 'absolute';
	div.style.top = scrolloffset.y  + 'px';
	div.style.left = scrolloffset.x + 'px';;
	div.style.width = viewport.width  + 'px';
	div.style.height = viewport.height  + 'px';
	div.style.zIndex = 1000;
	div.style.textAlign = 'center';
	div.style.paddingTop = viewport.height / 2 - 100 +'px';
	
	div.appendChild(document.createTextNode('Bitte warten ...'))
	body.appendChild(div);
}
function removeLoading()
{
	var loading = document.getElementById("loading");
	if (loading) loading.parentNode.removeChild(loading);
	if (typeof tooltip.init == "function") tooltip.init();
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

	document.getElementById('content').innerHTML = getback;
	
	removeLoading();
}
function evalScripts(getback)
{
	eval(getback);
}
function scrollOffset ()
{
	var x=0,y=0;
	if (typeof self.pageYOffset != "undefined") // all except Explorer
	{
		x = self.pageXOffset;
		y = self.pageYOffset;
	}
	else if (document.documentElement && typeof document.documentElement.scrollTop != "undefined")
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
	return {x : x, y : y}
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