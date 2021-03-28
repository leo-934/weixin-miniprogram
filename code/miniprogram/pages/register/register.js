// pages/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems:[
      {name:'TG',value:'TG',},
      {name: 'CG', value: 'CG', },
      {name: 'OG', value: 'OG'},
      {name: 'PG', value: 'PG'},
      {name:'无所属',value:'无所属'},
    ],
    sexradioItems:[
      {name:'男',value:'男',},
      {name:'女',value:'女',},
    ],
    name: '',
    userName: '',
    serial: '',
    radioSexChosen: '',
    radioDepChosen: '',
    usercnt:0
  },
  radioDepChange(e) {
    this.setData({
      radioDepChosen: e.detail.value
    })
  },
  radioSexChange(e) {
    this.setData({
      radioSexChosen: e.detail.value
    })
  },
  inputName(e){
    this.setData({
      name:e.detail.value
    })
  },
  inputUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  inputSerial(e){
    this.setData({
      serial:e.detail.value
    })
  },
  checkInfo: function(submitValue){
    var res = {
      checked: true,
      content: ''
    }
    if (!/^[\u4e00-\u9fa5]{2,}$/.test(submitValue.name)){
      res.checked = false,
      res.content = '请输入真实姓名'
    }
    else if(!submitValue.userName){
      res.checked = false,
      res.content = '请输入用户名'
    }
    else if(!/^[0-9]{10}$/.test(submitValue.serial)){
      res.checked = false,
      res.content = '请输入正确学号'
    }
    else if(!submitValue.department){
      res.checked = false,
      res.content = '请选择部门'
    }
    else if(!submitValue.sex){
      res.checked = false,
      res.content = '请选择性别'
    }
    return res
  },
  handleSubmit(e){
    var submitValue = {
      name: this.data.name,
      userName: this.data.userName,
      department: this.data.radioDepChosen,
      sex: this.data.radioSexChosen,
      serial: this.data.serial
    }
    console.log(submitValue)
    var res = this.checkInfo(submitValue)
    if(res.checked){
      var that=this
      const db = wx.cloud.database()
      db.collection('user_info').add({
        data:{
          uid:that.data.usercnt,
          name:that.data.name,
          userName:that.data.userName,
          serial:that.data.serial,
          department:that.data.radioDepChosen,
          sex:that.data.radioSexChosen,
          zhiwei:0,
          authority:0,
          activity:[],
        },
        success:res=>{
          app.globalData.personalInfo = {
            _id: '',
            uid:that.data.usercnt,
            name:that.data.name,
            userName:that.data.userName,
            serial:that.data.serial,
            department:that.data.radioDepChosen,
            sex:that.data.radioSexChosen,
            zhiwei:0,
            authority:0,
            activity:[],
          }
          setTimeout(function(){
            
          },500)
          wx.switchTab({
            url: '../main/main',
          })
        },
        fail:err=>{
          console.err('fail')
        }
      })
    }else{
      wx.showToast({
        title: res.content,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that=this
    const db = wx.cloud.database()
    db.collection('user_info').where({
    }).count({
      success:function(res){
        that.setData({
          usercnt:res.total+1
        })
        console.log(that.data.usercnt)
      }
    })
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
