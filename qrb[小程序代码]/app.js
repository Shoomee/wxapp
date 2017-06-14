//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //获取推荐分类
    wx.request({
      url: 'https://qrb.shoomee.cn/qrb_api/getRecClasses', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setStorageSync('serviceClass', res.data.data)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //获取推荐合伙人
    wx.request({
      url: 'https://qrb.shoomee.cn/qrb_api/getRecPartners',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data)
        wx.setStorageSync('recPartners', res.data.data)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    wx.request({
      url: 'https://qrb.shoomee.cn/qrb_api/getCommentTags',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var commentTag = new Array();
        for (var i = 0; i < res.data.data.length; i++) {
          commentTag[res.data.data[i].id] = res.data.data[i]
        }
        commentTag = commentTag.splice(1, commentTag.length)
        wx.setStorageSync('commentTag', commentTag)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //获取评论标签

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (resL) {
          // console.log(resL)
          wx.getUserInfo({
            success: function (res) {
              // console.log(res)
              that.globalData.isLogin = true
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
          if (resL.code) {
            //发起网络请求
            wx.request({
              url: 'https://qrb.shoomee.cn/qrb_api/aesLogin',
              data: {
                code: resL.code
              },
              success: function (res) {
                // console.log(res)
                wx.setStorageSync('isReg', res.data.data.isReg)
                wx.setStorageSync('isMobile', res.data.data.isMobile)
                wx.setStorageSync('sessionKey', res.data.data.sessionKey)
                wx.setStorageSync('userId', res.data.data.userId)
                wx.setStorageSync('mobile', res.data.data.mobile)
              },
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false
  }
})