Page({
    data: {
        title: 'partnerInfo',
        partnerInfo: {},
        isShow: false
    },
    createOrder: function (e) {
        var that = this
        wx.showModal({
            title: '提示',
            content: '请确认创建该订单',
            success: function (res) {
                if (res.confirm) {
                    if (wx.getStorageSync('token') != undefined && wx.getStorageSync('token') != '') {
                        //企业主创建订单
                        wx.request({
                            url: 'https://qrb.shoomee.cn/api/createOrder',
                            data: {
                                team_id: e.currentTarget.dataset.tid,
                                partner_user_id: e.currentTarget.dataset.ptid,
                                name: wx.getStorageSync('searchValue')
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': 'Bearer ' + wx.getStorageSync('token')
                            },
                            success: function (res) {
                                //重新获取订单
                                wx.request({
                                    url: 'https://qrb.shoomee.cn/api/getCompanyUserOrders',
                                    data: {
                                        is_close: 0
                                    },
                                    header: {
                                        'content-type': 'application/json',
                                        'Authorization': 'Bearer ' + wx.getStorageSync('token')
                                    },
                                    success: function (res) {
                                        // console.log(res.data)
                                        if (res.data.result == 'success') {
                                            wx.setStorageSync('userOrders', res.data.data.data)
                                            that.setData({
                                                isEmpty: false,
                                                userOrders: res.data.data.data
                                            })
                                        } else {
                                            that.setData({
                                                isEmpty: true
                                            })
                                        }
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                                wx.showModal({
                                    title: '提示',
                                    content: '创建成功!',
                                    showCancel: false,
                                    success: function () {
                                        wx.switchTab({
                                            url: '../orders/orders'
                                        })
                                    }
                                })

                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '未登录',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            wx.hideToast()
                        }, 2000)

                    }
                }
            }
        })
        // console.log(e.currentTarget.dataset.tid)

    },
    onLoad: function (option) {
        // console.log(option)
        // console.log(this.data.title)
        var that = this
        //获取推荐合伙人
        wx.request({
            url: 'https://qrb.shoomee.cn/qrb_api/getPartner',
            data: {
                user_id: option.id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                // console.log(res.data.data[0])
                //拆解分类字符串
                var commentTag = wx.getStorageSync('commentTag')
                var strLength = res.data.data[0].team.vr_words.length
                res.data.data[0].team.vr_words = res.data.data[0].team.vr_words.substring(1, strLength - 1).split('][');
                //整理评论
                var recommend = new Array();
                for (var i = 0; i < res.data.data[0].team.order.length; i++) {
                    if (res.data.data[0].team.order[i].order_comment != null) {
                        if (res.data.data[0].team.order[i].order_comment.c2p_labels != null) {
                            var commentArr = res.data.data[0].team.order[i].order_comment.c2p_labels.split(',')
                            var commentLables = ''
                            for (var j = 0; j < commentArr.length; j++) {
                                if (commentArr[j] > 0) {//为空会报错
                                    commentLables += commentTag[commentArr[j]].content + ','
                                }
                            }
                            commentLables = commentLables.substring(0, commentLables.length - 1)
                            recommend[i] = {
                                avatar: res.data.data[0].team.order[i].company_user.user_info.avatar,
                                name: res.data.data[0].team.order[i].company_user.name,
                                time: res.data.data[0].team.order[i].order_comment.c2p_at,
                                content: commentLables,
                            }
                        }
                    }
                }
                if (recommend.length == 0) {
                    that.setData({
                        isShow: true
                    })
                }
                res.data.data[0].recommend = recommend
                that.setData({
                    partnerInfo: res.data.data[0]
                })
                // console.log(res.data.data[0])
            },
            fail: function (res) {
                console.log(res)
            }
        })
    }
})