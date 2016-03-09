
shared = angular.module 'shared', []

shared.service 'favsService',
    class
        favs: []
        tags: []

        constructor: (@$q)-> @all()

        all: ->
            d = @$q.defer()
            chrome.storage.local.get
                favs: []
            ,
                (items) =>
                    console.log items
                    @favs = items.favs
                    d.resolve @favs
            d.promise

        getTags: ->
            if @tags == []
                for fav in @favs
                    for tag in fav.tags
                        @tags.push tag if tag not in @tags
            @tags

        add: (fav) ->
            d = @$q.defer()
            @favs.push fav
            for tag in fav.tags
                @tags.push tag if tag not in @tags
            chrome.storage.local.set
                favs: @favs
            ,
                -> d.resolve()
            d.promise
