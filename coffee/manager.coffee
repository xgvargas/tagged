
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.config ($mdIconProvider) ->
    $mdIconProvider.defaultIconSet 'mdicons.svg'

manager.controller 'MainCtrl',
    class
        constructor: (@$scope, @favsService) ->
            @tags = @favsService.tags
            @favsService.query().then (favs) =>
                @favs = favs

            @$scope.$watch (=> @search), (val, old) =>
                @favsService.query val
                .then (result) =>
                    console.log result
                    @favs = result

        filterBy: (tag) -> @search = '/' + tag

        open: (url) ->
            chrome.tabs.create
                url: url

        openMenu: ($mdOpenMenu, ev) ->
            @sender = ev
            $mdOpenMenu ev
