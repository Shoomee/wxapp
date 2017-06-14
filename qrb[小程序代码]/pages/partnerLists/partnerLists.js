Page({
    data: {
        title: 'partnerLists',
        searchValue: '',
        partnerLists: [],
        isShow: false,
        userId: 0
    },
    bindViewTap: function (e) {
        // console.log(e.currentTarget.dataset.pid)
        wx.navigateTo({
            url: '../partnerInfo/partnerInfo?id=' + e.currentTarget.dataset.pid
        })
    },
    onLoad: function () {
        var that = this
        that.setData({
            searchValue: wx.getStorageSync('searchValue')
        })
        if (wx.getStorageSync('userId') != undefined) {
            that.setData({
                userId : wx.getStorageSync('userId')
            })
        }
        wx.request({
            url: 'https://qrb.shoomee.cn//qrb_api/searchPartner', //仅为示例，并非真实的接口地址
            data: {
                word: wx.getStorageSync('searchValue'),
                origin: 'xcx',
                user_id: that.data.userId
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                for (var i = 0; i < res.data.data.length; i++) {
                    var strLength = res.data.data[i].vr_words.length
                    res.data.data[i].vr_words = res.data.data[i].vr_words.substring(1, strLength - 1).split('][');
                }
                if (res.data.data.length == 0) {
                    that.setData({
                        isShow: true
                    })
                }
                that.setData({
                    partnerLists: res.data.data
                })
                // console.log(that.data.partnerLists)
            },
            fail: function (res) {
                console.log(res)
            }
        })
        // console.log(wx.getStorageSync('searchValue'))
    }
})