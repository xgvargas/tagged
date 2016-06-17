
class Bookmarks
    favs: []
    tags: []
    pins: []
    sess: []

    constructor: () -> @load()

    getIndex: () ->
        index = elasticlunr ->
            @addField     'title'
            @addField     'description'
            @addField     'url'
            @setRef       'id'
            @saveDocument false
        elasticlunr.addStopWords [
            'um', 'uma', 'a', 'as', 'o', 'os',
            ]
        index

    load: () ->
        @ready = $.Deferred()
        @index = @getIndex()
        chrome.storage.local.get {favs: []}, (items) =>
            @favs = items.favs
            for fav, i in @favs
                fav['id'] = i
                @index.addDoc fav
                for tag in fav.tags
                    @tags.push tag if tag not in @tags
            @tags.sort()
            @ready.resolve()

    save: () ->
        d = $.Deferred()
        # TODO apagar valores desnecessarios temporarios....
        chrome.storage.local.set {favs: @favs}, -> d.resolve()
        d.promise()

    add: (fav) ->
        @favs.push fav
        for tag in fav.tags
            @tags.push tag if tag not in @tags
        @tags.sort()
        @save()

    update: (id, fav) ->
        fav.id = id
        @index.update fav
        @favs[id] = fav
        for tag in fav.tags
            @tags.push tag if tag not in @tags
        @save()

    delete: (id) ->
        @index.removeDoc @favs[id]
        # TODO
        @save()

    splitSearch: (search) ->
        # s1 = /// ^ ( (?: \s* \[ [^\]]+ \])* ) \s* (.*) $///
        # s2 = /// \[ \s* ( [\w\s]+? ) \s* \]///g
        s1 = ///^ ( (?: \s* \\\w+ )* ) \s* (.*) $///
        s2 = ///\\ (\w+) ///g

        m = s1.exec search

        t = []
        while (y = s2.exec m[1])?
            t.push y[1]

        qtext: m[2], qtags: t

    query: (search) ->
        d = $.Deferred()
        $.when(@ready).then =>

            if not search
                d.resolve (item for item in @favs when item.tags.length == 0)
            else
                {qtext, qtags} = @splitSearch search
                if qtext != '' and qtext?
                    r = @index.search qtext, expand: true
                    f = (@favs[p.ref] for p in r)
                else
                    f = @favs

                if qtags.length
                    d.resolve (item for item in f when qtags.every (el) -> el in item.tags)
                else
                    d.resolve f
        d.promise()


#####################################################################


@bookmarks = new Bookmarks()


#####################################################################


chrome.omnibox.onInputChanged.addListener (text, suggest) ->
    @bookmarks.query text
    .then (result) ->
        suggest ({content: i.url, description: i.title} for i in result)

chrome.omnibox.onInputEntered.addListener (string, disposition) ->
    chrome.tabs.create url: if string then string else chrome.extension.getURL 'manager.html'

# chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->

# chrome.tabs.onUpdated.addListener (activeInfo) ->

chrome.contextMenus.create
    id       : "openManager"
    title    : "Manager"
    contexts : ["browser_action"]

chrome.contextMenus.onClicked.addListener (info, tab) ->
    chrome.tabs.create url: chrome.extension.getURL 'manager.html'
