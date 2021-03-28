// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: '凌晨5点还在debug',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showButton: false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
  }
  app.getOpenid()
  var that = this
  setTimeout(function(){
    that.setData({
      showButton: true
    })
  }, 1000)
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    const db = wx.cloud.database()
    db.collection('user_info').field({
      _openid:true,
      name: true,
      userName: true,
      department: true,
      serial: true,
      zhiwei: true,
      sex: true,
      authority: true,
      activity: true,
      _id: true
    })
    .where({
      _openid: app.globalData.openid,
    })
    .get({
      success: res=>{
        if(res.data.length>0 && res.data[0]._openid == app.globalData.openid){
          console.log('已经注册')
          app.globalData.personalInfo = res.data[0]
          console.log('login:app.globalData',app.globalData)
          // console.log(res.data[0])
          this.handleJump()
        }
        else{
          console.log('未注册用户')
          wx.navigateTo({
            url: '../register/register',
          })
        }
      }
    })
    // 自动跳转
    // if(this.data.hasUserInfo){
    //   this.handleJump()
    // }
  },
  handleJump:function(e){
    wx.switchTab({
      url: '../main/main',
    }) 
  }
})
