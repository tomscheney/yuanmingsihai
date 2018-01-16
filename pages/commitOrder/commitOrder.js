// pages/commitOrder.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList: [{ head: '姓名', tail: '填写您的姓名' }, { head: '电话',tail: '请填写收货人手机号码' }, { head: '地址', tail: '请填写收货地址' }],
    paymethod: ['../images/dd_vip@2x.png','../images/dd_wx@2x.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options",options);
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
  bindPayTap:function(e){
    console.log("index:",e);
    var index = e.currentTarget.dataset.index;
     switch(index){
       case 0:{
       wx.scanCode({
         success: (res) => {
           console.log("card:",res);
         }
       })
       }
       case 1:{
         //传参数金额，名称，描述,openid
         var openid = app.globalData.openid;

         console.log("openid:",openid);

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

})