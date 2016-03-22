angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {

	$scope.tagline = 'Travel in Bangalore anywhere!';	
	$scope.noCabsMsg = "";

	$scope.user;

	$scope.book = function() {

	};

	$scope.mapProp = {
		    	center: new google.maps.LatLng(12.9667, 77.5667),
		    	zoom:11,
		    	mapTypeId: google.maps.MapTypeId.ROADMAP
		  	};
	$scope.map5 = new google.maps.Map(document.getElementById("googleMap5"), $scope.mapProp);


  	  markers = [
		  	  {
		  	  	name: 'Myself',
		  	  	latitude: 0,
		  	  	longitude: 0,
		  	  	cabType: 'none',
  	  			status: 'free'
		  	  },
  	  		{
  	  			name: 'Anil',
  	  			latitude : 12.9922,
  	  			longitude: 77.7159,
  	  			cabType: 'Usual',
  	  			status: 'free'
  	  		},
  	  		{
  	  			name: 'Herbert',
  	  			latitude: 12.9699,
  	  			longitude: 77.6499,
  	  			cabType: 'Usual',
  	  			status: 'free'
  	  		},
  	  		{
  	  			name: 'Rashi',
  	  			latitude: 12.9715987,
  	  			longitude: 77.59456269999998,
  	  			cabType: 'Pink',
  	  			status: 'free'
  	  		}
	    ];

	    // Info Window Content
    infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>My Self</h3>' +
        '<p>This is where I am</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Cab of Anil</h3>' +
        '<p>CabType : Usual</p>' +
        '</div>'],
        ['<div class="info_content">' +
        '<h3>Cab of Herbert</h3>' +
        '<p>CabType : Usual</p>' +
        '</div>'],
        ['<div class="info_content">' +
        '<h3>Cab of Rashi</h3>' +
        '<p>CabType : Pink</p>' +
        '</div>']
    ];


	    var i, imageName;
	    myloc = [];

	    for (i=0; i < markers.length; i++) {
	    	if (markers[i].name === 'Myself') {
	    		imageName = '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png';
	    	} else if (markers[i].cabType === 'Pink') {
	    		imageName = '//maps.gstatic.com/mapfiles/markers2/marker.png';
	    	} else {
	    		imageName = '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png';
	    	}

			myloc[i] = new google.maps.Marker({
				    clickable: false,
				    icon: new google.maps.MarkerImage(imageName,
				                                                    new google.maps.Size(22,22),
				                                                    new google.maps.Point(0,18),
				                                                    new google.maps.Point(11,11)),
				    shadow: null,
				    zIndex: 999,
				    map: $scope.map5
				});
	    }

	    		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {  	
	    				markers[0].latitude = pos.coords.latitude;
	    				markers[0].longitude = pos.coords.longitude;

				  		var a = [new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
				  				new google.maps.LatLng(12.9922, 77.7159),
				  				new google.maps.LatLng(12.9699, 77.6499),
				  				new google.maps.LatLng(12.9715987, 77.59456269999998)];

				  		var i, me, infoWindow = new google.maps.InfoWindow();


				  		for (i=0; i<markers.length; i++) {
				  			me = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
				  			myloc[i].setPosition(me);

				  		}
				}, function(error) {
				    // ...
				});

	$scope.formData = {};
    var coords = {};
    var lat = 0;
    var lang = 0;


// Creates a new user based on the form fields
    $scope.createUser = function() {
    	var minDist = 25, minIndex = -1, currDist = 0;
    	var fromlat = $scope.formData.fromLatitude, fromlang = $scope.formData.fromLongitude;

    	//find the closest cab driver based on From location
    		for(i=1; i<markers.length; i++) {
    			f = Math.abs(fromlat - markers[i].latitude) * Math.abs(fromlat - markers[i].latitude);
    			t = Math.abs(fromlang - markers[i].longitude) * Math.abs(fromlang - markers[i].longitude);

    			currDist = Math.sqrt(f + t);

    			if (currDist < minDist && $scope.formData.cabType === markers[i].cabType) {
    				minDist = currDist;
    				minIndex = i;
    				markers[i].status= 'Busy';
    			}
    		}


    	if (minIndex !== -1) {
    		//after the travel duration
	    	//reposition the drivers to the new To location
	    		markers[0].latitude = $scope.formData.toLatitude;
	    		markers[0].longitude = $scope.formData.toLongitude;

				markers[minIndex].latitude = $scope.formData.toLatitude;
	    		markers[minIndex].longitude = $scope.formData.toLongitude;

	    		markers[minIndex].status= 'Free';

	    	//update to new locations
	    		for (i=0; i<markers.length; i++) {
					 me = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
					 myloc[i].setPosition(me);
				}
				$scope.noCabsMsg = "";
    	}	
    	else {
    		$scope.noCabsMsg = "Sorry. No cabs Available";
    	}


        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            cabType: $scope.formData.cabType,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.cabType = "";
                
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    	};

});