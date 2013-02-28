var map;
var redStations = [];
function initialize()
	{
		// Check if geolocation is supported by browser
		if(!navigator.geolocation) {
			throw 'Geolocation not supported!';
		} else {

			//initialize map to cambridge area
			var latlng = new google.maps.LatLng(42.37,-71.13);
			myOptions = {
				zoom: 12,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP};
			
			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
			
			// Get current position, and recenter map
			navigator.geolocation.getCurrentPosition(placeMap);
			
			//set up redline T stops
			placeRedLineStations();
		}

}
// Function used in navigator.geolocation.getCurrentPosition method.
function placeMap(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    var latlng = new google.maps.LatLng(lat,lng);
	
	var yourLoc = new google.maps.Marker({
    	position: latlng,
    	title:"Hello World!"
    });
    
    yourLoc.setMap(map);
}

var redLineRequest;
function placeRedLineStations(){
	try {
		redLineRequest = new XMLHttpRequest();
	 }
	 catch (ms1) { 
	 	try {
	 		redLineRequest = new ActiveXObject("Msxml2.XMLHTTP");
	 	}
	 	catch (ms2) {
	 		try {
	 			redLineRequest = new ActiveXObject("Microsoft.XMLHTTP");
	 		}
	 		catch (ex) {
	 			redLineRequest = null;
	 		}
	 	}
	 }
	 if (redLineRequest == null) {
		 alert("Error creating request object --Ajax not supported?");
   	 }else{
	     redLineRequest.open("GET","RealTimeHeavyRailKeys.csv",true);    
	     redLineRequest.send(null);
	     redLineRequest.onreadystatechange=drawRedLineStations;
     }
}

function drawRedLineStations(){
	if(redLineRequest.readyState==4&&redLineRequest.status==200){		
		var allText = redLineRequest.responseText;
		var allTextLines = [];
		allTextLines = allText.split(/\r\n|\n/);
		var fldHeading = [];
		fldHeading = allTextLines[0].split(',');
		for(i=0;i<fldHeading.length;i++){
			//assumption that csv file will always have these as categories
			if(fldHeading[i]=="StationName")nameOffset=i;
			if(fldHeading[i]=="stop_lat")latOffset=i;
			if(fldHeading[i]=="stop_lon")lonOffset=i;
			if(fldHeading[i]=="PlatformKey")pkeyOffset=i;
			if(fldHeading[i]=="Line")lineOffset=i;
		}
		
		var fldData=[];
		for(i=1; i<allTextLines.length; i++){
			fldData[i-1] = allTextLines[i].split(',');
		}
		

		var pkeyToStationName = new Object();
		for(i=0;i<fldData.length;i++){
			if(fldData[i][lineOffset]=="Red"){
				stationName=fldData[i][nameOffset];
				//console.log("checking for "+stationName);
				if(redStations[stationName]==null){
				//	console.log("initializing "+stationName);					
					redStations[stationName]=new Object();
					redStations[stationName].lat=fldData[i][latOffset];
					redStations[stationName].lon=fldData[i][lonOffset];
					redStations[stationName].pkeys=[fldData[i][pkeyOffset]];
					pkeyToStationName[fldData[i][pkeyOffset]]=stationName;
				//	console.log("end initializing "+stationName);
				}else{
				//	console.log("adding to "+stationName);
					redStations[stationName].pkeys.push(fldData[i][pkeyOffset]);
					pkeyToStationName[fldData[i][pkeyOffset]]=stationName;
				//	console.log("end adding to "+stationName);
				//	console.log(redStations[stationName]);
				}
				
			}
		}
		
		//HAVEN'T YET MODIFIED ANYTHING BELOW THIS!!!
		//assumption based on csv being static: there are fields called StationName, PlatformKey, stop_lat, stop_lon
		var redLineMarker = new Object();
		for(key in redStations){
			var station = redStations[key];
			redLineMarker[key] = new google.maps.Marker({
    			position: new google.maps.LatLng(station.lat,station.lon),
    			title:key
    		});
    		//console.log(station+"at "+station.lat+", "+station.lon);
    		redLineMarker[key].setMap(map);
    		
    		google.maps.event.addListener(redLineMarker[key], 'click', function() {
				map.setZoom(20);
				map.setCenter(redLineMarker[key].getPosition());
			});
		}
		
		
	}
	if(redLineRequest.status==0||redLineRequest.status==404){	
		redLineRequest.abort();
		placeRedLineStations();
	}
}

/*
var redLineRequest;
function load_redLineData() {
	 try {
		redLineRequest = new XMLHttpRequest();
	 }
	 catch (ms1) { 
	 	try {
	 		redLineRequest = new ActiveXObject("Msxml2.XMLHTTP");
	 	}
	 	catch (ms2) {
	 		try {
	 			redLineRequest = new ActiveXObject("Microsoft.XMLHTTP");
	 		}
	 		catch (ex) {
	 			redLineRequest = null;
	 		}
	 	}
	 }
  
	 if (redLineRequest == null) {
		 alert("Error creating request object --Ajax not supported?");
   	 }else{
	     redLineRequest.open("GET","http://mbtamap-cedar.herokuapp.com/mapper/redline.json",true);    
	     redLineRequest.send(null);
	     redLineRequest.onreadystatechange=redLineCallback;
     }
}

function redLineCallback(){
	if(redLineRequest.readyState==4&&redLineRequest.status==200){
		placeRedLine(redLineRequest.responseText);
	}
	if(redLineRequest.status==0||redLineRequest.status==404){	
		redLineRequest.abort();
		load_redLineData();
	}
}

function placeRedLine(str){
	data=JSON.parse(str);
	
	for(i=0; i<parsed.length; i++){
		
		 	redlineMarkers[i] = new google.maps.Marker({
    		position: new google.maps.LatLng(parsed[i].lattitude,parsed[i].longitude),
    		title:"Hello World!"
    	});
    
   
		
	    c.innerHTML=parsed[i]["company"];
	    c=r.insertCell(1);
	    c.innerHTML=parsed[i]["location"];
	    c=r.insertCell(2);
	    c.innerHTML=parsed[i]["position"];
	}
	 yourLoc.setMap(map);
}

*/