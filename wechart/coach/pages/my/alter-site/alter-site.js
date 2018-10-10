// pages/my/alter-site/alter-site.js
//var JMessage = require('../../../utils/jmessage-wxapplet-sdk-1.4.0.min.js');
const app = getApp().globalData
Page({
  data: {
    url: 'http://xlrtimo.oss-cn-beijing.aliyuncs.com/timo/imgs/',
    array: ['--'],
    objectArray: [],
    array1: ['--市'],
    objectArray1: ['请选择省份'],
    array2: ['--区'],
    objectArray2: ['请选择市区'],
    index: 0,
    index1: 0,
    index2: 0,
    province: '',
    cityId: '',
    county: '',
    address: '请输入详细地址',
    addr: '',
    location:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({ location:options.index})
  },

  subMit: function (e) {
    if(this.data.location=='1'){
      //这是首页过来的提交，提交成功之后返回到日程首页
      wx.request({
        url: app.url + '/v1/coach/update/coachAddressByUserId',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': wx.getStorageSync('userInfo').userId,
          'addressDetail':this.data.addr,
          'province': this.data.province,
          'city': this.data.cityId,
          'county': this.data.county
        },
        success: function (res) {
          if (res.data.code == '10000') {
            wx.switchTab({
              url: '../../../pages/index/scheduleIndex/scheduleindex'
            });  
          }
        },
        fail: function (info) {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
    }else{
      var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      var userId = wxPrevPage.data.userId;
      var province = this.data.province;
      var city = this.data.cityId;
      var county = this.data.county;
      var addressDetail = this.data.addr;
      var url = app.url + '/v1/coach/update/coachAddressByUserId';

      wx.request({
        url: url,
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': userId,
          'addressDetail': addressDetail,
          'province': province,
          'city': city,
          'county': county
        },
        success: function (res) {
          if (res.data.code == '10000') {
            wx.showToast({
              title: '操作成功!',
              icon: 'none'
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000);
          }
        },
        fail: function (info) {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
    }
    
  },
  userNameInput: function (e) {
    console.log(e.detail.value)
    this.setData({ addr: e.detail.value })
  },
  bindPickerChange: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var province = this.data.objectArray;
    for (var i in province) {
      if (i == e.detail.value) {
        this.setData({ province: province[i].provinceId });
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    cityList(this)
    setTimeout(function () { countyLsit(that)},1000)
    
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    var city = this.data.objectArray1;
    for (var i in city) {
      if (i == e.detail.value) {
        this.setData({ cityId: city[i].cityId });
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    countyLsit(this)
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
    var county = this.data.objectArray2;
    for (var i in county) {
      if (i == e.detail.value) {
        this.setData({ county: county[i].countyId });
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    app.noType();
    if (that.data.location==1){//这是从日程首页过来的调用定位
      console.log("这是用户从课程首页跳转过来修改地址的")
      //获取教练地址
      wx.request({
        url: app.url+'/v1/coach/get/coachBaseInfoByUserId',
        method: 'GET',
        header: { 'token': wx.getStorageSync('userInfo').token },
        data: {
          'userId': wx.getStorageSync('userInfo').userId
        },
        success:function(re){
          console.log(re )
          if(re.data.code=='10000'){
            var resultInfo=re.data.response;
            if (resultInfo.addressDetail ){
              that.setData({ addr: resultInfo.addressDetail, county: resultInfo.countyId})
              //展示教练在数据库中存储的位置信息
              //获取省位置
              wx.request({
                url: app.url + '/v1/systemconfig/get/allProvinceInfo',
                method: 'GET',
                header: { 'token': wx.getStorageSync('userInfo').token },
                data: {},
                success: function (res) {
                  if (res.data.code == '10000') {
                    var result = res.data.response;
                    var len = result.length;
                    var arr = new Array();
                    while (len--) {
                      arr.unshift(result[len].provinceName);
                    }
                    for (var i = 0; i < result.length; i++) {
                      if (result[i].provinceId == resultInfo.provinceId) {
                        console.log("省ID" + resultInfo.provinceId)
                        that.setData({ index: i, province: resultInfo.provinceId })
                        //获取市位置
                        wx.request({
                          url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
                          method: 'GET',
                          header: { 'token': wx.getStorageSync('userInfo').token },
                          data: { 'provinceId': resultInfo.provinceId },
                          success: function (res) {
                            if (res.data.code == '10000') {
                              var result = res.data.response;
                              var len = result.length;
                              var arr = new Array();
                              while (len--) {
                                arr.unshift(result[len].cityName);
                              }
                              for (let x = 0; x < result.length; x++) {
                                if (result[x].cityId == resultInfo.cityId) {
                                  that.setData({ index1: x, cityId: result[x].cityId })
                                }
                              }
                              that.setData({ objectArray1: result, array1: arr })
                              var cityThat = result[0].cityId
                              console.log("市ID" + result[0].cityId)
                              that.setData({ objectArray1: result, array1: arr, cityId: cityThat })
                              //获取区位置
                              wx.request({
                                url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
                                method: 'GET',
                                header: { 'token': wx.getStorageSync('userInfo').token },
                                data: { 'cityId': resultInfo.cityId },
                                success: function (res) {
                                  if (res.data.code == '10000') {
                                    var result = res.data.response;
                                    var len = result.length;
                                    var arr = new Array();
                                    while (len--) {
                                      arr.unshift(result[len].countyName);
                                    }
                                    for (let y = 0; y < result.length; y++) {
                                      if (result[y].countyId == resultInfo.countyId) {
                                        that.setData({ index2: y, })
                                      }
                                    }
                                    that.setData({ objectArray2: result, array2: arr })
                                  }
                                },
                                fail: function (info) {
                                  console.log("请求失败")
                                }
                              })
                            }
                          },
                          fail: function (info) {
                            console.log("请求失败")
                          }
                        })
                      }
                    }
                    that.setData({ objectArray: result, array: arr })
                  }
                },
                fail: function (info) {
                  console.log("请求失败")
                }
              })
            }else{
              //教练的住址为空定位到当前位置
              that.setData({
                addr: wx.getStorageSync('location').result.address_component.street_number
              })
              //获取省ID及省市区联动
              wx.request({
                url: app.url + '/v1/systemconfig/getRegionInfoId',
                method: 'POST',
                header: { 'token': wx.getStorageSync('userInfo').token },
                data: {
                  'countryName': wx.getStorageSync('location').result.address_component.district
                },
                success: function (res) {
                  if (res.data.code == '10000') {
                    //获取到省市区的城市ID
                    var cityIdInfo = res.data.response;
                    that.setData({ county: cityIdInfo.countryId })
                    //获取省位置
                    wx.request({
                      url: app.url + '/v1/systemconfig/get/allProvinceInfo',
                      method: 'GET',
                      header: { 'token': wx.getStorageSync('userInfo').token },
                      data: {},
                      success: function (res) {
                        if (res.data.code == '10000') {
                          var result = res.data.response;
                          var len = result.length;
                          var arr = new Array();
                          while (len--) {
                            arr.unshift(result[len].provinceName);
                          }
                          for (var i = 0; i < result.length; i++) {
                            if (result[i].provinceId == cityIdInfo.provinceId) {
                              console.log("省ID" + cityIdInfo.provinceId)
                              that.setData({ index: i, province: cityIdInfo.provinceId })
                              //获取市位置
                              wx.request({
                                url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
                                method: 'GET',
                                header: { 'token': wx.getStorageSync('userInfo').token },
                                data: { 'provinceId': cityIdInfo.provinceId },
                                success: function (res) {
                                  if (res.data.code == '10000') {
                                    var result = res.data.response;
                                    var len = result.length;
                                    var arr = new Array();
                                    while (len--) {
                                      arr.unshift(result[len].cityName);
                                    }
                                    for (var x = 0; x < result.length; x++) {
                                      if (result[x].cityId == resultInfo.cityId) {
                                        that.setData({ index1: x, cityId: result[x].cityId })
                                      }
                                    }
                                    that.setData({ objectArray1: result, array1: arr})
                                    //获取区位置
                                    wx.request({
                                      url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
                                      method: 'GET',
                                      header: { 'token': wx.getStorageSync('userInfo').token },
                                      data: { 'cityId': cityIdInfo.cityId },
                                      success: function (res) {
                                        if (res.data.code == '10000') {
                                          var result = res.data.response;
                                          var len = result.length;
                                          var arr = new Array();
                                          while (len--) {
                                            arr.unshift(result[len].countyName);
                                          }
                                          for (var y = 0; y < result.length; y++) {
                                            if (result[y].countyId == resultInfo.countyId) {
                                              that.setData({ index2: y})
                                            }
                                          }
                                          that.setData({ objectArray2: result, array2: arr })
                                        }
                                      },
                                      fail: function (info) {
                                        console.log("请求失败")
                                      }
                                    })
                                  }
                                },
                                fail: function (info) {
                                  console.log("请求失败")
                                }
                              })
                            }
                          }
                          that.setData({ objectArray: result, array: arr })
                        }
                      },
                      fail: function (info) {
                        console.log("请求失败")
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '获取您当前地址失败',
                      icon: 'none'
                    })
                  }
                }
              })
            }
          }
        }
      })
      
    }else{
      prviceList(that, 1);
      console.log("===========================")
      var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      let coachInfos = wxPrevPage.data.coachInfos;
      var addrDetail = coachInfos.addressDetail;
      var province = coachInfos.provinceId;
      var city = coachInfos.cityId;
      var county = coachInfos.countyId;
      console.log(county)
      that.setData({ 
        addr: addrDetail ? addrDetail:'', 
        province: province, 
        cityId: city, 
        county: county 
        })
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
//获取所有省份信息列表
function prviceList(that,first) {
  
  var wxCurrPage = getCurrentPages();//获取当前页面的页面栈
  var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
  var province = wxPrevPage.data.coachInfos.provinceId;
  var city = wxPrevPage.data.coachInfos.cityId;
  var county = wxPrevPage.data.coachInfos.countyId;
  wx.request({
    url: app.url + '/v1/systemconfig/get/allProvinceInfo',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: {},
    success: function (res) {
      if (res.data.code == '10000') {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        while (len--) {
          arr.unshift(result[len].provinceName);
        }
        for(var i=0;i<result.length;i++){
          if (result[i].provinceId == province){
            that.setData({index:i})
            cityList(that)
            setTimeout(function () { countyLsit(that)},0)
          }
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

  var province = that.data.province;
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCityInfoByProvinceId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { 'provinceId': province },
    success: function (res) {
      wx.hideLoading();
      console.log(res)
      if (res.data.code == '10000') {
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
//根据城市ID 查询区
function countyLsit(that) {
  var cityId = that.data.cityId;
  wx.request({
    url: app.url + '/v1/systemconfig/get/allCountyInfoByCityId',
    method: 'GET',
    header: { 'token': wx.getStorageSync('userInfo').token },
    data: { 'cityId': cityId },
    success: function (res) {
      wx.hideLoading();
      console.log(res)
      if (res.data.code == '10000') {
        var result = res.data.response;
        var len = result.length;
        var arr = new Array();
        while (len--) {
          arr.unshift(result[len].countyName);
        }
        var countyThat = result[0].countyId
        that.setData({ objectArray2: result, array2: arr, county: countyThat })
      }
    },
    fail: function (info) {
      console.log("请求失败")
    }
  })
}
