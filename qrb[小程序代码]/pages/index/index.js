//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '企人宝',
    userInfo: {},
    movies: [
      { url: '/images/企业内训.jpg' ,mobile: '051482980269' },
      { url: '/images/户外拓展.jpg' ,mobile: '051482980269' },
    ],
    serviceClass: [],
    buildingSliders:[],
    recPartners:[]
  },
  callPartner: function (e) {
        if (e.currentTarget.dataset.phone == undefined) {
            wx.showModal({
                title: '提示',
                content: '未知号码!',
                showCancel: false
            })
        } else {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
            })
        }
    },
  //事件处理函数
  toSearch: function (e) {
    // console.log(e.currentTarget.dataset.name)
    wx.setStorageSync('searchValue', e.currentTarget.dataset.name)
    wx.navigateTo({
      url: '../partnerLists/partnerLists'
    })
  },
  toScroll: function () {
    wx.navigateTo({
      url: '../scroll/scroll'
    })
  },
  toQuestion: function () {
    wx.navigateTo({
      url: '../question/question'
    })
  },
  bindViewTapInfo: function (e) {
    // console.log(e.currentTarget.dataset.pid)
        wx.navigateTo({
            url: '../partnerInfo/partnerInfo?id=' + e.currentTarget.dataset.pid
        })
  },
  bindViewTap: function () {
    
        wx.navigateTo({
            url: '../search/search'
        })
  },
  onLoad: function () {
    // console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    that.setData({
      serviceClass: wx.getStorageSync('serviceClass')
    })
    that.setData({
      buildingSliders: wx.getStorageSync('buildingSliders')
    })
    that.setData({
      recPartners: wx.getStorageSync('recPartners')
    })
  }
})
