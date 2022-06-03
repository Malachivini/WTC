//Activate Best Navigation when clicked
document.getElementById("navButton").addEventListener("click", BestNav);

//needed Variables
var icons = [];
var marker, circle;
var currentLat, currentLng;
let map;
var currentZoom;
var lastLocationLat;
var lastLocationLong;
var chargers;


//Read JSON File With Stations Data
fetch("./chargers.geojson").then(function name(resp) {
    resp.json().then(function(result) {
        chargers = result;
        Main();
    });

});

//Main Function
function Main(){

    //Collect JSON data to Matrix
    chargers.features.forEach(item => {
    var icon = [];
    var lan = item.geometry.coordinates[1];
    var long  = item.geometry.coordinates[0];
    var iconColor = item.properties["marker-color"];
    var markerSize = item.properties["marker-size"];
    var markerIcon = item.properties["marker-symbol"];
    var avl = item.properties["available"];
    icon.push(lan);
    icon.push(long);
    icon.push(iconColor);
    icon.push(markerSize);
    icon.push(markerIcon);
    icon.push(avl);
    icons.push(icon);
    });

    //Initiallize Map
    map = L.map('map', {
    layers: MQ.mapLayer(),
    center: [32.07084723553064,34.82284069061279],
    zoom: 12
    });
        //Add Stations To Map
        icons.forEach(icon => {
        var marker;
                // 1 = Available
                if(icon[5] == 1){
                    custom_icon = L.icon({
                        iconUrl: 'img/green.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }
                // 0 = Not Available
                else if(icon[5] == 0){
                    custom_icon = L.icon({
                        iconUrl: 'img/red.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }
                // 2 = Maintenance
                else if(icon[5] == 2){
                    custom_icon = L.icon({
                        iconUrl: 'img/grey.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }
                // Default
                else{
                    marker = L.marker([icon[0], icon[1]]);
                    marker.addTo(map);
                }

                //Set For Navigation
                marker.on('click', function(ev){                   
                    var latlng = marker.getLatLng();
                    //var latlng = map.mouseEventToLatLng(ev.originalEvent);
                    map.remove();
                    runDirection(currentLat + ', ' + currentLng, latlng["lat"] + ', ' + latlng["lng"])
                });
                
            });




    // Get Current Location
    if(!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!")
    } else {
            navigator.geolocation.getCurrentPosition(getPosition);
    }

    

    function getPosition(position){
        var lat = position.coords.latitude;
        currentLat = lat;
        var long = position.coords.longitude;
        currentLng = long;
        var accuracy = position.coords.accuracy;

        L.marker([lat,long]).addTo(map);
        map.center = [currentLat,currentLng];
    }
    

}


// Set Intervals to Check updated JSON data
setInterval(() => {
                    fetch("./chargers.geojson").then(function name(resp) {
                        resp.json().then(function(result) {
                        chargers = result;
                        currentZoom = map.getZoom();
                        var tempLat = map.getCenter();
                        lastLocationLat = tempLat["lat"];
                        lastLocationLong = tempLat["lng"];

                        //Reset Map
                        map.remove();
                        Reload();
                        });

                    });

                }, 120000);
                
            

// Very Similar to Initial Upload, but with updated Status
function Reload(){
        icons = [];
        chargers.features.forEach(item => {
            var icon = [];
            var lan = item.geometry.coordinates[1];
            var long  = item.geometry.coordinates[0];
            var iconColor = item.properties["marker-color"];
            var markerSize = item.properties["marker-size"];
            var markerIcon = item.properties["marker-symbol"];
            var avl = item.properties["available"];
            icon.push(lan);
            icon.push(long);
            icon.push(iconColor);
            icon.push(markerSize);
            icon.push(markerIcon);
            icon.push(avl);
            icons.push(icon);
        });

        map = L.map('map', {
            layers: MQ.mapLayer(),
            center: [lastLocationLat,lastLocationLong],
            zoom: currentZoom
        });

        icons.forEach(icon => {
        var marker;
                if(icon[5] == 1){
                    custom_icon = L.icon({
                        iconUrl: 'img/green.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }
                else if(icon[5] == 0){
                    custom_icon = L.icon({
                        iconUrl: 'img/red.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }
                else if(icon[5] == 2){
                    custom_icon = L.icon({
                        iconUrl: 'img/grey.png',
                        iconSize: [40, 40],
                        iconAnchor: [10, 29],
                        popupAnchor: [0, -29]
                    });
                    marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                    marker.addTo(map);
                }

                else{
                    marker = L.marker([icon[0], icon[1]]);
                    marker.addTo(map);
                }
                marker.on('click', function(ev){
                    var latlng = marker.getLatLng();
                    map.remove();
                    runDirection(currentLat + ', ' + currentLng, latlng["lat"] + ', ' + latlng["lng"])
                });
                
            });
        };


function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    
}




// Calculate Route To Destination
function runDirection(start, end) {
        
        // recreating new map layer after removal
        map = L.map('map', {
            layers: MQ.mapLayer(),
            center: [32.07084723553064,34.82284069061279],
            zoom: 12
        });
        
        var dir = MQ.routing.directions();

        dir.route({
            locations: [
                start,
                end
            ]
        });
    
        // Custom Start And Finish Icons
        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStartMarker: (location) => {
                var custom_icon;
                var marker;

                custom_icon = L.icon({
                    iconUrl: 'img/start_point.png',
                    iconSize: [45, 55],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            },
            
            createEndMarker: (location) => {
                var custom_icon;
                var marker;

                custom_icon = L.icon({
                    iconUrl: 'img/green.png',
                    iconSize: [40, 40],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                    
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);
                return marker;
            }
        });
        
        map.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true
        })); 


        icons.forEach(icon => {
            if(end != (icon[0] + ", " + icon[1])){
                var marker;
            if(icon[5] == 1){
                custom_icon = L.icon({
                    iconUrl: 'img/green.png',
                    iconSize: [40, 40],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });
                marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                marker.addTo(map);
            }
            else if(icon[5] == 0){
                custom_icon = L.icon({
                    iconUrl: 'img/red.png',
                    iconSize: [40, 40],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });
                marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                marker.addTo(map);
            }
            else if(icon[5] == 2){
                custom_icon = L.icon({
                    iconUrl: 'img/grey.png',
                    iconSize: [40, 40],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });
                marker = L.marker([icon[0], icon[1]], {icon: custom_icon});
                marker.addTo(map);
            }

            else{
                marker = L.marker([icon[0], icon[1]]);
                marker.addTo(map);
            }
            marker.on('click', function(ev){
                var latlng = marker.getLatLng();
                map.remove();
                runDirection(currentLat + ', ' + currentLng, latlng["lat"] + ', ' + latlng["lng"])
            });

            
            }
            
        });


}


// Find Closest Available Station
function BestNav(){
    var options = [];
    icons.forEach(icon => {
        if(icon[5] == 1){
            options.push(icon);
        }
    });

    var counter = 0;
    var bestIndex = -1;
    var bestDistance = 200000;
    options.forEach(option => {
        dis = Math.pow(Math.abs(currentLat - option[0]),2) + Math.pow(Math.abs(currentLng - option[1]),2);

        if(dis < bestDistance){
            bestIndex = counter;
            bestDistance = dis;
        }
        counter += 1;
    });

    map.remove();
    runDirection(currentLat + ', ' + currentLng, options[bestIndex][0] + ', ' + options[bestIndex][1]);

}

