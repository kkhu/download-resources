
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let resources = [];
let count = 0;

const downloadFile = async (fileUrl) => {
  try {
    // 解析URL，获取路径部分
    const url = new URL(fileUrl);

    // 构建存储目录
    const downloadPath = path.join(__dirname, 'downloads', url.hostname + url.pathname);

    let savePath = downloadPath;

    if (/\/$/.test(savePath)) {
      savePath += 'index.html'
    }

    const dirName = path.dirname(savePath);

    // 确保目录存在
    await fs.promises.mkdir(dirName, { recursive: true });

    // 发起HTTP请求下载文件
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
    });

    // 创建可写流并保存文件
    const outputStream = fs.createWriteStream(downloadPath);
    response.data.pipe(outputStream);

    return new Promise((resolve, reject) => {
      outputStream.on('finish', () => resolve(downloadPath));
      outputStream.on('error', reject);
    });
  } catch (error) {
    console.error('下载文件时出错:', error);
    throw error;
  }
};

function downloadFiles(resources) {
  let fileUrl = '';
  count = 0;
  resources.forEach(async (file) => {
    fileUrl = file;
    await downloadFile(fileUrl)
      .then((filePath) => {
        count++;
        console.log(`${count},文件成功下载到: ${filePath}`);
      })
      .catch((error) => {
        console.error('下载文件失败:', error);
      });
  });
  console.log('Total Files=', resources, '  successfully download=', count);
}

function main() {
  console.log('total resource=', resources.length);
  downloadFiles(resources);
}

module.exports = {
  downloadFiles
}