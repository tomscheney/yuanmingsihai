//index.js
//获取应用实例

var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

const app = getApp()


Page({
  data: {
    
    imageUrl: "http://bmob-cdn-15679.b0.upaiyun.com/2017/12/17/e4f99a5c406c23288092d882ef72e2c0.jpg"  ,
    products: [[{ name: '普洱茶', description: '真的很好喝' }, { name: '大红袍', description: '安神补眠，你值得拥有' }], [{ name: '铁观音', description: '真的很好喝' }, { name: '竹叶青', description: '安神补眠，你值得拥有' }], [{ name: '黄山毛峰', description: '真的很好喝' }, { name: '龙潭飘雪', description: '安神补眠，你值得拥有' }], ],
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
    var that = this;
    var Tea = Bmob.Object.extend("Tea");
    var tea = new Bmob.Query(Tea);
    // 查询所有数据
    tea.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        var list = [];
        for (var i = 0; i < results.length / 2; i++) {
          var object = results[i * 2 ];
          var nextObject = results[i * 2 + 1];
          var temp = [];
          temp.push(object);
          if(nextObject){
            temp.push(nextObject);
          }
          list.push(temp);
          console.log(object.get('name') + ' - ' + object.get('description') + ' - ' + object.get('coverUrl'));
          console.log('list', temp)

        }
        console.log('list', list)

        that.setData({
         products:list
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
  },

  selectPriceGrade:function(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    })
  }
})










