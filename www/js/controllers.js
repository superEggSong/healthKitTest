angular.module('starter.controllers', ['ionic'])

.controller('HealthKitCtrl', function($scope) {
  $scope.healthData = {};
  //healthKit 지원여부 확인
  document.addEventListener("deviceready", function(){
    alert('healthKit 시작');
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

    // 걸음수 체크
    window.plugins.healthkit.querySampleType({
      "startDate" : new Date(new Date().getTime() - 2*24*60*60*1000),
      "endDate"   : new Date(),
      "sampleType": "HKQuantityTypeIdentifierStepCount",
      "unit"      : "count"
    },
    function(value){
      alert('2일 동안 걸음 수 : ' + value[0].quantity);
    },
    function(){
        console.log('불러오기 실패');
    });

    window.plugins.healthkit.sumQuantityType(
      {
        'startDate': new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        'endDate': new Date(), // now
        'sampleType': 'HKQuantityTypeIdentifierStepCount'
      },
      function (value) {
        alert("Success for running step query " + value);
      },
      callback
    );
    
    $scope.saveStep = function(){
      var saveStep = $scope.healthData.saveStep;
      alert(saveStep);
      window.plugins.healthkit.saveQuantitySample(
          {
            'startDate': new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // a day ago
            'endDate': new Date(), // now
            'sampleType': 'HKQuantityTypeIdentifierStepCount', // make sure you request write access beforehand
            'unit': 'count',
            'amount': 300
          },
          function (value) {
            alert("Success running saveQuantitySample, result: " + value);
          },
          callback
      );
    }
  
  }, false);

  
  // display_hp_data = function(){
  //   alert('click');
  //   window.plugins.healthkit.checkAuthStatus({
  //     "type": "HKQuantityTypeIdentifierStepCount"
  //   },
  //   function() {
  //     window.plugins.healthkit.querySampleType({
  //       "startDate" : new Date(new Date().getTime() - 2*24*60*60*1000),
  //       "endDate"   : new Date(),
  //       "sampleType": "HKQuantityTypeIdentifierStepCount",
  //       "unit"      : "count"
  //     },
  //     function(value){
  //         alert('success');
  //     },
  //     function(){
  //         alert('fail');
  //     });
  //   });
  // }
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
