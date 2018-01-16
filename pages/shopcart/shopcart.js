// pages/shopcart.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    checkItemList: [],
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Order = Bmob.Object.extend("Order");
    var order = new Bmob.Query(Order);
    var openid = app.globalData.openid;
    order.equalTo("openid", openid);
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
          totalfee += (parseInt(object.get("price")) * count);
          tempList[i] = checkUrl;
        }
        app.globalData.shopbadge = count;

        // console.log(object.id + ' - ' + object.get('name'));

        that.setData({
          checkItemList: tempList,
          orderList: results,
          totalFee: totalfee,
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },

  checkItem: function (e) {

    var index = e.currentTarget.dataset.index;
    var itemUrl = this.data.checkItemList[index];
    console.log("itemUrl:", itemUrl);
    console.log("itemUrl:", itemUrl.substr(13, 3));
    var totalfee = this.totalFee;
    var object = this.data.orderList[index];

    if (itemUrl.substr(14, 3) == 'wxz') {
      itemUrl = '../images/gwc_xz@2x.png';
      totalfee -= (object.get('price') * object.get('amount'));
      object.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          console.log("添加成功, objectId:" + result.id);
        },
        error: function (result, error) {
          // 添加失败
          console.log('添加失败');

        }
      });
    } else {
      itemUrl = '../images/gwc_wxz@2x.png';
      var count = app.globalData.shopbadge;
      count--;
      app.globalData.shopbadge = count;
      object.destroy();
    }
    this.data.checkItemList[index] = itemUrl;
    var tempItemLiost = this.data.checkItemList;
    this.setData({
      checkItemList: tempItemLiost,
      totalFee: totalfee,
    })

  },
  clickSettlement: function () {
    if (this.totalFee > 0) {
      wx.navigateTo({
        url: '../commitOrder/commitOrder?totalFee=' + this.totalFee,
      })
    } else {
      common.showModal("还没有订单，快去选购产品吧！");
    }
  }
})