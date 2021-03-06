$(function () {
    var map;
    var geocoder = new google.maps.Geocoder();
    var directionsService = new google.maps.DirectionsService();
    var rendererOptions= {
        polylineOptions:{
            strokeWeight: 500,
            strokeColor: $("#directionColor").val(),
            preserveViewport: true
        }
    };
    var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    var pointsMarkers = [new google.maps.Marker()];

    var iconSize = 1;
    var pathPoints = [];
    var centerIndex = 0;

    var icon = {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: $("#wayPointColor").val(),
        fillOpacity: 1,
        anchor: new google.maps.Point(1,1),
        strokeWeight: 0,
        scale: iconSize
    };

    $("#riverColor").change(initialize);
    $("#roadColor").change(initialize);
    $("#highwayColor").change(initialize);
    $("#searchButton").click(getDirections);
    $("#directionColor").change(function () {
        rendererOptions.polylineOptions.strokeColor = $("#directionColor").val();
        directionsDisplay.setOptions(rendererOptions);
        directionsDisplay.setMap(map);
        getDirections();
    });

    $("#wayPointColor").change(function () {

        icon.fillColor = $("#wayPointColor").val();

        for (var i = 0 ; i < pointsMarkers.length; i++){
            pointsMarkers[i].setIcon(icon);
        }
    });

    $("#originPlace").keyup(function () {
        if(! $("#placesDiv").hasClass("placesVisible"))
        {
            $("#placesDiv").addClass("placesVisible");
        }
        autoComplete($(this), "Origin: ");

    });

    $("#destinationPlace").keyup(function (event) {
        // user pressed enter
        if(event.keyCode == 13){
            getDirections();
        }
        else {
            if(! $("#placesDiv").hasClass("placesVisible"))
            {
                $("#placesDiv").addClass("placesVisible");
            }
            autoComplete($(this), "Destination: ");
        }
    });

    function getDirections() {
        var origin = $("#originPlace").val();
        var destination = $("#destinationPlace").val();
        computeRoute(origin, destination);
    }


    $("#originPlace").focusin(function () {
        $("#placesDiv").addClass("placesVisible");
    });

    $("#destinationPlace").focusin(function () {
        $("#placesDiv").addClass("placesVisible");
    });

    $("#originPlace").focusout(function () {
      //  $("#placesDiv").removeClass("placesVisible");
    });
    $("#destinationPlace").focusout(function () {
      //  $("#placesDiv").removeClass("placesVisible");
    });


    function autoComplete(input, prefix) {
        var inputPlace = input.val();
        $("#searchPlace").text(prefix + inputPlace);
        $("#places").empty();
        if(inputPlace){
            var autocompleteService = new google.maps.places.AutocompleteService();
            var autocompletionRequest = {input: inputPlace};
            autocompleteService.getPlacePredictions(autocompletionRequest, autocompleteCallBack);
        }
        function autocompleteCallBack(autocompletePredictions, placesServiceStatus)
        {
            if(placesServiceStatus == "OK")
            {
                for(var i = 0; i < autocompletePredictions.length; i++) {
                    var description = autocompletePredictions[i].description;
                    $("#places").append("<li class='placeItem'>" + description + "</li>")
                }
                $("#places li").click(function () {
                    input.val($(this).text());
                    input.trigger( "focus" );
                    $("#placesDiv").removeClass("placesVisible");
                });
            }
        }
    }

    initialize();

    function initialize() {

        var lat = 41.66242160061023;
        var lng = -91.53680428270343;

        var riverColor = $("#riverColor").val();
        var roadColor = $("#roadColor").val();
        var highwayColor = $("#highwayColor").val();
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng),
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
        google.maps.event.addListener(map, 'rightclick', function(event) {
            speakLocation(event.latLng.lat(), event.latLng.lng());
        });
    }

    function computeRoute(origin, destination){
        directionsService.route({
            //  origin: "MacLean Hall, Iowa City, IA 52240",
            //  destination: "Kinnick Stadium, Iowa City, IA",
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function(response, status) {
            if (status === 'OK') {
                pathPoints = response.routes[0].overview_path;
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                // center the map at the initial point
                moveCenter();

                // initialize points' markers
                for(i = 0; i < pointsMarkers.length; i++) {
                    pointsMarkers[i].setMap(null);
                }
                pointsMarkers=[]; // needed for avoiding undefined setMap
                for(i = 0; i < pathPoints.length; i++) {

                    var marker = new google.maps.Marker({
                        icon: icon,
                        zIndex: 999,
                        position: new google.maps.LatLng(pathPoints[i].lat(),
                            pathPoints[i].lng())});

                    marker.addListener("click", function () {

                        console.log(this);
                        speakLocation(this.position.lat(), this.position.lng());

                    });

                    pointsMarkers.push(marker);
                }

               // pointsMarkers[0].setMap(map);

                document.addEventListener('keydown', function(event) {
                    // move forward
                    if (event.keyCode == 38 || event.keyCode == 39 ) {
                        if(centerIndex < pathPoints.length - 1) {
                            // remove previous mark
                            pointsMarkers[centerIndex].setMap(null);
                            centerIndex++;
                            moveCenter();
                        }
                    }
                    // move backward
                    if (event.keyCode == 37 || event.keyCode == 40 ){
                        if(centerIndex > 0){
                            // remove previous mark
                            pointsMarkers[centerIndex].setMap(null);
                            centerIndex --;
                            moveCenter();
                        }
                    }
                });

            } else {
               // window.alert('Directions request failed due to ' + status);
            }
        });

    }

    function moveCenter() {
        if(centerIndex < pathPoints.length){
            map.panTo(new google.maps.LatLng(pathPoints[centerIndex].lat(), pathPoints[centerIndex].lng()));
            pointsMarkers[centerIndex].setMap(map);
        }
    }

    function speakLocation(lat, lng) {
        var url =
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat + "," + lng + "&key=AIzaSyCb2qb3QksKFmP-bvV8RU2Rd1KoUEMYlf0";
        $.get(url, function (data) {
            console.log(data);
            if (data.status == "OK") {
                if (data.results.length > 0) {
                    console.log(data.results[0].formatted_address);
                    chrome.tts.speak(data.results[0].formatted_address);

                    var request = {
                        location: event.latLng,
                        radius: '10' // 10 meters
                    };


                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request, function (results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                                var place = results[i];
                                console.log(place);
                            }
                        }
                    });

                }
                else {
                    console.log("No result");
                    chrome.tts.speak("No result");
                }
            }
        })
            .fail(function () {
                console.log("Couldn't find the address of this location");
            })
            .always(function () {
                console.log("finished");
            });
    }

});


