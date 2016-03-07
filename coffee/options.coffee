save_options = ->
    jwt = document.getElementById('jwt').value
    chrome.storage.sync.set
        jwt: jwt
    ,
        ->
            status = document.getElementById 'status'
            status.textContent = 'Tudo salvo!'
            setTimeout ->
                status.textContent = ''
            ,
                750

restore_options = ->
    chrome.storage.sync.get
        jwt: 'bugaluga'
    ,
        (items) ->
            document.getElementById('jwt').value = items.jwt

document.addEventListener 'DOMContentLoaded', restore_options
document.getElementById('save').addEventListener 'click', save_options
