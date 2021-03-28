// pages/main/main.js
var util = require('../../utils/util')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:"XXX",
    date:"2020 12月25日 星期五",
    todayActivityList:null,
    filterOpen:true,
    chooseId:'0',
    allActivityList: [],
    cardList:[]
  },
  handleFilterChosen: function(e){
      this.setData({filterOpen:!this.data.filterOpen})
  },
  handleFilter: function(e){
    this.setData({
      chooseId:e.currentTarget.dataset.id
    })
    this.filterActivity(this.data.chooseId)
  },
  // 接口函数：将allActivityList筛选后放入cardList
  filterActivity: function(selectMode){
    console.log('准备筛选列表活动..')
    switch(selectMode){
      case "0":
        this.setData({
          cardList: this.data.allActivityList
        })
        break
      case "1":
        this.setData({
          cardList: this.filter(this.data.allActivityList, 'TG')
        })
        break;
      case "2":
        this.setData({
          cardList: this.filter(this.data.allActivityList, 'CG')
        })
        break;
      case "3":
        this.setData({
          cardList: this.filter(this.data.allActivityList, 'OG')
        })
        break;
      case "3":
        this.setData({
          cardList: this.filter(this.data.allActivityList, 'PG')
        })
        break;
    }
    console.log('筛选完毕')
  },
  filter: function(activityList, department){
    var resList = []
    for(let i=0; i<activityList.length; i++){
      if(activityList[i].department==department || activityList[i].department=='All')
      resList.push(activityList[i])
    }
    return resList
  },
  getTodayActivity: function(){
    console.log('准备计算今日活动..')
    var activityList = app.globalData.activityList
    var now = new Date()
    var todayList = []
    for (let i = 0; i < activityList.length; i++) {
      if(parseInt(activityList[i].info.startTime.year) == now.getFullYear() && parseInt(activityList[i].info.startTime.month) == now.getMonth()+1 && parseInt(activityList[i].info.startTime.day) == now.getDate()){
        todayList.push(activityList[i])
      }
    }
    this.setData({
      todayActivityList: todayList
    })
    console.log('今日活动计算完毕')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('Main页面Load事件..')
    var that = this
    // 把页面引用传给全局变量app中
    app.globalData.pageMain = this
    console.log('已经把页面引用传给全局变量app中')
    console.log('得到现在时间')
    console.log('appdata',app.globalData)
    var time = util.getTime(new Date());
    // console.log('app.globalData',app.globalData)
    that.setData({
      date: time,
      // 获得全局变量中的活动列表
      allActivityList:app.globalData.activityList,
      // 获得全局变量中的昵称信息
      name: app.globalData.personalInfo.userName
    })
    // 得到今日的活动
    that.getTodayActivity()
    // 接口函数：将allActivityList筛选后放入cardList
    that.filterActivity(that.data.chooseId)  
    console.log('已更新Main页面数据',this.data)

  },
  updateData:function(data){
    console.log('正在更新Main页面数据..')
    this.setData({
      allActivityList: app.globalData.activityList,
      name: app.globalData.personalInfo.userName
    })
    this.filterActivity(this.data.chooseId)
    this.getTodayActivity()
    console.log('更新Main页面数据完毕')
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
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
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
    console.log('下拉刷新事件，准备重新下载信息')
    app.getActivity()
    app.getPersonalInfo()
    wx.showToast({
      title: '页面更新啦~',
      icon: 'none'
    })
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