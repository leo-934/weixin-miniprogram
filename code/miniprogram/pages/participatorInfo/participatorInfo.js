// miniprogram/pages/enrollerInfo/enrollerInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activityInfo = JSON.parse(options.activityInfo)
    this.getNameList(activityInfo.participator)
  },
  getNameList:function(openidList){
    var that = this
    var nameList = []
    var recordList
    const db = wx.cloud.database()
    db.collection('user_info').field({
      name: true,
      _openid: true
    }).get({
      success: res=>{
        console.log('res',res.data)
        recordList = res.data
        for(let i =0; i<recordList.length; i++){
          for(let j=0; j<openidList.length; j++){
            if(recordList[i]._openid==openidList[j]){
              nameList.push(recordList[i].name)
              break
            }
          }
        }
        that.setData({
          nameList:nameList
        })
        console.log(nameList)
        console.log('当前data',that.data)
      }
    })
    // wx.cloud.callFunction({
    //   name:'getNameList',
    //   data:{
    //     openidList: openidList
    //   },
    //   success: res=>{
    //     console.log('获得信息成功',res)
    //   }
    // })
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