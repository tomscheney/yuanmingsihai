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
    previewImage: function (e) {
      console.log("xxxx:",e);
      wx.previewImage({
        // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
        urls: [this.data.imageUrl]

      });
      this.setData({
        imageUrl: ""
      });

    } ,
    onLoad: function () {

    },
    formSubmit: function (event) {
        var path = event.detail.value.path;
        var width = 430;
        var that = this;
        // Bmob.generateCode({ "path": path, "width": width, "interface": "b",'scene':'dfd',"type":1}).then(function (obj) {
        Bmob.generateCode({ "path": path, "width": width,"type":1}).then(function (obj) {
          console.log("generateCode:",obj);
            that.setData({
              imageUrl: obj.url
            });
            
            
        }, function (err) {

            common.showTip('失败' + err);
        });
    }
})