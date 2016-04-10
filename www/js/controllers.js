angular.module('starter.controllers', ['ionic'])

.controller('HealthKitCtrl', function($scope) {
  //healthKit 지원여부 확인
  document.addEventListener("deviceready", function(){
    console.log('healthKit 시작');
    window.plugins.healthkit.available(function(isAvailable){
      if(isAvailable == false)
      {
        document.getElementById("error-info").innerHTML = "Unfortunately HealthKit is not available in this device.";
        $.mobile.changePage("#not-supported");
      }
    });
    // 키, 몸무게, 비타민 권한 요청
    window.plugins.healthkit.requestAuthorization({
      "readTypes"  : ["HKQuantityTypeIdentifierHeight", "HKQuantityTypeIdentifierBodyMass", "HKQuantityTypeIdentifierStepCount"],
      "writeTypes" : ["HKQuantityTypeIdentifierHeight", "HKQuantityTypeIdentifierBodyMass", "HKQuantityTypeIdentifierStepCount"]
    },
    null,
    function(){
      document.getElementById("error-info").innerHTML = "APP doesn't have sufficient permission";
      $.mobile.changePage("#not-supported");
    });
  }, false);

  // 걸음수 체크
  $scope.getStepCount = function(){
    window.plugins.healthkit.querySampleType({
      "startDate" : new Date(new Date().getTime() - 24*60*60*1000),
      "endDate"   : new Date(),
      "sampleType": "HKQuantityTypeIdentifierStepCount",
      "unit"      : "count"
    },
    function(stepData){
      console.log(stepData[0]);
      var arraySteaData = new Array();
      var html = "";
      for(var i=0; i<stepData.length; i++){
        html += "<tr><td>" + stepData[i].startDate + "</td><td>" + stepData[i].endDate + "</td><td>" + stepData[i].quantity + "</td></tr>";
      }
      $("#tbodyStepData").append(html).closest("#tbodyStepData").table("refresh").trigger("create");
      console.log(html);
    },
    function(){

    });
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
