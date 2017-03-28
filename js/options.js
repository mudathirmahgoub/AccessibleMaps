$(function () {
    var map;
    var geocoder = new google.maps.Geocoder();

    $("#riverColor").change(initialize);
    $("#roadColor").change(initialize);
    $("#highwayColor").change(initialize);

    initialize();

    function initialize() {
        var riverColor = $("#riverColor").val();
        var roadColor = $("#roadColor").val();
        var highwayColor = $("#highwayColor").val();
        var mapOptions = {
            center: new google.maps.LatLng(41.66242160061023, -91.53680428270343),
            zoom: 17,
            disableDefaultUI: true,
            zoomControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            overviewMapControl: true,
            panControl: true,
            styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#263c3f'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#6b9a76'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: roadColor}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#212a37'}]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9ca5b3'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: highwayColor}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#1f2835'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#f3d19c'}]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{color: '#2f3948'}]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: riverColor}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#17263c'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#ffffff'}]
                }
            ]

        };
        map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

        google.maps.event.addListener(map, 'click', function(event) {
            console.log(event.latLng.lat());
            console.log(event.latLng.lng());

            var url =
                "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                event.latLng.lat() + "," + event.latLng.lng() + "&key=AIzaSyCb2qb3QksKFmP-bvV8RU2Rd1KoUEMYlf0";


            $.get( url, function(data) {
                console.log(data);
                if(data.status == "OK")
                {
                    if(data.results.length > 0)
                    {
                        console.log(data.results[0].formatted_address);
                        chrome.tts.speak(data.results[0].formatted_address);
                    }
                    else
                    {
                        console.log("No result");
                        chrome.tts.speak("No result");
                    }
                }
            })
            .fail(function() {
                console.log( "Couldn't find the address of this location" );
            })
            .always(function() {
                console.log( "finished" );
            });
        });
    }
    initialize();

});


