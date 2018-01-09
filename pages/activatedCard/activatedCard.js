
// pages/activitedCard/activatedCard.js
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardNO: '',
    balance: '',
    needAdd: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true

          })
        }
      })
    }
      var that = this;
    Object.defineProperty(this.data, 'needAdd', {
      set: function (value) {
        console.log('我来了',value );
        //此处拦截了设置请求
        if (value == true) {

          var Diary = Bmob.Object.extend("card");
          var diary = new Diary();
          console.log('卡号', that.data.cardNO);
          console.log('余额', that.data.balance);

          diary.set("cardNO", that.data.cardNO);
          diary.set("balance", that.data.balance);
          //添加数据，第一个入口参数是null
          diary.save(null, {
            success: function (result) {
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              console.log("创建成功, objectId:" + result);
            },
            error: function (result, error) {
              // 添加失败
              console.log('创建失败');
            }
          });

        }
      }

    });
  },

  bindActivatedCard: function (event) {

    wx.scanCode({
      success: (res) => {
        console.log("扫码结果:", res.result);
        console.log("path:", res.path);
        if (res.path) {
          var start = res.path.indexOf('query=');
          var cardNO = res.path.substr(start + 6, 8);

          this.setData({
            cardNO: cardNO,
          });
          console.log("cardNO", this.data.cardNO);

          var balance = "0";
          if (cardNO.slice(0, 4) == '1000') {
            console.log("balance：", 1000);
            balance = "1000";
          } else if (cardNO.slice(0, 4) == '3000') {
            console.log("balance：", 3000);
            balance = "3000";
          }
          else if (cardNO.slice(0, 4) == '5000') {
            console.log("balance：", 5000);
            balance = "5000";
          }
          this.setData({
            balance: balance,
          });

          var that = this;
          var Diary = Bmob.Object.extend("card");
          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Diary);
          //查询单条数据，第一个参数是这条数据的objectId值
          query.equalTo("cardNO", cardNO);
          query.first({
            success: function (result) {
              // 查询成功，不需要添加
              console.log("查询成功:", result);
              if (result) {
                that.setData({
                  balance: '余额:' + result.get('balance'),
                });
              } else {
                console.log("cardNO", that.data.cardNO);

                that.setData({
                  needAdd: true,
                });
                console.log("查询成功: 我走着");

              }
            },
            error: function (error) {
              // 查询失败，没有这条记录
              console.log("查询 error:", error.message);
              that.setData({
                needAdd: true,
              });
            }
          });


          

        }
      }
    })
  },

  

  bindSkipButtun: function (event) {
    console.log("event", event);
    wx.redirectTo({
      url: '../index/index',
    })
  },
  bindGenerateCode: function (event) {
    wx.navigateTo({
      url: '../code/code',
    })
  },

})