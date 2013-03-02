var map;
/*
var redStations = [];
var pkeyToStationName = [];
var keyData=[];
var stationOrder=[];
*/


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
    	title:"You are here!"    	
    });
    
    yourLoc.setMap(map);
}


function placeRedLineStations(){
	var redLineMarker = new Object();
	for(key in rlstations){
		var station = rlstations[key];
		var pos = new google.maps.LatLng(station["stop_lat"],station["stop_lon"]);
		redLineMarker[key]=createMarker(pos,key)	
    	redLineMarker[key].setMap(map);   		
	}
	drawStationConnections();

}

function createMarker(pos, t) {

	var image = {
    url: 'stop_marker.png',
   	
    size: new google.maps.Size(25, 25),
    
    origin: new google.maps.Point(0,0),
    
    anchor: new google.maps.Point(12, 12)
  };
	var marker = new google.maps.Marker({
    				position: pos,
    				title:t,
    				icon: image
    		});
    var infowindow = new google.maps.InfoWindow({
   						content: "I am "+t+"station"
   					});
    google.maps.event.addListener(marker, 'click', function() { 
	   /*infowindow.setContent('test: ' + i + '');*/
	   infowindow.open(map, marker);
    }); 
    
 
    
    return marker;  
}

function drawStationConnections(){
	//assumption, there are three branches, trunk, Braintree, and Ashmont, and Braintree and Ashmont split off from the trunk
	for(i=0; i<connections.length; i++){
		var rlcoord = [];
		for(j=0; j<connections[i].length; j++){
			var skey=connections[i][j];
			console.log(skey);
			var pos=new google.maps.LatLng(rlstations[skey]["stop_lat"],rlstations[skey]["stop_lon"]);
			rlcoord.push(pos);
		}
		var rlPath = new google.maps.Polyline({
			path: rlcoord,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		rlPath.setMap(map);
	}
}


/*var redLineRequest;
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
}*/

/*function drawRedLineStations(){
	if(redLineRequest.readyState==4&&redLineRequest.status==200){		
		var allText = redLineRequest.responseText;
		var allTextLines = [];
		allTextLines = allText.split(/\r\n|\n/);
		var fldHeading = [];
		fldHeading = allTextLines[0].split(',');
		for(i=0;i<fldHeading.length;i++){
			//assumption that RealTimeHeavyRailKeys.csv file will always have these as categories
			if(fldHeading[i]=="StationName")nameOffset=i;
			if(fldHeading[i]=="stop_lat")latOffset=i;
			if(fldHeading[i]=="stop_lon")lonOffset=i;
			if(fldHeading[i]=="PlatformKey")pkeyOffset=i;
			if(fldHeading[i]=="Line")lineOffset=i;
			if(fldHeading[i]=="EndOfLine")eolOffset=i;
			if(fldHeading[i]=="Branch")branchOffset=i;
			if(fldHeading[i]=="Direction")dirOffset=i;
			if(fldHeading[i]=="PlatformOrder")orderOffset=i;
			//is there a find functions to do this better????
		}
		

		for(i=1; i<allTextLines.length; i++){
			keyData[i-1] = allTextLines[i].split(',');
		}
		

		var pkeyToStationName = new Object();
		for(i=0;i<keyData.length;i++){
			if(keyData[i][lineOffset]=="Red"){
				stationName=keyData[i][nameOffset];
				if(keyData[i][eolOffset]=="TRUE"&&keyData[i][dirOffset]=="NB"){
					stationOrder[0].push(stationName);
				}else if(keyData[i][dirOffset]=="SB"{
					stationOrder[keyData[i][orderOffset]].push(stationName);
				}
				//console.log("checking for "+stationName);
				if(redStations[stationName]==null){
				//	console.log("initializing "+stationName);					
					redStations[stationName]=new Object();
					redStations[stationName].lat=keyData[i][latOffset];
					redStations[stationName].lon=keyData[i][lonOffset];
					redStations[stationName].pkeys=[keyData[i][pkeyOffset]];
					redStations[stationName].branch=keyData[i][branchOffset];
					pkeyToStationName[keyData[i][pkeyOffset]]=stationName;
				//	console.log("end initializing "+stationName);
				}else{
				//	console.log("adding to "+stationName);
					redStations[stationName].pkeys.push(keyData[i][pkeyOffset]);
					pkeyToStationName[keyData[i][pkeyOffset]]=stationName;
				//	console.log("end adding to "+stationName);
				//	console.log(redStations[stationName]);
				}
				
			}
		}
		

		var redLineMarker = new Object();
		for(key in redStations){
			var station = redStations[key];
			var pos = new google.maps.LatLng(station.lat,station.lon);
			redLineMarker[key]=createMarker(pos,key)	
    		redLineMarker[key].setMap(map);   		
		}
		drawStationConnections();
		
	}
	if(redLineRequest.status==0||redLineRequest.status==404){	
		redLineRequest.abort();
		placeRedLineStations();
	}
}*/


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