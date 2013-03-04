var map;
/*
var redStations = [];
var pkeyToStationName = [];
var keyData=[];
var stationOrder=[];
*/

  /*infowindow.setContent("I HAPPEN???");*/
var todisplay;
var myMarker;
var people;
var redLineMarker;
var dRequest;
var cwRequest;
var arrivalData;
var geoLoaded;
var stationsLoaded;
var waldo;
var carmen;

function initialize(){
  // Check if geolocation is supported by browser
  if(!navigator.geolocation) {
    throw 'Geolocation not supported!';
  }else {
    initGlobals();
	  //initialize map to cambridge area
    var latlng = new google.maps.LatLng(42.37,-71.13);
    myOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    // Get current position, and recenter map  
    navigator.geolocation.getCurrentPosition(placeGeoLoc);

    //set up redline T stops
    placeRedLineStations();
    getCarmenAndWaldo();
    setArrivalData();
  }
}

function initGlobals(){
  people=new Object;
  redLineMarker = new Object();
  geoLoaded=false;
  stationsLoaded=false;
  waldo=false;
  carmen=false;
}

// Function used in navigator.geolocation.getCurrentPosition method.
function placeGeoLoc(pos) {
  var lat = pos.coords.latitude;
  var lng = pos.coords.longitude;
  var latlng = new google.maps.LatLng(lat,lng);

  myMarker = new google.maps.Marker({
    position: latlng,
    title:"You are here!"    	
  });
  
  myMarker.setMap(map);
}


function placeRedLineStations(){
  for(key in rlstations){
    var station = rlstations[key];
    var pos = new google.maps.LatLng(station["stop_lat"],station["stop_lon"]);
    redLineMarker[key]=createStationMarker(pos,key);
    redLineMarker[key]["marker"].setMap(map);   		
	}
	drawStationConnections();
}

function createStationMarker(pos, t) {
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
    content: "<h3>"+ t + " STATION</h3><p>loading...<p>"
  });
  google.maps.event.addListener(marker, 'click', function() { 
    infowindow.open(map, marker);
  }); 
  var stationObj={"marker":marker,
              "info":infowindow};
  return stationObj;  
}

function setArrivalData(){
  try {
    dRequest = new XMLHttpRequest();
  }
  catch (ms1) { 
    try {
      dRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (ms2) {
      try {
        dRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (ex) {
        dRequest = null;
      }
    }
  }
  if (dRequest == null) {
    alert("Error creating request object --Ajax not supported?");
  }else{
    dRequest.open("GET","http://mbtamap-cedar.herokuapp.com/mapper/redline.json",true);    
    dRequest.send(null);
    dRequest.onreadystatechange=infoWindowCallback;
  }
}

function infoWindowCallback(){
  if(dRequest.readyState==4&&dRequest.status==200){
    arrivalData=JSON.parse(dRequest.responseText);
    for(i=0; i<arrivalData.length;i++){
      //if(arrivalData[i]["PlatformKey"]=="RBRAS")console.log("rbras:"+arrivalData[i]["Route"]);
      //if(arrivalData[i]["PlatformKey"]=="RASHS")console.log("rashs:"+arrivalData[i]["Route"]);
    }
    for(key in rlstations){
      setInfo(key);
    } 
  }
  if(dRequest.status==0||dRequest.status==404){	
    dRequest.abort();
    alert("Could not get train arrival data...please refresh the page");
  }
}

function setInfo(key){
  var infoWindow=redLineMarker[key]["info"];
  var nbname=rlstations[key]["PlatformKeyNB"];
  var sbname=rlstations[key]["PlatformKeySB"];
  var content="<h3>"+key+" STATION:</h3><table border=\"1\"><tr><th>Direction</th><th>Predicted Arrival</th></tr>";
  for(i=0; i<arrivalData.length; i++){
    if(arrivalData[i]["PlatformKey"]==nbname&&arrivalData[i]["InformationType"]=="Predicted"){
      content+="<tr><td>Alewife (NB)</td><td>"+arrivalData[i]["Time"]+"</td></tr>";
    }
    if(arrivalData[i]["PlatformKey"]==sbname&&arrivalData[i]["InformationType"]=="Predicted"){
      if(arrivalData[i]["Route"]==0)content+="<tr><td>Braintree (SB)</td><td>";
      else content+="<tr><td>Ashmont (SB)</td><td>";
      content+=arrivalData[i]["Time"]+"</td></tr>";        
    }
  }
  content+="</table>";
  infoWindow.setContent(content);
}

function drawStationConnections(){
  //assumption, there are three branches, trunk, Braintree, and Ashmont, 
  //and Braintree and Ashmont split off from the trunk
  for(i=0; i<connections.length; i++){
    var rlcoord = [];
    for(j=0; j<connections[i].length; j++){
      var skey=connections[i][j];
      //console.log(skey);
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


function getCarmenAndWaldo(){
  try {
    cwRequest = new XMLHttpRequest();
  }
  catch (ms1) { 
    try {
      cwRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (ms2) {
      try {
        cwRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (ex) {
        cwRequest = null;
      }
    }
  }
  if (cwRequest == null) {
    alert("Error creating request object --Ajax not supported?");
  }else{
    cwRequest.open("GET","http://messagehub.herokuapp.com/a3.json",true);    
    cwRequest.send(null);
    cwRequest.onreadystatechange=drawCarmenAndWaldoCallback;
  }
}

function drawCarmenAndWaldoCallback(){
  if(cwRequest.readyState==4&&cwRequest.status==200){
    var cwdata=JSON.parse(cwRequest.responseText);
    console.log(cwdata);
    for(i=0; i<cwdata.length;i++){
      var image = 'stop_marker.png';
      if(cwdata[i]["name"]=="Waldo")waldo=true;
      if(cwdata[i]["name"]=="Carmen Sandiego")carmen=true;
      var marker=createCWMarker(cwdata[i]);
      marker.setMap(map);
      people[cwdata[i]["name"]]=new Object();
      people[cwdata[i]["name"]]["data"]=cwdata[i];
      people[cwdata[i]["name"]]["marker"]=marker;
    }
    if(!waldo && !carmen){
      alert("Neither Carmen nor Waldo could be found!");
    }else if(!waldo){
      alert("Wally couldn't be found!");
    }else if(!carmen){
      alert("Carmen couldn't be found!");
    }	
	}
  if(cwRequest.status==0||cwRequest.status==404){	
    cwRequest.abort();
    alert("Neither Carmen nor Waldo could be found! Oh no! Refresh the page to try again");
  }
}

function createCWMarker(obj){
  var image = 'stop_marker.png';
  if(obj["name"]=="Waldo"){
    image = 'waldo.png';
  }else if(obj["name"]=="Carmen Sandiego"){
    image = 'carmen.png';
  }
  var pos=new google.maps.LatLng(obj["loc"]["latitude"],obj["loc"]["longitude"]);
  var marker = new google.maps.Marker({
    position: pos,
    title: obj["name"],
    icon: image
  });
  var infowindow = new google.maps.InfoWindow({
    content: obj["loc"]["note"]
  });
  google.maps.event.addListener(marker, 'click', function() { 
    /*infowindow.setContent('test: ' + i + '');*/
    infowindow.open(map, marker);
  }); 
  return marker;
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
			redLineMarker[key]=createStationMarker(pos,key)	
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
