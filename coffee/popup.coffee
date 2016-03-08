popup = angular.module 'popup', ['ngMaterial', 'shared']

popup.controller 'MainCtrl',
    class
        txt:
            title: chrome.i18n.getMessage 'popup_title'
            description: chrome.i18n.getMessage 'popup_description'
            add: chrome.i18n.getMessage 'popup_add'
        fav:
            title: ""
            description: ""
            icon: ""
            tags: []

        tags: []
        working: no
        done: no

        constructor: (@$timeout, @tagsService, @favService) ->
            @tags = @tagsService.all()
            chrome.tabs.query {active: true, currentWindow: true}, (tabs) =>
                @fav.title = tabs[0].title
                @fav.url = tabs[0].url
                @fav.icon = tabs[0].favIconUrl
                @tabId = tabs[0].id

        add: ->
            @working = yes
            @done = yes
            @tagsService.add @fav.tags
            @favService.add @fav, =>
                @working = no
                chrome.browserAction.setIcon
                    tabId:  @tabId
                    path:
                        19: 'icon19h.png'
                        38: 'icon38h.png'
                @$timeout(750) .then -> window.close()
