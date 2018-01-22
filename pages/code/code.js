var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
Page({
  data: {
    "imageUrl": "",
  },
  noneWindows: function () {
    this.setData({
      imageUrl: ""
    })
  },
  saveImage: function (e) {
    console.log("xxxx:", e);

    var that = this;
    wx.previewImage({
      urls: [that.data.imageUrl],
    })
    //清空图片
    this.setData({
      imageUrl: ""
    });
  },
  onLoad: function () {

  },
  formSubmit: function (event) {
    var path = event.detail.value.path;
    path = 'pages/index/index?query=' + path;
    var width = 430;
    var that = this;
    Bmob.generateCode({ "path": path, "width": width, "type": 1 }).then(function (obj) {
      console.log("generateCode:", obj);
      that.setData({
        imageUrl: obj.url
      });


    }, function (err) {

      common.showTip('失败');

    });
  }
})