const app = getApp().globalData;
Page({
  data: {
    latitude:'',
    longitude:'',
    address:'',
    markers:[],
    circles:[],
  },
  onLoad:function(option){
    var that=this;
    that.setData({
      latitude: option.latitude,
      longitude: option.longitude,
      address: option.address,
      markers: [{
        id: 1,
        latitude: option.latitude,
        longitude: option.longitude,
        width: 30,
        height: 30,
        iconPath: "../../../image/imgs/loca.png",
        title: option.address,
      }],
      circles: [{
        latitude: option.latitude,
        longitude: option.longitude,
        color: '',
        fillColor: '#7cb5ec88',
        radius: 1000,
        strokeWidth: 1
      }]
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
  onShow:function(){
    app.noType();
  }
})