bgPage = undefined

download = (data) ->
    data = JSON.stringify data, null, 4
    url = "data:application/json;base64,#{btoa unescape encodeURIComponent data}"
    chrome.downloads.download
        url      : url
        saveAs   : true
        filename : 'tagged-backup.json'

upload = () ->
    # decodeURIComponent(escape(window.atob(b64)));

open = (url) ->
    chrome.tabs.create
        url: url

filterBy = (tag) ->
    $('#search').val("\\#{tag}").keydown()

showTags = () ->
    dust.render 'tag', bgPage.bookmarks.tags, (err, output) ->
        $('#tags').html output

showBookmarks = (query) ->
    bgPage.bookmarks.query query
    .then (favs) ->
        dust.render 'favitem', favs, (err, output) ->
            $('#saves').html(output)


$ ->

    chrome.runtime.getBackgroundPage (bg) ->
        bgPage = bg
        bgPage.bookmarks.ready.done ->

            showTags()
            showBookmarks ''

    $('#tags').on 'click', 'li', () ->
        filterBy $(@).text()

    $('#search').keydown () ->
        setTimeout ->
            showBookmarks $('#search').val()



# manager = angular.module 'manager', ['ngMaterial', 'shared']

# manager.config ($mdIconProvider) ->
#     $mdIconProvider.defaultIconSet 'mdicons.svg'

# manager.controller 'MainCtrl',
#     class
#         search: ''

#         constructor: (@$scope, @favsService) ->
#             @tags = @favsService.tags
#             @favsService.query  ''
#             .then (favs) =>
#                 @favs = favs

#             @$scope.$watch (=> @search), (val, old) =>
#                 @favsService.query val
#                 .then (result) =>
#                     @favs = result




