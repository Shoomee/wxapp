var app = getApp()

Page({
    data: {
        title: 'orders',
        isShow: false,
        isEmpty: true,
        orderStatus: ['待分配', '已分配未接受', '已分配已接受', '分配未成功', '订单已完成', '已关闭', '已关闭'],
        userOrders: [],
        windowHeight: 0,//获取屏幕高度  
        refreshHeight: 0,//获取高度  
        refreshing: false,//是否在刷新中  
        refreshAnimation: {}, //加载更多旋转动画数据  
        clientY: 0,//触摸时Y轴坐标 
        start: 1
    },
    tologin: function () {
        if (wx.getStorageSync('mobile') == '') {
            wx.showModal({
                title: '提示',
                content: '请先进入我的页面，进行手机认证!',
                showCancel: false
            })
        } else {
            wx.redirectTo({
                url: '../login/login'
            })
        }

    },
    toComment: function (e) {
        var that = this
        if (that.data.userOrders[e.currentTarget.dataset.oid].status != 4) {
            wx.showModal({
                title: '提示',
                content: '订单未完成，不能评价!',
                showCancel: false
            })
        } else {
            if (that.data.userOrders[e.currentTarget.dataset.oid].order_comment != undefined) {
                if (that.data.userOrders[e.currentTarget.dataset.oid].order_comment.c2t_labels != undefined && that.data.userOrders[e.currentTarget.dataset.oid].order_comment.c2p_labels != undefined) {
                    wx.showModal({
                        title: '提示',
                        content: '订单已完成评价!',
                        showCancel: false
                    })
                } else {
                    wx.setStorageSync('commentOrder', that.data.userOrders[e.currentTarget.dataset.oid])
                    wx.navigateTo({
                        url: '../comment/comment'
                    })
                }
            } else {
                wx.setStorageSync('commentOrder', that.data.userOrders[e.currentTarget.dataset.oid])
                wx.navigateTo({
                    url: '../comment/comment'
                })
            }


        }



    },
    onLoad: function () {
        var that = this;
        //获取屏幕高度  
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
                // console.log("屏幕高度: " + res.windowHeight)
            }
        })

        if (app.globalData.isLogin === false || wx.getStorageSync('token') === undefined || wx.getStorageSync('token') === '') {
            that.setData({
                isShow: false
            })

        } else if (app.globalData.isLogin === true && wx.getStorageSync('token') !== undefined && wx.getStorageSync('token') !== '') {
            //  console.log(wx.getStorageSync('token'))
            that.setData({
                isShow: true
            })
            //获取订单
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
                        // console.log(res.data.data.data);
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
        }
        // console.log(this.data.title)
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
    onShow: function () {
        var that = this;
        //获取屏幕高度  
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
                // console.log("屏幕高度: " + res.windowHeight)
            }
        })
        if (app.globalData.isLogin === false || wx.getStorageSync('token') === undefined || wx.getStorageSync('token') === '') {
            that.setData({
                isShow: false
            })

        } else if (app.globalData.isLogin === true && wx.getStorageSync('token') !== undefined && wx.getStorageSync('token') !== '') {
            //  console.log(wx.getStorageSync('token'))
            that.setData({
                isShow: true
            })
            //获取订单
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
                        // console.log(res.data.data.data);
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
        }
        // console.log(this.data.title)
    },


    /***************************************************************************************/
    scroll: function () {
        // console.log("滑动了...")
    },
    lower: function () {
        var that = this;
        var start = that.data.start;
        start += 1;
        that.setData({
            start: start
        })
        // console.log("加载了..." + start)
        wx.request({
            url: 'https://qrb.shoomee.cn/api/getCompanyUserOrders?page=' + start,
            data: {
                is_close: 0
            },
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            complete: function (res) {
                if (res.data.result == 'success') {
                    // console.log(res.data)
                    var userOrders = that.data.userOrders.concat(res.data.data.data);
                    that.setData({
                        userOrders: userOrders
                    })
                }
            }
        })
    },
    upper: function () {
        // console.log("下拉了....")
        //获取用户Y轴下拉的位移  
        if (this.data.refreshing) return;
        this.setData({ refreshing: true });
        updateRefreshIcon.call(this);
        var that = this;

        var start = 1;
        that.setData({
            start: start
        })

        var i = Math.random() //获得0-1的随机数  
        i = Math.ceil(i * 10) //乘以10并向上去整  

        wx.request({
            url: 'https://qrb.shoomee.cn/api/getCompanyUserOrders',
            data: {
                is_close: 0
            },
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },

            complete: function (res) {
                if (res.data.result == 'success') {
                    setTimeout(function () {
                        that.setData({
                            userOrders: res.data.data.data
                        })
                    }, 2000)
                }
                setTimeout(function () {
                    that.setData({
                        refreshing: false
                    })
                }, 2500)
            }
        })

    }
})

/** 
 * 旋转上拉加载图标 
 */
function updateRefreshIcon() {
    var deg = 0;
    var that = this;
    // console.log('旋转开始了.....')
    var animation = wx.createAnimation({
        duration: 1000
    });

    var timer = setInterval(function () {
        if (!that.data.refreshing)
            clearInterval(timer);
        animation.rotateZ(deg).step();//在Z轴旋转一个deg角度  
        deg += 360;
        that.setData({
            refreshAnimation: animation.export()
        })
    }, 1000);
} 