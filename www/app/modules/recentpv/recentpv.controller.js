(function() {
    'use strict';

    angular
        .module('app.recentpv')
        .controller('RecentPvController', RecentPvController);

    RecentPvController.$inject = ['$scope','songservice','logger'];

    function RecentPvController($scope,songservice,logger) {
        
        logger.info('enter RecentPvController');
        
        /*jshint validthis: true */
        var vm = this;
        
        vm.songs = [];
        vm.title = 'Recent PV';
        vm.query = '';
        vm.loading = false;
        vm.doRefresh = doRefresh;
        vm.queryRecentPv = queryRecentPv;
        vm.getMomentFromNow = getMomentFromNow;

        //init(); 
 
        function init() {
            var promises = [queryRecentPv()];
            return songservice.ready(promises).then(function(){
                logger.info('Songs pv loaded');
            });
        }
        

        function queryRecentPv() {
            logger.info("RecentPvController : queryRecentPv completed....");
            vm.loading = true;
            return songservice.querySongtByPV(vm.songs.length).then(function(data) {
                
                angular.forEach(data.items, function(value, key) {
                        vm.songs.push(value);
                });
                //vm.songs = data.items;
                vm.loading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                
                return vm.songs;
            });
        }
        
        function doRefresh() {
                return songservice.querySongtByPV(0).then(function(data) {
                vm.songs = data.items;
                vm.loading = false;
                
                $scope.$broadcast('scroll.refreshComplete');
                return vm.songs;
            });
        }
        
        function getMomentFromNow(strDateTime) {
            if(typeof strDateTime === 'undefined') return;
            return  moment(strDateTime + "+03:00").fromNow();
        }
        
        
    }
})();