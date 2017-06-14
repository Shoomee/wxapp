
// 提交［电话号码］
function submitPhoneNum(phoneNum) {
    // 此处调用wx中的网络请求的API，完成电话号码的提交
    wx.request({
        url: 'https://qrb.shoomee.cn/qrb_api/seedSms',
        data: {
            mobile: phoneNum
        },
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            res.data.data = res.data.data.split(',')
            console.log(res.data)
            if (res.data.data[1] === '0') {
                // console.log('true')
            } else {
                // console.log('false')
            }
        },
        fail: function (res) {
            console.log(res)
        }
    })
    return true
}

//提交［验证码］
function submitIdentifyCode(phoneNum, identifyCode) {
    // 此处调用wx中的网络请求的API，完成短信验证码的提交
    wx.request({
        url: 'https://qrb.shoomee.cn/qrb_api/checkSms',
        data: {
            mobile: phoneNum,
            verify_code: identifyCode
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            // console.log(res.data)
        },
        fail: function (res) {
            console.log(res)
        }
    })
    return true
}



module.exports = {
    submitPhoneNum: submitPhoneNum,
    submitIdentifyCode: submitIdentifyCode,
  
}


