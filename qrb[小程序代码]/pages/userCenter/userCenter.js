var app = getApp()
Page({
    data: {
        title: 'userCenter',
        userInfo: {},
    },
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        that.setData({
            userInfo: app.globalData.userInfo
        })
    },
    toRegister: function () {
        if (app.globalData.userInfo == undefined) {
            wx.showModal({
                title: '提示',
                content: '无法获取微信信息，请稍后再试!',
                showCancel: false
            })
        } else if (wx.getStorageSync('isMobile')) {
            wx.showModal({
                title: '提示',
                content: '您已绑定手机号码!',
                showCancel: false
            })
        } else {
            wx.navigateTo({
                url: '../register/register'
            })
        }

    },
    signOut: function () {
        wx.setStorageSync('token', '')
        wx.setStorageSync('userOrders', [])
        wx.showModal({
            title: '提示',
            content: '注销成功!',
            showCancel: false
        })
    }
})