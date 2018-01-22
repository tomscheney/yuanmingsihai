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
   
   
    var totalfee = this.data.totalFee;

    var object = this.data.orderList[index];
    totalfee -= (object.get('price') * object.get('amount'));
    app.globalData.shopbadge -= object.get('amount');
    this.data.orderList.splice(index,1);


    this.data.checkItemList[index] = itemUrl;
    var tempItemList = this.data.checkItemList;
    this.setData({
      checkItemList: tempItemList,
      totalFee: totalfee,
      orderList: this.data.orderList,
    })
    object.destroy({
      success: function (myObject) {
        // 删除成功
        console.log("删除成功");
      },
      error: function (myObject, error) {
        // 删除失败、
        console.log("删除失败");

      }
    });

  },

  //结算
  clickSettlement: function () {
    
    if (this.data.totalFee > 0) {
      
      wx.navigateTo({
        url: '../commitOrder/commitOrder'
      })
    } else {
      common.showModal("还没有订单，快去选购产品吧！");
    }
  },

  //数量增加
  bindTapPlus: function (e) {
    var that = this;
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    //对应opendid（用户），下的对应订单
    var openid = app.globalData.openid;
    query.equalTo("openid", openid);
    var index = e.currentTarget.dataset.index;
    var object = this.data.orderList[index];
    var productid = object.get('productid')
    query.equalTo("productid", productid);
    query.first({

      success: function (result) {

        //更新订单数量
        var amount = result.get('amount');
        amount++;
        result.set('amount', amount);
        result.save();
        object.set('amount', amount);
        that.data.totalFee += object.get("price");

        that.setData({
          orderList:that.data.orderList,
          totalFee:that.data.totalFee,
        })
      }, fail: function (object, error) {
        console.log("订单查询失败:error", object, errror);
      }
    })

  },
  //数量减少
  bindTapMinus: function (e) {
    var that = this;
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    //对应opendid（用户），下的对应订单
    var openid = app.globalData.openid;
    query.equalTo("openid", openid);

    var index = e.currentTarget.dataset.index;
    var object = this.data.orderList[index];
    var productid = object.get('productid')
    query.equalTo("productid", productid);
    query.first({

      success: function (result) {

        //更新订单数量
        var amount = result.get('amount');
        amount--;
        if (amount > 0) { 
        result.set('amount', amount);
        result.save();
        object.set('amount',amount);
        that.data.totalFee -= object.get("price");

        that.setData({
          orderList: that.data.orderList,
          totalFee: that.data.totalFee,
        })
      } 

    }, fail: function (object, error) {
      console.log("订单查询失败:error", object, errror);
    }
    })
  },
//修改订单数量
modifyOrderAmount: function(e) {

  var that = this;
  var Order = Bmob.Object.extend("Order");
  var query = new Bmob.Query(Order);
  //对应opendid（用户），下的对应订单
  var openid = app.globalData.openid;
  query.equalTo("openid", openid);
  var index = e.currentTarget.dataset.index;
  var object = this.data.orderList[index];
  var productid = object.get('productid')
  query.equalTo("productid", productid);

  query.first({

    success: function (result) {
      //更新订单数量
      var amount = result.get('amount');

      var value = parseInt(e.detail.value);
      var d_value = amount - value;
      result.set('amount', value);
      result.save();
      object.set('amount', value);
      that.data.totalFee -= (object.get("price") * d_value);

      that.setData({
        orderList: that.data.orderList,
        totalFee: that.data.totalFee,
      })
    }, fail: function (object, error) {
      console.log("订单查询失败:error", object, errror);
    }
  })
}


})