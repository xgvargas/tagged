# chrome.omnibox.onInputStarted.addListener ->
# chrome.omnibox.onInputCancelled.addListener ->

chrome.omnibox.onInputChanged.addListener (text, suggest) ->
    angular.injector ['ng', 'shared']
    .get("favsService").query text
    .then (result) ->
        console.log result

        suggest ({content: i.url, description: i.title} for i in result)

chrome.omnibox.onInputEntered.addListener (string, disposition) ->
    chrome.tabs.create url: string

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->

chrome.tabs.onUpdated.addListener (activeInfo) ->

chrome.contextMenus.create
    id: "openManager"
    title: "Manager"
    contexts: ["browser_action"]

chrome.contextMenus.onClicked.addListener (info, tab) ->
    chrome.tabs.create url: chrome.extension.getURL 'manager.html'
