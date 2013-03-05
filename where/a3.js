var map;
var myMarker;
var myPos;
var redLineMarkers;
var dRequest;
var cwRequest;
var arrivalData;
var geoLoaded;
var waldo;
var carmen;
//see bottom of file for hardcoded station data

function initialize() {
  try{
    if(!navigator.geolocation) {
      throw 'Geolocation not supported!';
    } else {
      initGlobals();
      //initialize map to boston/cambridge area
      var latlng = new google.maps.LatLng(42.37,-71.08);
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
      //retrieve and place Carmen and Waldo
      setCarmenAndWaldo();
      //retrieve and set train info
      setArrivalData();
    }
  } 
  catch (e) {
    alert("Sorry, something went wrong! Please refresh the page.");
  }
}


function initGlobals(){
  redLineMarkers = new Object();
  geoLoaded=false;
  waldo=false;
  carmen=false;
}

function toRad(x){
    return x * Math.PI / 180;
}
  
function hdistance(lat1,lon1){
  return function(lat2,lon2){
    var R = 3959;

    var x1 = lat1-lat2;
    var dLat = toRad(x1);  
    var x2 = lon1-lon2; 
    var dLon = toRad(x2); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;
  };
}


// Function used in navigator.geolocation.getCurrentPosition method.
function placeGeoLoc(pos) {
  var lat = pos.coords.latitude;
  var lng = pos.coords.longitude;
  var latlng = new google.maps.LatLng(lat,lng);
  myPos=pos;

  myMarker = new google.maps.Marker({
    position: latlng,
    title:"You are here!"    	
  });
  geoLoaded=true;
  var distToMe=hdistance(lat,lng);
  var mindist=-1;
  var minkey;
  for(key in rlstations){
      newdist=distToMe(rlstations[key].stop_lat,rlstations[key].stop_lon);
      if(newdist<mindist||mindist==-1){
          minkey=key;
          mindist=newdist;
      }
  }
  var infowindow = new google.maps.InfoWindow({
    content: "<p>Closest station is "+minkey+" which is "+mindist.toFixed(3)+" miles away</p>"
  });
  google.maps.event.addListener(myMarker, 'click', function() { 
    infowindow.open(map, myMarker);
  }); 
  myMarker.setMap(map);
}


function placeRedLineStations(){
  for(key in rlstations){
    var station = rlstations[key];
    var pos = new google.maps.LatLng(station.stop_lat,station.stop_lon);
    redLineMarkers[key]=createStationMarker(pos,key);
    redLineMarkers[key].marker.setMap(map);   		
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
  var infoWindow=redLineMarkers[key].info;
  var nbname=rlstations[key].PlatformKeyNB;
  var sbname=rlstations[key].PlatformKeySB;
  var content="<p class=\"infoheader\">"+key+" STATION:</p><table border=\"1\"><tr><th>Direction</th><th>Predicted Arrival</th></tr>";
  for(i=0; i<arrivalData.length; i++){
    if(arrivalData[i].PlatformKey==nbname&&arrivalData[i].InformationType=="Predicted"){
      content+="<tr><td>Alewife (NB)</td><td>"+arrivalData[i].Time+"</td></tr>";
    }
    if(arrivalData[i].PlatformKey==sbname&&arrivalData[i].InformationType=="Predicted"){
      if(arrivalData[i].Route==0)content+="<tr><td>Braintree (SB)</td><td>";
      else content+="<tr><td>Ashmont (SB)</td><td>";
      content+=arrivalData[i].Time+"</td></tr>";        
    }
  }
  content+="</table>";
  infoWindow.setContent(content);
}

function drawStationConnections(){
  for(i=0; i<connections.length; i++){
    var rlcoord = [];
    for(j=0; j<connections[i].length; j++){
      var skey=connections[i][j];
      var pos=new google.maps.LatLng(rlstations[skey].stop_lat,rlstations[skey].stop_lon);
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


function setCarmenAndWaldo(){
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
    for(i=0; i<cwdata.length;i++){
      var image = 'stop_marker.png';
      if(cwdata[i].name=="Waldo")waldo=true;
      if(cwdata[i].name=="Carmen Sandiego")carmen=true;
      var marker=createCWMarker(cwdata[i]);
      marker.setMap(map);
    }
  }
  if(cwRequest.status==0||cwRequest.status==404){	
    cwRequest.abort();
  }
}

function createCWMarker(obj){
  var image;
  if(obj.name=="Waldo"){
    image = 'waldo.png';
  }else if(obj.name=="Carmen Sandiego"){
    image = 'carmen.png';
  }
  var pos=new google.maps.LatLng(obj.loc.latitude,obj.loc.longitude);
  var marker = new google.maps.Marker({
    position: pos,
    title: obj.name,
    icon: image
  });
  var infowindow = new google.maps.InfoWindow({});
  var note=obj.loc.note;
  google.maps.event.addListener(marker, 'click', function() { 
    var content="<p>Note: "+note+"<p>";
    if(geoLoaded==true){
      var distToMe = hdistance(myPos.coords.latitude,myPos.coords.longitude);
      var mi=distToMe(obj.loc.latitude,obj.loc.longitude); 
      content+="<p>"+obj.name+" is "+ mi.toFixed(3) +" miles away from you!<p>";
    }
    infowindow.setContent(content);
    infowindow.open(map, marker);
  }); 
  return marker;
}

//hardcoded station data:
rlstations= 
{
"ALEWIFE":
	{
		"StationName": "ALEWIFE",
		"PlatformKeyNB": "RALEN",
		"PlatformKeySB": "",
		"PlatformName": "ALEWIFE NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-alfcl",
		"stop_name": "Alewife Station",
		"stop_desc": "",
		"stop_lat": "42.395428",
		"stop_lon": "-71.142483"
	},
"DAVIS":
	{
		"StationName": "DAVIS",
		"PlatformKeyNB": "RDAVN",
		"PlatformKeySB": "RDAVS",
		"PlatformName": "DAVIS NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-davis",
		"stop_name": "Davis Station",
		"stop_desc": "",
		"stop_lat": "42.39674",
		"stop_lon": "-71.121815"
	},
"PORTER":
	{
		"StationName": "PORTER",
		"PlatformKeyNB": "RPORN",
		"PlatformKeySB": "RPORS",
		"PlatformName": "PORTER NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-portr",
		"stop_name": "Porter Square Station",
		"stop_desc": "",
		"stop_lat": "42.3884",
		"stop_lon": "-71.119149"
	},
"HARVARD":
	{
		"StationName": "HARVARD",
		"PlatformKeyNB": "RHARN",
		"PlatformKeySB": "RHARS",
		"PlatformName": "HARVARD NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-harsq",
		"stop_name": "Harvard Square Station",
		"stop_desc": "",
		"stop_lat": "42.373362",
		"stop_lon": "-71.118956"
	},
"CENTRAL":
	{
		"StationName": "CENTRAL",
		"PlatformKeyNB": "RCENN",
		"PlatformKeySB": "RCENS",
		"PlatformName": "CENTRAL NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-cntsq",
		"stop_name": "Central Square Station",
		"stop_desc": "",
		"stop_lat": "42.365486",
		"stop_lon": "-71.103802"
	},
"KENDALL":
	{
		"StationName": "KENDALL",
		"PlatformKeyNB": "RKENN",
		"PlatformKeySB": "RKENS",
		"PlatformName": "KENDALL NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-knncl",
		"stop_name": "Kendall/MIT Station",
		"stop_desc": "",
		"stop_lat": "42.36249079",
		"stop_lon": "-71.08617653"
	},
"CHARLES MGH":
	{
		"StationName": "CHARLES MGH",
		"PlatformKeyNB": "RMGHN",
		"PlatformKeySB": "RMGHS",
		"PlatformName": "CHARLES MGH NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-chmnl",
		"stop_name": "Charles/MGH Station",
		"stop_desc": "",
		"stop_lat": "42.361166",
		"stop_lon": "-71.070628"
	},
"PARK":
	{
		"StationName": "PARK",
		"PlatformKeyNB": "RPRKN",
		"PlatformKeySB": "RPRKS",
		"PlatformName": "PARK NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-pktrm",
		"stop_name": "Park St. Station",
		"stop_desc": "",
		"stop_lat": "42.35639457",
		"stop_lon": "-71.0624242"
	},
"DOWNTOWN CROSSING":
	{
		"StationName": "DOWNTOWN CROSSING",
		"PlatformKeyNB": "RDTCN",
		"PlatformKeySB": "RDTCS",
		"PlatformName": "DOWNTOWN CROSSING NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-dwnxg",
		"stop_name": "Downtown Crossing Station",
		"stop_desc": "",
		"stop_lat": "42.355518",
		"stop_lon": "-71.060225"
	},
"SOUTH STATION":
	{
		"StationName": "SOUTH STATION",
		"PlatformKeyNB": "RSOUN",
		"PlatformKeySB": "RSOUS",
		"PlatformName": "SOUTH STATION NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-sstat",
		"stop_name": "South Station",
		"stop_desc": "",
		"stop_lat": "42.352271",
		"stop_lon": "-71.055242"
	},
"BROADWAY":
	{
		"StationName": "BROADWAY",
		"PlatformKeyNB": "RBRON",
		"PlatformKeySB": "RBROS",
		"PlatformName": "BROADWAY NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-brdwy",
		"stop_name": "Broadway Station",
		"stop_desc": "",
		"stop_lat": "42.342622",
		"stop_lon": "-71.056967"
	},
"ANDREW":
	{
		"StationName": "ANDREW",
		"PlatformKeyNB": "RANDN",
		"PlatformKeySB": "RANDS",
		"PlatformName": "ANDREW NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-andrw",
		"stop_name": "Andrew Station",
		"stop_desc": "",
		"stop_lat": "42.330154",
		"stop_lon": "-71.057655"
	},
"JFK":
	{
		"StationName": "JFK",
		"PlatformKeyNB": "RJFKN",
		"PlatformKeySB": "RJFKS",
		"PlatformName": "JFK NB",
		"Branch": "Trunk",
		"Direction": "NB",
		"stop_id": "place-jfkred",
		"stop_name": "JFK/UMass Station",
		"stop_desc": "",
		"stop_lat": "42.320685",
		"stop_lon": "-71.052391"
	},
"SAVIN HILL":
	{
		"StationName": "SAVIN HILL",
		"PlatformKeyNB": "RSAVN",
		"PlatformKeySB": "RSAVS",
		"PlatformName": "SAVIN HILL NB",
		"Branch": "Ashmont",
		"Direction": "NB",
		"stop_id": "place-shmnl",
		"stop_name": "Savin Hill Station",
		"stop_desc": "",
		"stop_lat": "42.31129",
		"stop_lon": "-71.053331"
	},
"FIELDS CORNER":
	{
		"StationName": "FIELDS CORNER",
		"PlatformKeyNB": "RFIEN",
		"PlatformKeySB": "RFIES",
		"PlatformName": "FIELDS CORNER NB",
		"Branch": "Ashmont",
		"Direction": "NB",
		"stop_id": "place-fldcr",
		"stop_name": "Fields Corner Station",
		"stop_desc": "",
		"stop_lat": "42.300093",
		"stop_lon": "-71.061667"
	},
"SHAWMUT":
	{
		"StationName": "SHAWMUT",
		"PlatformKeyNB": "RSHAN",
		"PlatformKeySB": "RSHAS",
		"PlatformName": "SHAWMUT NB",
		"Branch": "Ashmont",
		"Direction": "NB",
		"stop_id": "place-smmnl",
		"stop_name": "Shawmut Station",
		"stop_desc": "",
		"stop_lat": "42.29312583",
		"stop_lon": "-71.06573796"
	},
"ASHMONT":
	{
		"StationName": "ASHMONT",
		"PlatformKeyNB": "",
		"PlatformKeySB": "RASHS",
		"PlatformName": "ASHMONT SB",
		"Branch": "Ashmont",
		"Direction": "SB",
		"stop_id": "place-asmnl",
		"stop_name": "Ashmont Station",
		"stop_desc": "",
		"stop_lat": "42.284652",
		"stop_lon": "-71.064489"
	},
"NORTH QUINCY":
	{
		"StationName": "NORTH QUINCY",
		"PlatformKeyNB": "RNQUN",
		"PlatformKeySB": "RNQUS",
		"PlatformName": "NORTH QUINCY NB",
		"Branch": "Braintree",
		"Direction": "NB",
		"stop_id": "place-nqncy",
		"stop_name": "North Quincy Station",
		"stop_desc": "",
		"stop_lat": "42.275275",
		"stop_lon": "-71.029583"
	},
"WOLLASTON":
	{
		"StationName": "WOLLASTON",
		"PlatformKeyNB": "RWOLN",
		"PlatformKeySB": "RWOLS",
		"PlatformName": "WOLLASTON NB",
		"Branch": "Braintree",
		"Direction": "NB",
		"stop_id": "place-wlsta",
		"stop_name": "Wollaston Station",
		"stop_desc": "",
		"stop_lat": "42.2665139",
		"stop_lon": "-71.0203369"
	},
"QUINCY CENTER":
	{
		"StationName": "QUINCY CENTER",
		"PlatformKeyNB": "RQUCN",
		"PlatformKeySB": "RQUCS",
		"PlatformName": "QUINCY CENTER NB",
		"Branch": "Braintree",
		"Direction": "NB",
		"stop_id": "place-qnctr",
		"stop_name": "Quincy Center Station",
		"stop_desc": "",
		"stop_lat": "42.251809",
		"stop_lon": "-71.005409"
	},
"QUINCY ADAMS":
	{
		"StationName": "QUINCY ADAMS",
		"PlatformKeyNB": "RQUAN",
		"PlatformKeySB": "RQUAS",
		"PlatformName": "QUINCY ADAMS NB",
		"Branch": "Braintree",
		"Direction": "NB",
		"stop_id": "place-qamnl",
		"stop_name": "Quincy Adams Station",
		"stop_desc": "",
		"stop_lat": "42.233391",
		"stop_lon": "-71.007153"
	},
"BRAINTREE":
	{
		"StationName": "BRAINTREE",
		"PlatformKeyNB": "RBRAS",
		"PlatformKeySB": "RBRAS",
		"PlatformName": "BRAINTREE SB",
		"Branch": "Braintree",
		"Direction": "SB",
		"stop_id": "place-brntn",
		"stop_name": "Braintree Station",
		"stop_desc": "",
		"stop_lat": "42.2078543",
		"stop_lon": "-71.0011385"
	}
};
connections=[["ALEWIFE","DAVIS","PORTER","HARVARD","CENTRAL","KENDALL","CHARLES MGH","PARK","DOWNTOWN CROSSING","SOUTH STATION","BROADWAY","ANDREW","JFK"],
["JFK","SAVIN HILL","FIELDS CORNER","SHAWMUT","ASHMONT"],
["JFK","NORTH QUINCY","WOLLASTON","QUINCY CENTER","QUINCY ADAMS","BRAINTREE"]];