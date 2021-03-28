var dateTimePicker = require('../../utils/dateTimePicker.js');
var app=getApp()
Page({
  data: {
    startTime:{
      dateTimeArray1: null,
      dateTime1: null,
      startYear: 2000,
      endYear: 2050
    },
    endTime:{
      dateTimeArray1: null,
      dateTime1: null,
      startYear: 2000,
      endYear: 2050
    },
    startTimeSelected: null,
    endTimeSelected: null,
    radioItems: [
      {name: 'TG', value: 'TG'},
      {name: 'CG', value: 'CG', },
      {name: 'OG', value: 'OG'},
      {name: 'PG', value: 'PG'},
      {name: 'All', value: 'All',checked: 'true'},
    ],
      radioChosen:'All',
      activityName:'',
      tagsInput:'',
      activityIntro:'',
      activityAddress:'',
      activityTags:[],
  },
  onLoad(){
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var newDate = new Date()
    var startYear = newDate.getFullYear()
    var endYear = startYear+3
    var obj1 = dateTimePicker.dateTimePicker(startYear, endYear);
    // 精确到分的处理，将数组的秒去掉
    obj1.dateTimeArray.pop();
    obj1.dateTime.pop();
    // 生成当前时间
    var nowTime = {
      year: newDate.getFullYear(),
      month: newDate.getMonth()+1,
      day: newDate.getDate(),
      hour:newDate.getHours(),
      minute: newDate.getMinutes()
    }
    this.setData({
     ['startTime.dateTimeArray1']: obj1.dateTimeArray,
     ['endTime.dateTimeArray1']: obj1.dateTimeArray,
     ['startTime.dateTime1']: obj1.dateTime,
     ['endTime.dateTime1']: obj1.dateTime,
     startTimeSelected:nowTime,
     endTimeSelected:nowTime
    })
    // console.log(this.data)
  },

  changeDateTime1(e) {
    if(e.currentTarget.dataset.id=='1'){
      this.setData({ 
        ['startTime.dateTime1']: e.detail.value ,
        startTimeSelected:{
          year:this.data.startTime.dateTimeArray1[0][e.detail.value[0]],
          month:this.data.startTime.dateTimeArray1[1][e.detail.value[1]],
          day:this.data.startTime.dateTimeArray1[2][e.detail.value[2]],
          hour:this.data.startTime.dateTimeArray1[3][e.detail.value[3]],
          minute:this.data.startTime.dateTimeArray1[4][e.detail.value[4]],
        }
      });
    }
    else{
      this.setData({
        ['endTime.dateTime1']: e.detail.value,
        endTimeSelected:{
          year:this.data.endTime.dateTimeArray1[0][e.detail.value[0]],
          month:this.data.endTime.dateTimeArray1[1][e.detail.value[1]],
          day:this.data.endTime.dateTimeArray1[2][e.detail.value[2]],
          hour:this.data.endTime.dateTimeArray1[3][e.detail.value[3]],
          minute:this.data.endTime.dateTimeArray1[4][e.detail.value[4]],
        }
      });
    }
  },
  handleSubmit: function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content:'确定要提交吗',
      success: function(res){
        if(res.confirm){
          that.upLoadInfo()
        }
      }
    })
  },
  upLoadInfo: function(e){
    var that = this
    // 分割标签
    this.splitTags()
    // console.log(this.data.startTime)
    var stime = that.data.startTime
    var etime = that.data.endTime
    let startTime = {
      year: stime.dateTimeArray1[0][stime.dateTime1[0]],
      month: stime.dateTimeArray1[1][stime.dateTime1[1]],
      day: stime.dateTimeArray1[2][stime.dateTime1[2]],
      hour: stime.dateTimeArray1[3][stime.dateTime1[3]],
      minute: stime.dateTimeArray1[4][stime.dateTime1[4]],
    }
    let endTime = {
      year: etime.dateTimeArray1[0][etime.dateTime1[0]],
      month: etime.dateTimeArray1[1][etime.dateTime1[1]],
      day: etime.dateTimeArray1[2][etime.dateTime1[2]],
      hour: etime.dateTimeArray1[3][etime.dateTime1[3]],
      minute: etime.dateTimeArray1[4][etime.dateTime1[4]],
    }
    // 验证提交信息合法性
    var res = that.checkInfo()
    if(res.checked){
      // 上传新发布的活动信息到数据库
      const db =wx.cloud.database()
      db.collection('activity_info').add({
        data:{
          signcode:'00000',
          title:that.data.activityName,
          tags:that.data.activityTags,
          launcher: app.globalData.personalInfo.userName,
          launcher_openid: app.globalData.personalInfo._openid,
          department:that.data.radioChosen,
          detailText:that.data.activityIntro,
          enroller:[],
          participator:[],
          info:{
            startTime: startTime,
            endTime: endTime,
            address:that.data.activityAddress,
            numberOfPeople:0
          },
          isSignUp:true
        },
        success:res=>{
          // console.log(res)
          // app.getPersonalInfo()
          app.getActivity()
          wx.navigateBack({
            delta: 1,
          })
        },
        fail:err=>{
          console.err(err)
        }
      })
    }
    else{
      wx.showToast({
        title: res.content,
        icon: 'none',
        duration: 2000, 
      })
    }
  },
  checkInfo: function(){
    var res = {
      checked: true,
      content: ''
    }
    if(!this.data.activityName){
      res.checked = false
      res.content = '请填写活动名称'
    }
    else if(!this.data.tagsInput){
      res.checked = false
      res.content = '请填写活动标签'
    }
    else if(!this.checkTags(this.data.tagsInput)){
      res.checked = false
      res.content = '标签长度不能大于4'
    }
    else if(!this.data.activityIntro){
      res.checked = false
      res.content = '请填写活动简介'
    }
    else if(!this.data.activityAddress){
      res.checked = false
      res.content = '请填写活动举办地点'
    }
    else if(this.compareTime(this.data.startTimeSelected, this.data.endTimeSelected)>=0){
      res.checked = false
      res.content = '活动结束时间必须晚于开始时间'
    }
    return res
  },
  // 用分钟数比较时间
  compareTime: function(date1, date2){
    var time1 = parseInt(date1.year)*12*31*24*60+parseInt(date1.month)*31*24*60 + parseInt(date1.day)*24*60+parseInt(date1.hour)*60+ parseInt(date1.minute)
    var time2 = parseInt(date2.year)*12*31*24*60+parseInt(date2.month)*31*24*60 + parseInt(date2.day)*24*60+parseInt(date2.hour)*60+ parseInt(date2.minute)
    return (time1 - time2)
  },
  checkTags(tagsString){
    var flag = true
    var list = tagsString.split(' ')
    for(let i=0; i< list.length; i++){
      if(list[i].length>4){
        flag = false
        break
      }
    }
    return flag
  },
  radioChange(e) {
    this.setData({
      radioChosen: e.detail.value
    })
  },
  inputName(e){
    this.setData({
      activityName:e.detail.value
    })
  },
  inputTags(e){
    this.setData({
      tagsInput:e.detail.value
    })
    // console.log(this.data)
  },
  inputIntro(e){
    this.setData({
      activityIntro:e.detail.value
    })
  },
  inputAddress(e){
    this.setData({
      activityAddress:e.detail.value
    })
  },
  splitTags: function(e){
    var str = this.data.tagsInput
    this.setData({
      activityTags:str.split(" ")
    })
    // console.log(this.data)
  },
  onShow:function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('activity_info').where({
    }).count({
      success:function(res){
        that.setData({
          activitycnt:res.total+1
        })
      }
      }
    )
  }
})