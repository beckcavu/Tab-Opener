chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'btn' : []});
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlContains: ''},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
    
  });
 
