angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $q, $interval, $cordovaGeolocation, $ionicLoading, $cordovaDatePicker, $ionicPopup, $ionicScrollDelegate, Trips, $timeout, $cordovaDatePicker, ionicDatePicker, ionicTimePicker, moment) {
  ga('set', 'page', '/plan-trip.html');
  ga('send', 'pageview');
  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);

  $scope.bounds = new google.maps.LatLngBounds(swBound, neBound);
  $scope.selectId;
  //takes in a value for ASAP, and updates the page accordingly
  $scope.updateASAP = function (asap) {
    if (asap !== undefined) {
      $scope.params.time.asap = asap;
    }
    if ($scope.params.time.asap === true) {
      $scope.params.time.type = 'departure';
    }
  };

  $scope.updateOrigin = function () {
    console.log('blerp');
    if ($scope.params.destinationOnly) {
      loadLocation();
    } else {
      $scope.params.origin.name = '';
      $scope.params.origin.id = '';
    }
  };

 //Loads the user's location and updates the origin
  var loadLocation = function () {
    var deferred = $q.defer();
    var options = {timeout: 500, enableHighAccuracy: true};
    $ionicLoading.show();

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      $ionicLoading.hide();
      $scope.noLocation = false;
      new google.maps.Geocoder().geocode({
        'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.params.origin = {
              name: results[1].formatted_address,
              id: results[1].place_id
            };
            deferred.resolve();
            $scope.$apply();
          }
        }
      });
    }, function (err) {
      // When getting location fails, this callback fires
      $scope.noLocation = true;
      /* When getting location fails immediately, $ionicLoading.hide()
       * is never called (or the page refuses to redraw), so
       * we add a 1 second delay as a workaround.
       *
       * We also set the checkbox state after the delay, but solely
       * for user feedback (it otherwise would never change when clicked on)
       */
      $timeout(function () {
        $ionicLoading.hide();
        $scope.params.destinationOnly = false;
      }, 1000);
      console.log('unable to get location ' + err.message);
    });

    return deferred.promise;
  };

  //Called when this page is opened, and either a loaded trip has been queued
  //or there are no current existing parameters. Also called as a result of the
  //newTrip method. Constructs the map, and then sets $scope.params as either default
  //or loaded parameters
  var reload = function () {
    constructMap(defaultMapCenter);
    currentDate = new Date();
    $scope.params = {
      name: 'New Trip',
      time: {
        datetime: currentDate,
        type: 'departure',
        asap: true
      },
      origin: {},
      destination: {},
      destinationOnly: true
    };

    if (loadedTrip !== null) {
      $scope.loaded = true;
      $scope.params = loadedTrip;
      $scope.params.time = loadedTrip.time;
      console.log(JSON.stringify(loadedTrip.time));
      console.log(JSON.stringify($scope.params.time));
      loadedTrip = null;
      if ($scope.params.destinationOnly) {
        loadLocation().then(function () {
          $scope.getRoute();
        });
      }
      else {
        console.log(JSON.stringify($scope.params.time));
        $scope.getRoute();
        console.log(JSON.stringify($scope.params.time));
      }
    }
    else {
      $scope.loaded = false;
      loadLocation();
    }

    $scope.updateASAP();
  };

  $scope.$on('$ionicView.enter', function () {
    loadedTrip = Trips.pop();
    $scope.selectId = $scope.timeOptions[0]
    console.log(JSON.stringify(loadedTrip))
    if (loadedTrip !== null || !$scope.params)//reload if either a trip is being loaded or if this page has not yet been loaded
      reload();
  });

  var invalidLocationPopup = function () {
    $ionicPopup.alert({
      title: 'Invalid Location',
      template: 'PVTA does not service this location.'
    });
  };

  function constructMap (latLng) {
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('directions-map'), mapOptions);


    $scope.directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.directionsDisplay.setMap($scope.map);

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    originAutocomplete.setBounds($scope.bounds);
    destinationAutocomplete.setBounds($scope.bounds);

    originAutocomplete.addListener('place_changed', function () {
      $scope.params.destinationOnly = false;
      var place = originAutocomplete.getPlace();
      if (!place.geometry) {
        console.log('Place has no geometry.');
        return;
      }
      if ($scope.bounds.contains(place.geometry.location)) {
        expandViewportToFitPlace($scope.map, place);
        $scope.params.origin.id = place.place_id;
        $scope.params.origin.name = place.name;
        $scope.$apply();
      } else {
        $scope.params.origin.id = null;
        originInput.value = $scope.params.origin.name;
        invalidLocationPopup();
      }
    });

    destinationAutocomplete.addListener('place_changed', function () {
      var place = destinationAutocomplete.getPlace();
      if (!place.geometry) {
        console.log('Place has no geometry.');
        return;
      }
      if ($scope.bounds.contains(place.geometry.location)) {
        expandViewportToFitPlace($scope.map, place);
        $scope.params.destination.id = place.place_id;
        $scope.params.destination.name = place.name;
        $scope.$apply();
      }
      else {
        $scope.params.destination.id = null;
        destinationInput.value = $scope.params.destination.name;
        invalidLocationPopup();
      }
    });
  }


  function expandViewportToFitPlace (map, place) {
    if (place.geometry.viewpoint) {
      map.fitBounds(place.geometry.viewpoint);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }


  $scope.getRoute = function () {
    console.log($scope.params.time.type);
    if (!$scope.params.origin.id || !$scope.params.destination.id) {
      return;
    }

    $scope.route = {
      directions: [],
      arrivalTime: null,
      departureTime: null,
      origin: null,
      destination: null
    };
    console.log(JSON.stringify($scope.params.time));
    if ($scope.params.time.datetime < Date.now()) {//directions will fail if given a previous time
      $scope.updateASAP(true);
    }
    $ionicLoading.show({
      template: 'Routing..'
    });
    console.log(JSON.stringify($scope.params.time));
    Trips.route($scope.params, $scope.directionsDisplay, function (data) {
      console.log(JSON.stringify($scope.params.time));
      $ionicLoading.hide();
      $scope.route = data;
      if ($scope.route.status === google.maps.DirectionsStatus.OK) {
        Trips.generateDirections(function (data) {
          $scope.route.directions = data;
          $scope.$apply();
          $scope.scrollTo('route');
          console.log(JSON.stringify($scope.params.time));
          // Force a map redraw because it was hidden before.
          // There's an angular bug with ng-show that will cause
          // the map to draw only grey after being hidden
          // unless we force a redraw.
          google.maps.event.trigger($scope.map,'resize');
        });
      }
      else {
        $ionicPopup.alert(
          {
            title: 'Unable to Find a Trip',
            template: 'There are no scheduled buses at the time you requested that work for your trip.\nThis failure has a status code of: ' + $scope.route.status
          }
        );
        // In cases of error, we set the route object that
        // otherwise contained all our data to undefined, because, well,
        // the data was bad.
        $scope.route = undefined;
      }
    }, function (err) {
      $scope.route = undefined;
      $ionicLoading.hide();
      console.log('Error routing: ' + err);
    });
  };

  var saveSuccessful = function () {
    $ionicPopup.alert({
      title: 'Save Successful!',
      template: 'This trip can be accessed from My Buses.'
    });
  };

  $scope.saveTrip = function () {
    var prevName = $scope.params.name;
    if (!$scope.loaded) {
      $scope.params.name = '';//Clears the name instead of 'New Trip'
    }
    $ionicPopup.show({
      template: '<input type="text" ng-model="params.name">',
      title: 'Trip Name',
      subTitle: 'Give this trip a name.',
      scope: $scope,
      buttons: [
    {text: 'Cancel',
      onTap: function () {
        $scope.params.name = prevName;
      }},
      {text: '<b>OK</b>',
        type: 'button-positive',
      onTap: function () {
        if ($scope.loaded) {
          Trips.set($scope.params);
        }
        else {
          Trips.add($scope.params);
        }
        $scope.loaded = true;//the current trip is now considered loaded onto the page
        saveSuccessful();}
      }]
    });
  };

  //Supply anchor the div to scroll to, used on this page to view directions
  $scope.scrollTo = function (anchor) {
    $location.hash(anchor);
    $ionicScrollDelegate.anchorScroll(true);
  };

  // After confirmation, reloads page with an empty trip
  $scope.newTrip = function () {
    $ionicPopup.confirm({
      title: 'New Trip',
      template: '<div style=\'text-align:center\'>Close current trip?</div>'
    }).then(function (res) {
      if (res) {
        $scope.loaded = false;
        $scope.route.origin = null;
        reload();
      }
    });
  };

  // This method allows for location selection on google typeahead on mobile devices
  $scope.disableTap = function () {
    console.log('dflkdjflsdfjkfsdf');
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    //         // leave input field if google-address-entry is selected
    angular.element(container).on('click', function () {
      document.getElementById('origin-input').blur();
      document.getElementById('destination-input').blur();
    });
  };

  function onTimeChosen (time) {
    if (typeof (time) === 'undefined') {
      console.log('Time not selected');
    } else {
      var selectedTime = new Date(time * 1000);
      console.log('Selected epoch is : '+ time +', and the time is: ' + selectedTime.getUTCHours() + 'H :' + selectedTime.getUTCMinutes() + 'M');
      $scope.params.time.datetime.setHours(selectedTime.getUTCHours());
      $scope.params.time.datetime.setMinutes(selectedTime.getUTCMinutes());
    }
  }
  function onDateChosen(date) {
    console.log('Return value from the datepicker popup is : ' + date, new Date(date));
    date = new Date(date);
    $scope.params.time.datetime.setDate(date.getDate());
    $scope.params.time.datetime.setMonth(date.getMonth());
    $scope.params.time.datetime.setFullYear(date.getFullYear());
  }

  $scope.openTimePicker = function (date) {
    var timePickerConfig = {
    callback: onTimeChosen,
    format: 12,         //Optional
    step: 1,           //Optional
  };
  ionicTimePicker.openTimePicker(timePickerConfig);
  }

  var datePickerConfig = {
    callback: onDateChosen,
    from: new Date(), //Optional
    setLabel: 'OK',
    closeLabel: 'Cancel',
    mondayFirst: false,
    showTodayButton: true,
    closeOnSelect: true
  };

  $scope.setTimeOption = function () {
    var selectedOption = $scope.selectId;
    $scope.params.time.asap = selectedOption.isASAP;
    $scope.params.time.type = selectedOption.type;
  }

  $scope.timeOptions = [
    {
      title: 'Leaving Now',
      type: 'departure',
      isASAP: true,
      id: 0
    },
    {
      title: 'Departing At...',
      type: 'departure',
      isASAP: false,
      id: 1
    },
    {
      title: 'Arriving At...',
      type: 'arrival',
      isASAP: false,
      id: 2
    }
  ];

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(datePickerConfig);
  };

  $scope.toggleArrivalOrDeparture  = function () {
    if ($scope.params.time.type === 'departure') {
      $scope.params.time.type = 'arrival';
    }
    else if ($scope.params.time.type === 'arrival') {
      $scope.params.time.type = 'departure';
    }
    else {
      console.error('Attempted to toggle $scope.params.time.type, but it was previously set to an improper value of ' + $scope.params.time.type);
    }
  }
});
