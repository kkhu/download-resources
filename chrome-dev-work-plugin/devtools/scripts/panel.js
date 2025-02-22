console.log('loaded devtools Panel.js');

let elBtnGet = document.querySelector('.btn-get');
let elBtnSave = document.querySelector('.btn-save');
let elBtnStopRefresh = document.querySelector('.btn-stop-refresh');
let elStattisticSummary = document.querySelector('.statistic .summary');
let elResourceList = document.querySelector('.resource-list');

const TICK_INTERVAL = 5000;
let ticker;
let types = {};
let resourcesList = [];
const HTTP_URL_REG = /https?:\/\/.+\..+/;
const SERVER_API_HOST = 'http://localhost:6789';

function getServerAPIHost(path) {
  return SERVER_API_HOST + path;
}

function updateStatistics() {
  types = {};
  clearStatistics();
  chrome.devtools.inspectedWindow.getResources((resources) => {
    countResourcesOfType(resources);
    renderResourceList(resources);
    renderStatisticSummary(resources);
    resourcesList = resources;
  });
}

function clearStatistics() {
  emptySubElements(elStattisticSummary);
  emptySubElements(elResourceList);
}

function emptySubElements(el) {
  Array.from(el?.children).forEach(e => e.remove());
}

function countResourcesOfType(resources) {
  resources.forEach((resource, i) => {
    if (!(resource.type in types)) {
      types[resource.type] = 0;
    }
    types[resource.type] += 1;
  });
}

function renderResourceList(resources) {
  let list = resources.filter((s) => HTTP_URL_REG.test(s.url));
  list.forEach((resource, i) => {
    const li = document.createElement('li');
    li.innerText = `[${i+1}],[type: ${resource.type}], url: ${resource.url}`;
    elResourceList.appendChild(li);
    if (!(resource.type in types)) {
      types[resource.type] = 0;
    }
    types[resource.type] += 1;
  });
}

function renderStatisticSummary(resources) {
  let result = `Resources on this page: 
  total: ${resources.length} \r
  ${Object.entries(types)
    .map((entry) => {
      const [type, count] = entry;
      return `${type}: ${count}`;
    })
    .join('\n')}`;
  let div = document.createElement('div');
  div.innerText = result;
  elStattisticSummary.appendChild(div);
}

function clearTick() {
  clearInterval(ticker);
}

function tickTask() {
  updateStatistics();
}

function tick() {
  ticker = setInterval(() => {
    tickTask();
  }, TICK_INTERVAL);
}

function download() {
  let urlList = resourcesList.filter((s) => HTTP_URL_REG.test(s.url)).map(s => s.url);
  console.log(urlList);
  console.log(JSON.stringify(urlList));
  chrome.devtools.inspectedWindow.eval('console.log("'+urlList.join('\n')+'")');
  let params = {
    urls: urlList
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(getServerAPIHost(`/download`), {
    method: 'post',
    headers,
    body: JSON.stringify(params)
  }).then(res=> {
    console.log('login res=', res);
    res.json().then(data => {
      console.log('data=', data);
    });
  }).catch(e => {
    console.log('login e=', e);
  });
}

function evt() {
  elBtnGet.addEventListener('click', updateStatistics);
  elBtnSave.addEventListener('click', download);
  // elBtnStopRefresh.addEventListener('click', clearTick);
}

function main() {
  evt();
  // tick();
  tickTask();
}

main();