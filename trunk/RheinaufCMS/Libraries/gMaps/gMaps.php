<?php
class gMaps
{
	var $api_key=''; // emil-wachter-stiftung.de
	var $street_field = 'Straße';
	var $PLZ_field= 'PLZ';
	var $city_field = 'Stadt';
	var $country_field = 'Land';
	

	var $lat_field = "Breite";
	var $long_field = "Länge";
	 
	function gMaps($api_key)
	{
		$this->api_key = $api_key;
		if (isset($_GET['getlatlong'])) 
		{
			print $this->js_get_lat_long($_GET['place']);
			exit;
		}
	}

	function getLatLong($adresse)
	{
		$req_url ="http://maps.google.com/maps/geo?q=".urlencode($adresse)."&output=csv&key=".$this->api_key;

		$result = file_get_contents($req_url);
		$result = explode(',',$result);

		$status = $result[0];
		$acurracy = $result[1];
		$lat_long = $result[2].','.$result[3];

		if ($status == '200')
		{
			return $lat_long;
		}
		else return 'Fehler: '.$this->status_codes($status);
	}
	

	function create_map($id)
	{
		$this->load_scripts();
		$this->map_id = $id;
		$GLOBALS['scripts'] .= Html::script('onLoad.push(function(){window["gMap_'.$id.'"] = new GoogleMap(document.getElementById("'.$id.'"))});');
	}
	
	function create_markers($locations)
	{
		$return = '';

		$markers = '';
		foreach ($locations as $loc)
		{
			$lat = $loc[$this->lat_field];
			$long = $loc[$this->long_field];
			$land = $loc[$this->country_field];
			$html = $loc['markerBubble'];
			if ($lat && $long)
			{
				$markers .= "point = new GLatLng($lat,$long);\n";
				$markers .= "gMap_$this->map_id.map.addOverlay(gMap_$this->map_id.createMarker(point, '$html','$id'));\n";
				if ($land == '' || $land == 'Deutschland')	$markers .= "window['gMap_$this->map_id'].bounds.extend(point);\n";
			}
		}
		return $markers;
	}
	function load_scripts($array='')
	{

		if ($GLOBALS['gmapscripts_loaded']) return;
		$GLOBALS['gmapscripts_loaded'] = true;
		$GLOBALS['scripts'] .= Html::script('',array('src'=>'http://maps.google.com/maps?file=api&v=2&key='.$this->api_key));
		$GLOBALS['scripts'] .= Html::script('
			

			function GoogleMap(mapContainer)
			{
				var map = this.map = new GMap2(mapContainer);
		    //map.setCenter(new GLatLng(51.161096,10.447228), 6);
				map.setCenter(new GLatLng(0,0),0);
		    map.addControl(new GSmallMapControl());
				map.addControl(new GMapTypeControl());
				//map.setMapType(G_SATELLITE_MAP);
				//map.setMapType(G_HYBRID_MAP);

				overview = new GOverviewMapControl(new GSize(100,100));
				map.addControl(overview);

				var point;
				var bounds = this.bounds = new GLatLngBounds();

			}
			
			GoogleMap.prototype.createMarker = function(point,html,locid)
			{
				var marker = new GMarker(point);
				GEvent.addListener(marker, "click", function() { marker.openInfoWindowHtml(html); });
				if (locid)
				{
					GEvent.addListener(marker, "dblclick", function() { window.location.search = "?id="+locid; });
				}
				return marker;
			}

			GoogleMap.prototype.setZoomToMarkers = function()
			{

				this.map.setZoom(this.map.getBoundsZoomLevel(this.bounds));

				var clat = (this.bounds.getNorthEast().lat() + this.bounds.getSouthWest().lat()) /2;
				var clng = (this.bounds.getNorthEast().lng() + this.bounds.getSouthWest().lng()) /2;
				this.map.setCenter(new GLatLng(clat,clng));
			}
			

			//window.onload = init;
			window.onunload = GUnload;
			');


		//$return .= '<div id="map" style="width: 475px; height: 600px"></div>';

		return $return;
	}
	function getMapObject ()
	{
		return "gMap_".$this->map_id;
	}
	function js_get_lat_long($place)
	{
	  list($lat,$long) = explode(',',$this->getLatLong($place));
	  return  '{latitude:"'.$lat.'",longitude:"'.$long.'"};' ;
	}

	function get_lat_long_js()
	{

	  return "
function getLatLong(str,plz,city,country,lat_target,long_target)
{
	var handler = function(getback)
	{
	 try { eval('var ret ='+getback); }
		catch(e) {}
		if (ret.latitude)
		{
			if (ret.latitude.indexOf('Fehler') != -1)
		 	{
		 		lat_target.value = '';
		 		long_target.value = '';
		 		return ret.latitude;
		 	}
			lat_target.value  = ret.latitude;
			long_target.value = ret.longitude;
	 	}
	}
	city = (plz) ? '' : city;
	httpRequestGET('".SELF."?getlatlong&place=' + escape(str + ' ' +  plz + ' ' + city + ' ' + country),handler,false)
}
		";
	}
		function status_codes($code)
	{
		switch ($code)
		{
			case '200':
				return 'G_GEO_SUCCESS';
			break;
			case '500':
				return 'G_GEO_SERVER_ERROR';
			break;
			case '601':
				return 'G_GEO_MISSING_ADDRESS';
			break;
			case '602':
			//	return 'G_GEO_UNKNOWN_ADDRESS';
				return 'Google Maps: Adresse nicht gefunden';
			break;
			case '603':
				return 'G_UNAVAILABLE_ADDRESS';
			break;
			case '610':
				return 'G_GEO_BAD_KEY';
			break;

		}

	}
}


?>