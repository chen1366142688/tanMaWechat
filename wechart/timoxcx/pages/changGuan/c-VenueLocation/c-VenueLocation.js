var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
// 实例化API核心类
qqmapsdk = new QQMapWX({
  key: '5ICBZ-XLHCD-4HR4J-HJGBE-N36JF-3TBWX'
});
Page({
  data: {
    latitude: '',
    longitude: '',
    address: '',
    markers:[]
  },
  onLoad: function (option) {
    var that = this;
    let latitude = option.latitude;
    let longitude = option.longitude;
    let address = option.address;
    // console.log(params)
    
    that.setData({
      address: address,
      latitude: latitude,
      longitude: longitude,
      markers: [{
        //iconPath: "http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/lanqiu.png",
        id: 0,
        latitude: latitude,
        longitude: longitude,
        width: 50,
        height: 50
      }],
    })

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onShow: function () {
    var that = this;
    // console.log(that.data.longitude);
    // console.log(that.data.latitude);
    // console.log(!(that.data.longitude && that.data.latitude))
    if (!(that.data.longitude && that.data.latitude)){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          // console.log(res)
          that.setData({
            latitude: latitude,
            longitude: longitude
          })
          
        }
        
      })
      reverseLocation(that, that.data.latitude, that.data.longitude)
    }
    

  }
})
function reverseLocation(that, lat, lon) {
  // 调用接口
  qqmapsdk.reverseGeocoder({

    location: {
      latitude: lat,
      longitude: lon
    },
    success: function (res) {
      console.log(res);
      that.setData({
        address: "   " + res.result.address
      })
    },
    fail: function (res) {
      console.log(res);
    },
    template: function () {
      console.log(111)
      console.log(that.data.latitude);
    }
  });
}