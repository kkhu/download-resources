console.log('loaded devtools index.js');

console.log('1310 chrome.devtools =', chrome.devtools);

let sourceCount = 0;
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    sourceCount++;
    // chrome.devtools.inspectedWindow.eval(`console.log("request: ", ${request})`);
    // "'+sourceCount+'" 
    chrome.devtools.inspectedWindow.eval('console.log(Large image: " + decodeURIComponent("' +  decodeURIComponent(request.request.url) + '"))');
  }
);

chrome.devtools.panels.create("MyWorkPanel",
  "../icons/128.png",
  "devtools/panel.html",
  function(panel) {
    // code invoked on panel creation
    console.log('panel=', panel)
  }
);

chrome.devtools.panels.elements.createSidebarPane("MyWorkPanelSidebar",
  function(sidebar) {
      // sidebar initialization code here
      sidebar.setObject({ some_data: "Some data to show" });
});

// // Create a connection to the service worker
// const serviceWorkerConnection = chrome.runtime.connect({
//   name: "devtools-page"
// });

// // Send a periodic heartbeat to keep the port open.
// setInterval(() => {
//   // port.postMessage("heartbeat");
// }, 15000);



var openCount = 0;
chrome.runtime.onConnect.addListener(function (port) {
    console.log('runtime.onConnect=', port)
    if (port.name == "devtools-page") {
      if (openCount == 0) {
        alert("DevTools window opening.");
      }
      openCount++;

      port.onDisconnect.addListener(function(port) {
          openCount--;
          if (openCount == 0) {
            alert("Last DevTools window closing.");
          }
      });
    }
});