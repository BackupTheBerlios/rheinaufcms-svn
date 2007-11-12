function accesskeys() {
	var accesskey_array = new Array('1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
	var links = document.getElementsByTagName("a");
	var ak_node;
	for (var i = 0; i<(links.length || accesskey_array.length);i++)	{
		ak_node = document.createAttribute('accesskey'); 
		ak_node.nodeValue = accesskey_array[i];
		links[i].setAttributeNode(ak_node);
	}
}
function content (rubrik,seite) {	

	httpRequest('http://'+window.location.host+'/CMSinit.php?r='+rubrik.toString()+'&s='+seite.toString());
	return false;
}

 var http_request = false;

function httpRequest(url) {

    http_request = false;

    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
            // zu dieser Zeile siehe weiter unten
        }
    } else if (window.ActiveXObject) { // IE
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!http_request) {
        alert('Ende :( Kann keine XMLHTTP-Instanz erzeugen');
        return false;
    }
    http_request.onreadystatechange = setInhalt;
    http_request.open('GET', url, true);
    http_request.send(null);
	return true;
}

function setInhalt() {

    if (http_request.readyState == 4) {
        if (http_request.status == 200) {
            var getback = http_request.responseXML;
        	var html = getback.getElementsByTagName('html')[0].innerHTML;
            //alert(html);
        	document.getElementsByTagName('html')[0].innerHTML = html;
        } else {
            alert('Bei dem Request ist ein Problem aufgetreten.');
        }
    }

}
