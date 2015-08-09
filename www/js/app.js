// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngOpenFB','ServiceWarrantyApp.factory' ])

.run(function($ionicPlatform,ngFB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    ngFB.init({appId: '1600281576906225'});

     //if (PushbotsPlugin.isAndroid()) {
    //    PushbotsPlugin.initializeAndroid('55c70c23177959375e8b456a', '810401006814');
   // } 
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.myproducts', {
    url: '/products',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'ListController'
      }
    }
  })
  .state('login', {
            url: '/main',
            templateUrl: 'templates/entry.html',
            controller: 'LoginController'
  })
 .state('app.single', {
    url: '/products/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'ListController'
      }
    }
  })
  
  .state('app.sr', {
      url: '/sr',
      views: {
        'menuContent': {
          templateUrl: 'templates/srlist.html'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileController'
        }
      }
    })

    .state('app.regproduct', {
      url: '/regproduct',
      views: {
        'menuContent': {
          templateUrl: 'templates/registerproduct.html',
          controller: 'ListController'
          
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/products');
});
