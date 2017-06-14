var app = getApp()
var password = null
Page({
    data: {
        windowWidth: 0,
        windoeHeight: 0,
        icon_phone: "../../images/phone.png",
        input_icon: "../../images/input.png",
        icon_password: "../../images/password.png",
    },
    input_password: function (e) {
        password = e.detail.value
    },
    login: function (cb) {
        var that = this
        wx.request({
            url: 'https://qrb.shoomee.cn/oauth/token',
            data: {
                grant_type: 'password',
                client_id: 2,
                client_secret: '2paijmElt4VL01Flrcq7hj63f9GwTV62oS1gp9FL',
                username: wx.getStorageSync('mobile'),
                password: password,
                scope: ''
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                // console.log(res.data.access_token)

                if (res.data.access_token == undefined) {
                    wx.showModal({
                        title: '提示',
                        content: '密码错误!',
                        showCancel: false
                    })
                } else {
                    wx.setStorageSync('token', res.data.access_token)
                    password=''
                    wx.switchTab({
                        url: '../orders/orders'
                    })
                }

            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    toindex: function () {
        wx.switchTab({
            url: '../orders/orders'
        })
    },
    onLoad: function () {
        // console.log(this.data.title)
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    nextButtonWidth: res.windowWidth - 0
                })
            }
        })
    },
    globalData: {
        userInfo: null
    }
})