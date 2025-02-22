// background.js
chrome.runtime.onInstalled.addListener(function () {
  console.log("插件已被安装");

});

chrome.tabs.onUpdated.addListener(function (tabId, tab) {
  console.log("插件 onUpdated=", tabId, tab);
});


// chrome.action.onClicked.addListener(async (tab) => {
//  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//  // Next state will always be the opposite
//  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
//  console.log('prevState=', prevState);
//  // Set the action badge to the next state
//  await chrome.action.setBadgeText({
//    tabId: tab.id,
//    text: nextState,
//  });
// });

console.log('chrome.devtools=', chrome.devtools)
// chrome.devtools.network.onRequestFinished.addListener(
//   function(request) {
//     if (request.response.bodySize > 1*1024) {
//       chrome.devtools.inspectedWindow.eval(
//           'console.log("Large image: " + unescape("' +
//           escape(request.request.url) + '"))');
//     }
//   }
// );

// var callback = function(details) {
//   console.log('detail=', details);
// };
// var filter = {};
// var opt_extraInfoSpec = [];
// chrome.webRequest.onBeforeRequest.onErrorOccurred(
//   callback, filter, opt_extraInfoSpec);

//   chrome.sidePanel.open();


// var openCount = 0;
// chrome.runtime.onConnect.addListener(function (port) {
//     console.log('runtime.onConnect=', port)
//     if (port.name == "devtools-page") {
//       if (openCount == 0) {
//         alert("DevTools window opening.");
//       }
//       openCount++;

//       port.onDisconnect.addListener(function(port) {
//           openCount--;
//           if (openCount == 0) {
//             alert("Last DevTools window closing.");
//           }
//       });
//     }
// });