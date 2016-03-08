
document.addEventListener 'DOMContentLoaded', ->
    chrome.storage.sync.get
        jwt: 'bugaluga'
    ,
        (items) ->
            document.getElementById('jwt').value = items.jwt

document.getElementById('save').addEventListener 'click', ->
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
