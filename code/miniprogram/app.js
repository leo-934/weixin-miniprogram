//app.js
App({
  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        var openid = res.result.openid
        this.globalData.openid=openid
        console.log("We have got this shit id:" + openid)
      }
    })
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'xiaochengxu-7g034yit756a0de1',
        traceUser: true,
      })
    }
    // console.log('app has launched')
    this.getActivity()
    //this.globalData = {}
  },
  globalData:{
    activityList:[],
    openid:null,
    personalInfo: null,
    pageMain:null,
    pageUser:null,
    pageTabbar:null
  },
  getActivity:function(){
    console.log('准备从数据库下载活动信息列表')
    var that = this
    wx.cloud.callFunction({
      name:'getActivity',
      success(res){
        that.globalData.activityList = res.result.data
        console.log('云函数调用成功，活动信息列表：',res.result.data)
        if(that.globalData.pageMain){
          console.log('准备更新Main页面信息..')
          that.globalData.pageMain.updateData()
        }
        if(that.globalData.pageUser){
          console.log('准备更新User页面信息..')
          that.globalData.pageUser.updateData()
        }
        // if(that.globalData.pageTabbar){
        //   that.globalData.pageTabbar.data.authority = that.globalData.personalInfo.authority
        // }
        console.log('下载更新任务完成，现在App中全局变量：',that.globalData)
      },
      fial(err){
        console.log('云函数调用失败',err)
      }
    })
    if(that.globalData.pageTabbar && that.globalData.pageTabbar.data.authority!=0){
      console.log('检测到用户权限不为0，开启Tabbar的发布接口')
      that.globalData.pageTabbar.data.authority = that.globalData.personalInfo.authority
    }
  },
getPersonalInfo: function(){
  console.log('准备从数据库下载个人信息')
  var that = this
  // console.log(that.globalData.personalInfo._id)
  wx.cloud.callFunction({
    name:'getPersonalInfo',
    data: {
      id:  that.globalData.personalInfo._id,
    },
    success(res){
      // console.log('云函数调用成功，返回值：', res.result.data)
      that.globalData.personalInfo = res.result.data
      console.log('云函数调用成功，个人信息：',res.result.data)
      // that.globalData.activityList = res.result.data
      if(that.globalData.pageMain){
        that.globalData.pageMain.updateData()
      }
      if(that.globalData.pageUser){
        that.globalData.pageUser.updateData()
      }
      console.log('下载更新任务完成，现在App中全局变量：',that.globalData)
    },
    fial(err){
      console.log('云函数调用失败',err)
    }
  })
}
})
