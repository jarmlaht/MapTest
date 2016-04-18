var map;
var marker;
var infoWindow;

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    console.log("onDeviceReady");
    var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 5000 };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

// onSuccess Geolocation
function onSuccess(position) {
    console.log("onSuccess");
    var element = document.getElementById('geolocation');
    var coordinates = 'Latitude: ' + position.coords.latitude + '<br>' +
    'Longitude: ' + position.coords.longitude + '<br>' +
    'Altitude: ' + position.coords.altitude + '<br>' +
    'Accuracy: ' + position.coords.accuracy + '<br>' +
    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br>' +
    'Heading: ' + position.coords.heading + '<br>' +
    'Speed: ' + position.coords.speed + '<br>' +
    'Timestamp: ' + position.timestamp + '<br>';
    element.innerHTML = coordinates;
    console.log(coordinates);
}

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function initMap() {
    console.log("initMap");
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14
    });
    marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Click to zoom'
    });
    infoWindow = new google.maps.InfoWindow({
        map: map,
        maxWidth: 500
    });
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        getLocation();
        
        var refreshDiv = document.createElement('div');
        var refreshControl = new RefreshControl(refreshDiv, map);
        refreshControl.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(refreshDiv);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function getLocation() {
    console.log("getLocation");
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        //var element = document.getElementById('geolocation');
        var coordinates = 'Latitude: ' + position.coords.latitude + '<br>' +
        'Longitude: ' + position.coords.longitude + '<br>' +
        'Altitude: ' + position.coords.altitude + '<br>' +
        //'Heading: ' + position.coords.heading + '<br>' +
        //'Speed: ' + position.coords.speed + '<br>' +
        'Date: ' + new Date(position.timestamp);
        marker.setPosition(pos);
        map.setCenter(pos);
        infoWindow.setContent(coordinates);
        infoWindow.open(map, marker);
        console.log(coordinates);

    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });
    
    marker.addListener('click', function() {
        if (map.getZoom() === 8) map.setZoom(14);
        else map.setZoom(8);
        map.setCenter(marker.getPosition());
        console.log("Zoom level: " + map.getZoom());
    });    
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }    
}

function RefreshControl(controlDiv) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Refresh';
    controlUI.appendChild(controlText);

    // Setup the click event listeners:
    controlUI.addEventListener('click', function() {
        console.log("button clicked!");
        getLocation();
    });

}

