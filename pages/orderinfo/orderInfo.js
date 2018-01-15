// pages/orderinfo/orderInfo.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');


const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
   
   coverUrl:'',
   productName:'',
   price:'',
   introduceImageUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("options:", options.productid);
   
    var productid = options.productid;

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

        that.setData({
          coverUrl: coverUrl,
          productName: productName,
          price: price,
          introduceImageUrl: introduceImageUrl,
        })
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

  var count = app.globalData.shopbadge;
  count+=1;
  app.globalData.shopbadge = count;
  console.log("count:",count);
  common.showModal("添加购物车成功");
}

})