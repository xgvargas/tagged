
shared = angular.module 'shared', []

shared.service 'favsService',
    class
        favs: []
        tags: []

        constructor: (@$q) ->
            @valid = @$q.defer()
            @index = @getIndex()
            chrome.storage.local.get
                favs: []
            ,
                (items) =>
                    @favs = items.favs
                    for fav, i in @favs
                        fav['id'] = i
                        @index.addDoc fav
                        for tag in fav.tags
                            @tags.push tag if tag not in @tags
                    @tags.sort()
                    @valid.resolve()

        query: (q, len = 15) ->
            d = @$q.defer()
            @valid.promise.then =>
                if q?
                    r = @index.search q, expand: true
                    f = (@favs[p.ref] for p in r)
                else
                    f = @favs
                d.resolve f
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

        getIndex: ->
            index = elasticlunr ->
                @addField 'title'
                @addField 'description'
                @addField 'url'
                @setRef 'id'
                @saveDocument false
            elasticlunr.addStopWords [
                'um', 'uma', 'a', 'as', 'o', 'os',
                ]
            index
