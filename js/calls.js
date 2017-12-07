var k = "oqMr94lOnVSduMmQu0BIm0cZM5vjsw2ClfDmevFY";
var fReq = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', getStations);

function getStations(){
  //add listener for click to submit data
  document.getElementById("submit").addEventListener('click', function(event){
	  //stuff for alt. fuel stations
	  //var fReq = new XMLHttpRequest();
	  var loc = document.getElementById("location").value;
	  var rad = document.getElementById("radius").value;
		
	  fReq.open("GET", "https://api.data.gov/nrel/alt-fuel-stations/v1/nearest.json?api_key=" + k + "&location=" + loc + "&radius=" + rad + "&status=E&access=public&limit=10", true);
	  fReq.addEventListener('load', function(){
		
		  if(fReq.status >= 200 && fReq.status < 400){
			var fRes = JSON.parse(fReq.responseText);
			var stations = fRes.fuel_stations;
			var fuelForm = document.getElementById("altFuel");
			var max;
			
			if(stations.length - 1 < 10){
			  max = stations.length;
			} else {
			  max = 10;
			}
			
			for(x = 0; x < max; x++){
			  var station = fRes.fuel_stations[x];
			  var fuelP = document.createElement("p");
					
			  fuelP.innerHTML = "<b>" + station.station_name + "</b><br>" + station.street_address + "<br>" + station.city + ", " + station.state + " " + station.zip + "<br>" + station.station_phone + "<br>";

			  fuelForm.appendChild(fuelP);
			}
		  } else {
			var head = document.createElement("h2");
			var fuelP = document.createElement("p");
			
			head.innerHTML = "Error in the network request:"
			fuelP.innerHTML = fReq.statusText;
			
			document.body.appendChild(head);
			document.body.appendChild(fuelP);
		  }
	  });
		
	  fReq.send(null);
	  
	  // farmers market api stuff
	  var zip = document.getElementById("zip").value;
	  var farmForm = document.getElementById("farm");

  
	  jQuery.ajax({
		url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
		success: function(data){
			var markets = data.results;
			var max;
			
			if(markets.length < 10){
			  max = markets.length;
			} else {
			  max = 10;
			}
	
			for(var x = 0; x < max; x++){
			  var id = markets[x].id;
			  var name = markets[x].marketname;
			  var marketP = document.createElement("p");
			  
			  marketP.innerHTML = "<b>" + name.substring(name.indexOf(' ') + 1) + "</b>";
			  
			  $.ajax({
				url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
				async: false,
				success: function(detail){
					var addr = detail.marketdetails.Address;
					var map = detail.marketdetails.GoogleLink;
					var link = document.createElement("a");
					
					link = "<a href='" + map + "' target='_blank'>View Map</a><br>";
					
					marketP.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + link + addr;
					
					farmForm.appendChild(marketP);
				},
				error: reqErr,
			  });
			  
			}
			
			var reveal = document.getElementsByClassName("col-md-5");
			for(var x = 0; x < reveal.length; x++){
			  reveal[x].style.visibility = "visible";
			}
			document.getElementById("final").style.visibility = "visible";
			
		},
		error: reqErr
		
	  });
	  
	  event.preventDefault();
	});
}

// error function
function reqErr(data){
	var head = document.createElement("h2");
	var p = document.createElement("p");

	head.innerHTML = "Error in the network request:"
	p.innerHTML = fReq.statusText;

	document.body.appendChild(head);
	document.body.appendChild(p);
}
