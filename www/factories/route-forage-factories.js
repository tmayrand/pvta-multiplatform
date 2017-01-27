angular.module('pvta.factories')

.factory('RouteForage', function (RouteList, moment, Recent, Routes, $q, Toast) {
  function getRouteList () {
    if (RouteList.isEmpty()) {
      return localforage.getItem('routes').then(function (routes) {
        if ((routes !== null) && (routes.list.length > 0) && (Recent.recent(routes.time))) {
          var msg = 'Loaded routes from storage.';
          console.log(msg);
          ga('send', 'event', 'RoutesLoaded', 'RouteForageFactory.getRouteList()', msg);
          return routes.list;
        }
        else {
          var msg = 'No routes stored or routelist is old';
          console.log(msg);
          ga('send', 'event', 'RoutesNotLoaded', 'RouteForageFactory.getRouteList()', msg);
          return Routes.query().$promise;
        }
      }).catch(function () {
        Toast.showStorageError();
        return Routes.query().$promise;
      });
    }
    else {
      var msg = 'Route list already loaded';
      console.log(msg);
      ga('send', 'event', 'RoutesAlreadyLoaded', 'RouteForageFactory.getRouteList()', msg);
      return $q.when(RouteList.getEntireList());
    }
  }

  function saveRouteList (list) {
    if (RouteList.isEmpty()) {
      RouteList.pushEntireList(list);
    }
    pushListToForage(list);
  }

  function pushListToForage (routes) {
    var toForage = {
      list: routes,
      time: new Date()
    };
    localforage.setItem('routes', toForage, function (err) {
      if (err) {
        var msg = 'Unable to save routes; Localforage error: ' + err;
        console.error(msg);
        Toast.showStorageError();
        ga('send', 'event', 'UnableToSaveRoutes', 'RouteForageFactory.pushListToForage()', msg);
      }
      else {
        var msg = 'Saved routes list.';
        console.log(msg);
        ga('send', 'event', 'SuccessfullySavedRoutes', 'RoutesForageFactory.pushListToForage()', msg);
      }
    });
  }

  return {
    get: getRouteList,
    save: saveRouteList
  };
});
