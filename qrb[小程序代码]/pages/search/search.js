var WxSearch = require('../../wxSearch/wxSearch.js')
Page({
    data: {
        title: 'search',
    },
    onLoad: function () {
        var that = this
        //初始化的时候渲染wxSearchdata
        WxSearch.init(that, 43, ['法律顾问', '知识产权']);
        WxSearch.initMindKeys([]);
    },
    wxSearchFn: function (e) {
        var that = this
        WxSearch.wxSearchAddHisKey(that);
        if (that.data.wxSearchData.value != undefined) {
            wx.setStorageSync('searchValue', that.data.wxSearchData.value)
            wx.navigateTo({
                url: '../partnerLists/partnerLists'
            })
        }

    },
    wxSearchInput: function (e) {
        var that = this
        WxSearch.wxSearchInput(e, that);
    },
    wxSerchFocus: function (e) {
        var that = this
        WxSearch.wxSearchFocus(e, that);
    },
    wxSearchBlur: function (e) {
        var that = this
        WxSearch.wxSearchBlur(e, that);
    },
    wxSearchKeyTap: function (e) {
        var that = this
        WxSearch.wxSearchKeyTap(e, that);
    },
    wxSearchDeleteKey: function (e) {
        var that = this
        WxSearch.wxSearchDeleteKey(e, that);
    },
    wxSearchDeleteAll: function (e) {
        var that = this;
        WxSearch.wxSearchDeleteAll(that);
    },
    wxSearchTap: function (e) {
        var that = this
        WxSearch.wxSearchHiddenPancel(that);
    }
})