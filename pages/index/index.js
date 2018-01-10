//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    
    imageUrl: "http://bmob-cdn-15679.b0.upaiyun.com/2017/12/17/e4f99a5c406c23288092d882ef72e2c0.jpg"  ,
    pruducts: [[{ name: '普洱茶', description: '真的很好喝' }, { name: '大红袍', description: '安神补眠，你值得拥有' }], [{ name: '铁观音', description: '真的很好喝' }, { name: '竹叶青', description: '安神补眠，你值得拥有' }], [{ name: '黄山毛峰', description: '真的很好喝' }, { name: '龙潭飘雪', description: '安神补眠，你值得拥有' }], ],
    amount:0,

    selectIndex:0,
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../orderinfo/orderInfo'
    })

    console.log('我点击了');

  },
  onLoad: function (e) {
   
  
    
  },

  selectPriceGrade:function(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    })
  }
})










