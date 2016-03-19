
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.config ($mdIconProvider) ->
    $mdIconProvider.defaultIconSet 'mdicons.svg'

manager.controller 'MainCtrl',
    class
        search: ''

        constructor: (@$scope, @favsService) ->
            @tags = @favsService.tags
            @favsService.query  ''
            .then (favs) =>
                @favs = favs

            @$scope.$watch (=> @search), (val, old) =>
                @favsService.query val
                .then (result) =>
                    @favs = result

        filterBy: (tag) -> @search = '\\' + tag

        open: (url) ->
            chrome.tabs.create
                url: url

        # openMenu: ($mdOpenMenu, ev) ->
        #     @sender = ev
        #     $mdOpenMenu ev

        remove: (item) ->

        edit: (item) ->

        sync: ->

        fromFile: ->
            # decodeURIComponent(escape(window.atob(b64)));

        toFile: ->
            data = JSON.stringify @favsService.favs, null, 4
            url = "data:application/json;base64,#{btoa unescape encodeURIComponent data}"
            chrome.downloads.download
                url      : url
                saveAs   : true
                filename : 'tagged-backup.json'
