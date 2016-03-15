
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

        splitSearch: (search) ->
            # s1 = /// ^ ( (?: \s* \[ [^\]]+ \])* ) \s* (.*) $///
            # s2 = /// \[ \s* ( [\w\s]+? ) \s* \]///g
            s1 = ///^ ( (?: \s* \/\w+ )* ) \s* (.*) $///
            s2 = ///\/ (\w+) ///g

            m = s1.exec search

            t = []
            while (y = s2.exec m[1])?
                t.push y[1]

            qtext: m[2], qtags: t


        query: (search) ->
            d = @$q.defer()
            @valid.promise.then =>
                {qtext, qtags} = @splitSearch search
                if qtext != '' and qtext?
                    r = @index.search qtext, expand: true
                    f = (@favs[p.ref] for p in r)
                else
                    f = @favs

                if not search
                    d.resolve (item for item in f when item.tags.length == 0)
                else
                    if qtags.length
                        d.resolve (item for item in f when qtags.every (el) -> el in item.tags)
                    else
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
