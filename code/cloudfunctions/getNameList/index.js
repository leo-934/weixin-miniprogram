// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var openidList = event.openidList
  var nameList = []
  var name
  for(let i =0; i<openidList.length; i++){
    record = cloud.database().collection('user_info').where({
      _openid: openidList[i]
    }).field({
      name: true
    }).get()
    nameList.push(name)
  }
  return cloud.database().collection('user_info').where({
    _openid: openidList[0]
  }).field({
    name: true
  }).get()
}