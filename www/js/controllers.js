angular.module('starter.controllers', ['ngCordova','ngStorage','ngOpenFB'])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
$scope.logout = function(){
  $state.go('login')
}

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
  { title: 'Reggae', id: 1 },
  { title: 'Chill', id: 2 },
  { title: 'Dubstep', id: 3 },
  { title: 'Indie', id: 4 },
  { title: 'Rap', id: 5 },
  { title: 'Cowbell', id: 6 }
  ];
})

.controller("LoginController", function($scope,$state, $cordovaOauth, $localStorage, $location,ngFB) {

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $state.go("app.myproducts");
            } else {
                alert('Facebook login failed');
            }
        });
}
 
    $scope.facebookLogin = function() {
        $cordovaOauth.facebook("1600281576906225", ["email"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $state.go("app.myproducts")
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };
 
})

.controller("ProfileController", function($scope, $http, $localStorage, $location,$ionicLoading,$timeout) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,age_range", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

    $scope.share = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.post("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, message: "I love it", format: "json" }}).then(function(result) {
               
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

})






.controller('ListController', ['$scope', '$http','$state','$rootScope','ProductService','$ionicListDelegate','Loader', function($scope, $http, $state,$rootScope,ProductService,$ionicListDelegate,Loader) {
  ProductService.getMasterList().then(function(data) {
    $scope.masterList = data;
  });

  ProductService.GetProducts().then(function(data) {

   
      $scope.userproducts = data
      $scope.id = $state.params.id
     


     
     
    

   $rootScope.$on('products:listChanged', function() {
     console.log($scope.data.newProductList)
     ProductService.addProduct($scope.data.newProductList)
    console.log(ProductService.GetProducts())
    
   });
   
    $scope.productId = $state.params.prodId;

    $scope.data = {showDelete : false,
      showReorder: false,
      showLable: false,
      selectedProduct:"",
      showCard: false,
      newProduct: {"status": "In Warranty",
                    "category": "TV",
                    "image": "../img/s6.jpg"},
      newProductList: {}

    }

    $scope.moveItem = function(item,fromIndex,toIndex){

      $scope.userproducts.splice(fromIndex,1);
      $scope.userproducts.splice(toIndex,0,item);
    } ;

    $scope.onProductChange = function(){

      console.log($scope.data.selectedProduct)
      $scope.data.showCard = true
      console.log($scope.data.showCard)



    } ;

    var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

    $scope.addProductToUser = function(){

      $scope.data.newProduct.name = $scope.data.selectedProduct.name
      $scope.data.newProduct.model = $scope.data.selectedProduct.model
      $scope.data.newProduct.desc = $scope.data.selectedProduct.desc
     
      $scope.data.newProduct.image = $scope.data.selectedProduct.image
      $scope.data.newProduct.category = $scope.data.selectedProduct.category
     
      $scope.data.newProduct.id = randomString(7)
      console.log($scope.data.newProduct.id)
       ProductService.addProduct($scope.data.newProduct)
      
      $scope.data.newProduct = {"status": "In Warranty"}
      Loader.toggleLoadingWithMessage("Product Added Succesfully")
      $state.go('app.myproducts')
     
        
    }



    $scope.onItemDelete = function(index){
      $scope.userproducts.splice(index, 1);
       $ionicListDelegate.closeOptionButtons();
       Loader.toggleLoadingWithMessage("Product Deleted Succesfully")
    };

    $scope.toggleStar = function(item){
      item.star = !item.star;
    };

    $scope.doRefresh= function(){
      $http.get('js/data.json').success(function(data){
       if($scope.userproducts.length == 0){
        $scope.userproducts = data.userproducts; 
       
      } 
       
      
      $scope.data.showDelete = false;
      $scope.data.showReorder = false;
      $scope.$broadcast('scroll.refreshComplete');
    });
    };
  });
}])


