//app.js

var Bmob = require('utils/bmob.js');
Bmob.initialize("97d353af489136a32c44834a9c27267f", "d695b05371f27727e99f68c2ab98475e");
var APP_ID = 'wxd339da91bf1b1fe3';
var APP_SECRECT = '97d353af489136a32c44834a9c27267f';

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('onLaunch')
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('resCode:', res.code)        
        if (res.code) {
          //发起网络请求
          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              // that.setData({
              //   loading: true,
              //   url: result.openid
              // })
              console.log('result', result)
              var openid = result.openid;
              //指定用户，跳转激活页面
              // if (openid == "odW8G0Yyaew3eZk6SZeYB_uSPKxI") {
                // wx.redirectTo({
                //   url: "/pages/activatedCard/activatedCard",
                // })
              // }
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          common.showTip('获取用户登录态失败！', 'loading');
        }
      },
      fail:function(error){
        console.log("login error",error);
      },

      
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})