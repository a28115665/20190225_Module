(function(){
    "use strict";

    angular.module('SmartAdmin.Layout').directive('smartMenuItems', function ($http, $rootScope, $compile, ToolboxApi, Session) {
    return {
        restrict: 'A',
        // compile: function (element, attrs) {
            
        //     function createItem(item, parent, level){
        //         var li = $('<li />' ,{'ui-sref-active': "active"})
        //         var a = $('<a />');
        //         var i = $('<i />');

        //         li.append(a);

        //         if(item.sref)
        //             a.attr('ui-sref', item.sref);
        //         if(item.href)
        //             a.attr('href', item.href);
        //         if(item.icon){
        //             i.attr('class', 'fa fa-lg fa-fw fa-'+item.icon);
        //             a.append(i);
        //         }
        //         if(item.title){
        //             a.attr('title', item.title);
        //             if(level == 1){ 
        //                 console.log(item.title, $rootScope.getWord(item.title));
        //                 a.append(' <span class="menu-item-parent">' + item.title + '</span>');
        //             } else {
        //                 a.append(' ' + item.title);

        //             }
        //         }

        //         if(item.items){
        //             var ul = $('<ul />');
        //             li.append(ul);
        //             li.attr('data-menu-collapse', '');
        //             _.forEach(item.items, function(child) {
        //                 createItem(child, ul, level+1);
        //             })
        //         } 

        //         parent.append(li); 
        //     }

        //     $http.get(attrs.smartMenuItems).then(function(res){
        //         var ul = $('<ul />', {
        //             'smart-menu': ''
        //         })
        //         _.forEach(res.data.items, function(item) {
        //             createItem(item, ul, 1);
        //         })
                
        //         var $scope = $rootScope.$new();
        //         var html = $('<div>').append(ul).html(); 
        //         var linkingFunction = $compile(html);
                
        //         var _element = linkingFunction($scope);

        //         element.replaceWith(_element);
        //         console.log(element);                
        //     })
        // },
        link: function(scope, element, attrs){
            function createItem(item, parent, level){
                var li = $('<li />' ,{'ui-sref-active': "active"})
                var a = $('<a />');
                var i = $('<i />');

                li.append(a);

                if(item.sref)
                    a.attr('ui-sref', item.sref);
                if(item.href)
                    a.attr('href', item.href);
                if(item.icon){
                    i.attr('class', 'fa fa-lg fa-fw fa-'+item.icon);
                    a.append(i);
                }
                if(item.title){
                    a.attr('title', $rootScope.getWord(item.title));
                    if(level == 1){ 
                        a.append(' <span class="menu-item-parent">' + $rootScope.getWord(item.title) + '</span>');
                    } else {
                        a.append(' ' + $rootScope.getWord(item.title));

                    }
                }

                if(item.items){
                    var ul = $('<ul />');
                    li.append(ul);
                    li.attr('data-menu-collapse', '');
                    _.forEach(item.items, function(child) {
                        createItem(child, ul, level+1);
                    })
                } 

                parent.append(li); 
            }


            function DoMenu(){
                ToolboxApi.ComposeMenu({
                    U_ID : Session.Get().U_ID
                }).then(function(res){
                    console.log(res);

                    var ul = $('<ul />', {
                        'smart-menu': ''
                    })
                    _.forEach(res.items, function(item) {
                        createItem(item, ul, 1);
                    })
                    
                    var $scope = $rootScope.$new();
                    var html = $('<div>').append(ul).html(); 
                    var linkingFunction = $compile(html);
                    
                    var _element = linkingFunction($scope);
                    // console.log(_element);
                    // element.replaceWith(_element);
                    
                    element.html(_element);   
                })        
            }

            $rootScope.$watch('lang', function(newVal, oldVal){
                if(!angular.equals(newVal, {}) && !angular.isUndefined(newVal)){
                    DoMenu();
                }
            }, true);
        }
    }
});
})();