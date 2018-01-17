// pages/orderinfo/orderInfo.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');


const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    productid: '',
    coverUrl: '',
    productName: '',
    price: 0,
    introduceImageUrl: '',
    netContent: '',
    description: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    console.log("options:", options.productid);

    var productid = options.productid;
    this.setData({
      productid: productid,
    })
    var Tea = Bmob.Object.extend("Tea");
    //创建查询对象，入口参数是对象类的实例
    var tea = new Bmob.Query(Tea);
    //查询单条数据，第一个参数是这条数据的objectId值
    var that = this;
    tea.get(productid, {
      success: function (result) {
        // 查询成功，调用get方法获取对应属性的值
        var coverUrl = result.get("coverUrl");
        var productName = result.get("name");
        var price = result.get("price");
        var introduceImageUrl = result.get("introduceImageUrl");
        var netContent = result.get("netContent");
        var description = result.get("description");
        console.log("xxxresult:",result);;
        that.setData({
          coverUrl: coverUrl,
          productName: productName,
          price: price,
          introduceImageUrl: introduceImageUrl,
          netContent: netContent,
          description: description,
        })
        console.log("result:", result);
      },
      error: function (object, error) {
        // 查询失败
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // count += 1;
    // app.globalData.iconbadge += count;
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

  immediateBuy: function () {
    wx.navigateTo({
      url: '../commitOrder/commitOrder',
    })
  },
  addToshopCart: function () {



    //查询单条数据，第一个参数是这条数据的objectId值
    var that = this;

    var Order = Bmob.Object.extend("Order");

    //创建查询对象，入口参数是对象类的实例
    var query = new Bmob.Query(Order);
    query.equalTo("openid", app.globalData.openid);
    query.equalTo("productid", this.data.productid);
    console.log("productid:", this.data.productid);

    query.find({
      success: function (results) {
        console.log("results",results);
       if(results.length > 0){
         var object = results[0];
         var amount = object.get('amount');
         var count = app.globalData.shopbadge;
         count += 1;
         app.globalData.shopbadge = count;
         amount++;
         object.set("amount", amount);
         object.save();

         console.log("amount:", amount);
         common.showModal("添加购物车成功");
         console.log(typeof object);
       } else {

         //新建订单
         var order = new Order();
         var openid = app.globalData.openid;
         order.set("openid", openid);
         order.set("productid", that.data.productid);
         order.set("name", that.data.productName);
         order.set("price", that.data.price);
         order.set("coverUrl", that.data.coverUrl);
         order.set("netContent", that.data.netContent);
         order.set("description", that.data.description);
         order.set("amount", 1);
         //添加数据，第一个入口参数是null
         order.save(null, {
           success: function (result) {
             // 添加成功，返回成功之后的objectId
             //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
             var count = app.globalData.shopbadge;
             count += 1;
             app.globalData.shopbadge = count;
             console.log("count:", count);
             common.showModal("添加购物车成功");

           },
           error: function (result, error) {
             // 添加失败
             console.log('创建订单失败',error);

           }
         });

       }


      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //创建新表
        var Order = Bmob.Object.extend("Order");
        var order = new Order();
        var openid = app.globalData.openid;
        order.set("openid", openid);
        order.set("productid", that.data.productid);
        order.set("name", that.data.productName);
        order.set("price", that.data.price);
        order.set("coverUrl", that.data.coverUrl);
        order.set("netContent", that.data.netContent);
        order.set("description", that.data.description);
        order.set("amount", 1);
        //添加数据，第一个入口参数是null
        order.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId
            //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            var count = app.globalData.shopbadge;
            count += 1;
            app.globalData.shopbadge = count;
            console.log("count:", count);
            common.showModal("添加购物车成功");

          },
          error: function (result, error) {
            // 添加失败
            console.log('创建订单失败', error);

          }
        });

      }

    })
    
  }

})