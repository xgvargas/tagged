
shared = angular.module 'shared', []

shared.service 'tagsService',
    class
        tags: []

        constructor: ->
            tags.push('teste')
            chrome.storage.local.get
                tags: []
            ,
                (items) =>
                    @tags = items

        all: ->
            @tags

        add: (tags) ->
            for tag in tags
                @tags.push() if tag not in @tags
            save()

        save: ->
            chrome.storage.local.set
                tags: @tags
