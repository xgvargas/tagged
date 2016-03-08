app = angular.module 'tagged', ['ngMaterial']

# app.service 'tabsService',
#     class
#         getCurrent: ->
#             chrome.tabs.getCurrent (tab) ->
#                 return tab.title

app.controller 'MainCtrl',
    class
        tags: []
        description: ""
        constructor: ->
            chrome.tabs.query {active: true, currentWindow: true}, (tabs) =>
                @title = tabs[0].title
                @url = tabs[0].url
                @icon = tabs[0].favIconUrl

        add: ->
            alert 'adicionando...'
