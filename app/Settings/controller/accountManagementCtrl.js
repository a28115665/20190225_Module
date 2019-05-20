"use strict";

angular.module('app.settings').controller('AccountManagementCtrl', function ($scope, $stateParams, $state, AuthApi, Session, toaster, $uibModal, $templateCache, $filter, SysCode, RestfulApi, uiGridConstants, bool, role, userGrade) {

	var $vm = this;
    // console.log(Account.get());

	angular.extend(this, {
        Init : function(){
            $scope.ShowTabs = true;
            
            $vm.LoadData();
        },
        profile : Session.Get(),
        defaultTab : 'hr1',
        TabSwitch : function(pTabID){
            return pTabID == $vm.defaultTab ? 'active' : '';
        },
        LoadData : function(){
            console.log($vm.defaultTab);
            switch($vm.defaultTab){
                case 'hr1':
                    LoadAccount();
                    break;
                case 'hr2':
                    LoadGroup();
                    break;
            }
        },
        gridAccountMethod : {
            //編輯
            modifyData : function(row){
                console.log(row);
                $state.transitionTo("app.settings.accountmanagement.account", {
                    data: row.entity
                });
            },
            //刪除
            deleteData : function(row){
                console.log(row);

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
                            return row.entity;
                        },
                        show: function(){
                            return {
                                title : "是否刪除"
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 0,
                        params: {
                            U_ID : selectedItem.U_ID
                        }
                    }).then(function (res) {
                        if(res["returnData"] == 1){
                            LoadAccount();
                        }
                    });
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        accountManagementOptions : {
            data: '$vm.accountData',
            columnDefs: [
                { name: 'U_STS'    ,  displayName: '離職', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: bool
                    }
                },
                // { name: 'U_CHECK'  ,  displayName: '認證', cellFilter: 'booleanFilter', filter: 
                //     {
                //         term: null,
                //         type: uiGridConstants.filter.SELECT,
                //         selectOptions: bool
                //     }
                // },
                { name: 'U_ID'     ,  displayName: '帳號' },
                { name: 'U_NAME'   ,  displayName: '名稱' },
                { name: 'U_EMAIL'  ,  displayName: '信箱' },
                { name: 'U_PHONE'  ,  displayName: '電話' },
                { name: 'U_GRADE'  ,  displayName: '職稱', cellFilter: 'gradeFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: userGrade
                    }
                },
                { name: 'U_ROLE'   ,  displayName: '角色', cellFilter: 'roleFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: role
                    }
                },
                { name: 'Options'  ,  displayName: '操作', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMDForAccount') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            // enableVerticalScrollbar: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.accountManagementGridApi = gridApi;
            }
        },
        gridGroupMethod : {
            //編輯
            modifyData : function(row){
                // console.log(row);
                $state.transitionTo("app.settings.accountmanagement.group", {
                    data: row.entity
                });
            },
            //刪除
            deleteData : function(row){
                console.log(row);
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
                            return row.entity;
                        },
                        show: function(){
                            return {
                                title : "是否刪除"
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);

                    RestfulApi.DeleteMSSQLData({
                        deletename: 'Delete',
                        table: 6,
                        params: {
                            SG_GCODE : selectedItem.SG_GCODE
                        }
                    }).then(function (res) {
                        if(res["returnData"] == 1){
                            LoadGroup();
                        }
                    });
                }, function() {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        },
        groupManagementOptions : {
            data: '$vm.groupData',
            columnDefs: [
                { name: 'SG_TITLE' ,  displayName: '群組名稱' },
                { name: 'SG_DESC'  ,  displayName: '群組敘述' },
                { name: 'SG_STS'   ,  displayName: '作廢', cellFilter: 'booleanFilter', filter: 
                    {
                        term: null,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: bool
                    }
                },
                { name: 'Options'  ,  displayName: '操作', enableFiltering: false, cellTemplate: $templateCache.get('accessibilityToMDForGroup') }
            ],
            enableFiltering: true,
            enableSorting: false,
            enableColumnMenus: false,
            paginationPageSizes: [10, 25, 50, 100],
            paginationPageSize: 100,
            onRegisterApi: function(gridApi){
                $vm.groupManagementGridApi = gridApi;
            }
        },
        AddAccount : function(){

            $state.transitionTo("app.settings.accountmanagement.account");

        },
        AddGroup : function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addGroupModalContent.html',
                controller: 'AddGroupModalInstanceCtrl',
                controllerAs: '$ctrl',
            });

            modalInstance.result.then(function(selectedItem) {
                // console.log(selectedItem);

                RestfulApi.InsertMSSQLData({
                    insertname: 'Insert',
                    table: 6,
                    params: {
                        SG_TITLE : selectedItem.TITLE,
                        SG_DESC  : selectedItem.DESC,
                        SG_CR_DATETIME : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    }
                }).then(function(res) {
                    console.log(res);

                    if(res["returnData"] == 1){
                        LoadGroup();
                    }

                    // $state.reload()
                });
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }
	})

	function LoadAccount(){    
        RestfulApi.SearchMSSQLData({
            querymain: 'accountManagement',
            queryname: 'SelectAllUserInfoNotWithAdmin'
        }).then(function (res){
            console.log(res["returnData"]);
            $vm.accountData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.accountManagementGridApi);
        });    
	}

    function LoadGroup(){    
        RestfulApi.SearchMSSQLData({
            querymain: 'accountManagement',
            queryname: 'SelectAllGroup'
        }).then(function (res){
            $vm.groupData = res["returnData"];
        }).finally(function() {
            HandleWindowResize($vm.groupManagementGridApi);
        });    
    }

})
.controller('AddGroupModalInstanceCtrl', function ($uibModalInstance) {
    var $ctrl = this;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.items);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});