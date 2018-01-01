//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    motto: 'Hello World hh',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageUrl: "http://bmob-cdn-15679.b0.upaiyun.com/2017/12/17/e4f99a5c406c23288092d882ef72e2c0.jpg"  ,

    pruductArray: [[{ productName: '普洱茶', productDescription: '真的很好喝' }, { productName: '大红袍', productDescription: '安神补眠，你值得拥有' }], [{ productName: '铁观音', productDescription: '真的很好喝' }, { productName: '竹叶青', productDescription: '安神补眠，你值得拥有' }], [{ productName: '黄山毛峰', productDescription: '真的很好喝' }, { productName: '龙潭飘雪', productDescription: '安神补眠，你值得拥有' }], ],
    amount:0,
  },

  switch: function (e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function (e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
    console.log('我点击了');

  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

insert: function () {
    var cb = this.data.checkbox;
    cb.push(this.data.checkbox.length);
    this.setData({
      checkbox: cb
    });
  },

})

var Bmob = require('../../utils/bmob.js');
var Diary = Bmob.Object.extend("diary");
var diary = new Diary();
diary.set("title", "hello");
diary.set("content", "hello world , wellcome!");
//添加数据，第一个入口参数是null
diary.save(null, {
  success: function (result) {
    // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
    console.log("日记创建成功, objectId:" + result.id);
  },
  error: function (result, error) {
    // 添加失败
    console.log('创建日记失败');

  }
});

var query = new Bmob.Query(Diary);
query.get("9cfa492b1b", {
  success: function (result) {
    // The object was retrieved successfully.
    console.log("查询日记成功，该日记内容为为" + result.get("content"));
  },
  error: function (result, error) {
    console.log("查询失败");
  }
});






