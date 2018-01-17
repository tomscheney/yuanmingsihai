// pages/commitOrder.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList: [{ head: '姓名', tail: '填写您的姓名' }, { head: '电话', tail: '请填写收货人手机号码' }, { head: '地址', tail: '请填写收货地址' }],
    paymethod: ['../images/dd_vip@2x.png', '../images/dd_wx@2x.png'],
    totalFee: 0,
    orderList: [],
    username: '',
    phoneNo: '',
    address: '',
    productList: [],//支付产品列表
    cardBalance: 0,//卡余额
    cardNO: '',//卡号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var productid = options.productid;

   

      var that = this;
      var Order = Bmob.Object.extend("Order");
      var order = new Bmob.Query(Order);
      var openid = app.globalData.openid;
      order.equalTo("openid", openid);
      if (productid) {
        order.equalTo("productid", productid);
      }
      // 查询所有数据
      order.find({
        success: function (results) {
          console.log("共查询到 " + results.length + " 条记录");

          var checkUrl = '../images/gwc_xz@2x.png';
          var tempList = [];
          var count = 0;
          var totalfee = 0;
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var amount = object.get("amount")
            count += amount;
            totalfee += object.get("price") * amount;
            tempList[i] = checkUrl;
          }
          app.globalData.shopbadge = count;

          console.log("totalfee:", totalfee);

          that.setData({
            orderList: results,
            totalFee: totalfee,
          })
          console.log("orderList", that.data.orderList);


        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindPayTap: function (e) {
    console.log("index:", e);
    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 0: {
        var that = this;
        wx.scanCode({
          success: (res) => {
            console.log("card:", res);
            //得到卡号
            var value = res.path.replace(/\s+/g, "");

            if (value.length == 8) {

              that.setData({
                cardNO: value,
              })
              console.log("cardNO:", that.data.cardNO);

              //查询数据库
              var Card = Bmob.Object.extend("Card");
              var query = new Bmob.Query(Card);
              query.equalTo("openid", app.globalData.openid);
              query.equalTo("cardNO", that.data.cardNO);
              query.first({
                success: function (object) {
                  console.log("balance:", object);
                  if (object) {
                    // 查询成功
                    var balance = object.get("balance");
                    that.setData({
                      cardBalance: balance,
                    })
                    console.log("balance:", balance);
                  } else {
                    common.showModal("此卡不存在或未激活，请联系发卡商家")
                  }
                },
                error: function (error) {
                  console.log("查询失败: " + error.code + " " + error.message + "\n result:", result);
                }
              });

            } else {

              common.showModal("此二维码非法")
            }

          }
        })
      }
      case 1: {
        //传参数金额，名称，描述,openid
        var openid = app.globalData.openid;

        console.log("openid:", openid);

        Bmob.Pay.wechatPay(0.01, '名称1', '描述', openid).then(function (resp) {
          console.log('resp');
          console.log(resp);

          that.setData({
            loading: true,
            dataInfo: resp
          })

          //服务端返回成功
          var timeStamp = resp.timestamp,
            nonceStr = resp.noncestr,
            packages = resp.package,
            orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
            sign = resp.sign;

          //打印订单号
          console.log(orderId);

          //发起支付
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packages,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              //付款成功,这里可以写你的业务代码
              console.log(res);
            },
            'fail': function (res) {
              //付款失败
              console.log('付款失败');
              console.log(res);
            }
          })

        }, function (err) {
          console.log('服务端返回失败');
          common.showTip(err.message, 'loading', {}, 6000);
          console.log(err);
        });
      }
    }

  },

  commitOrder: function () {
    //创建新表
    var PayOrder = Bmob.Object.extend("PayOrder");
    var order = new PayOrder();
    var openid = app.globalData.openid;
    order.set("openid", openid);
    order.set("totalFee", this.data.totalFee);
    order.set("productList", this.data.productList);
    order.set("phoneNo", this.data.phoneNo);
    order.set("address", this.data.address);
    order.set("username", this.data.username);

    if (this.data.username.length > 1) {
      order.set("username", this.data.username);
    } else {
      common.showModal("请填写您的姓名");
      return;
    }
    if (this.data.phoneNo.length == 11) {
      order.set("phoneNo", this.data.phoneNo);
    } else {
      console.log("phoneNo:", this.data.phoneNo);
      common.showModal("请填写正确的电话号码");
      return;
    }
    if (this.data.address.length > 10) {
      order.set("address", this.data.address);
    } else {
      common.showModal("请填写正确的地址");
      return;
    }
    if (this.data.totalFee <= this.data.cardBalance) {
      order.set("username", this.data.username);
    } else {
      common.showModal("卡余额不足，请换卡或者加卡扫码支付");
      return;
    }

    var that = this;
    //添加数据，第一个入口参数是null
    order.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId
        //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        app.globalData.shopbadge = 0;

        //更新卡余额
        var Card = Bmob.Object.extend("Card");
        var query = new Bmob.Query(Card);
        query.equalTo("openid", app.globalData.openid);
        query.equalTo("cardNO", that.data.cardNO);
        query.first({
          success: function (object) {
            console.log("查询成功: ", object);
            // 查询成功
            var balance = that.data.cardBalance - that.data.totalFee;
            console.log('余额', balance);

            object.set("balance", balance);
            object.save(null, {
              success: function (object) {

                common.showModal("支付成功");

                wx.redirectTo({
                  url: '../index/index',
                })
                var orderList = that.data.orderList;
                console.log('更新余额成功,orderList', orderList);

                for (var i = 0; i < orderList.length; i++) {
                  var order = orderList[i];
                  console.log('order:', order);

                  order.destroy({
                    success: function (myObject) {
                      // 删除成功
                    },
                    error: function (myObject, error) {
                      // 删除失败
                    }
                  })

                }

              }, fail: function (error) {
                console.log('更新余额失败', error);
              }
            })

          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message + "\n result:", result);
          }
        });

      },
      error: function (result, error) {
        // 添加失败
        console.log('创建支付订单失败', error);

      }
    });
  },
  inputInfo: function (e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    if (index == 0) {
      this.data.username = value;
    } else if (index == 1) {
      this.data.phoneNo = value;

    } else if (index == 2) {
      this.data.address = value;
    }
  }

})