
shared = angular.module 'shared', []

shared.service 'tagsService',
    class
        all_tags: []

        constructor: ->
            chrome.storage.local.get
                tags: []
            ,
                (items) =>
                    @all_tags = items.tags

        all: ->
            @all_tags

        add: (tags) ->
            for tag in tags
                @all_tags.push tag if tag not in @all_tags
            @save()

        save: ->
            chrome.storage.local.set
                tags: @all_tags


shared.service 'favService',
    class
        constructor: ->

        add: (fav, cb) ->
            chrome.storage.local.set
                favs: fav
            ,
                cb()
