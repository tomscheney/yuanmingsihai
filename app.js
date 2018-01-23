//app.js

var Bmob = require('utils/bmob.js');
Bmob.initialize("9bb3f7c98ca2859aec9941b4d65ba029", "99ca98d8e9ac8a9c4fd05a7b0afc07eb");


App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        if (res.code) {
          //发起网络请求
          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              // that.setData({
              //   loading: true,
              //   url: result.openid
              // })
              var openid = result.openid;
              that.globalData.openid = openid;


              //指定用户，跳转激活页面
              if (openid == "odW8G0VeIAvW9FAicai0ePKVBTGI") {

                wx.redirectTo({
                  url: "/pages/activatedCard/activatedCard",
                })

              }

              var User = Bmob.Object.extend("user");
              //创建查询对象，入口参数是对象类的实例
              var query = new Bmob.Query(User);
              //查询单条数据，第一个参数是这条数据的objectId值
              query.equalTo("openid",openid);
              query.first({
                success: function(result){

                  //更新用户数据
                  
                  var userInfo = that.globalData.userInfo;
                  if (userInfo) {
                    result.set("username", userInfo['nickName']);
                    result.set("gender", userInfo['gender']);
                    result.set("avatarUrl", userInfo['avatarUrl']);
                    result.set("city", userInfo['city']);
                    result.set("country", userInfo['country']);
                    result.set("language", userInfo['language']);
                    result.set("province", userInfo['province']);
                    result.save();
                  }


                }, fail: function(object, error){
                  console.log("查询失败:error",object,errror);
                 //如果没有查询到openid，则添加数据

                  var user = new User();
                  user.set("openid", openid);
                  var userInfo = that.globalData.userInfo;
                  if (userInfo) {
                    user.set("username", userInfo['nickName']);
                    user.set("gender", userInfo['gender']);
                    user.set("avatarUrl", userInfo['avatarUrl']);
                    user.set("city", userInfo['city']);
                    user.set("country", userInfo['country']);
                    user.set("language", userInfo['language']);
                    user.set("province", userInfo['province']);

                  }
                  //添加数据，第一个入口参数是null
                  user.save(null, {
                    success: function (result) {
                      // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                      console.log("新增用户成功");
                    },
                    error: function (result, error) {
                      // 添加失败
                      console.log("新增用户失败");

                    }
                  });

                  
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
              that.globalData.userInfo = res.userInfo
              var userInfo = res.userInfo;
              console.log("userInfo", res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              var openid = that.globalData.openid;
    
              //指定用户，跳转激活页面
              if (openid == "odW8G0VeIAvW9FAicai0ePKVBTGI") {

                wx.redirectTo({
                  url: "/pages/activatedCard/activatedCard",
                })

              } 
              if(!openid){
                console.log("opemid为空");
                return;
              }

              var User = Bmob.Object.extend("user");
              //创建查询对象，入口参数是对象类的实例
              var query = new Bmob.Query(User);
              //查询单条数据，第一个参数是这条数据的objectId值
              query.equalTo("openid", openid);
              query.first({
                success: function (result) {

                  //更新用户数据
                  result.set("username", userInfo['nickName']);
                  result.set("gender", userInfo['gender']);
                  result.set("avatarUrl", userInfo['avatarUrl']);
                  result.set("city", userInfo['city']);
                  result.set("country", userInfo['country']);
                  result.set("language", userInfo['language']);
                  result.set("province", userInfo['province']);
                  result.save();


                }, fail: function (object, error) {
                  
                  console.log("查询失败:error", object, errror);
                  //如果没有查询到openid，则添加数据
                  var user = new User();
                  user.set("openid", openid);

                  user.set("username", userInfo['nickName']);
                  user.set("gender", userInfo['gender']);
                  user.set("avatarUrl", userInfo['avatarUrl']);
                  user.set("city", userInfo['city']);
                  user.set("country", userInfo['country']);
                  user.set("language", userInfo['language']);
                  user.set("province", userInfo['province']);
                  user.save();

                }
              });

              
              
              

            }
          })
        } else {
           wx.authorize({
             scope: 'scope.userInfo',
             success() {
 
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
    orderList:[],
  }
})