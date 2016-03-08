popup = angular.module 'popup', ['ngMaterial', 'shared']

popup.controller 'MainCtrl',
    class
        txt:
            title: chrome.i18n.getMessage 'popup_title'
            description: chrome.i18n.getMessage 'popup_description'
            add: chrome.i18n.getMessage 'popup_add'
        fav:
            description: ""
        tags: []
        constructor: (@tagsService) ->
            @tags = @tagsService.all()
            chrome.tabs.query {active: true, currentWindow: true}, (tabs) =>
                @fav.title = tabs[0].title
                @fav.url = tabs[0].url
                @fav.icon = tabs[0].favIconUrl

        add: ->
            alert 'adicionando...'
