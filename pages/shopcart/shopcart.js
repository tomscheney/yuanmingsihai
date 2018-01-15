// pages/shopcart.js

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    checkItemList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    var openid = app.globalData.openid;
    query.equalTo("openid", openid);
    
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        
        var checkUrl = '../images/gwc_xz@2x.png';
        var tempList = [];
       
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          tempList.push(checkUrl);

          console.log(object.id + ' - ' + object.get('title'));
        }

        that.setData({
          checkItemList: tempList,
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },

  checkItem:function(e){

    var index = e.currentTarget.dataset.index;
    var itemUrl = this.data.checkItemList[index];
    console.log("itemUrl:", itemUrl );
    console.log("itemUrl:", itemUrl.substr(13, 3));

    if(itemUrl.substr(14, 3) == 'wxz'){
      itemUrl = '../images/gwc_xz@2x.png';
    } else {
      itemUrl = '../images/gwc_wxz@2x.png';
      var count = app.globalData.shopbadge;
      count--;
      app.globalData.shopbadge = count;
    }
    this.data.checkItemList[index] = itemUrl;
    var tempItemLiost = this.data.checkItemList;
    this.setData({
      checkItemList: tempItemLiost,
    })

  },
  clickSettlement:function(){
   wx.navigateTo({
     url: '../commitOrder/commitOrder?',
   })
  }
})