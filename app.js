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
    var that = this;
    var openid = '';
    var username = '';
    var gender = '';
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('resCode:', res)

        if (res.code) {
          //发起网络请求
          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              // that.setData({
              //   loading: true,
              //   url: result.openid
              // })
              console.log('result', result)
              openid = result.openid;
              //指定用户，跳转激活页面
              if (openid == "odW8G0VeIAvW9FAicai0ePKVBTGI") {

                wx.redirectTo({
                  url: "/pages/activatedCard/activatedCard",
                })
              }

              var User = Bmob.Object.extend("user");
              var user = new User();
              user.set("openid", openid);
              var userInfo = that.globalData.userInfo;
              if (userInfo) {
                user.set("username", userInfo['username']);
                user.set("gender", userInfo['gender']);
              }
              //添加数据，第一个入口参数是null
              user.save(null, {
                success: function (result) {
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  console.log("创建成功, objectId:" + result);
                },
                error: function (result, error) {
                  // 添加失败
                  console.log('创建失败1111', error);
                  result.fetchWhenSave(true);
                  result.set("openid", openid);
                  user.set("username", username);
                  user.set("gender", gender);
                  result.save();
                }
              });


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
      fail: function (error) {
        console.log("login error", error);
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
              console.log('userInfo', res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              username = res.userInfo['nickName'];
              gender = res.userInfo['gender'];
              //将用户信息添加到数据库的对应表

              var User = Bmob.Object.extend("user");
              var user = new User();
              var openid = that.globalData.openid;
              if (opeid) {
                user.set("openid", openid);
              }
              user.set("username", username);
              user.set("gender", gender);
              //添加数据，第一个入口参数是null
              user.save(null, {
                success: function (result) {
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  console.log("创建成功, objectId:" + result);
                },
                error: function (result, error) {
                  // 添加失败
                  console.log('创建失败22222', error);
                  result.fetchWhenSave(true);
                  result.set("openid", openid);
                  user.set("username", username);
                  user.set("gender", gender);
                  result.save();
                }
              });


            }
          })
        }
      }
    })
  },

  onShow: function () {
    //   var f = this.globalData.shopbadge;
    //  f++;
    //  this.globalData.shopbadge = f;
    //  console.log('ccccc:',f);
  },

  globalData: {
    userInfo: null,
    shopbadge: 0,
    hello: 0,
    openid: '',
  }
})