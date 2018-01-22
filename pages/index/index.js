//index.js
//获取应用实例

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()


Page({
  data: {
    
    products: [],
    amount: 0,
    selectIndex: 0,
    iconbadge: 0,

  },

  //事件处理函数
  bindViewTap: function (e) {
    
   var index = e.currentTarget.dataset.index;
   var column = parseInt(index/2);
   var row = parseInt(index % 2);
   var Tea = Bmob.Object.extend("Tea");

   var tempList = this.data.products[column];
  

   var object = tempList[row];
   var productid = object.id;
    wx.navigateTo({
      url: '../orderinfo/orderInfo?productid=' + productid,
    })

 
  },
  onLoad: function (e) {
    

    this.iconbadge = app.globalData.shopbadge;
    //监听购物车数量变化
    var that = this;
    Object.defineProperty(app.globalData, 'shopbadge', {
      get: function () {
        return that.data.iconbadge;
      },
      set: function (value) {
        that.setData({
          iconbadge : value,
        })
      }
    });  

    this.startQuery(1000);

  },

  selectPriceGrade: function (e) {

    var index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    })
    var price = 1000;
   if (index == 1){
      price = 3000
    }
    else if (index == 2){
      price = 5000
    }

    
    this.startQuery(price);

  },

  bindShopCart: function () {
    wx.navigateTo({
      url: '../shopcart/shopcart',
    })

  },

  startQuery:function(price){

    var that = this;
    var Tea = Bmob.Object.extend("Tea");
    var tea = new Bmob.Query(Tea);
    tea.equalTo("price", price);
    // 查询所有数据
    tea.find({
      success: function (results) {

        // 循环处理查询到的数据
        var list = [];
        for (var i = 0; i < results.length / 2; i++) {
          var object = results[i * 2];
          var nextObject = results[i * 2 + 1];
          var temp = [];
          temp.push(object);
          if (nextObject) {
            temp.push(nextObject);
          }
          list.push(temp);

        }

        that.setData({
          products: list
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  }

})










