var app = getApp()
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/main/main",
      iconPath: "../pages/data/imgs/icon/suqare.svg",
      selectedIconPath: "../pages/data/imgs/icon/suqare_s.svg",
    }, {
      pagePath: "/pages/user/user",
      iconPath: "../pages/data/imgs/icon/user.svg",
      selectedIconPath: "../pages/data/imgs/icon/user_s.svg",
    }],
    lauchImg:"../pages/data/imgs/icon/lauch2.svg"
  },
  attached() {
    // 把页面引用传给全局变量app中
    app.globalData.pageTabbar = this
    var authority = 0
    var info = app.globalData.personalInfo
    if(info){
      authority = info.authority
    }
    if(!this.authority || this.authority==0){
      this.setData({
        authority: authority
      })
    }
  },
  created(){
    // 把页面引用传给全局变量app中
    app.globalData.pageTabbar = this
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // console.log(url)
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
      this.updateData()
    },
    handleLauch(e){
      // console.log("123")
      wx.navigateTo({
        url: '/pages/lauchActivity/lauchActivity'
      })
    },
    updateData(){
      var authority = 0
      var info = app.globalData.personalInfo
      if(info){
        authority = info.authority
      }
      this.setData({
        authority: authority
      })
    }
  }
})