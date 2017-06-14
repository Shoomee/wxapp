var name = null, mobile = null, question = null
Page({
    data: {
        windowWidth: 0,
        windoeHeight: 0,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                })
            }
        })
    },
    input_name: function (e) {
        name = e.detail.value
    },
    input_mobile: function (e) {
        mobile = e.detail.value
    },
    input_question: function (e) {
        question = e.detail.value
    },
    subQuestion: function (e) {
        // console.log(name + '/' + mobile + '/' + question)
        //获取订单
        wx.request({
            url: 'https://qrb.shoomee.cn/qrb_api/createQuestion',
            data: {
                name: name,
                contact: mobile,
                description: question,
                device: 'wx_sapp'
            },
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data.result == 'success') {
                    wx.showModal({
                        title: '提示',
                        content: '提交成功，请保持联系方式畅通!',
                        showCancel: false,
                        success: function () {
                            wx.switchTab({
                                url: '../index/index'
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.data,
                        showCancel: false,
                    })
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
    }
})