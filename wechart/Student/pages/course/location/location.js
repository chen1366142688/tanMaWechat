
// page/index/index.js
const app = getApp().globalData;
Page({
  data: {
    url: app.imgUrl,
    address:'',
    region: [],
    isCl: false,
    array: ['省份'],
    objectArray: [],
    index: 0,
    array1: ['城市'],
    objectArray1: [],
    index1: 0,
    array2: ['区县'],
    objectArray2: [],
    index2: 0,
    province:'',
    city:'',
    county:'',
    userId: "",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      userId: wx.getStorageSync('userInfo').userId
    });
    allProvince(this)
  },
  bindPickerChange: function (e) {
    var that=this;
    var provinId;
    var value = parseInt(e.detail.value);
    var arr = that.data.objectArray;
    for(var i=0;i<arr.length;i++){
      if (value == i){
        provinId=arr[i].provinceId;
      }
    }
    //根据当前省份查询城市列表
    cityList(that, provinId)
    that.setData({
      index: e.detail.value,
      province: provinId
    })
  },
  //查询当前城市下的区县
  bindPickerChange1: function (e) {
    var that = this;
    var cityId;
    var value = parseInt(e.detail.value);
    var arr = that.data.objectArray1;
    for (var i = 0; i < arr.length; i++) {
      if (value == i) {
        cityId = arr[i].cityId;
      }
    }
    countyList(that, cityId)
    that.setData({
      index1: e.detail.value,
      city: cityId
    })
  },
  bindPickerChange2: function (e) {
    var that=this;
    var county;
    var value = parseInt(e.detail.value);
    var arr = that.data.objectArray2;
    for (var i = 0; i < arr.length; i++) {
      if (value == i) {
        county = arr[i].countyId;
      }
    }
    that.setData({
      index2: e.detail.value,
      county: county
    })
  },
  //监听用户输入
  busLocation:function(e){
    console.log(e.detail.value)
    var address = e.detail.value;
    this.setData({ address: address})
  },
  //自动定位
  autoLocation:function(e){
      var location = wx.getStorageSync('location').result;
      var city = location.address_component;
      var address = location.address_component.street_number;
      var arr = [city.province, city.city, city.district]
       region(this,city.province, city.city, city.district);
      this.setData({
        address: address,
        region: arr,
        isCl: true
      })
  },
  //提交学员地址
  submit:function(e){
    if (!this.data.address) {
      wx.showToast({
        title: '请填写具体位置',
      })
      return false;
    } else if (this.data.province == '' || this.data.city == '' || this.data.county==''){
      wx.showToast({
        title: '请选择省市区',
      })
    }else{
    var locations;
      locations=this.data.address;
      subLocation(this, this.data.userId, locations, this.data.province, this.data.city, this.data.county)
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (res.networkType == 'none') {
          wx.reLaunch({
            url: '../../../pages/welcome/welcomeNo/welcomeNo',
          })
        }
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
//获取省份列表
function allProvince(that){
  wx.request({
    url: app.url + '/v1/systemconfig/get/allProvinceInfo',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
    },
    success:function(res){
      if(res.data.code=='10000'){
        var obj = that.data.objectArray;
        var serverObj = res.data.response;
        obj=serverObj;
        var arr=[];
        obj.forEach(function (item) {
          arr.push(item.provinceName);
          item.name = item.provinceName;
          delete item.provinceName;
        })
        that.setData({
          array: arr,
          objectArray: obj
        })
      }
    },
    fail:function(info){
      wx.showToast({
        title: '获取地址失败',
      })
    }
  })
}
//获取城市列表
function cityList(that,provinId){
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'provinceId': provinId
    },
    success:function(res){
      console.log("请求城市成功")
      console.log(res.data)
      if (res.data.code == '10000') {
        var obj = that.data.objectArray1;
        var serverObj = res.data.response;
        obj = serverObj;
        var arr = [];
        obj.forEach(function (item) {
          arr.push(item.cityName);
          item.name = item.cityName;
          delete item.cityName;
        })
        that.setData({
          array1: arr,
          objectArray1: obj
        })
      }
    },
    fail:function(info){
      wx.showToast({
        title: '获取城市失败',
      })
    }
  })
}
//获取区县列表
function countyList(that, cityId) {
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method: 'GET',
    data: {
      'cityId': cityId
    },
    success: function (res) {
      console.log("请求城市成功")
      console.log(res.data)
      if (res.data.code == '10000') {
        var obj = that.data.objectArray2;
        var serverObj = res.data.response;
        obj = serverObj;
        var arr = [];
        obj.forEach(function (item) {
          arr.push(item.countyName);
          item.name = item.countyName;
          delete item.countyName;
        })
        that.setData({
          array2: arr,
          objectArray2: obj
        })
      }
    },
    fail: function (info) {
      wx.showToast({
        title: '获取城市失败',
      })
    }
  })
}
//提交地址
function subLocation(that,userId, addressDetail, province, city, county){
  wx.request({
    url: app.url + '/v1/student/update/studentAddressByUserId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'GET',
    data:{
      'userId': userId,
      'addressDetail': addressDetail,
      'province': province,
      'city': city,
      'county': county
    },
    success:function(res){
      console.log("修改成功")
      that.setData({
        address: ''
      })
      wx.navigateBack({
        delta: 1
      })
    },
    fail:function(info){
      wx.showToast({
        title: '修改失败',
      })
    }
  })
}
//根据省市区去查询ID
function region(that,provinceName, cityName, countryName){
  wx.request({
    url: app.url + '/v1/systemconfig/getRegionInfoId',
    header: { 'token': wx.getStorageSync('userInfo').token },
    method:'POST',
    data:{
      "cityName": cityName,
      "countryName": countryName,
      "provinceName": provinceName
    },
    success:function(res){
      if(res.data.code=='10000'){
        //这里改变选择框的值且让它可以继续选择
        var arr = that.data.array;
        arr.unshift(provinceName);
        var arr1 = that.data.array1;
        arr1.unshift(cityName);
        var arr2 = that.data.array2;
        arr2.unshift(countryName);
        that.setData({
          province: res.data.response.provinceId,
          city: res.data.response.cityId,
          county: res.data.response.countryId,
          array: arr,
          array1: arr1,
          array2: arr2
        })
        //插入当前省份的城市和当前城市的区县
        cityList(that, that.data.province)
        countyList(that, that.data.city)
      }
    },
    fail:function(info){
      wx.showToast({
        title: '查询城市ID失败',
      })
    }
  })
}