
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.config ($mdIconProvider) ->
    $mdIconProvider.defaultIconSet 'mdicons.svg'

manager.controller 'MainCtrl',
    class
        constructor: (@favsService) ->
            @tags = @favsService.tags
            @favsService.query().then (favs) =>
                @favs = favs

        filterBy: (tag) -> @search = '/' + tag

        open: (url) ->
            chrome.tabs.create
                url: url

        openMenu: ($mdOpenMenu, ev) ->
            @sender = ev
            $mdOpenMenu ev
