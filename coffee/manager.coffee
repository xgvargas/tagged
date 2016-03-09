
manager = angular.module 'manager', ['ngMaterial', 'ngMdIcons', 'shared']

manager.config ($mdIconProvider) ->
    $mdIconProvider.defaultIconSet 'icons.svg'

manager.controller 'MainCtrl',
    class
        constructor: (@tagsService) ->
            @tags = @tagsService.all()
            @tags.push('teste')
            @tags.push('meleca')
            @favs = [
                title:'oi mano'
                url: 'http://www.github.com'
                tags: ['python']
            ,
                title: 'beleza!? sou outro fav'
                url: 'http://google.com'
                tags: ['angular']
                icon: 'https://material.angularjs.org/latest/favicon.ico'
            ]

        filterBy: (tag) ->
            alert 'oi'

        open: (url) ->
            chrome.tabs.create
                url: url

        openMenu: ($mdOpenMenu, ev) ->
            @sender = ev
            $mdOpenMenu ev
