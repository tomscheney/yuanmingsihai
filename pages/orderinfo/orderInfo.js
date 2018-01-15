// pages/orderinfo/orderInfo.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');


const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduceList: [{ head: "品名", tail: "武夷岩茶" }, { head: "净含量", tail: "1000克" }, { head: "质量等级", tail: "特级" }, { head: "冲泡温度", tail: "100度，沸水" }, {
      head: "冲泡时间", tail: "  第一泡润茶出汤要快，第二泡5秒出汤，第三泡开始每泡可延续10秒出汤。"
    }, {
      head: "功效", tail: "改善皮肤过敏，预防老化，美白细肤，能够溶解脂肪减肥瘦身的功效。"
    }],
    detailList: [{ title: "干茶", content: "条索状，外形紧实，色泽乌绿" }, { title: "香气", content: "香浓辛锐且清长，有独特的木质香" }, { title: "茶汤", content: "橙黄透亮，木质香浓甘醇，枞味明显，回甘清爽" }, { title: "叶底", content: "叶底均匀，大片且柔软" },],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:", options);
    // var count = getApp().globalData.shopbadge;
    // count++;
    var sa = this.introduceList.push('1');
    console.log("count:", app.globalData.shopbadge);

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
  app.globalData.shopbadge += 1;
  common.showModal("添加购物车成功");
}

})