//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    
    pricerGrade:['1000型','2000型','3000型'],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageUrl: "http://bmob-cdn-15679.b0.upaiyun.com/2017/12/17/e4f99a5c406c23288092d882ef72e2c0.jpg"  ,
    
    pruductArray: [[{ productName: '普洱茶', productDescription: '真的很好喝' }, { productName: '大红袍', productDescription: '安神补眠，你值得拥有' }], [{ productName: '铁观音', productDescription: '真的很好喝' }, { productName: '竹叶青', productDescription: '安神补眠，你值得拥有' }], [{ productName: '黄山毛峰', productDescription: '真的很好喝' }, { productName: '龙潭飘雪', productDescription: '安神补眠，你值得拥有' }], ],
    amount:0,
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../orderinfo/orderInfo'
    })

    console.log('我点击了');

  },
  onLoad: function (e) {
   
   console.log("index:",e);
    
  },

})










