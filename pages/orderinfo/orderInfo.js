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
   coverUrl:'',
   productName:'',
   price:'',
   introduceImageUrl:'',
   netContent: '',
   description:'',
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
        that.setData({
          coverUrl: coverUrl,
          productName: productName,
          price: price,
          introduceImageUrl: introduceImageUrl,
          netContent: netContent,
          description: description,
        })
        console.log("result:",result);
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

immediateBuy:function () {
wx.navigateTo({
  url: '../commitOrder/commitOrder',
})
},
addToshopCart:function () {

  
  var Order = Bmob.Object.extend("Order");
  var order = new Order();
  var openid = app.globalData.openid;
  order.set("openid", openid);
  order.set("productid", this.data.productid);
  order.set("name", this.data.productName);
  order.set("price", this.data.price);
  order.set("coverUrl", this.data.coverUrl);
  order.set("netContent", this.data.netContent);
  order.set("description", this.data.description);

  
  //添加数据，第一个入口参数是null
  order.save(null, {
    success: function (result) {
      // 添加成功，返回成功之后的objectId
      //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
      console.log("日记创建成功, objectId:" + result.get('name'));
      common.showModal("添加购物车成功");
      var count = app.globalData.shopbadge;
      count += 1;
      app.globalData.shopbadge = count;
      console.log("count:", count);

    },
    error: function (result, error) {
      // 添加失败
      console.log('创建日记失败');

    }
  });
}

})