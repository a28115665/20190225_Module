"use strict";

angular.module('app.auth').controller('MainLoginCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, RestfulApi) {
    // console.log(Session.Get());
    $scope.Login = function($vm){
        // console.log($vm);
        AuthApi.Login({
            U_ID : $vm.userid,
            U_PW : $vm.password
        }).then(function(res) {
            console.log(res);
            if(res["returnData"] && res["returnData"].length > 0){
                toaster.success("狀態", "登入成功", 3000);

                AuthApi.ReLoadSession().then(function(res){
                    $state.transitionTo("app.default");
                });

            }else{                
                toaster.error("狀態", "帳號密碼錯誤", 3000);
            }
        });
        
    }
})
