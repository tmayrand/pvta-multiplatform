angular.module('pvta.controllers').controller('RouteMapController', function ($scope, $stateParams, $ionicLoading, Map, LatLong, KML, Route, RouteVehicles) {
  var bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map, bounds);

  function placeVehicles () {
  //places every vehicle on said route on the map
    _.each($scope.vehicles, function (vehicle) {
      var color, message;
      var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);
      
      //if the vehicle is on time, make the text green. If it's late, make the text red and say late by how much
      if (vehicle.DisplayStatus === 'On Time') {
        color = 'green';
        message = '<h4 style=\'color: ' + color + ';\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus + '</h4>';
      }
      else {
        color = 'red';
        message = '<h4 style=\'color: ' + color + ';\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus
          + ' by ' + vehicle.Deviation + ' minutes</h4>';
      }

      //sets the content of the window to have a ton of information about the vehicle
      var content = '<div style=\'font-family: Arial;text-align: center\'><h3 style=\'color: #' + $scope.route.Color+ "'>"
      + $scope.route.ShortName + ': ' + vehicle.Destination + '</h3>' + message + '<h4>Last Stop: ' + vehicle.LastStop + '</h4></div>';

      //add a listener for that vehicle with that content as part of the infobubble
      Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), content);
    });
  }

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show({});
    var fileName = KML.pop();
    if (fileName) {
      Map.addKML(fileName);
    }
    Map.plotCurrentLocation();
    $scope.route = Route.get({routeId: $stateParams.routeId}, function () {
      $scope.stops = $scope.route.Stops;
      $scope.vehicles = $scope.route.Vehicles;
      placeVehicles();
      $ionicLoading.hide();
    });
  });

});
