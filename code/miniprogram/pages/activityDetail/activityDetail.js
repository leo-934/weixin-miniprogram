var dateTimePicker = require('../../utils/dateTimePicker.js');
var app =getApp()
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
      {name: 'All', value: 'All'},
    ],
      radioChosen:'All',
      activityName:'',
      tagsInput:'',
      activityIntro:'',
      activityAddress:'',
      activityTags:[],
      activitysigncode:''
  },
  onLoad(options){
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
    var activityInfo = JSON.parse(options.activityInfo)
    var mapList = {
      'TG': 0,
      'CG': 1,
      'OG': 2,
      'PG': 3,
      'All': 4
    }
    console.log(activityInfo)
    this.setData({
      activityName: activityInfo.tit-le,
      activityTagsString: activityInfo.tags.join(' '),
      radioChosen: activityInfo.department,
      ['radioItems['+mapList[activityInfo.department] +'].checked'] : true,
      activityIntro: activityInfo.detailText,
      activityAddress: activityInfo.info.address,
      activityNumberOfPeople: activityInfo.enroller.length,
      activityNumOfSignIn: activityInfo.participator.length,
      startTimeSelected: activityInfo.info.startTime,
      endTimeSelected: activityInfo.info.endTime,
      activity_id : activityInfo._id,
      activitysigncode:activityInfo.signcode,
      ori_signcode: activityInfo.signcode,
      item: activityInfo
    })
    console.log('初始化',this.data)
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
      content:'确定要修改信息吗',
      success: function(res){
        if(res.confirm){
          that.splitTags()
          // 接口对象
          var interfaceValue = {
            vCode: that.data.activitysigncode,
            name: that.data.activityName,
            tags: that.data.activityTags,
            department: that.data.radioChosen,
            introduction: that.data.activityIntro,
            address: that.data.activityAddress,
            startTime: that.data.startTimeSelected,
            endTime: that.data.endTimeSelected,
            activity_id : that.data.activity_id,
            // signcode: that.data.activitysigncode
          }
          var res = that.checkInfo(interfaceValue)
          if (res.checked){
            console.log('上传更新信息',interfaceValue)
            that.upLoadInfo(interfaceValue)
          }
          else{
            wx.showToast({
              title: res.content,
              icon: 'none'
            })
          }
        }
      }
    })
  },
  // 接口函数 上传修改后提交的信息
  upLoadInfo: function(interfaceValue){
    // 接口对象 interfaceValue
    const db = wx.cloud.database()
    var that = this
    console.log(that.data.activity_id)
    db.collection('activity_info').doc(that.data.activity_id).update({
      data:{
            signcode: that.data.vCode,
            title: that.data.activityName,
            tags: that.data.activityTags,
            department: that.data.radioChosen,
            detailText: that.data.activityIntro,
            info:{
              startTime: that.data.startTimeSelected,
              endTime: that.data.endTimeSelected,
              address: that.data.activityAddress,
            }
      }
    }).then(res=>{
      console.log('更新结果',res)
      wx.showToast({
        title: '修改成功！',
      })
      app.getActivity()
      wx.navigateBack({
        delta: 1,
      })
      
    })


  },
  checkInfo(interfaceValue){
    var res = {
      checked : true,
      content : ''
    }
    console.log(interfaceValue)
    if(interfaceValue.vCode!=this.data.ori_signcode && !/^\d{4}$/.test(interfaceValue.vCode)){
      res.checked = false
      res.content = '请输入4位数字验证码'
    }
    else if(!interfaceValue.name){
      res.checked = false
      res.content = '请填写活动名称'
    }
    else if(!interfaceValue.tags[0]){
      res.checked = false
      res.content = '请填写活动标签'
    }
    else if(!this.checkTags(interfaceValue.tags)){
      res.checked = false
      res.content = '标签长度不能大于4'
    }
    else if(!interfaceValue.introduction){
      res.checked = false
      res.content = '请填写活动简介'
    }
    else if(!interfaceValue.address){
      res.checked = false
      res.content = '请填写活动举办地点'
    }
    else if(this.compareTime(interfaceValue.startTime, interfaceValue.endTime)>=0){
      res.checked = false
      res.content = '活动结束时间必须晚于开始时间'
    }
    // console.log(interfaceValue)
    return res
  },
  checkTags(tags){
    var flag = true
    for(let i=0; i< tags.length; i++){
      if(tags[i].length>4){
        flag = false
        break
      }
    }
    return flag
  },
  // 用分钟数比较时间
  compareTime: function(date1, date2){
    var time1 = parseInt(date1.year)*12*31*24*60+parseInt(date1.month)*31*24*60 + parseInt(date1.day)*24*60+parseInt(date1.hour)*60+ parseInt(date1.minute)
    var time2 = parseInt(date2.year)*12*31*24*60+parseInt(date2.month)*31*24*60 + parseInt(date2.day)*24*60+parseInt(date2.hour)*60+ parseInt(date2.minute)
    return (time1 - time2)
  },
  inputVerCode(e){
    this.setData({
      vCode: e.detail.value
    })
  },
  radioChange(e) {
    this.setData({
      radioChosen: e.detail.value
    })
    console.log(this.data)
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
    var str = this.data.activityTagsString
    this.setData({
      activityTags:str.split(" ")
    })
    // console.log(this.data)
  },
  goToEnroller: function(e){
    console.log('跳转到报名者信息',this.data.item)
    wx.navigateTo({
      url: `../../pages/enrollerInfo/enrollerInfo?activityInfo=` + JSON.stringify(this.data.item)
    })
  },
  goToParticipator: function(e){
    console.log('跳转到签到名单信息')
    wx.navigateTo({
      url: `../../pages/participatorInfo/participatorInfo?activityInfo=` + JSON.stringify(this.data.item)
    })
  }
})
