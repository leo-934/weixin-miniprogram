// pages/user/user.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backgroundImg: "https://7869-xiaochengxu-7g034yit756a0de1-1304336989.tcb.qcloud.la/background.png?sign=d34ef6d74dc0b9d580491648ab8f105f&t=1610095047",
    portraitSrc:"../data/imgs/png/portrait.png",
    button_choose: 0,
    personalInfo:{
      name:"xxx",
      userName:"小程序好难啊",
      sex:'男',
      department:"TG",
      shenfen:0,
      serial: '',
      activityList: []
    },
    filterOpen:true,
    allActivityList:[],
    cardList: []
  },
  handleClick_button_involve: function(e){
    this.setData({
      button_choose: 0
    })
    this.filterActivity(0)
  },
  handleClick_button_history: function(e){
    this.setData({
      button_choose: 1
    })
    this.filterActivity(1)
  },
  handleClick_button_manage: function(e){
    this.setData({
      button_choose: 2
    })
    this.filterActivity(2)
  },
  // 接口函数：将allActivityList筛选后放入cardList
  filterActivity: function(button_choose){
    console.log('正在筛选活动列表..')
    switch(button_choose){
      case 0:
        var allList = this.data.allActivityList
        var myList = app.globalData.personalInfo.activity
        var filterList = []

        for(let i=0; i<allList.length; i++){
          for(let j=0; j<myList.length; j++){
            if(allList[i]._id == myList[j]){
              filterList.push(allList[i])
            }
          }
        }
        this.setData({
          cardList: filterList
        })
        break
      case 1:
        // console.log(this.data)
        var oriList = this.data.allActivityList
        var resList = []
        var newDate = new Date()
        var nowTime = {
          year: newDate.getFullYear(),
          month: newDate.getMonth()+1,
          day: newDate.getDate(),
          hour:newDate.getHours(),
          minute: newDate.getMinutes()
        }
        for(let i=0; i<oriList.length; i++){       
          if(this.compareTime(oriList[i].info.endTime, nowTime)<0){
            resList.push(oriList[i])
          }
        }
        this.setData({
          cardList: resList
        })
        break
      case 2:
        this.setData({
          cardList: this.filter(this.data.allActivityList, 'launcher_openid', this.data.personalInfo._openid)
        }) 
        break
    }
    console.log('筛选完毕')
  },
  filter: function(activityList, field, value){
    var resList = []
    for(let i=0; i<activityList.length; i++){
      if(activityList[i][field]==value)
      resList.push(activityList[i])
    }
    return resList
  },
  compareTime: function(date1, date2){
    var time1 = parseInt(date1.year)*12*31*24*60+parseInt(date1.month)*31*24*60 + parseInt(date1.day)*24*60+parseInt(date1.hour)*60+ parseInt(date1.minute)
    var time2 = parseInt(date2.year)*12*31*24*60+parseInt(date2.month)*31*24*60 + parseInt(date2.day)*24*60+parseInt(date2.hour)*60+ parseInt(date2.minute)
    return (time1 - time2)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('User页面Load事件..')
    let that = this
    // 把页面引用传给全局变量app中
    app.globalData.pageUser = that
    console.log('已经把页面引用传给全局变量app中')
    that.setData({
      // 获得全局变量中的活动列表
      allActivityList:app.globalData.activityList,
      // 获得全局变量中的个人信息
      personalInfo: app.globalData.personalInfo
    })
    console.log('已更新User页面数据')
    // 接口函数：将allActivityList筛选后放入cardList
    that.filterActivity(that.data.button_choose)
    // console.log('user',this.data)
  },
  updateData: function(){
    console.log('正在更新user页面信息..')
    this.setData({
      allActivityList: app.globalData.activityList,
      personalInfo: app.globalData.personalInfo
    })
    console.log('user页面信息更新完毕')
    this.filterActivity(this.data.button_choose)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
     }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})