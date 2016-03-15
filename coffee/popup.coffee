popup = angular.module 'popup', ['ngMaterial', 'shared']

popup.config ($mdIconProvider) -> $mdIconProvider.defaultIconSet 'mdicons.svg'

popup.controller 'MainCtrl',
    class
        txt:
            title       : chrome.i18n.getMessage 'popup_title'
            description : chrome.i18n.getMessage 'popup_description'
            add         : chrome.i18n.getMessage 'popup_add'
            later       : chrome.i18n.getMessage 'popup_later'

        fav:
            title       : ""
            description : ""
            icon        : ""
            tags        : []

        tags : []
        done : no

        constructor: (@$timeout, @favsService) ->
            @tags = @favsService.tags
            chrome.tabs.query {active: true, currentWindow: true}, (tabs) =>
                @fav.title = tabs[0].title
                @fav.url   = tabs[0].url
                @fav.icon  = tabs[0].favIconUrl
                @tabId     = tabs[0].id

        add: ->
            @done = yes
            @favsService.add(@fav).then =>
                chrome.browserAction.setIcon
                    tabId:  @tabId
                    path:
                        19: 'icon19h.png'
                        38: 'icon38h.png'
                @$timeout(750) .then -> window.close()

        addLater: ->
            @fav.tags = ['depois']
            @add()
