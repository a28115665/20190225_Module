"use strict";

angular.module('app.settings').controller('ExAccountCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi, bool, compy) {

	var $vm = this;
    // console.log(Account.get());

	angular.extend(this, {
        Init : function(){
            if($stateParams.data == null){
                $vm.vmData = {
                	CI_STS : false,
                    IU : "Add"
                }
            }else{
                $vm.vmData = $stateParams.data;
                $vm.vmData["IU"] = "Update";

                console.log($vm.vmData);
            }
        },
        profile : Session.Get(),
        boolData : bool,
        compyData : compy,
        ForgetPW : function(){

            var _defaultPass = "Leja@168";

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: $templateCache.get('isChecked'),
                controller: 'IsCheckedModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'sm',
                windowClass: 'center-modal',
                // appendTo: parentElem,
                resolve: {
                    items: function() {
                        return _defaultPass;
                    },
                    show: function(){
                        return {
                            title : "即將設定為預設密碼" + _defaultPass
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                // console.log(selectedItem);
                
                $vm.vmData.CI_PW = selectedItem;

            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },
        Return : function(){
        	ReturnToExternalManagementPage();
        },
        Add : function(){
            RestfulApi.InsertMSSQLData({
                insertname: 'InsertByEncrypt',
                table: 7,
                params: {
                    CI_ID          : $vm.vmData.CI_ID,
                    CI_PW          : $vm.vmData.CI_PW,
                    CI_NAME        : $vm.vmData.CI_NAME,
                    CI_COMPY       : $vm.vmData.CI_COMPY,
                    CI_STS         : $vm.vmData.CI_STS,
                    CI_CR_USER     : $vm.profile.U_ID,
                    CI_CR_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                }
            }).then(function(res) {
                // console.log(res);
                toaster.pop('success', '訊息', '新增外部帳號成功', 3000);

                ReturnToExternalManagementPage();

                // $state.reload()
            });
        },
        Update : function(){
            RestfulApi.UpdateMSSQLData({
                updatename: 'UpdateByEncrypt',
                table: 7,
                params: {
                    CI_PW          : $vm.vmData.CI_PW,
                    CI_NAME        : $vm.vmData.CI_NAME,
                    CI_COMPY       : $vm.vmData.CI_COMPY,
                    CI_STS         : $vm.vmData.CI_STS,
                    CI_UP_USER     : $vm.profile.U_ID,
                    CI_UP_DATETIME : $filter('date')(new Date, 'yyyy-MM-dd HH:mm:ss')
                },
                condition: {
                    CI_ID         : $vm.vmData.CI_ID
                }
            }).then(function (res) {
                toaster.pop('success', '訊息', '更新外部帳號成功', 3000);

                ReturnToExternalManagementPage();

            }, function (err) {

            });
        }
	})

    function ReturnToExternalManagementPage(){
        $state.transitionTo("app.settings.externalmanagement");
    };

});