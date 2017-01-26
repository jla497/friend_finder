var mapObject;
var username = "me";
var friendMarkers = [];
var markers = [];
var myPosition = {
	  	lat: 0,
	  	long: 0
	  }
	  
var friendData = [];
var placeData = [];
var infowindow;
var placeCat = "restaurant";
var places =[];

$(document).ready(function(){
	
	var model = {
	  init: function(){
         
         //start up google map
	 mapObject = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 49.2527903, lng: -122.8373},
          zoom: 8
          });
         //create directions service
         var directionsService = new google.maps.DirectionsService;
         var directionsDisplay = new google.maps.DirectionsRenderer();
         
         directionsDisplay.setMap(mapObject);
         
         directionsDisplay.setPanel(document.getElementById('rightPanel'));
         
        var input = document.getElementById('pac-input');
        
        var searchBox = new google.maps.places.SearchBox(input);
        
      // mapObject.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        mapObject.addListener('bounds_changed', function() {
          searchBox.setBounds(mapObject.getBounds());
        });

         markers = [];
          
          
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
       
           places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }
         
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          for(var i = 0;i<places.length;i++)
          { var place = places[i];
          	
             if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker= new google.maps.Marker({
              map: mapObject,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            });
						marker.addListener('click',function(){
						  
								 console.log(this.title);
								 model.calculateAndDisplayRoute(directionsService,directionsDisplay,this.position);
						});         
            markers.push(marker);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
            
            
          }
          mapObject.fitBounds(bounds); 
        });
       
        model.getFriends();  
          
     },
          
         
           
		
	  getFriends: function(){
		
			 var url = "https://jaesportfolio.com/projects/connectDB.php";
         //fetch all friends JSON objects  
       var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                 friendData = $.parseJSON(this.responseText);
                //addFriendMarkers(data);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
		},
		
		calculateAndDisplayRoute: function(directionsService, directionsDisplay, dest){
		
			  directionsService.route({
          origin: {lat: myPosition.lat, lng: myPosition.long},
          destination: dest,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

	};
	
	
	
	
	
	
	
	var octopus = {
		init: function(){
			username = "<?php echo $_SESSION['username']?>";
			getLocation(function(latitude,longitude){
				myPosition.lat = latitude;
				myPosition.long = longitude;
				var url = "https://jaesportfolio.com/projects/postDB.php?lat="+myPosition.lat+"&long="+myPosition.long;
				$.get(url,function(data,status){
					{
					  console.log("Data: "+data+" status: "+status);
					  username = data;
                                          $("#userID").text(username);	
					}
				});
			
			});
			model.init();
			view.init();
			
			}
	};
	
	
	
	var view = {
	
		init: function(){
				$("#viewAllFriends").click(function(){
						model.getFriends();
						addFriendMarkers(friendData);
						
						for(var i = 0;i<places.length;i++)
						{
						  console.log("here"+places[i].title);
						}
				});
		}
	};
	
	
	function showLocation(position){
	 myPosition.lat = position.coords.latitude;
	 myPosition.long = position.coords.longitude;
	 console.log(myPosition.lat);
	 console.log(myPosition.long);
	 
}


function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            }

            else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }

function getLocation(_callback){

            if(navigator.geolocation){
               // timeout at 60000 milliseconds (60 seconds)
               var options = {timeout:60000};
               navigator.geolocation.getCurrentPosition(function(position){
               		_callback(position.coords.latitude,position.coords.longitude);
               }, errorHandler, options);
            }

            else{
               alert("Sorry, browser does not support geolocation!");
            }
 }

function addFriendMarkers(friendLocs){
        for(var idx = 0; idx<friendMarkers.length;idx++)
	{
		friendMarkers[idx].setMap(null);
	}
	friendMarkers = [];
        //console.log("busLocs: "+busLocs);
        for(var x = 0;x<friendLocs.length;x++)
        {       console.log("friend marker:"+friendLocs[x].name," ,"+friendLocs[x].lat);
                var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(friendLocs[x].lat, friendLocs[x].long),
                        map: mapObject,
											  label: friendLocs[x].name
                });
               // marker.setMap(mapObject);
                friendMarkers.push(marker);
        }

    }


	octopus.init();
});











