
shared = angular.module 'shared', []

shared.service 'favsService',
    class
        favs: []
        tags: []

        constructor: (@$q) ->
            @valid = @$q.defer()
            chrome.storage.local.get
                favs: []
            ,
                (items) =>
                    @favs = items.favs
                    for fav in @favs
                        for tag in fav.tags
                            @tags.push tag if tag not in @tags
                    @tags.sort()
                    @valid.resolve()

        query: (q, len = 15) ->
            d = @$q.defer()
            @valid.promise.then =>
                d.resolve @favs
            d.promise

        add: (fav) ->
            d = @$q.defer()
            @favs.push fav
            for tag in fav.tags
                @tags.push tag if tag not in @tags
            @tags.sort()
            chrome.storage.local.set
                favs: @favs
            ,
                -> d.resolve()
            d.promise
