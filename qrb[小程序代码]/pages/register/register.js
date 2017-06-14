var app = getApp()
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）
var interval = null
var hintMsg = null // 提示

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")

var phoneNum = null, identifyCode = null, password = null, rePassword = null;

Page({
    data: {
        windowWidth: 0,
        windoeHeight: 0,
        icon_phone: "../../images/phone.png",
        input_icon: "../../images/input.png",
        icon_password: "../../images/password.png",

        nextButtonWidth: 0,
        // step: step_g,
        time: currentTime
    },
    onLoad: function () {
        // step_g = 1
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
        currentTime = -1

    },
    onUnload: function () {
        currentTime = maxTime
        if (interval != null) {
            clearInterval(interval)
        }
    },

    input_phoneNum: function (e) {
        phoneNum = e.detail.value
    },
    input_identifyCode: function (e) {
        identifyCode = e.detail.value
    },
    input_password: function (e) {
        password = e.detail.value
    },
    input_rePassword: function (e) {
        rePassword = e.detail.value
    },
    sendPhoneNum: function () {
        if (currentTime < 0) {
            firstStep()
            if (hintMsg != null) {
                wx.showToast({
                    title: hintMsg,
                    icon: 'loading',
                    duration: 700
                })
            } else {
                var that = this
                currentTime = maxTime
                interval = setInterval(function () {
                    currentTime--
                    that.setData({
                        time: currentTime
                    })

                    if (currentTime <= 0) {
                        currentTime = -1
                        clearInterval(interval)
                    }
                }, 1000)
            }
        } else {
            wx.showToast({
                title: '短信已送，请稍后重试!',
                icon: 'loading',
                duration: 700
            })
        }
    },
    subRegister: function () {
        if (!check.checkPhoneNum(phoneNum)) {
            hintMsg = "请输入正确的电话号码!"
        }
        if (!check.isContentEqual(password, rePassword)) {
            if (hintMsg == null) {
                hintMsg = "两次密码不一致或为空！"

            } else {
                hintMsg = hintMsg

            }
        }
        if (hintMsg != null) {
            wx.showToast({
                title: hintMsg,
                icon: 'loading',
                duration: 700
            })
            hintMsg = null
            return false
        } else {
            //提交电话号码,密码,验证码
            wx.request({
                url: 'https://qrb.shoomee.cn/qrb_api/aesRegister',
                data: {
                    mobile: phoneNum,
                    verify_code: identifyCode,
                    password: password,
                    name: app.globalData.userInfo.nickName,
                    session_key: wx.getStorageSync('sessionKey')
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    // console.log(res.data.data)
                    if (res.data.result == "fail") {
                        wx.showToast({
                            title: res.data.data,
                            icon: 'loading',
                            duration: 700
                        })
                    } else {

                        //获取token
                        wx.request({
                            url: 'https://qrb.shoomee.cn/oauth/token',
                            data: {
                                grant_type: 'password',
                                client_id: 2,
                                client_secret: '2paijmElt4VL01Flrcq7hj63f9GwTV62oS1gp9FL',
                                username: phoneNum,
                                password: password,
                                scope: ''
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (res) {
                                // console.log(res.data.access_token)
                                wx.setStorageSync('token', res.data.access_token)
                                wx.setStorageSync('mobile', phoneNum)
                                wx.setStorageSync('isMobile', true)
                                wx.switchTab({
                                    url: '../index/index'
                                })
                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })

                    }

                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }



        // console.log(phoneNum + '/' + identifyCode + '/' + password);
    }
})

function firstStep() { // 提交电话号码，获取［验证码］
    if (!check.checkPhoneNum(phoneNum)) {
        hintMsg = "请输入正确的电话号码!"
        return false
    }
    if (webUtils.submitPhoneNum(phoneNum)) {
        hintMsg = null
        return true
    }
    hintMsg = "提交错误，请稍后重试!"
    return false
}

