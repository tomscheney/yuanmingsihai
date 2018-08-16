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
    paymethod: 0,//默认卡（0）支付，微信支付（1）.
    cardList: [],//卡支付列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var productid = options.productid;
    this.setData({
      productid: productid,
    })

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
          console.log("object:", object);
          that.data.productList.push(object.get("productid"));
        }


        console.log("totalfee:", totalfee);

        that.setData({
          orderList: results,
          totalFee: totalfee,
          productList: that.data.productList,
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
    var orderList = this.data.orderList;
    if (this.data.productid) {
      for (var i = 0; i < orderList.length; i++) {
        var order = orderList[i];
        console.log('order:', order);

        order.destroy({
          success: function (myObject) {
            // 删除成功
            console.log('删除成功')
          },
          error: function (myObject, error) {
            // 删除失败
            console.log('删除失败')
          }
        })

      }
    }
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
    var that = this;

    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 0: {
        this.data.paymethod == 0;
        wx.scanCode({
          success: (res) => {
            console.log("card:", res);
            //得到卡号
            var index = res.path.indexOf("=");
            console.log("index", index);
            var cardNO = res.path.substr(index + 1, 9);
            console.log("cardNO", cardNO);


            if (cardNO.length == 8) {

              that.setData({
                cardNO: cardNO,
              })
              console.log("cardNO:", that.data.cardNO);

              //查询数据库
              var Card = Bmob.Object.extend("Card");
              var query = new Bmob.Query(Card);
              query.equalTo("cardNO", that.data.cardNO);
              query.first({
                success: function (object) {
                  console.log("balance:", object);
                  if (object) {
                    // 查询成功
                    var balance = object.get("balance");
                    
                    if (balance > 0) {
                      that.data.cardList.push(cardNO);
                      that.setData({
                        cardBalance: (balance + that.data.cardBalance),
                      })
                      console.log("balance:", balance);
                      if (that.data.cardBalance < that.data.totalFee) {
                        var wxPayFee = that.data.totalFee - that.data.cardBalance;

                        common.showModal("此卡余额不足支付，需微信支付¥" + wxPayFee);
                      }
                    } else {

                      common.showModal("此卡余额不足")

                    }



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
      } break;
      case 1: {
        common.showModal("已为您切换为微信支付")
        this.data.paymethod = 1;
      }
    }

  },

  commitOrder: function () {

    if (this.data.username.length < 1) {

      common.showModal("请填写您的姓名");
      return;
    }
    if (this.data.phoneNo.length != 11) {
      common.showModal("请填写正确的电话号码");
      return;
    }
    if (this.data.address.length < 10) {

      common.showModal("请填写正确的地址");
      return;
    }
    
    

    //传参数金额，名称，描述,openid

    var openid = app.globalData.openid;

    console.log("openid:", openid);

    var wxPayFee = this.data.totalFee - this.data.cardBalance;
    if (wxPayFee < 0){
      this.createOrder("card pay.");
      return;
    }
    var that = this;
    Bmob.Pay.wechatPay(wxPayFee, '茶叶', '缘茗四海', openid).then(function (resp) {
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
      that.data.orderId = orderId;
      //发起支付
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': packages,
        'signType': 'MD5',
        'paySign': sign,
        'success': function (res) {
          //付款成功,这里可以写你的业务代码
          that.createOrder(orderId);

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
      common.showTip(err.message, 'loading', {}, 3000);
      console.log(err);
    });

  },

  createOrder: function (orderId) {
    var that = this;
    //创建新表
    var PayOrder = Bmob.Object.extend("PayOrder");
    var order = new PayOrder();
    var openid = app.globalData.openid;
    order.set("openid", openid);
    order.set("totalFee", this.data.totalFee);
    order.set("productList", this.data.productList.tostring);
    order.set("phoneNo", this.data.phoneNo);
    order.set("address", this.data.address);
    order.set("username", this.data.username);
    order.set("orderId", this.data.orderId);
    var wxPayFee = this.data.totalFee - this.data.cardBalance;
    order.set("wxPayFee", wxPayFee);
    order.set("cardList", that.data.cardList);

    //添加数据，第一个入口参数是null
    order.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId
        //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        app.globalData.shopbadge = 0;

        if (that.data.paymethod == 0) {
          //更新卡余额
          var Card = Bmob.Object.extend("Card");
          var query = new Bmob.Query(Card);

          query.equalTo("cardNO", that.data.cardNO);
          query.first({
            success: function (object) {
              console.log("查询成功: ", object);
              // 查询成功
              if (object) {

                var balance = that.data.cardBalance - that.data.totalFee;
                if(balance < 0) {
                  balance = 0;
                }
                console.log('余额', balance);

                object.set("balance", balance);
                object.save(null, {
                  success: function (object) {

                    that.sendMessage();
                    common.showTip('支付成功', '', {}, 3000);

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
                          console.log('删除成功')
                        },
                        error: function (myObject, error) {
                          // 删除失败
                          console.log('删除失败')

                        }
                      })

                    }

                  }, fail: function (error) {
                    console.log('更新余额失败', error);
                  }
                })
              }

            },
            error: function (error) {
              console.log("查询失败: " + error.code + " " + error.message + "\n result:", result);
            }

          });
        } else {
          common.showTip('支付成功', '', {}, 3000);

          wx.redirectTo({
            url: '../index/index',
          })
        }
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
  },

  sendMessage: function () {

    var content = "老板您好，用户:" + this.data.username + "  通过小程序在平台下单了，请到bmob后台查看，请及时发货！"
    Bmob.Sms.requestSms({ "mobilePhoneNumber": "15110203093", "content": content }).then(function (obj) {

      console.log('短信发送成功');
    }, function (err) {
      console.log('短信发送失败');

    });


    var that = this;

    content = "亲爱的客户您好，您在平台的订单我们已经收到，我们会及时发货，若有疑问，请根据贵宾卡后的联系方式，联系我们！\n 缘茗四海"
    Bmob.Sms.requestSmsCode({ "mobilePhoneNumber": that.data.phoneNo, "template": "订单提示" }).then(function (obj) {

      console.log('客户短信发送成功', obj);
    }, function (err) {
      console.log('客户短信发送失败', err);

    });

  }


})