// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('activity_info').field({
    department:true,
    enroller:true,
    detailText:true,
    title:true,
    launcher:true,
    launcher_openid: true,
    participator:true,
    signcode:true,
    tags:true,
    info:true,
    isSignUp:true,
    _id: true
  }).orderBy('info.startTime.year','asc')
  .orderBy('info.startTime.month','asc')
  .orderBy('info.startTime.day','asc')
  .orderBy('info.startTime.hour','asc')
  .orderBy('info.startTime.minute','asc')
  .get()
}