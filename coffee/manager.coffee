
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.config ($mdIconProvider) ->
    $mdIconProvider.defaultIconSet 'mdicons.svg'

manager.controller 'MainCtrl',
    class
        search: '/depois'

        constructor: (@$scope, @favsService) ->
            @tags = @favsService.tags
            @favsService.query @search
            .then (favs) =>
                @favs = favs

            @$scope.$watch (=> @search), (val, old) =>
                @favsService.query val
                .then (result) =>
                    @favs = result

        filterBy: (tag) -> @search = '/' + tag

        open: (url) ->
            chrome.tabs.create
                url: url

        openMenu: ($mdOpenMenu, ev) ->
            @sender = ev
            $mdOpenMenu ev

        remove: (item) ->

        edit: (item) ->
