const shareLogo = require('./shareLogo.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getShareInfo = (opts) => {
  return {
    onShareAppMessage: () => {
      let title = opts && opts.title ? opts.title : 'WX-RUI小程序示例';
      let path = opts && opts.path ? opts.path : '/pages/index/index';
      let imageUrl = opts && opts.imageUrl ? opts.imageUrl : shareLogo[Math.floor(Math.random() * shareLogo.length)];
      return {
        title: title,
        path: path,
        imageUrl: imageUrl
      }
    }
  }
}
module.exports = {
  getShareInfo: getShareInfo
};
