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
        bgPage.bookmarks.ready.done () ->
            showTags()
            showBookmarks ''

    # filtra favs pela tag clicada
    $('#tags').on 'click', 'li', () -> $('#search').val("\\#{$(@).text()}").keydown()

    # filtra favs quando search eh editado
    $('#search').keydown () ->
        setTimeout ->
            showBookmarks $('#search').val()

    # baixa uma copia json dos dados
    $('#btn-export').click () -> download()

    # abre e carrega o modal
    editing_idx = null
    $('#saves').on 'click', '.edit', () ->
        editing_idx = $(@).parents('li').attr('data-ref')
        console.log "edit: ", editing_idx, bgPage.bookmarks.favs[editing_idx]
        $('#editor').openModal
            ready: () ->
                $('#fav-title').val bgPage.bookmarks.favs[editing_idx].title
                $('#fav-url').val bgPage.bookmarks.favs[editing_idx].url
                $('#fav-description').val bgPage.bookmarks.favs[editing_idx].description
                Materialize.updateTextFields()
                $('#fav-tags').materialtags 'removeAll'
                $('#fav-tags').materialtags 'add', bgPage.bookmarks.favs[editing_idx].tags.join ','
        false

    # valida e salva o modal
    $('#editor').on 'click', '#btn-save-edit', () ->
        console.log 'salvando a pemba!'
        fav =
            title       : $('#fav-title').val()
            url         : $('#fav-url').val()
            description : $('#fav-description').val()
            tags        : $('#fav-tags').materialtags 'items'
        console.log fav
        bgPage.bookmarks.update editing_idx, fav
        $('#editor').closeModal()
        showTags()
        showBookmarks $('#search').val()

    # apaga o fav
    $('#saves').on 'click', '.delete', () ->
        console.log "delete: ", $(@).parents('li').attr('data-ref')
        false

    # abre aba com o fav
    $('#saves').on 'click', 'li', () ->
        # chrome.tabs.create url: $(@).find('p').text()
        console.log $(@).find('p').text()
