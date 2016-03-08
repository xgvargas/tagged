# chrome.omnibox.onInputStarted.addListener ->
# chrome.omnibox.onInputCancelled.addListener ->

chrome.omnibox.onInputChanged.addListener (text, suggest) ->
    suggest [
        content: "primeiro"
        description: "#{text} segundo"
    ,
        content: "terceiro"
        description: "#{text} quarto"
    ]

chrome.omnibox.onInputEntered.addListener (string, disposition) ->
    alert "abrindo a pagina #{string}"

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->

chrome.tabs.onUpdated.addListener (activeInfo) ->
