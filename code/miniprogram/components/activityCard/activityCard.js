// components/activityCard/activityCard.js
var app =getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:{}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isFold:true,
    isSignUp:true,
    numberOfPeople: 0,
    backgroundImageUrl:"https://7869-xiaochengxu-7g034yit756a0de1-1304336989.tcb.qcloud.la/%E5%A1%AB%E5%85%85%E5%9B%BE%E7%89%87/1.png?sign=8c730249d980441773fec32ad31b8140&t=1609947822",
    /*
      activityState
      0: 当前时间在活动开始时间前
      1：当前时间在活动开始时间后，结束时间前
      2：当前时间在活动结束后
    */
    activityState: 0,
  },
  pageLifetimes:{
    show:function(){
      this.initInfo()
    }
  },
  ready: function(){
    this.initInfo()
    this.getLoadImg()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 组件初始化函数 不要动
    initInfo: function(e){
      // 获取报名状态 待完善 先用本地的数据代替
      // console.log(this.data)
      this.getIsSignUp()
      // 获取签到状态 待完善
      this.getIsSignIn()
      // 获取活动时间状态
      this.getActivityState()
      // 获取报名人数
      this.getNumberOfSignUp()
      // console.log(this.data.activityState)
    },
    // 接口函数 判断该用户是否报名 通过本地的全局变量app.global.activityList.enroller 判断
    getIsSignUp: function(e){
      // 先用本地数据替代 写好后删掉
      // console.log('card',this.data)
      var find = false
      for(let i=0; i<this.data.item.enroller.length; i++){
        if(this.data.item.enroller[i]==app.globalData.openid){
          find = true
          break
        }
      }
      // console.log(find)
      this.setData({
        isSignUp:find
      })
    },
    // 接口函数 判断该用户是否签到 通过本地的全局变量app.global.activityList.paticipator 判断
    getIsSignIn: function(e){
      // console.log(this.data)
      var find = false
      for(let i=0; i<this.data.item.participator.length; i++){
        if(this.data.item.participator[i]==app.globalData.openid){
          find = true
          break
        }
      }
      this.setData({
        isSignIn:find
      })
    },
    getNumberOfSignUp:function(){
      this.setData({
        numberOfPeople: this.data.item.enroller.length
      })
      // console.log(this.data.numberOfPeople)
    },
    // 将报名信息上传 同时更新app里的活动列表
    handleSignUp: function(e){
      var that = this
      wx.showModal({
        title:'提示',
        content: '确定要报名该活动吗',
        success: function (res) {
          if (res.confirm) {//确定
            // 将报名的消息上传
            var activity_id = that.data.item._id
            var my_openid = app.globalData.personalInfo._openid
            // console.log(activity_id, my_openid)
            const db = wx.cloud.database()
            // 先查询是否已经报名
            db.collection('activity_info').doc(activity_id).get({
              success: res=>{
                console.log('查询成功')
                var enroller_online = res.data.enroller
                var find = false
                for(let i=0; i<enroller_online.length; i++){
                  if(enroller_online[i] == my_openid){
                    find = true
                    break
                  }
                }
                // console.log(find)
                if(find){ //已经报过名了
                  wx.showToast({
                    title: '您已经报过名了',
                    icon: 'none'
                  })
                }
                else{ //没有报过名 上传数据
                  console.log('查找成功')
                  enroller_online.push(my_openid)
                  var newEnroller = enroller_online
                  // console.log(newEnroller)
                  wx.cloud.callFunction({
                    name:'updateSignUp',
                    data:{
                      collection: 'activity_info',
                      id: activity_id,
                      myData: newEnroller,
                    },
                    success: res=>{
                      // console.log('报名成功',res)
                      console.log('报名成功')
                      that.setData({
                        isSignUp: true,
                        numberOfPeople: that.data.numberOfPeople+1
                      })
                      // 获取user_info表里的个人信息的activity字段
                      var my_id = app.globalData.personalInfo._id
                      const ndb = wx.cloud.database()
                      ndb.collection('user_info').doc(my_id).field({
                        activity: true
                      }).get({
                        success: res=>{
                          console.log('获得个人信息成功')
                          var personActivity = res.data.activity
                          personActivity.push(activity_id)
                          // console.log(activity_id)
                          // console.log(my_id)
                          // console.log(personActivity)
                          wx.cloud.callFunction({
                            name:'updatePersonActivity',
                            data:{
                              collection: 'user_info',
                              id: my_id,
                              myData: personActivity
                            },
                            success: res=>{
                              wx.showToast({
                                title: '报名成功',
                                icon:'none'
                              })
                              console.log('上传个人信息成功')
                              app.getPersonalInfo()
                              app.getActivity()
                              // console.log('app更新~')
                              // console.log('上传成功',res)
                            },
                            fail: err=>{
                              wx.showToast({
                                title: '网络错误，上传报名信息失败',
                                icon:'none'
                              })
                              // console.error('上传失败')
                            }
                          })
                          // console.log(personActivity)
                        },
                        fail: err=>{
                          wx.showToast({
                            title: '网络错误，个人信息添加失败',
                            icon:'none'
                          })
                          // console.error('网络错误，添加到个人信息失败')
                        }
                      })
                    },
                    fail: err=>{
                      console.error(err)
                    }
                  })
                }
              },
              fail: err=>{
                wx.showToast({
                  title: '网络错误：获取报名信息失败',
                  icon:'none'
                })
                // console.error('网络错误，获取报名信息失败')
              }
            })
          }
        }
      })

    },
    // 将取消报名信息上传 同时更新app里的活动列表
    handleCancel: function(){
      var that = this
      wx.showModal({
        title:'提示',
        content: '确定要取消报名该活动吗',
        success: function (res) {
          if (res.confirm) {//确定
            // 将取消报名的消息上传
            var activity_id = that.data.item._id
            var my_openid = app.globalData.personalInfo._openid
            // console.log(activity_id, my_openid)
            const db = wx.cloud.database()
            // 先查询是否已经报名
            db.collection('activity_info').doc(activity_id).get({
              success: res=>{
                var enroller_online = res.data.enroller
                var find = false
                var mark
                for(let i=0; i<enroller_online.length; i++){
                  if(enroller_online[i] == my_openid){
                    mark = i
                    find = true
                    break
                  }
                }
                // console.log(find)
                if(!find){ //没有报过名
                  wx.showToast({
                    title: '您尚未报名',
                    icon: 'none'
                  })
                }
                else{ //报过名 上传数据
                  enroller_online.splice(mark, 1)
                  // console.log(enroller_online)
                  var newEnroller = enroller_online
                  wx.cloud.callFunction({
                    name:'updateSignUp',
                    data:{
                      collection: 'activity_info',
                      id: activity_id,
                      myData: newEnroller
                    },
                    success: res=>{
                      // console.log('取消报名成功',res)
                      that.setData({
                        isSignUp: false,
                        numberOfPeople: that.data.numberOfPeople-1
                      })
                       // 获取user_info表里的个人信息的activity字段
                       var my_id = app.globalData.personalInfo._id
                       const ndb = wx.cloud.database()
                       ndb.collection('user_info').doc(my_id).field({
                         activity: true
                       }).get({
                         success: res=>{
                           var personActivity = res.data.activity
                           for(let i=0; i<personActivity.length; i++){
                             if(personActivity[i] == activity_id){
                               personActivity.splice(i, 1)
                               break
                              }
                            }
                            // console.log()

                           wx.cloud.callFunction({
                             name:'updatePersonActivity',
                             data:{
                               collection: 'user_info',
                               id: my_id,
                               myData: personActivity
                             },
                             success: res=>{
                              wx.showToast({
                                title: '取消报名成功',
                                icon:'none'
                              })
                              app.getPersonalInfo()
                              app.getActivity()
                              // console.log('app更新~')
                              //  console.log('上传成功',res)
                             },
                             fail: err=>{
                              wx.showToast({
                                title: '上传失败',
                                icon:'none'
                              })
                              //  console.error('上传失败')
                             }
                           })
                           // console.log(personActivity)
                         },
                         fail: err=>{
                          wx.showToast({
                            title: '网络错误:个人信息添加失败',
                            icon:'none'
                          })
                          //  console.error('网络错误，添加到个人信息失败')
                         }
                       })
                    },
                    fail: err=>{
                      console.error(err)
                    }
                  })
                }
              },
              fail: err=>{
                console.error('网络错误，获取报名信息失败')
              }
            })
          }
        }
      })
    },
    // 跳转到签到页面
    handleSignIn: function(e){
      wx.navigateTo({
        url: `../../pages/signIn/signIn?activityInfo=` + JSON.stringify(this.data.item)
      })
    },
    // 下面是本地处理函数 不涉及数据库
    getActivityState: function(e){
      var state = 2
      var nowTime_std = new Date()
      var nowTime = {
        year : nowTime_std.getFullYear(),
        month: nowTime_std.getMonth()+1,
        day : nowTime_std.getDate(),
        hour : nowTime_std.getHours(),
        minute : nowTime_std.getMinutes()
      }
      if(this.compareTime(nowTime, this.data.item.info.startTime)<0){
        state = 0
      }
      else if(this.compareTime(nowTime, this.data.item.info.endTime)<0){
        state = 1
      }
      else{
        state = 2
      }
      this.setData({
        activityState: state
      })
    },
    // 用分钟数比较时间
    compareTime: function(date1, date2){
      var time1 = parseInt(date1.year)*12*31*24*60+parseInt(date1.month)*31*24*60 + parseInt(date1.day)*24*60+parseInt(date1.hour)*60+ parseInt(date1.minute)
      var time2 = parseInt(date2.year)*12*31*24*60+parseInt(date2.month)*31*24*60 + parseInt(date2.day)*24*60+parseInt(date2.hour)*60+ parseInt(date2.minute)
      return (time1 - time2)
    },
    getLoadImg: function(e){
      let that = this
      var index = this.data.index
      index = index % 9 + 1
      var imgfileID = 'cloud://xiaochengxu-7g034yit756a0de1.7869-xiaochengxu-7g034yit756a0de1-1304336989/填充图片/'+index+'.png'
      wx.cloud.downloadFile({
        fileID: imgfileID, // 文件 ID
        success: res => {
          // 返回临时文件路径
          that.setData({
            backgroundImageUrl:res.tempFilePath
          })
          // console.log(res.tempFilePath)
        },
        fail:err=>{
          console.error('获取填充图片失败',err)
        } 
      })
    },
    handleFold: function(e){
      this.setData({
        isFold:!this.data.isFold
      })
    },
    nothing: function(){
      return false
    }
  }
})
