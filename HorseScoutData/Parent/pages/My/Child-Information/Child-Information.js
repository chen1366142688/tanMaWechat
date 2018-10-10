// pages/My/Child-Information/Child-Information.js
const app = getApp().globalData
Page({
  data: {
    array: ['--'],
    objectArray: [],
    array1: ['--市'],
    objectArray1: ['请选择省份'],
    index: 0,
    index1: 0,
    array2: [ '幼儿园', '小学', '初中', '高中'],
    objectArray2: [],
    array3: [ '一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    index3: 0,
    array4: [ '一班', '二班', '三班', '四班', '五班', '六班', '七班', '八班', '九班', '十班', '十一班', '十二班', '十三班', '十四班', '十五班', '十六班', '十七班', '十八班', '十九班', '二十班', '二十一班', '二十二班', '二十三班', '二十四班', '二十五班', '二十六班', '二十七班', '二十八班', '二十九班', '三十班', '三十一班', '三十二班', '三十三班', '三十四班', '三十五班', '三十六班', '三十七班', '三十八班', '三十九班', '四十班', '四十一班', '四十二班', '四十三班', '四十四班', '四十五班', '四十六班', '四十七班', '四十八班', '四十九班', '五十班'],
    index4: 0,
    Kindergarten: [ '大班', '中班', '小班'],
    JuniorMiddleSchool: [ '初一', '初二', '初三'],
    highSchool: [ '高一', '高二', '高三'],
    index2: 0,
    province: '',
    cityId: '',
    county: '',
    address: '请输入详细地址',
    addr: '',
    location: '',
    lineActive:178,
    instruNumber:21.81,
    childHeight:0,
    childWeight:0,
    childName : "",
    idcard : "",
    isMoreShow : false
  },
  childName(e){
    this.setData({ childName : e.detail.value})
  },
  childHeight(e){
    this.setData({ childHeight: e.detail.value})
  },
  childWeight(e){
    this.setData({ childWeight: e.detail.value})
  },
  idcard(e){
    this.setData({ idcard : e.detail.value})
  },
  // 提交资料
  upsertChildrenInfo() {
    let childrenInfo = {
      "birthday": "2012-02-09",
      "bmi": parseFloat(this.data.instruNumber),
      "childrenClass":  parseInt(this.data.index4) + 1,
      "childrenHeight": parseInt(this.data.childHeight) * 10,
      "childrenId": this.data.childrenId,
      "childrenWeight": parseInt(this.data.childWeight) * 10,
      "cityId": this.data.cityId,
      "gender": this.data.gender,
      "grade": parseInt(this.data.index3) + 1,
      "haveIdCard": "1",
      "idCard": this.data.idcard || "510112199202090035",
      "name": this.data.childName,
      "parentUserId": wx.getStorageSync('userInfo').patriarchId,
      "provinceId": this.data.province,
      "relationCode": wx.getStorageSync('userInfo').relationCode,
      "schoolId": this.data.schoolId,
      "schoolType": parseInt(this.data.index2) + 1
    }
    wx.request({
      url: app.rQUrl + '/v1/childreninfo/upsertChildrenInfo',
      method: 'POST',
      header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
      data: childrenInfo,
      success : function(res){
        console.log(res)
        wx.switchTab({
          url: "../../../pages/My/My-Index/My-Index"
        })
      }
    })
  },
  blurHeight(e){
    const that = this;
    let height = e.detail.value;
    if (height > 0 && that.data.childWeight > 0){
      let childHeight = that.data.childHeight / 100; 
      let result = (that.data.childWeight / (childHeight * childHeight)).toFixed(2)
      if (result > 40) {
        that.setData({ instruNumber: result, lineActive: 595 })
        return;
      } else if (result < 15) {
        that.setData({ instruNumber: result, lineActive: 15 })
        return;
      } else {
        that.setData({ instruNumber: result, lineActive: fectory(result) })
      }
    }
  },
  blurWeight(e){
    const that = this;
    let weight = e.detail.value;
    if (weight > 0 && that.data.childHeight > 0) {
      let childHeight = that.data.childHeight / 100;
      let result = (that.data.childWeight / (childHeight * childHeight)).toFixed(2)
      if(result > 40){
        that.setData({ instruNumber: result, lineActive: 595 })
        return;
      } else if (result < 15) {
        that.setData({ instruNumber: result, lineActive: 15 })
        return;
      }else{
        that.setData({ instruNumber: result, lineActive: fectory(result)})
      }
    }
  },
  // 联系客服
  ContactCustomerService(e) {
    wx.makePhoneCall({ //客服电话待定
      phoneNumber: '13679695212',
    })
  },
  // 选择省
  bindPickerChange: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var province = this.data.objectArray;
    for (var i in province) {
      if (i == e.detail.value) {
        this.setData({ province: province[i].provinceId });
      }
    }
    console.log(this.data.province)
    wx.showLoading({
      title: '加载中...',
    })
    cityList(this)
  },
  // 选择市
  bindPickerChange1: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    var city = this.data.objectArray1;
    for (var i in city) {
      if (i == e.detail.value) {
        this.setData({ cityId: city[i].cityId });
      }
    }
  },
  // 选择学校类型
  bindPickerChange2(e) {
    console.log(e.detail.value)
    this.setData({ index2: e.detail.value, SchoolValue: '' })
    wx.setStorageSync('schoolName', '')
  },
  // 选择年级
  bindPickerChange3(e) {
    console.log(e.detail.value)
    this.setData({ index3: e.detail.value })
  },
  // 选择班级
  bindPickerChange4(e) {
    console.log(e.detail.value)
    this.setData({ index4: e.detail.value })
  },
  // 搜索学校
  goSchool(e) {
    wx.navigateTo({
      url: '../../../pages/Information/Selection-school/Selection-school',
    })
  },
  // 更多按钮
  getMore(){
    this.setData({
      isMoreShow : !this.data.isMoreShow
    })
  },
  // 添加资料
  addCoase(){
    wx.navigateTo({
      url: '../../../pages/Information/Perfect-Information/Perfect-Information',
    })
  },
  // 绑定孩子资料
  boundFun(){
    wx.navigateTo({
      url: '../../../pages/My/Bind-child/Bind-child',
    })
  },
  unbindFun(){
    let that = this;
    let id = this.data.childID
    unbindFun(that, id)
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      childID: options.childrenid
    })
    getChildrenInfo(options.childrenid,that)
  },
  onReady: function () {},
  onShow: function () {
    prviceList(this);
    cityList(this)
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () { }
})
//获取所有省份信息列表
function prviceList(that, first) {
  // var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
  // var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
  // var province = wxPrevPage.data.coachInfos.provinceId;
  // var city = wxPrevPage.data.coachInfos.cityId;
  // var county = wxPrevPage.data.coachInfos.countyId;
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/allProvinceInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: {},
    success: function (res) {
      if (res.data.code == '10000') {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        for (let i = 0 ; i < len ; i++){
          arr.push(result[i].provinceName)
        }
        that.setData({ objectArray: result, array: arr })
      }
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
//根据省份ID查询城市列表
function cityList(that) {
  var province = that.data.province ? that.data.province : 110;
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/allCityInfoByProvinceId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { 'provinceId': province },
    success: function (res) {
      wx.hideLoading();
      if (res.data.code == '10000'  ) {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        while (len--) {
          arr.unshift(result[len].cityName);
        }
        var cityThat = result[0].cityId
        that.setData({ objectArray1: result, array1: arr, cityId: cityThat })
      }
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
// 根据孩子id获取孩子信息
function getChildrenInfo(id,that){
  wx.request({
    url: app.rQUrl + '/v1/childreninfo/getChildrenBaseInfoByChildrenId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { 'childrenId': id },
    success: function (res) {
      console.log(res)
      let result = res.data.response;
      getProvinceById(result.provinceId,that);
      getCityById(result.cityId,that)
      that.setData({
        instruNumber: result.bmi,
        index4: parseInt(result.childrenClass) - 1,
        childHeight: result.height / 10,
        childrenId: result.childId,
        childWeight: result.weight / 10,
        gender: result.gender,
        index3: parseInt(result.grade) - 1,
        haveIdCard: result.haveIdCard,
        idcard: result.idCard,
        childName: result.realName,
        schoolId: result.schoolId,
        index2: parseInt(result.schoolType) - 1,
        SchoolValue : result.schoolName
      })
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
function getProvinceById(provinceid,that){
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/provinceInfoByProvinceId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { 'provinceId': provinceid },
    success: function (res) {
      that.setData({
        index : res.data.response.id - 1,
        province: res.data.response.provinceId
      })
      cityList(that)
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
function getCityById(cityid, that) {
  wx.request({
    url: app.rQUrl + '/v1/regionInfo/get/cityInfoByCityId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { 'cityId': cityid },
    success: function (res) {
      for (var i in that.data.objectArray1){
        if (res.data.response.id == that.data.objectArray1[i].id ){
          console.log(that.data.objectArray1[i].id)
        }
      }
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
function getLocations() {
  var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
  var qqmapsdk;
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
    key: 'BX6BZ-ZDEWF-EQVJ3-JPL6W-BPU6Q-4PFHB'
  });
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          wx.setStorageSync('location', res)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
  })

};
function unbindFun(that,id){
  wx.request({
    url: app.rQUrl + '/v1/childreninfo/unbundling',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').oauthToken.token },
    data: { 'childrenId': id, "parentUserId": wx.getStorageSync('userInfo').userId},
    success: function (res) {
      console.log(res)
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
//计算偏移量位置
function fectory(BMI){
  let a = 610-60;
  let b = a/610;
  let c = BMI - 15;
  let d = c /25;
  let e = (d * a) + 30;
  return e;
}

