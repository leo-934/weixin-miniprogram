// components/activityManage/activityManage.js
// components/activityCard/activityCard.js
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
    activityState: 1,
  },
  pageLifetimes:{
    show:function(){
      this.initInfo()
    }
  },
  ready: function(){
    this.initInfo()
    this.getLoadImg()
    // console.log(this.data.item)
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    initInfo: function(e){
      this.setData({
        isSignUp:this.data.item.isSignUp
      })
      this.getNumberOfSignUp()
    },
    getNumberOfSignUp:function(){
      this.setData({
        numberOfPeople: this.data.item.enroller.length
      })
      // console.log(this.data.numberOfPeople)
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
    handleSignUp: function(e){
      this.data.item.isSignUp = true
      this.setData({
        isSignUp:this.data.item.isSignUp
      })
    },
    handleCancel: function(){
      // console.log("123")
      var that = this
      wx.showModal({
        title: '提示', 
        content: '确定要取消报名吗', 
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            that.data.item.isSignUp = false
            that.setData({
              isSignUp: false
            })
          }
        }
      })
    },
    handleSignIn: function(e){
      console.log("签到成功")
      wx.showModal({
        title: '提示',
        content: '这是一个模态弹窗',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    handleLookover: function(e){
      // console.log(this.data.item)
      wx.navigateTo({
        url: `../../pages/activityDetail/activityDetail?activityInfo=` + JSON.stringify(this.data.item)
      })
    },
    nothing: function(){
      return false
    }
  }
})
