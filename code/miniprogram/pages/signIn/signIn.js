// pages/signIn/signIn.js
var app= getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verCode:null,
    participated:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    var activityInfo = JSON.parse(options.activityInfo)
    this.setData({
      activityName: activityInfo.title,
      activityTagsString: activityInfo.tags.join(' '),
      activityDepartment: activityInfo.department,
      activityIntro: activityInfo.detailText,
      activityAddress: activityInfo.info.address,
      activityNumberOfPeople: activityInfo.enroller.length,
      activity_id: activityInfo._id,
    })
    console.log(this.data)
  },
  // 接口函数 待完善 成功返回true 失败返回false
  verify: function(interfaceValue){
    console.log(interfaceValue)
    const db = wx.cloud.database()
    db.collection('activity_info').doc(interfaceValue.activity_id).field({
        signcode:true,
    }).get({
      success: res=>{
        if(interfaceValue.verCode == res.data.signcode){
          console.log('验证成功')
          this.wait(interfaceValue.activity_id)
        }
        else{
          console.log('签到码错误')
          this.signInFail()
        }
      },
      fail: err=>{
        console.error('网络错误')
      }
    })
  },
  wait:function(activity_id){
    var that = this
    const db = wx.cloud.database()
    db.collection('activity_info').doc(activity_id).field({
        title:true,
        participator:true,
    }).get({
      success:res=>{
        console.log(res)
        let renyuan = res.data.participator
        that.data.participated = renyuan
        that.data.participated.push(app.globalData.openid)
        console.log(activity_id, that.data.participated)
        that.upLoadSignIn(activity_id, that.data.participated)
      },
      fail: err=>{
        this.signInFail()
        console.error(err)
      }
    })
  },
  // 上传签到成功信息 待完善 同时更新app活动列表
  upLoadSignIn:function(activity_id, participated){
    wx.cloud.callFunction({
      name:'updateValue',
      data:{
        collection: 'activity_info',
        id: activity_id,
        myData: participated
      },
      success: res=>{
        // console.log(res)
        this.singInSuccess()
        app.getActivity()
      },
      fail: err=>{
        console.error(err)
      }
    })
  },

  handleSignIn: function(e){
    var interfaceValue = {
      activity_id : this.data.activity_id,
      verCode : this.data.verCode
    }
    var check = this.checkInfo(interfaceValue)
    if(check){
      // 接口函数verify 接口对象 interfaceValue
      this.verify(interfaceValue)
    }else{
      wx.showToast({
        title: '请输入四位签到码',
        icon: 'none'
      })
    }
  },
  singInSuccess: function(){
    // 上传签到成功信息
    //this.upLoadSignIn()
    wx.showToast({
      title: '签到成功！',
      icon:'success',
      duration: 1000
    })
    setTimeout(function(){
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
    app.getActivity()
  },
  signInFail:function(){
    wx.showToast({
      title: '验证码错误',
      icon: "none",
      duration: 1000
    })
  },
  upLoadFail: function(){
    wx.showToast({
      title: '网络错误',
      icon: "none",
      duration: 1000
    })
    setTimeout(function(){
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  },
  checkInfo: function(interfaceValue){
    return /^\d{4}$/.test(interfaceValue.verCode)
  },
  inputVerCode:function(e){
    this.setData({
      verCode:e.detail.value
    })
  },
})