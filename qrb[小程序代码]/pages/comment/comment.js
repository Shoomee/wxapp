var checkbox, checkbox2;
Page({
    data: {
        title: 'comment',
        commentTag: [],
        isChoose: 1,
        isChoose2: 1,
        checkbox: [],
        checkbox2: [],
        commentOrder: {}
    },
    good: function () {
        var that = this
        that.setData({
            isChoose: 1
        })
    },
    bad: function () {
        var that = this
        that.setData({
            isChoose: 0
        })
    },
    good2: function () {
        var that = this
        that.setData({
            isChoose2: 1
        })
    },
    bad2: function () {
        var that = this
        that.setData({
            isChoose2: 0
        })
    },
    onLoad: function () {
        var that = this
        that.setData({
            commentOrder: wx.getStorageSync('commentOrder')
        })
        //获取评论标签
        wx.request({
            url: 'https://qrb.shoomee.cn/qrb_api/getCommentTags',
            data: {
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                // console.log(res.data.data)
                // wx.setStorageSync('commentTag', res.data.data)
                that.setData({
                    commentTag: res.data.data
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    checkboxChange: function (e) {
        // console.log(e.detail.value)
        var that = this
        that.setData({
            checkbox: e.detail.value
        })
    },
    checkboxChange2: function (e) {
        // console.log(e.detail.value)
        var that = this
        that.setData({
            checkbox2: e.detail.value
        })
    },
    createOrder: function () {
        var that = this
        if (that.data.checkbox.length > 0) {
            //合并标签id
            var labelsbox = ''
            for (var i = 0; i < that.data.checkbox.length; i++) {
                labelsbox += that.data.checkbox[i] + ','
            }
            labelsbox = labelsbox.substring(0, labelsbox.length - 1)

            //评论合伙人
            wx.request({
                url: 'https://qrb.shoomee.cn/api/c2pComment',
                data: {
                    order_id: that.data.commentOrder.id,
                    service_user_id: that.data.commentOrder.service_user_id,
                    labels: labelsbox,
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + wx.getStorageSync('token')
                },
                success: function (res) {
                    // console.log(res.data.data)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }
        if (that.data.checkbox2.length > 0) {
            //合并标签id
            var labelsbox2 = ''
            for (var i = 0; i < that.data.checkbox2.length; i++) {
                labelsbox2 += that.data.checkbox2[i] + ','
            }
            labelsbox2 = labelsbox2.substring(0, labelsbox2.length - 1)
            if (that.data.commentOrder.tel_service_id != undefined) {
                //评论客服
                wx.request({
                    url: 'https://qrb.shoomee.cn/api/c2tComment',
                    data: {
                        order_id: that.data.commentOrder.id,
                        tel_service_id: that.data.commentOrder.tel_service_id,
                        labels: labelsbox2,
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/json',
                        'Authorization': 'Bearer ' + wx.getStorageSync('token')
                    },
                    success: function (res) {
                        // console.log(res.data.data)
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            }
        }
        if (that.data.checkbox.length == 0 && that.data.checkbox2.length == 0) {
            wx.showModal({
                title: '提示',
                content: '没有可以提交的!',
                showCancel: false,
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '评价成功!',
                showCancel: false,
                success: function () {
                    wx.switchTab({
                        url: '../orders/orders'
                    })
                }
            })
        }

    }
})