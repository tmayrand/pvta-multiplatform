// pvta-multiplatform

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'pvta' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'pvta.controllers' is found in controllers.js
angular.module('pvta.controllers', ['pvta.services']);

angular.module('pvta', ['ionic', 'ngCordova', 'pvta.controllers', 'angularMoment', 'jett.ionic.filter.bar', 'underscore'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
  });
  /******************************************************
  * Set the status bar color to our app's color.
  *********************************************************
  * Only after the device has specifically told us it's ready
  * may we access the global StatusBar object.
  * **************************************************/
  document.addEventListener('deviceready', onDeviceReady, true);
  function onDeviceReady () {
    StatusBar.backgroundColorByHexString('#387ef5');
  }
})

.config(function ($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppController'
  })


  .state('app.my-buses', {
    url: '/my-buses',
    views: {
      'menuContent': {
        templateUrl: 'templates/mybuses.html',
        controller: 'MyBusesController'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchController'
      }
    }
  })
    .state('app.vehicle', {
      url: '/vehicles/:vehicleId/:route',
      params: {
      // For whatever reason,
      // squash: true means that
      // :route is an optional param
        route: {squash: true}
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/vehicle.html',
          controller: 'VehicleController'
        }
      }
    })

  .state('app.routes', {
    url: '/routes',
    views: {
      'menuContent': {
        templateUrl: 'templates/routes.html',
        controller: 'RoutesController'
      }
    }
  })

  .state('app.route', {
    url: '/routes/:routeId',
    views: {
      'menuContent': {
        templateUrl: 'templates/route.html',
        controller: 'RouteController'
      }
    }
  })

  .state('app.stop', {
    url: '/stops/:stopId',
    views: {
      'menuContent': {
        templateUrl: 'templates/stop.html',
        controller: 'StopController'
      }
    }
  })

  .state('app.stops', {
    url: '/stops',
    views: {
      'menuContent': {
        templateUrl: 'templates/stops.html',
        controller: 'StopsController'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsController'
      }
    }
  })

  .state('app.storage-settings', {
    url: '/settings/storage',
    views: {
      menuContent: {
        templateUrl: 'templates/storage-settings.html',
        controller: 'StorageSettingsController'
      }
    }
  })

   .state('app.about', {
     url: '/about',
     views: {
       'menuContent': {
         templateUrl: 'templates/about.html',
         controller: 'AboutController'
       }
     }
   })

  .state('app.route-map', {
    url: '/map/route',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'RouteMapController'
      }
    }
  })

  .state('app.stop-map', {
    url: '/map/stop',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'StopMapController'
      }
    }
  })

  .state('app.vehicle-map', {
    url: '/map/vehicle',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'VehicleMapController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/my-buses');
});
